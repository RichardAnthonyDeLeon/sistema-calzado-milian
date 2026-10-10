import { z } from "zod";


export const crearClienteSchema = z.object({

  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres"),

  telefono: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 caracteres")
    .optional()
    .nullable(),

  correo: z
    .string()
    .email("Correo no válido")
    .optional()
    .nullable()
    .or(z.literal("")),

  nit: z
    .string()
    .optional()
    .nullable(),

  direccion: z
    .string()
    .optional()
    .nullable(),

  observaciones: z
    .string()
    .optional()
    .nullable(),

});


export const actualizarClienteSchema =
  crearClienteSchema
    .partial()
    .extend({

      estado: z
        .enum([
          "ACTIVO",
          "INACTIVO"
        ])
        .optional(),

    });