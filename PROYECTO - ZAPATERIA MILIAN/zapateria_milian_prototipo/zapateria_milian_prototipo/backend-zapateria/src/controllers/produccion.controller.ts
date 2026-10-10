import { Request, Response } from "express";
import { registrarLotesSchema, crearProduccionSchema } from "../schemas/produccion.schema.js";
import { ErrorLoteProduccion, registrarLotesProduccion } from "../services/lotes-produccion.service.js";
import {
  obtenerPedidosDisponibles,
  crearProduccion,
  obtenerOrdenesProduccion,
} from "../services/produccion.service.js";

export async function registrarLotes(req: Request, res: Response) {
  const validacion = registrarLotesSchema.safeParse(req.body);
  if (!validacion.success) return res.status(400).json({
    ok: false, message: "Datos de lotes inválidos.", errores: validacion.error.flatten(),
  });
  try {
    const resultado = await registrarLotesProduccion(validacion.data);
    return res.status(resultado.reutilizado ? 200 : 201).json({
      ok: true, message: resultado.reutilizado ? "La operación ya estaba registrada; no se repitieron movimientos." : "Lotes registrados correctamente.",
      data: resultado,
    });
  } catch (error) {
    if (error instanceof ErrorLoteProduccion) return res.status(error.status).json({ ok: false, message: error.message });
    if (typeof error === "object" && error !== null && "code" in error &&
      ["P2002", "P2034", "P2028"].includes(String(error.code))) {
      return res.status(409).json({ ok: false, message: "Conflicto concurrente o transacción vencida. Reintenta con el mismo número de lote y los mismos datos." });
    }
    console.error("Error al registrar lotes:", error);
    return res.status(500).json({ ok: false, message: "No se pudieron registrar los lotes. La operación fue revertida." });
  }
}

// ========================================
// LISTAR PEDIDOS DISPONIBLES
// ========================================

export async function listarPedidosDisponibles(
  req: Request,
  res: Response
) {
  try {
    const pedidos = await obtenerPedidosDisponibles();

    return res.status(200).json({
      ok: true,
      data: pedidos,
    });
  } catch (error) {
    console.error(
      "Error al obtener pedidos disponibles:",
      error
    );

    return res.status(500).json({
      ok: false,
      message: "Error al consultar los pedidos disponibles.",
    });
  }
}

// ========================================
// REGISTRAR PRODUCCIÓN
// ========================================

export async function registrarProduccion(
  req: Request,
  res: Response
) {
  try {
    const validacion = crearProduccionSchema.safeParse(
      req.body
    );

    if (!validacion.success) {
      return res.status(400).json({
        ok: false,
        message: "Datos de producción inválidos.",
        errores: validacion.error.flatten(),
      });
    }

    const resultado = await crearProduccion(
      validacion.data.id_pedido
    );

    return res.status(201).json({
      ok: true,
      message: "Producción registrada correctamente.",
      data: resultado,
    });
  } catch (error) {
    console.error(
      "Error al registrar producción:",
      error
    );

    const mensaje =
      error instanceof Error
        ? error.message
        : "Error interno del servidor.";

    if (
      mensaje === "El pedido no existe." ||
      mensaje ===
        "Solo se pueden crear producciones para pedidos confirmados." ||
      mensaje ===
        "El pedido no tiene detalles para producir." ||
      mensaje ===
        "El pedido ya tiene una producción registrada."
    ) {
      return res.status(400).json({
        ok: false,
        message: mensaje,
      });
    }

    return res.status(500).json({
      ok: false,
      message: "Error al registrar la producción.",
    });
  }
}

// ========================================
// LISTAR ÓRDENES DE PRODUCCIÓN
// ========================================

export async function listarOrdenesProduccion(
  req: Request,
  res: Response
) {
  try {
    const ordenes = await obtenerOrdenesProduccion();

    return res.status(200).json({
      ok: true,
      data: ordenes,
    });
  } catch (error) {
    console.error(
      "Error al obtener órdenes de producción:",
      error
    );

    return res.status(500).json({
      ok: false,
      message: "Error al consultar las órdenes de producción.",
    });
  }
}
