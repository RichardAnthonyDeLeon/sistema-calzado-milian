import { z } from "zod";

const identificador = z.coerce.number().int().positive().max(4294967295);

export const productoFichaParamsSchema = z.object({ id: identificador });
export const materialFichaParamsSchema = productoFichaParamsSchema.extend({
  idMaterial: identificador,
});

export const actualizarMaterialFichaSchema = z.object({
  cantidad_por_par: z.number().positive().max(9999999999.9999)
    .multipleOf(0.0001, "La cantidad admite hasta cuatro decimales."),
  porcentaje_desperdicio: z.number().min(0).max(100)
    .multipleOf(0.01, "El desperdicio admite hasta dos decimales."),
});

export const agregarMaterialFichaSchema = actualizarMaterialFichaSchema.extend({
  id_material: z.number().int().positive().max(4294967295),
});

export type DatosMaterialFicha = z.infer<typeof actualizarMaterialFichaSchema>;
