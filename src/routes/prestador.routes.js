import express from "express";
import {
  obterPerfilPrestador,
  atualizarPerfilPrestador
} from "../controllers/prestador.controller.js";

const router = express.Router();

/* Perfil */
router.get("/perfil/:id", obterPerfilPrestador);
router.put("/perfil/:id", atualizarPerfilPrestador);

export default router;
