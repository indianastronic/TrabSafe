import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

/* Rotas */
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import funcionariosRoutes from "./routes/funcionarios.routes.js";
import solicitacoesRoutes from "./routes/solicitacoes.routes.js";
import prestadoresRoutes from "./routes/prestadores.routes.js";
import iaRoutes from "./routes/ia.routes.js";
import documentosRoutes from "./routes/documentos.routes.js";
import prestadorPerfilRoutes from "./routes/prestador.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;


/* Resolver __dirname no ES Module */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Middlewares */
app.use(cors());
app.use(express.json());

/* Servir frontend */
app.use(express.static(path.join(__dirname, "public")));

/* Garantir index */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* APIs */
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/funcionarios", funcionariosRoutes);
app.use("/api/solicitacoes", solicitacoesRoutes);
app.use("/api/prestadores", prestadoresRoutes);
app.use("/api/ia", iaRoutes);
app.use("/api/documentos", documentosRoutes);
app.use("/api/prestador", prestadorPerfilRoutes);

/* Uploads */
app.use("/uploads", express.static("uploads"));

/* Fallback */
app.use((req, res) => {
  res.status(404).send("Rota não encontrada");
});

app.listen(PORT, () => {
  console.log(`🔥 TrabSafe rodando na porta ${PORT}`);
});
