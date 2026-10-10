import { Router } from "express";
import { obtenerClientes, registrarCliente, obtenerClientePorId, modificarCliente, eliminarCliente} from "../controllers/clientes.controller.js";

const router = Router();

router.get("/", obtenerClientes);
router.post("/", registrarCliente);
router.get("/:id", obtenerClientePorId);
router.put("/:id", modificarCliente);
router.delete("/:id", eliminarCliente);

export default router;