import { prisma } from "../lib/prisma.js";
import { confirmarPedido } from "./confirmacion-pedido.service.js";


interface DetalleExistente {

  id_variante: number;

  cantidad: number;

  precio_unitario: number;

  descripcion_diseno?: string | null;

}


interface DetallePersonalizado {

  talla: string;

  cantidad: number;

}


interface DatosBase {

  id_cliente: number;

  fecha_estimada_entrega?: string | null;

  observaciones?: string | null;

  imagen_referencia?: string | null;

  anticipo: number;

}


interface PedidoExistenteData
  extends DatosBase {

  tipo_modelo: "EXISTENTE";

  detalles: DetalleExistente[];

}


interface PedidoPersonalizadoData
  extends DatosBase {

  tipo_modelo: "PERSONALIZADO";

  modelo_personalizado: {

    nombre: string;

    categoria?: string | null;

    color: string;

    material: string;

    suela: string;

    color_suela: string;

    precio: number;

  };

  detalles: DetallePersonalizado[];

}


type PedidoData =
  | PedidoExistenteData
  | PedidoPersonalizadoData;


const incluirPedidoCompleto = {

  tbl_clientes: true,

  tbl_pagos_pedido: true,

  tbl_detalle_pedido: {

    include: {

      tbl_variantes_producto: {

        include: {
          tbl_productos: true
        }

      }

    }

  }

};


export async function listarPedidos() {

  return prisma.tbl_pedidos.findMany({

    include:
      incluirPedidoCompleto,

    orderBy: {
      id_pedido: "desc"
    }

  });

}


export async function buscarPedidoPorId(
  id: bigint
) {

  return prisma.tbl_pedidos.findUnique({

    where: {
      id_pedido: id
    },

    include:
      incluirPedidoCompleto

  });

}


async function validarCliente(
  tx: any,
  idCliente: number
) {

  const cliente =
    await tx.tbl_clientes.findUnique({

      where: {
        id_cliente:
          idCliente
      }

    });


  if (!cliente) {

    throw new Error(
      "El cliente seleccionado no existe"
    );

  }


  if (
    cliente.estado !==
    "ACTIVO"
  ) {

    throw new Error(
      "El cliente seleccionado está inactivo"
    );

  }

}


async function prepararDetalles(
  tx: any,
  data: PedidoData
) {

  if (
    data.tipo_modelo ===
    "EXISTENTE"
  ) {

    const detallesPreparados = [];


    for (
      const detalle of data.detalles
    ) {

      const variante =
        await tx
          .tbl_variantes_producto
          .findUnique({

            where: {
              id_variante:
                detalle.id_variante
            },

            include: {
              tbl_productos: true
            }

          });


      if (!variante) {

        throw new Error(
          `La variante ${detalle.id_variante} no existe`
        );

      }


      if (
        variante.estado !==
        "ACTIVO"
      ) {

        throw new Error(
          `La variante ${detalle.id_variante} está inactiva`
        );

      }


      if (
        variante.tbl_productos.estado !==
        "ACTIVO"
      ) {

        throw new Error(
          "El producto seleccionado está inactivo"
        );

      }


      detallesPreparados.push({

        id_variante:
          detalle.id_variante,

        cantidad:
          detalle.cantidad,

        precio_unitario:
          detalle.precio_unitario,

        descripcion_diseno:
          detalle.descripcion_diseno ??
          null

      });

    }


    return detallesPreparados;

  }


  const modelo =
    data.modelo_personalizado;


  const productoExistente =
    await tx.tbl_productos.findUnique({

      where: {
        nombre:
          modelo.nombre
      }

    });


  if (productoExistente) {

    throw new Error(
      "Ya existe un producto con ese nombre. Selecciónalo como modelo existente."
    );

  }


  const producto =
    await tx.tbl_productos.create({

      data: {

        nombre:
          modelo.nombre,

        categoria:
          modelo.categoria ??
          "Personalizado",

        descripcion:
          data.observaciones ??
          "Modelo personalizado registrado desde un pedido",

        imagen_url:
          data.imagen_referencia ??
          "",

        precio_venta:
          modelo.precio,

        estado:
          "ACTIVO"

      }

    });


  const tallasUnicas =
    new Set(
      data.detalles.map(
        detalle =>
          detalle.talla.trim()
      )
    );


  if (
    tallasUnicas.size !==
    data.detalles.length
  ) {

    throw new Error(
      "No puedes repetir la misma talla en el modelo personalizado"
    );

  }


  const detallesPreparados = [];


  for (
    const detalle of data.detalles
  ) {

    const variante =
      await tx
        .tbl_variantes_producto
        .create({

          data: {

            id_producto:
              producto.id_producto,

            talla:
              detalle.talla.trim(),

            color:
              modelo.color,

            material:
              modelo.material,

            /*
             * La tabla actual solamente tiene
             * un campo 'suela'. Guardamos aquí
             * el tipo y color de suela para no
             * perder ese dato.
             */
            suela:
              `${modelo.suela} - ${modelo.color_suela}`,

            precio:
              modelo.precio,

            existencia_actual:
              0,

            estado:
              "ACTIVO"

          }

        });


    detallesPreparados.push({

      id_variante:
        variante.id_variante,

      cantidad:
        detalle.cantidad,

      precio_unitario:
        modelo.precio,

      descripcion_diseno:
        data.observaciones ??
        null

    });

  }


  return detallesPreparados;

}


async function guardarAnticipo(
  tx: any,
  idPedido: bigint,
  idUsuario: number,
  anticipo: number
) {

  if (
    anticipo <= 0
  ) {
    return;
  }


  await tx.tbl_pagos_pedido.create({

    data: {

      id_pedido:
        idPedido,

      id_usuario:
        idUsuario,

      monto:
        anticipo,

      tipo_pago:
        "ANTICIPO",

      observaciones:
        "Anticipo registrado en el pedido"

    }

  });

}


export async function crearPedido(
  data: PedidoData
) {

  const idUsuario = 1;


  return prisma.$transaction(
    async (tx) => {

      await validarCliente(
        tx,
        data.id_cliente
      );


      const detalles =
        await prepararDetalles(
          tx,
          data
        );


      const precioTotal =
        detalles.reduce(

          (
            total,
            detalle
          ) =>
            total +
            (
              detalle.cantidad *
              detalle.precio_unitario
            ),

          0

        );


      if (
        data.anticipo >
        precioTotal
      ) {

        throw new Error(
          "El anticipo no puede ser mayor al total del pedido"
        );

      }


      const pedido =
        await tx.tbl_pedidos.create({

          data: {

            id_cliente:
              data.id_cliente,

            id_usuario:
              idUsuario,

            fecha_estimada_entrega:
              data.fecha_estimada_entrega
                ? new Date(
                    data.fecha_estimada_entrega
                  )
                : null,

            precio_total:
              precioTotal,

            observaciones:
              data.observaciones ??
              null,

            imagen_referencia:
              data.imagen_referencia ??
              null,

            estado:
              "BORRADOR"

          }

        });


      for (
        const detalle of detalles
      ) {

        const subtotal =
          detalle.cantidad *
          detalle.precio_unitario;


        await tx
          .tbl_detalle_pedido
          .create({

            data: {

              id_pedido:
                pedido.id_pedido,

              id_variante:
                detalle.id_variante,

              descripcion_diseno:
                detalle
                  .descripcion_diseno,

              cantidad:
                detalle.cantidad,

              precio_unitario:
                detalle
                  .precio_unitario,

              subtotal

            }

          });

      }


      await guardarAnticipo(
        tx,
        pedido.id_pedido,
        idUsuario,
        data.anticipo
      );


      return tx.tbl_pedidos.findUnique({

        where: {
          id_pedido:
            pedido.id_pedido
        },

        include:
          incluirPedidoCompleto

      });

    }
  );

}


export async function editarPedido(
  id: bigint,
  data: PedidoData
) {

  const idUsuario = 1;


  return prisma.$transaction(
    async (tx) => {

      const pedidoActual =
        await tx.tbl_pedidos.findUnique({

          where: {
            id_pedido: id
          }

        });


      if (!pedidoActual) {

        throw new Error(
          "El pedido no existe"
        );

      }


      if (
        pedidoActual.estado !==
          "BORRADOR" &&
        pedidoActual.estado !==
          "CONFIRMADO"
      ) {

        throw new Error(
          "El pedido ya no puede editarse porque su proceso ya inició"
        );

      }


      await validarCliente(
        tx,
        data.id_cliente
      );


      /*
       * En edición permitimos modificar pedidos
       * existentes normalmente.
       *
       * Si se envía PERSONALIZADO se creará un
       * nuevo producto personalizado.
       */
      const detalles =
        await prepararDetalles(
          tx,
          data
        );


      const precioTotal =
        detalles.reduce(

          (
            total,
            detalle
          ) =>
            total +
            (
              detalle.cantidad *
              detalle.precio_unitario
            ),

          0

        );


      if (
        data.anticipo >
        precioTotal
      ) {

        throw new Error(
          "El anticipo no puede ser mayor al total del pedido"
        );

      }


      await tx
        .tbl_detalle_pedido
        .deleteMany({

          where: {
            id_pedido: id
          }

        });


      await tx.tbl_pedidos.update({

        where: {
          id_pedido: id
        },

        data: {

          id_cliente:
            data.id_cliente,

          fecha_estimada_entrega:
            data.fecha_estimada_entrega
              ? new Date(
                  data.fecha_estimada_entrega
                )
              : null,

          precio_total:
            precioTotal,

          observaciones:
            data.observaciones ??
            null,

          imagen_referencia:
            data.imagen_referencia ??
            null

        }

      });


      for (
        const detalle of detalles
      ) {

        await tx
          .tbl_detalle_pedido
          .create({

            data: {

              id_pedido: id,

              id_variante:
                detalle.id_variante,

              descripcion_diseno:
                detalle
                  .descripcion_diseno,

              cantidad:
                detalle.cantidad,

              precio_unitario:
                detalle
                  .precio_unitario,

              subtotal:
                detalle.cantidad *
                detalle.precio_unitario

            }

          });

      }


      await tx
        .tbl_pagos_pedido
        .deleteMany({

          where: {

            id_pedido: id,

            tipo_pago:
              "ANTICIPO"

          }

        });


      await guardarAnticipo(
        tx,
        id,
        idUsuario,
        data.anticipo
      );


      return tx.tbl_pedidos.findUnique({

        where: {
          id_pedido: id
        },

        include:
          incluirPedidoCompleto

      });

    }
  );

}


export async function actualizarEstadoPedido(
  id: bigint,
  estado:
    | "BORRADOR"
    | "CONFIRMADO"
    | "EN_PRODUCCION"
    | "LISTO"
    | "ENTREGADO"
    | "CANCELADO"
) {
  if (estado === "CONFIRMADO") return confirmarPedido(id);

  const pedido =
    await prisma.tbl_pedidos.findUnique({

      where: {
        id_pedido: id
      }

    });


  if (!pedido) {

    throw new Error(
      "El pedido no existe"
    );

  }


  return prisma.tbl_pedidos.update({

    where: {
      id_pedido: id
    },

    data: {
      estado
    }

  });

}
