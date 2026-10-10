import { z } from "zod";


const detallePedidoExistenteSchema = z.object({

  id_variante: z.number().int().positive(),

  cantidad: z.number().int().positive(),

  precio_unitario: z.number().positive(),

  descripcion_diseno: z
    .string()
    .optional()
    .nullable()

});


const detallePedidoPersonalizadoSchema = z.object({

  talla: z
    .string()
    .trim()
    .min(1),

  cantidad: z
    .number()
    .int()
    .positive()

});


const pedidoBaseSchema = z.object({

  id_cliente:
    z.number().int().positive(),

  fecha_estimada_entrega:
    z.string().optional().nullable(),

  observaciones:
    z.string().optional().nullable(),

  imagen_referencia:
    z.string().optional().nullable(),

  anticipo:
    z.number().min(0).default(0)

});


const pedidoExistenteSchema =
  pedidoBaseSchema.extend({

    tipo_modelo:
      z.literal("EXISTENTE"),

    detalles:
      z
        .array(
          detallePedidoExistenteSchema
        )
        .min(
          1,
          "El pedido debe tener al menos un detalle"
        )

  });


const pedidoPersonalizadoSchema =
  pedidoBaseSchema.extend({

    tipo_modelo:
      z.literal("PERSONALIZADO"),

    modelo_personalizado:
      z.object({

        nombre:
          z.string().trim().min(1),

        categoria:
          z.string().trim().optional().nullable(),

        color:
          z.string().trim().min(1),

        material:
          z.string().trim().min(1),

        suela:
          z.string().trim().min(1),

        color_suela:
          z.string().trim().min(1),

        precio:
          z.number().positive()

      }),

    detalles:
      z
        .array(
          detallePedidoPersonalizadoSchema
        )
        .min(
          1,
          "El pedido debe tener al menos una talla"
        )

  });


export const crearPedidoSchema =
  z.discriminatedUnion(
    "tipo_modelo",
    [
      pedidoExistenteSchema,
      pedidoPersonalizadoSchema
    ]
  );


/*
 * La edición conserva la misma estructura.
 * El servicio controlará si el pedido todavía
 * puede modificarse.
 */
export const editarPedidoSchema =
  crearPedidoSchema;


export const actualizarEstadoPedidoSchema =
  z.object({

    estado: z.enum([
      "BORRADOR",
      "CONFIRMADO",
      "EN_PRODUCCION",
      "LISTO",
      "ENTREGADO",
      "CANCELADO"
    ])

  });