import { z } from "zod";


export const crearMaterialSchema = z.object({

  nombre: z
    .string()
    .min(2, "El nombre es obligatorio"),

  unidad: z
    .string()
    .min(1, "La unidad de medida es obligatoria"),

  existencia: z
    .number()
    .min(0),

  minimo: z
    .number()
    .min(0),

  costo: z
    .number()
    .min(0),

  descripcion: z
    .string()
    .optional()
    .nullable(),

});


export const actualizarMaterialSchema =
  crearMaterialSchema
    .partial()
    .extend({

      estado: z
        .enum([
          "ACTIVO",
          "INACTIVO"
        ])
        .optional(),

    });

    export const entradaMaterialSchema = z.object({

  id_material: z
    .number()
    .int()
    .positive(),

  id_proveedor: z
    .number()
    .int()
    .positive(),

  cantidad: z
    .number()
    .positive(),

  costo_total: z
    .number()
    .min(0),

  observaciones: z
    .string()
    .optional()
    .nullable(),

});