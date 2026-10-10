import { Router } from "express";

import {
  obtenerProveedores,
  registrarProveedor,
  obtenerProveedorPorId,
  modificarProveedor
} from "../controllers/proveedores.controller.js";


const router = Router();


router.get(
  "/",
  obtenerProveedores
);


router.get(
  "/:id",
  obtenerProveedorPorId
);


router.post(
  "/",
  registrarProveedor
);


router.put(
  "/:id",
  modificarProveedor
);


export default router;