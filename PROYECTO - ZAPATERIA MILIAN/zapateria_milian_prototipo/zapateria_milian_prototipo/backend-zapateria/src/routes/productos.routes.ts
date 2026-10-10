import { Router } from "express";

import {
  obtenerProductos,
  registrarProducto,
  modificarProducto,
  registrarVariante
} from "../controllers/productos.controller.js";


import {
  obtenerFichaTecnica, registrarMaterialFicha,
  modificarMaterialFicha, eliminarMaterialFicha,
} from "../controllers/ficha-tecnica.controller.js";

const router = Router();

router.get("/:id/materiales", obtenerFichaTecnica);
router.post("/:id/materiales", registrarMaterialFicha);
router.put("/:id/materiales/:idMaterial", modificarMaterialFicha);
router.delete("/:id/materiales/:idMaterial", eliminarMaterialFicha);


router.get(
  "/",
  obtenerProductos
);


router.post(
  "/",
  registrarProducto
);


router.post(
  "/:id/variantes",
  registrarVariante
);


router.put(
  "/:id",
  modificarProducto
);


export default router;
