import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

import clientesRoutes from "./routes/clientes.routes.js";
import proveedoresRoutes from "./routes/proveedores.routes.js";
import materialesRoutes from "./routes/materiales.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js";
import produccionRoutes from "./routes/produccion.routes.js";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "API Zapatería Milian funcionando",
  });
});

// Rutas
app.use("/api/clientes", clientesRoutes);
app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/materiales", materialesRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/produccion", produccionRoutes);

// Puerto
const PORT = Number(process.env.PORT) || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});