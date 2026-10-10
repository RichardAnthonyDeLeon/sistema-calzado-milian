import { z } from "zod";


export const crearProductoSchema = z.object({

  nombre: z.string().min(
    2,
    "El nombre es obligatorio"
  ),

  categoria: z.string().min(
    1,
    "La categoría es obligatoria"
  ),

  precioBase: z
    .number()
    .positive(),

  descripcion: z
    .string()
    .optional()
    .nullable(),

  imagen: z
    .string()
    .optional()
    .nullable(),

});


export const actualizarProductoSchema =
  crearProductoSchema
    .partial()
    .extend({

      estado: z
        .enum([
          "ACTIVO",
          "INACTIVO"
        ])
        .optional(),

    });


export const crearVarianteSchema = z.object({

  talla: z
    .string()
    .min(1),

  color: z
    .string()
    .min(1),

  material: z
    .string()
    .min(1),

  suela: z
    .string()
    .min(1),

  precio: z
    .number()
    .positive(),

});