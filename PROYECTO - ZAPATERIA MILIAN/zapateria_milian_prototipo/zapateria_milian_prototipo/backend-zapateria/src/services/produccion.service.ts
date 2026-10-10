import { prisma } from "../lib/prisma.js";

// ========================================
// OBTENER PEDIDOS DISPONIBLES
// ========================================

export async function obtenerPedidosDisponibles() {
  const pedidos = await prisma.tbl_pedidos.findMany({
    where: {
      estado: "CONFIRMADO",
    },
    include: {
      tbl_clientes: true,
      tbl_detalle_pedido: {
        include: {
          tbl_variantes_producto: {
            include: {
              tbl_productos: true,
            },
          },
          tbl_producciones: true,
        },
      },
    },
    orderBy: {
      fecha_pedido: "desc",
    },
  });

  return pedidos
    .map((pedido) => {
      const detalles = pedido.tbl_detalle_pedido.map((detalle) => {
        const cantidadSolicitada = Number(detalle.cantidad);

        const cantidadProducida = Number(
          detalle.tbl_producciones?.cantidad_producida ?? 0
        );

        return {
          id_detalle_pedido: detalle.id_detalle_pedido.toString(),
          id_variante: detalle.id_variante,
          modelo: detalle.tbl_variantes_producto.tbl_productos.nombre,
          talla: detalle.tbl_variantes_producto.talla,
          color: detalle.tbl_variantes_producto.color,
          cantidad_solicitada: cantidadSolicitada,
          cantidad_producida: cantidadProducida,
          cantidad_pendiente: Math.max(
            cantidadSolicitada - cantidadProducida,
            0
          ),
        };
      });

      const detallesPendientes = detalles.filter(
        (detalle) => detalle.cantidad_pendiente > 0
      );

      return {
        id_pedido: pedido.id_pedido.toString(),
        cliente: pedido.tbl_clientes.nombre,
        fecha_pedido: pedido.fecha_pedido,
        fecha_estimada_entrega: pedido.fecha_estimada_entrega,
        estado: pedido.estado,
        detalles: detallesPendientes,
        total_pendiente: detallesPendientes.reduce(
          (total, detalle) => total + detalle.cantidad_pendiente,
          0
        ),
      };
    })
    .filter((pedido) => pedido.total_pendiente > 0);
}

// ========================================
// CREAR PRODUCCIÓN
// ========================================

export async function crearProduccion(idPedido: bigint) {
  return prisma.$transaction(async (tx) => {
    // 1. Buscar el pedido con sus detalles.
    const pedido = await tx.tbl_pedidos.findUnique({
      where: {
        id_pedido: idPedido,
      },
      include: {
        tbl_detalle_pedido: {
          include: {
            tbl_producciones: true,
          },
        },
      },
    });

    if (!pedido) {
      throw new Error("El pedido no existe.");
    }

    // 2. Verificar el estado del pedido.
    if (pedido.estado !== "CONFIRMADO") {
      throw new Error(
        "Solo se pueden crear producciones para pedidos confirmados."
      );
    }

    if (pedido.tbl_detalle_pedido.length === 0) {
      throw new Error(
        "El pedido no tiene detalles para producir."
      );
    }

    // 3. Evitar producciones duplicadas.
    const produccionExistente = pedido.tbl_detalle_pedido.some(
      (detalle) => detalle.tbl_producciones !== null
    );

    if (produccionExistente) {
      throw new Error(
        "El pedido ya tiene una producción registrada."
      );
    }

    // 4. Crear una producción por cada detalle.
    const producciones = [];

    for (const detalle of pedido.tbl_detalle_pedido) {
      const produccion = await tx.tbl_producciones.create({
        data: {
          id_detalle_pedido: detalle.id_detalle_pedido,
          id_usuario: pedido.id_usuario,
          cantidad_total: detalle.cantidad,
          cantidad_producida: 0,
          estado: "PENDIENTE",
          observaciones: null,
        },
      });

      producciones.push(produccion);
    }

    // 5. Actualizar el estado del pedido.
    await tx.tbl_pedidos.update({
      where: {
        id_pedido: idPedido,
      },
      data: {
        estado: "EN_PRODUCCION",
      },
    });

    return {
      id_pedido: idPedido.toString(),
      producciones_creadas: producciones.length,
      estado_pedido: "EN_PRODUCCION",
      producciones,
    };
  });
}

// ========================================
// LISTAR ÓRDENES DE PRODUCCIÓN
// ========================================

export async function obtenerOrdenesProduccion() {
  const producciones = await prisma.tbl_producciones.findMany({
    include: {
      tbl_detalle_pedido: {
        include: {
          tbl_pedidos: {
            include: {
              tbl_clientes: true,
            },
          },
          tbl_variantes_producto: {
            include: {
              tbl_productos: true,
            },
          },
        },
      },
      tbl_lotes_produccion: true,
    },
    orderBy: {
      id_produccion: "desc",
    },
  });

  // Agrupar producciones por pedido.
  const ordenesAgrupadas = new Map<string, any>();

  for (const produccion of producciones) {
    const detalle = produccion.tbl_detalle_pedido;
    const pedido = detalle.tbl_pedidos;
    const variante = detalle.tbl_variantes_producto;
    const producto = variante.tbl_productos;

    const idPedido = pedido.id_pedido.toString();

    if (!ordenesAgrupadas.has(idPedido)) {
      ordenesAgrupadas.set(idPedido, {
        id: `OP-${idPedido}`,
        id_pedido: idPedido,
        pedidoId: `PED-${idPedido}`,
        cliente: pedido.tbl_clientes.nombre,
        modelo: producto.nombre,
        color: variante.color,
        precioUnitario: Number(detalle.precio_unitario),
        estado: "Pendiente",
        tallas: [],
        producciones: [],
        lotes: [],
      });
    }

    const orden = ordenesAgrupadas.get(idPedido);

    orden.tallas.push({
      id_produccion: produccion.id_produccion.toString(),
      id_detalle_pedido: detalle.id_detalle_pedido.toString(),
      id_variante: variante.id_variante,
      modelo: producto.nombre,
      estado: produccion.estado,
      talla: variante.talla,
      color: variante.color,
      solicitada: Number(produccion.cantidad_total),
      producida: Number(produccion.cantidad_producida),
    });

    orden.producciones.push({
      id_produccion: produccion.id_produccion.toString(),
      estado: produccion.estado,
      cantidad_total: Number(produccion.cantidad_total),
      cantidad_producida: Number(produccion.cantidad_producida),
    });

    for (const lote of produccion.tbl_lotes_produccion) {
      orden.lotes.push({
        id: `LOT-${lote.id_lote}`,
        id_lote: lote.id_lote.toString(),
        id_produccion: produccion.id_produccion.toString(),
        numero_lote: lote.numero_lote,
        fecha: lote.fecha_finalizacion ?? lote.fecha_inicio,
        cantidad: Number(lote.cantidad),
        estado: lote.estado,
        observacion: lote.observaciones ?? "",
        talla: variante.talla,
      });
    }
  }

  // Calcular estado general de cada orden.
  const ordenes = Array.from(ordenesAgrupadas.values());

  for (const orden of ordenes) {
    const produccionesOrden = orden.producciones;

    if (
      produccionesOrden.every(
        (produccion: any) =>
          produccion.estado === "CANCELADA"
      )
    ) {
      orden.estado = "Cancelado";
    } else if (
      produccionesOrden.every(
        (produccion: any) =>
          produccion.estado === "FINALIZADA"
      )
    ) {
      orden.estado = "Completado";
    } else if (
      produccionesOrden.some(
        (produccion: any) =>
          produccion.estado === "EN_PROCESO" ||
          produccion.estado === "FINALIZADA"
      )
    ) {
      orden.estado = "En producción";
    } else {
      orden.estado = "Pendiente";
    }
  }

  return ordenes;
}
