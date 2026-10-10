import { Router } from "express";

import {
  obtenerMateriales,
  registrarMaterial,
  modificarMaterial,
  crearEntradaMaterial
} from "../controllers/materiales.controller.js";

const router = Router();


router.get(
  "/",
  obtenerMateriales
);


router.post(
  "/",
  registrarMaterial
);


router.put(
  "/:id",
  modificarMaterial
);

router.post(
  "/entrada",
  crearEntradaMaterial
);

export default router;