import assert from "node:assert/strict";
import { test } from "node:test";
import { Prisma } from "../src/generated/prisma/client.js";
import { prisma } from "../src/lib/prisma.js";
import { registrarLotesSchema } from "../src/schemas/produccion.schema.js";
import { calcularConsumo, agruparConsumos, validarAvance, validarReenvio,
  registrarLotesProduccion } from "../src/services/lotes-produccion.service.js";

const D = (valor: string) => new Prisma.Decimal(valor);
const peticion = (cantidad = 2) => registrarLotesSchema.parse({
  numero_lote: "PRUEBA-001", fecha: "2026-10-09T14:00:00Z",
  producciones: [{ id_produccion: "10", cantidad }, { id_produccion: "11", cantidad }],
});

test("rechaza cantidades inválidas, IDs imprecisos, duplicados, fecha y clave inválidas", () => {
  for (const cantidad of [0, -1, 0.5, 4294967296]) {
    assert.equal(registrarLotesSchema.safeParse({ ...peticion(), producciones: [{ id_produccion: "10", cantidad }] }).success, false);
  }
  for (const id_produccion of ["0", "-1", "18446744073709551616", 9007199254740992, true]) {
    assert.equal(registrarLotesSchema.safeParse({ ...peticion(), producciones: [{ id_produccion, cantidad: 1 }] }).success, false);
  }
  const base = { numero_lote: "PRUEBA-001", producciones: [{ id_produccion: "10", cantidad: 1 }] };
  assert.equal(registrarLotesSchema.parse({ ...base, producciones: [{ id_produccion: "9007199254740993", cantidad: 1 }] }).producciones[0].id_produccion, 9007199254740993n);
  for (const cambio of [{ numero_lote: "" }, { fecha: "2026-02-30T00:00:00Z" }, { producciones: [] },
    { producciones: [...base.producciones, ...base.producciones] }, { id_usuario: 99 }]) {
    assert.equal(registrarLotesSchema.safeParse({ ...base, ...cambio }).success, false);
  }
});

test("calcula desperdicio exacto, redondea hacia arriba y agrupa materiales compartidos", () => {
  assert.equal(calcularConsumo(3, D("0.4"), D("5")).toString(), "1.26");
  assert.equal(calcularConsumo(1, D("0.0001"), D("0")).toString(), "0.001");
  assert.equal(calcularConsumo(1, D("0.1"), D("0.01")).toString(), "0.101");
  assert.equal(calcularConsumo(2, D("1"), D("100")).toString(), "4");
  const agrupados = agruparConsumos([{ id_material: 2, cantidad: D("0.101") },
    { id_material: 1, cantidad: D("2") }, { id_material: 2, cantidad: D("0.101") }]);
  assert.equal(agrupados[1][1].toString(), "0.202");
  assert.throws(() => calcularConsumo(1, D("0"), D("0")));
  assert.throws(() => calcularConsumo(1, D("1"), D("101")));
  assert.throws(() => calcularConsumo(4294967295, D("9999999999"), D("100")));
});

test("valida pendientes y calcula estados parciales y completos", () => {
  const produccion = { estado: "PENDIENTE", cantidad_total: 5, cantidad_producida: 0 };
  assert.equal(validarAvance(produccion, 2), "EN_PROCESO");
  assert.equal(validarAvance({ ...produccion, cantidad_producida: 3 }, 2), "FINALIZADA");
  for (const estado of ["FINALIZADA", "CANCELADA"]) assert.throws(() => validarAvance({ ...produccion, estado }, 1));
  for (const cantidad of [0, -1, 6]) assert.throws(() => validarAvance(produccion, cantidad));
});

test("reenvío exige mismo conjunto, cantidades, fecha y observaciones", () => {
  const datos = peticion();
  const lotes = datos.producciones.map((item, i) => ({ ...item, id_lote: BigInt(i + 1),
    fecha_finalizacion: new Date(datos.fecha!), estado: "FINALIZADO", observaciones: null }));
  assert.doesNotThrow(() => validarReenvio(lotes, datos));
  assert.throws(() => validarReenvio(lotes, peticion(3)));
  assert.throws(() => validarReenvio(lotes, { ...datos, observaciones: "Otra operación" }));
  assert.throws(() => validarReenvio(lotes, { ...datos, producciones: datos.producciones.slice(0, 1) }));
  assert.throws(() => validarReenvio(lotes, { ...datos, fecha: "2026-10-10T00:00:00Z" }));
});

test("transacción: inventarios por variante, idempotencia, finalización y rollback", async t => {
  // Dobles exclusivos de pruebas: nunca se conecta ni escribe en MySQL.
  let estado: any;
  function reiniciar(stock = "10") {
    estado = { pedido: "EN_PRODUCCION", stock, lotes: [], detalles: [], salidas: [], entradas: [],
      avances: [0, 0], estados: ["PENDIENTE", "PENDIENTE"], inventario: [0, 0],
      otroPedido: false, sinFicha: false, falloMovimiento: false, ausente: false };
  }
  reiniciar();
  const tx: any = {
    $queryRaw: async () => [{ id_pedido: 1n }],
    tbl_pedidos: {
      findUniqueOrThrow: async () => ({ estado: estado.pedido }),
      update: async ({ data }: any) => { estado.pedido = data.estado; },
    },
    tbl_usuarios: { findUnique: async () => ({ estado: "ACTIVO" }) },
    tbl_producciones: {
      findMany: async ({ select }: any) => (estado.ausente ? [0] : [0, 1]).map(i => select
        ? { tbl_detalle_pedido: { id_pedido: estado.otroPedido && i === 1 ? 2n : 1n } }
        : { id_produccion: BigInt(10 + i), estado: estado.estados[i], cantidad_total: 4,
          cantidad_producida: estado.avances[i], fecha_inicio: null, tbl_lotes_produccion: [],
          tbl_detalle_pedido: { id_pedido: 1n, tbl_variantes_producto: {
            id_variante: 100 + i, talla: "38", estado: "ACTIVO", tbl_productos: {
              nombre: `Modelo ${i}`, estado: "ACTIVO", tbl_producto_material: estado.sinFicha ? [] : [{
                id_material: 7, cantidad_por_par: D("0.5"), porcentaje_desperdicio: D("10"),
                tbl_materiales: { estado: "ACTIVO", nombre: "Cuero" },
              }],
            },
          } },
        }),
      updateMany: async ({ where, data }: any) => {
        if (estado.falloAvance) return { count: 0 };
        const i = Number(where.id_produccion) - 10;
        estado.avances[i] += data.cantidad_producida.increment;
        estado.estados[i] = data.estado;
        return { count: 1 };
      },
    },
    tbl_materiales: { updateMany: async ({ where, data }: any) => {
      if (D(estado.stock).lt(where.existencia_actual.gte)) return { count: 0 };
      estado.stock = D(estado.stock).minus(data.existencia_actual.decrement).toString();
      return { count: 1 };
    } },
    tbl_lotes_produccion: {
      findMany: async ({ where }: any) => estado.lotes.filter((lote: any) => lote.numero_lote === where.numero_lote)
        .map((lote: any) => ({ ...lote, tbl_producciones: { tbl_detalle_pedido: { id_variante: Number(lote.id_produccion) + 90 } } })),
      create: async ({ data }: any) => {
        const lote = { ...data, id_lote: BigInt(estado.lotes.length + 1) };
        estado.lotes.push(lote); return lote;
      },
    },
    tbl_detalle_produccion_material: { create: async ({ data }: any) => {
      estado.detalles.push({ ...data, cantidad_estimada: data.cantidad_estimada.toString(), cantidad_real: data.cantidad_real.toString() });
    } },
    tbl_movimientos_material: { create: async ({ data }: any) => { estado.salidas.push({ ...data, cantidad: data.cantidad.toString() }); } },
    tbl_variantes_producto: { updateMany: async ({ where, data }: any) => {
      estado.inventario[where.id_variante - 100] += data.existencia_actual.increment;
      return { count: 1 };
    } },
    tbl_movimientos_producto: { create: async ({ data }: any) => {
      if (estado.falloMovimiento) throw new Error("Fallo al registrar movimiento");
      estado.entradas.push(data);
    } },
    tbl_detalle_pedido: { count: async () => estado.estados.filter((valor: string) => valor !== "FINALIZADA").length },
  };
  const original = prisma.$transaction;
  (prisma as any).$transaction = async (operacion: any, opciones: any) => {
    assert.equal(opciones.isolationLevel, "ReadCommitted");
    const respaldo = structuredClone(estado);
    try { return await operacion(tx); } catch (error) { estado = respaldo; throw error; }
  };
  t.after(() => { prisma.$transaction = original; });

  const primero = await registrarLotesProduccion(peticion());
  assert.equal(primero.reutilizado, false);
  assert.equal(estado.stock, "7.8");
  assert.deepEqual(estado.inventario, [2, 2]);
  assert.deepEqual(estado.estados, ["EN_PROCESO", "EN_PROCESO"]);
  assert.equal(estado.salidas[0].id_referencia, estado.lotes[0].id_lote);
  assert.equal(estado.entradas[1].id_variante, 101);
  assert.equal((await registrarLotesProduccion(peticion())).reutilizado, true);
  assert.equal(estado.stock, "7.8");
  assert.equal(estado.entradas.length, 2);
  await assert.rejects(registrarLotesProduccion(peticion(3)), /otros datos/);
  await registrarLotesProduccion({ ...peticion(), numero_lote: "PRUEBA-002" });
  assert.equal(estado.pedido, "LISTO");
  assert.deepEqual(estado.inventario, [4, 4]);
  assert.equal((await registrarLotesProduccion(peticion())).reutilizado, true);

  reiniciar("2"); // Cada talla cabe por separado (1.1), el agregado (2.2) no.
  await assert.rejects(registrarLotesProduccion(peticion()), /insuficiente/);
  assert.equal(estado.stock, "2");
  assert.equal(estado.lotes.length, 0);
  for (const campo of ["otroPedido", "sinFicha", "falloMovimiento", "ausente", "falloAvance"]) {
    reiniciar(); estado[campo] = true;
    await assert.rejects(registrarLotesProduccion(peticion()));
    assert.equal(estado.stock, "10");
    assert.equal(estado.lotes.length, 0);
    assert.deepEqual(estado.inventario, [0, 0]);
  }
});
