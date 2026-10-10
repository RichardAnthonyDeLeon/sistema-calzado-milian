import { prisma } from "../lib/prisma.js";

export class ErrorConfirmacionPedido extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export function validarConfirmacionPedido(pedido: {
  estado: string;
  tbl_detalle_pedido: { cantidad: number; id_variante: number }[];
}) {
  if (pedido.estado !== "BORRADOR") {
    throw new ErrorConfirmacionPedido("Solo se pueden confirmar pedidos en estado BORRADOR.", 409);
  }
  if (!pedido.tbl_detalle_pedido.length || pedido.tbl_detalle_pedido.some(detalle =>
    !Number.isInteger(detalle.cantidad) || detalle.cantidad <= 0 || detalle.id_variante <= 0
  )) {
    throw new ErrorConfirmacionPedido("El pedido debe tener detalles válidos con cantidades positivas.", 400);
  }
}

export async function confirmarPedido(id: bigint) {
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT id_pedido FROM tbl_pedidos WHERE id_pedido = ${id} FOR UPDATE`;
    const pedido = await tx.tbl_pedidos.findUnique({
      where: { id_pedido: id }, include: { tbl_detalle_pedido: true },
    });
    if (!pedido) throw new ErrorConfirmacionPedido("El pedido no existe.", 404);
    validarConfirmacionPedido(pedido);
    const resultado = await tx.tbl_pedidos.updateMany({
      where: { id_pedido: id, estado: "BORRADOR" }, data: { estado: "CONFIRMADO" },
    });
    if (resultado.count !== 1) throw new ErrorConfirmacionPedido("El pedido cambió de estado. Actualiza el listado.", 409);
    return tx.tbl_pedidos.findUniqueOrThrow({ where: { id_pedido: id } });
  }, { isolationLevel: "ReadCommitted" });
}
