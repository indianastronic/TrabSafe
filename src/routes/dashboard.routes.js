import express from "express";
import { indicadoresEmpresa } from "../controllers/dashboard.controller.js";

const router = express.Router();

/* Dashboard da empresa */
router.get("/empresa/:empresaId", indicadoresEmpresa);

export default router;
