import { Router } from "express";

import {

  obtenerPedidos,

  obtenerPedidoPorId,

  registrarPedido,

  actualizarPedido,

  cambiarEstadoPedido

} from "../controllers/pedidos.controller.js";


const router = Router();


router.get(
  "/",
  obtenerPedidos
);


router.get(
  "/:id",
  obtenerPedidoPorId
);


router.post(
  "/",
  registrarPedido
);


router.put(
  "/:id",
  actualizarPedido
);


router.patch(
  "/:id/estado",
  cambiarEstadoPedido
);


export default router;