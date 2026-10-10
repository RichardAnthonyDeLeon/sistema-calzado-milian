import assert from "node:assert/strict";
import { test } from "node:test";
import { prisma } from "../src/lib/prisma.js";
import {
  agregarMaterialFichaSchema, materialFichaParamsSchema,
} from "../src/schemas/ficha-tecnica.schema.js";
import {
  agregarMaterialFicha, actualizarMaterialFicha, quitarMaterialFicha, listarFichaTecnica,
} from "../src/services/ficha-tecnica.service.js";

const datos = { cantidad_por_par: 0.1255, porcentaje_desperdicio: 5.25 };

test("valida identificadores, límites y precisión de la ficha técnica", () => {
  assert.equal(agregarMaterialFichaSchema.safeParse({ id_material: 1, ...datos }).success, true);
  for (const cantidad_por_par of [0, -1, 0.00001, Infinity, 10000000000]) {
    assert.equal(agregarMaterialFichaSchema.safeParse({ id_material: 1, ...datos, cantidad_por_par }).success, false);
  }
  for (const porcentaje_desperdicio of [-1, 100.01, 5.255, NaN]) {
    assert.equal(agregarMaterialFichaSchema.safeParse({ id_material: 1, ...datos, porcentaje_desperdicio }).success, false);
  }
  for (const porcentaje_desperdicio of [0, 100]) {
    assert.equal(agregarMaterialFichaSchema.safeParse({ id_material: 1, ...datos, porcentaje_desperdicio }).success, true);
  }
  assert.equal(materialFichaParamsSchema.safeParse({ id: "1", idMaterial: "2" }).success, true);
  assert.equal(materialFichaParamsSchema.safeParse({ id: "abc", idMaterial: "2" }).success, false);
  assert.equal(materialFichaParamsSchema.safeParse({ id: "1", idMaterial: "0" }).success, false);
});

test("alta, duplicado, actualización, baja lógica y reactivación conservan la asociación", async (t) => {
  // Doble exclusivo de pruebas: no escribe ni necesita datos de MySQL.
  const filas: any[] = [];
  let productoActivo = true;
  let materialActivo = true;
  const coincide = (fila: any, where: any) => Object.entries(where).every(([key, value]) => fila[key] === value);
  const tx = {
    tbl_productos: { findUnique: async ({ where }: any) => where.id_producto === 1
      ? { estado: productoActivo ? "ACTIVO" : "INACTIVO" } : null },
    tbl_materiales: { findUnique: async ({ where }: any) => where.id_material === 2
      ? { estado: materialActivo ? "ACTIVO" : "INACTIVO" } : null },
    tbl_producto_material: {
      findUnique: async ({ where }: any) => filas.find(fila => coincide(fila, where.id_producto_id_material)) ?? null,
      findUniqueOrThrow: async ({ where }: any) => {
        const fila = filas.find(fila => coincide(fila, where.id_producto_id_material));
        assert.ok(fila);
        return { ...fila };
      },
      findMany: async ({ where }: any) => filas.filter(fila => coincide(fila, where)),
      create: async ({ data }: any) => {
        const fila = { id_producto_material: filas.length + 1, ...data };
        filas.push(fila);
        return { ...fila };
      },
      updateMany: async ({ where, data }: any) => {
        const seleccionadas = filas.filter(fila => coincide(fila, where));
        seleccionadas.forEach(fila => Object.assign(fila, data));
        return { count: seleccionadas.length };
      },
    },
  };
  const transaccionOriginal = prisma.$transaction;
  (prisma as any).$transaction = async (operacion: any) => operacion(tx);
  t.after(() => { prisma.$transaction = transaccionOriginal; });

  await assert.rejects(agregarMaterialFicha(99, 2, datos), /producto no existe/);
  await assert.rejects(agregarMaterialFicha(1, 99, datos), /material no existe/);
  productoActivo = false;
  await assert.rejects(agregarMaterialFicha(1, 2, datos), /producto debe estar activo/);
  productoActivo = true;
  materialActivo = false;
  await assert.rejects(agregarMaterialFicha(1, 2, datos), /material debe estar activo/);
  materialActivo = true;

  const creada = await agregarMaterialFicha(1, 2, datos);
  assert.equal((await listarFichaTecnica(1)).length, 1);
  await assert.rejects(agregarMaterialFicha(1, 2, datos), /ya está asociado/);
  await assert.rejects(actualizarMaterialFicha(1, 99, datos), /material no existe/);
  const actualizada = await actualizarMaterialFicha(1, 2, { ...datos, cantidad_por_par: 0.5 });
  assert.equal(Number(actualizada.cantidad_por_par), 0.5);
  await quitarMaterialFicha(1, 2);
  assert.equal(filas.length, 1);
  assert.equal(filas[0].estado, "INACTIVO");
  assert.equal((await listarFichaTecnica(1)).length, 0);
  await assert.rejects(actualizarMaterialFicha(1, 2, datos), /asociación activa no existe/);
  await assert.rejects(quitarMaterialFicha(1, 2), /asociación activa no existe/);
  const reactivada = await agregarMaterialFicha(1, 2, datos);
  assert.equal(reactivada.id_producto_material, creada.id_producto_material);
  assert.equal(reactivada.estado, "ACTIVO");
  assert.equal(filas.length, 1);
});
