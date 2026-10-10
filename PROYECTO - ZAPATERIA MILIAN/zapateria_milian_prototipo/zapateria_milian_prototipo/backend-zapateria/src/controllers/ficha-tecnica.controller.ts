import type { Request, Response } from "express";
import {
  productoFichaParamsSchema, materialFichaParamsSchema,
  agregarMaterialFichaSchema, actualizarMaterialFichaSchema,
} from "../schemas/ficha-tecnica.schema.js";
import {
  ErrorFichaTecnica, listarFichaTecnica, agregarMaterialFicha,
  actualizarMaterialFicha, quitarMaterialFicha,
} from "../services/ficha-tecnica.service.js";

function responderError(error: unknown, res: Response) {
  if (error instanceof ErrorFichaTecnica) {
    return res.status(error.status).json({ ok: false, message: error.message });
  }
  if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
    return res.status(409).json({ ok: false, message: "El material ya está asociado a este producto." });
  }
  console.error("Error en ficha técnica:", error);
  return res.status(500).json({ ok: false, message: "No se pudo completar la operación de ficha técnica." });
}

export async function obtenerFichaTecnica(req: Request, res: Response) {
  const params = productoFichaParamsSchema.safeParse(req.params);
  if (!params.success) return res.status(400).json({ ok: false, message: "Producto inválido." });
  try {
    return res.json({ ok: true, data: await listarFichaTecnica(params.data.id) });
  } catch (error) { return responderError(error, res); }
}

export async function registrarMaterialFicha(req: Request, res: Response) {
  const params = productoFichaParamsSchema.safeParse(req.params);
  const body = agregarMaterialFichaSchema.safeParse(req.body);
  if (!params.success || !body.success) {
    return res.status(400).json({ ok: false, message: "Datos de ficha técnica inválidos.",
      errors: !body.success ? body.error.flatten() : undefined });
  }
  try {
    const { id_material, ...datos } = body.data;
    const data = await agregarMaterialFicha(params.data.id, id_material, datos);
    return res.status(201).json({ ok: true, message: "Material agregado a la ficha técnica.", data });
  } catch (error) { return responderError(error, res); }
}

export async function modificarMaterialFicha(req: Request, res: Response) {
  const params = materialFichaParamsSchema.safeParse(req.params);
  const body = actualizarMaterialFichaSchema.safeParse(req.body);
  if (!params.success || !body.success) {
    return res.status(400).json({ ok: false, message: "Datos de ficha técnica inválidos.",
      errors: !body.success ? body.error.flatten() : undefined });
  }
  try {
    const data = await actualizarMaterialFicha(params.data.id, params.data.idMaterial, body.data);
    return res.json({ ok: true, message: "Material actualizado correctamente.", data });
  } catch (error) { return responderError(error, res); }
}

export async function eliminarMaterialFicha(req: Request, res: Response) {
  const params = materialFichaParamsSchema.safeParse(req.params);
  if (!params.success) return res.status(400).json({ ok: false, message: "Identificadores inválidos." });
  try {
    await quitarMaterialFicha(params.data.id, params.data.idMaterial);
    return res.json({ ok: true, message: "Material quitado de la ficha técnica." });
  } catch (error) { return responderError(error, res); }
}
