import assert from "node:assert/strict";
import { test } from "node:test";
import { prisma } from "../src/lib/prisma.js";
import { confirmarPedido, validarConfirmacionPedido } from "../src/services/confirmacion-pedido.service.js";

test("solo confirma borradores con detalles válidos", () => {
  const detalles = [{ id_variante: 1, cantidad: 2 }];
  assert.doesNotThrow(() => validarConfirmacionPedido({ estado: "BORRADOR", tbl_detalle_pedido: detalles }));
  for (const estado of ["CONFIRMADO", "CANCELADO", "ENTREGADO", "EN_PRODUCCION", "LISTO"]) {
    assert.throws(() => validarConfirmacionPedido({ estado, tbl_detalle_pedido: detalles }), /BORRADOR/);
  }
  for (const tbl_detalle_pedido of [[], [{ id_variante: 1, cantidad: 0 }],
    [{ id_variante: 1, cantidad: -1 }], [{ id_variante: 1, cantidad: 1.5 }], [{ id_variante: 0, cantidad: 1 }]]) {
    assert.throws(() => validarConfirmacionPedido({ estado: "BORRADOR", tbl_detalle_pedido }), /detalles válidos/);
  }
});

test("rechaza pedido inexistente y repetición sin escribir en MySQL", async t => {
  let pedido: any = null;
  let escrituras = 0;
  const original = prisma.$transaction;
  (prisma as any).$transaction = async (operacion: any) => operacion({
    $queryRaw: async () => [],
    tbl_pedidos: {
      findUnique: async () => pedido,
      updateMany: async ({ where, data }: any) => {
        assert.equal(where.estado, "BORRADOR");
        escrituras++;
        pedido.estado = data.estado;
        return { count: 1 };
      },
      findUniqueOrThrow: async () => pedido,
    },
  });
  t.after(() => { prisma.$transaction = original; });
  await assert.rejects(confirmarPedido(1n), /no existe/);
  pedido = { estado: "BORRADOR", tbl_detalle_pedido: [{ id_variante: 1, cantidad: 2 }] };
  await confirmarPedido(1n);
  assert.equal(pedido.estado, "CONFIRMADO");
  await assert.rejects(confirmarPedido(1n), /BORRADOR/);
  assert.equal(escrituras, 1);
});
