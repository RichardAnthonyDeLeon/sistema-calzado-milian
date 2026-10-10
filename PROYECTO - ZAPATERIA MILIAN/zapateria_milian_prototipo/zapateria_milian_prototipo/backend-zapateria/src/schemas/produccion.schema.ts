import { z } from "zod";

export const crearProduccionSchema = z.object({
  id_pedido: z.coerce.bigint().refine(
    (valor) => valor > 0n,
    "El identificador del pedido debe ser válido."
  ),
});

const idProduccionSchema = z.union([
  z.string().regex(/^[1-9]\d*$/),
  z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
]).transform(valor => BigInt(valor)).refine(valor => valor <= 18446744073709551615n);

export const registrarLotesSchema = z.object({
  numero_lote: z.string().trim().min(1).max(30).regex(/^[A-Z0-9_-]+$/,
    "Usa mayúsculas, números, guiones o guiones bajos para identificar la operación."),
  fecha: z.iso.datetime({ offset: true }).optional(),
  observaciones: z.string().trim().max(500).nullable().optional(),
  producciones: z.array(z.object({
    id_produccion: idProduccionSchema,
    cantidad: z.number().int().positive().max(4294967295),
  }).strict()).min(1).max(100),
}).strict().superRefine((datos, ctx) => {
  const ids = datos.producciones.map(item => item.id_produccion.toString());
  if (new Set(ids).size !== ids.length) {
    ctx.addIssue({ code: "custom", path: ["producciones"], message: "No repitas una producción en la operación." });
  }
});

export type RegistrarLotesData = z.infer<typeof registrarLotesSchema>;
