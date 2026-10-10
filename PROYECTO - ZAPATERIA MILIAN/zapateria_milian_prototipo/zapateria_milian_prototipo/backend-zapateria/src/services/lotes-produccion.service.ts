import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { RegistrarLotesData } from "../schemas/produccion.schema.js";

export class ErrorLoteProduccion extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

// Precisión local: no cambia la configuración Decimal de otros módulos.
const Decimal = Prisma.Decimal.clone({ precision: 40 });
const MAX_MATERIAL = new Decimal("99999999999.999");
const MAX_ENTERO = 4294967295;

export function calcularConsumo(cantidad: number, porPar: Prisma.Decimal, desperdicio: Prisma.Decimal) {
  const base = new Decimal(porPar.toString());
  const porcentaje = new Decimal(desperdicio.toString());
  if (!Number.isInteger(cantidad) || cantidad <= 0 || !base.isFinite() || base.lte(0) ||
    !porcentaje.isFinite() || porcentaje.lt(0) || porcentaje.gt(100)) {
    throw new ErrorLoteProduccion("La ficha técnica contiene cantidades o desperdicios inválidos.");
  }
  const consumo = base.mul(cantidad).mul(porcentaje.div(100).plus(1))
    .toDecimalPlaces(3, Decimal.ROUND_CEIL);
  if (consumo.gt(MAX_MATERIAL)) throw new ErrorLoteProduccion("El consumo supera la capacidad del inventario.");
  return consumo;
}

export function agruparConsumos(consumos: { id_material: number; cantidad: Prisma.Decimal }[]) {
  const totales = new Map<number, Prisma.Decimal>();
  for (const consumo of consumos) {
    const total = new Decimal(totales.get(consumo.id_material)?.toString() ?? "0").plus(consumo.cantidad);
    if (total.gt(MAX_MATERIAL)) throw new ErrorLoteProduccion("El consumo acumulado supera la capacidad del inventario.");
    totales.set(consumo.id_material, total);
  }
  return [...totales].sort(([a], [b]) => a - b);
}

export function validarAvance(produccion: {
  estado: string; cantidad_total: number; cantidad_producida: number;
}, cantidad: number): "FINALIZADA" | "EN_PROCESO" {
  if (!["PENDIENTE", "EN_PROCESO", "PAUSADA"].includes(produccion.estado)) {
    throw new ErrorLoteProduccion("No se pueden registrar lotes en producciones canceladas o finalizadas.");
  }
  if (!Number.isInteger(cantidad) || cantidad <= 0 ||
    cantidad > produccion.cantidad_total - produccion.cantidad_producida) {
    throw new ErrorLoteProduccion("La cantidad debe ser positiva y no superar los pares pendientes.");
  }
  return produccion.cantidad_producida + cantidad === produccion.cantidad_total ? "FINALIZADA" : "EN_PROCESO";
}

function fechaSinMilisegundos(fecha: string | Date) {
  return new Date(Math.floor(new Date(fecha).getTime() / 1000) * 1000);
}

type LoteRegistrado = {
  id_lote: bigint; id_produccion: bigint; cantidad: number;
  fecha_finalizacion: Date | null; observaciones: string | null; estado: string;
};

export function validarReenvio(lotes: LoteRegistrado[], datos: RegistrarLotesData) {
  const iguales = lotes.length === datos.producciones.length && datos.producciones.every(item => {
    const lote = lotes.find(lote => lote.id_produccion === item.id_produccion);
    return lote && lote.estado === "FINALIZADO" && lote.cantidad === item.cantidad &&
      (lote.observaciones ?? "") === (datos.observaciones ?? "") &&
      (!datos.fecha || lote.fecha_finalizacion?.getTime() === fechaSinMilisegundos(datos.fecha).getTime());
  });
  if (!iguales) throw new ErrorLoteProduccion("El número de lote ya se utilizó con otros datos. Usa otro para una nueva operación.", 409);
}

export async function registrarLotesProduccion(datos: RegistrarLotesData) {
  // Mismo usuario provisional de Pedidos y Materiales, hasta implementar autenticación.
  const idUsuario = 1;
  const fecha = fechaSinMilisegundos(datos.fecha ?? new Date());
  return prisma.$transaction(async tx => {
    const ids = datos.producciones.map(item => item.id_produccion);
    const referencias = await tx.tbl_producciones.findMany({
      where: { id_produccion: { in: ids } },
      select: { tbl_detalle_pedido: { select: { id_pedido: true } } },
    });
    if (referencias.length !== ids.length) throw new ErrorLoteProduccion("Una o más producciones no existen.", 404);
    const idPedido = referencias[0].tbl_detalle_pedido.id_pedido;
    if (referencias.some(item => item.tbl_detalle_pedido.id_pedido !== idPedido)) {
      throw new ErrorLoteProduccion("Todas las producciones deben pertenecer al mismo pedido.");
    }

    // Serializa operaciones del mismo pedido antes de leer avances y claves de reenvío.
    // SQL parametrizado; ReadCommitted garantiza lecturas actuales tras esperar el bloqueo.
    await tx.$queryRaw`SELECT id_pedido FROM tbl_pedidos WHERE id_pedido = ${idPedido} FOR UPDATE`;
    const pedido = await tx.tbl_pedidos.findUniqueOrThrow({ where: { id_pedido: idPedido } });
    const anteriores = await tx.tbl_lotes_produccion.findMany({
      where: { numero_lote: datos.numero_lote, tbl_producciones: { tbl_detalle_pedido: { id_pedido: idPedido } } },
      include: { tbl_producciones: { select: { tbl_detalle_pedido: { select: { id_variante: true } } } } },
      orderBy: { id_produccion: "asc" },
    });
    if (anteriores.length) {
      validarReenvio(anteriores, datos);
      return { id_pedido: idPedido.toString(), estado_pedido: pedido.estado, reutilizado: true,
        lotes: anteriores.map(lote => ({ id_lote: lote.id_lote.toString(), id_produccion: lote.id_produccion.toString(),
          id_variante: lote.tbl_producciones.tbl_detalle_pedido.id_variante,
          numero_lote: lote.numero_lote, cantidad: lote.cantidad })) };
    }
    if (pedido.estado !== "EN_PRODUCCION") throw new ErrorLoteProduccion("El pedido debe estar en producción.");
    const usuario = await tx.tbl_usuarios.findUnique({ where: { id_usuario: idUsuario } });
    if (!usuario || usuario.estado !== "ACTIVO") throw new ErrorLoteProduccion("El usuario de registro no existe o está inactivo.");

    const producciones = await tx.tbl_producciones.findMany({
      where: { id_produccion: { in: ids } },
      include: { tbl_lotes_produccion: { orderBy: { fecha_finalizacion: "desc" }, take: 1 },
        tbl_detalle_pedido: { include: { tbl_variantes_producto: { include: {
        tbl_productos: { include: { tbl_producto_material: {
          where: { estado: "ACTIVO" }, include: { tbl_materiales: true },
        } } },
      } } } } }, orderBy: { id_produccion: "asc" },
    });
    if (producciones.length !== ids.length) throw new ErrorLoteProduccion("Las producciones cambiaron. Reintenta la operación.", 409);
    const plan = producciones.map(produccion => {
      if (produccion.tbl_detalle_pedido.id_pedido !== idPedido) throw new ErrorLoteProduccion("La producción cambió de pedido.", 409);
      const cantidad = datos.producciones.find(item => item.id_produccion === produccion.id_produccion)!.cantidad;
      const estado = validarAvance(produccion, cantidad);
      if (produccion.fecha_inicio && fecha < produccion.fecha_inicio) {
        throw new ErrorLoteProduccion("La fecha del lote no puede ser anterior al inicio de la producción.");
      }
      const ultimaFecha = produccion.tbl_lotes_produccion[0]?.fecha_finalizacion;
      if (ultimaFecha && fecha < ultimaFecha) throw new ErrorLoteProduccion("La fecha no puede ser anterior al último lote registrado.");
      const variante = produccion.tbl_detalle_pedido.tbl_variantes_producto;
      const producto = variante.tbl_productos;
      if (producto.estado !== "ACTIVO" || variante.estado !== "ACTIVO") throw new ErrorLoteProduccion("El modelo y la variante deben estar activos.");
      if (!producto.tbl_producto_material.length) throw new ErrorLoteProduccion(`El modelo ${producto.nombre} no tiene ficha técnica activa.`);
      const consumos = producto.tbl_producto_material.map(ficha => {
        if (ficha.tbl_materiales.estado !== "ACTIVO") throw new ErrorLoteProduccion(`El material ${ficha.tbl_materiales.nombre} está inactivo.`);
        return { id_material: ficha.id_material, cantidad: calcularConsumo(cantidad, ficha.cantidad_por_par, ficha.porcentaje_desperdicio) };
      });
      return { produccion, variante, cantidad, estado, consumos };
    });

    // Un único descuento agregado por material, condicionado al saldo actual bajo bloqueo de fila.
    for (const [idMaterial, consumo] of agruparConsumos(plan.flatMap(item => item.consumos))) {
      const resultado = await tx.tbl_materiales.updateMany({
        where: { id_material: idMaterial, estado: "ACTIVO", existencia_actual: { gte: consumo } },
        data: { existencia_actual: { decrement: consumo } },
      });
      if (resultado.count !== 1) throw new ErrorLoteProduccion(`Material ${idMaterial}: existencia insuficiente o material inactivo. Se requieren ${consumo.toFixed(3)} unidades.`, 409);
    }

    const lotes = [];
    for (const item of plan) {
      const { produccion, variante, cantidad, estado, consumos } = item;
      const avance = await tx.tbl_producciones.updateMany({
        where: { id_produccion: produccion.id_produccion, estado: produccion.estado,
          cantidad_total: produccion.cantidad_total, cantidad_producida: produccion.cantidad_producida },
        data: { cantidad_producida: { increment: cantidad }, estado,
          fecha_inicio: produccion.fecha_inicio ?? fecha,
          fecha_finalizacion: estado === "FINALIZADA" ? fecha : null },
      });
      if (avance.count !== 1) throw new ErrorLoteProduccion("El avance cambió durante el registro. Reintenta con el mismo número de lote.", 409);
      const lote = await tx.tbl_lotes_produccion.create({ data: {
        id_produccion: produccion.id_produccion, numero_lote: datos.numero_lote, cantidad,
        fecha_inicio: fecha, fecha_finalizacion: fecha, estado: "FINALIZADO", observaciones: datos.observaciones || null,
      } });
      for (const consumo of consumos) {
        await tx.tbl_detalle_produccion_material.create({ data: {
          id_lote: lote.id_lote, id_material: consumo.id_material,
          cantidad_estimada: consumo.cantidad, cantidad_real: consumo.cantidad,
        } });
        await tx.tbl_movimientos_material.create({ data: {
          id_material: consumo.id_material, id_usuario: idUsuario, cantidad: consumo.cantidad,
          tipo_movimiento: "SALIDA", tipo_referencia: "PRODUCCION", id_referencia: lote.id_lote,
          fecha_movimiento: fecha, observaciones: datos.observaciones || null,
        } });
      }
      const inventario = await tx.tbl_variantes_producto.updateMany({
        where: { id_variante: variante.id_variante, estado: "ACTIVO", existencia_actual: { lte: MAX_ENTERO - cantidad } },
        data: { existencia_actual: { increment: cantidad } },
      });
      if (inventario.count !== 1) throw new ErrorLoteProduccion("No se pudo incrementar el inventario de la variante.", 409);
      await tx.tbl_movimientos_producto.create({ data: {
        id_variante: variante.id_variante, id_usuario: idUsuario, cantidad,
        tipo_movimiento: "ENTRADA", tipo_referencia: "PRODUCCION", id_referencia: lote.id_lote,
        fecha_movimiento: fecha, observaciones: datos.observaciones || null,
      } });
      lotes.push({ id_lote: lote.id_lote.toString(), id_produccion: produccion.id_produccion.toString(),
        id_variante: variante.id_variante, numero_lote: lote.numero_lote, cantidad });
    }
    // Comprueba también detalles sin producción, para no marcar prematuramente LISTO.
    const pendientes = await tx.tbl_detalle_pedido.count({ where: {
      id_pedido: idPedido, OR: [{ tbl_producciones: { is: null } },
        { tbl_producciones: { is: { estado: { not: "FINALIZADA" } } } }],
    } });
    const estadoPedido = pendientes === 0 ? "LISTO" : "EN_PRODUCCION";
    await tx.tbl_pedidos.update({ where: { id_pedido: idPedido }, data: { estado: estadoPedido } });
    return { id_pedido: idPedido.toString(), estado_pedido: estadoPedido, reutilizado: false, lotes };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, maxWait: 5000, timeout: 30000 });
}
