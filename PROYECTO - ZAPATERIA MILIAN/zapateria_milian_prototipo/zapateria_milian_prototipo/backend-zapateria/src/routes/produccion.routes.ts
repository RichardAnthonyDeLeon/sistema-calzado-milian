import { Router } from "express";

import {
  listarPedidosDisponibles,
  registrarProduccion,
  listarOrdenesProduccion,
  registrarLotes,
} from "../controllers/produccion.controller.js";

const router = Router();

router.post("/lotes", registrarLotes);

// Consultar órdenes de producción.
router.get(
  "/",
  listarOrdenesProduccion
);

// Consultar pedidos disponibles.
router.get(
  "/pedidos-disponibles",
  listarPedidosDisponibles
);

// Crear orden de producción.
router.post(
  "/",
  registrarProduccion
);

export default router;
