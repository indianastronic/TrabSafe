import express from "express";
import { criarSolicitacao, listarTodasSolicitacoes, atualizarStatus } from "../controllers/solicitacoes.controller.js";
import db from "../db.js";

const router = express.Router();

/* -----------------------------
   Criar solicitação via IA
----------------------------- */
router.post("/", criarSolicitacao);

/* -----------------------------
   Buscar todas solicitações
   para painel do prestador
----------------------------- */
router.get("/todas", listarTodasSolicitacoes);

/* -----------------------------
   Atualizar status da solicitação
   "pendente" -> "andamento"
   "andamento" -> "concluida"
----------------------------- */
router.post("/:id/status", atualizarStatus);

export default router;
