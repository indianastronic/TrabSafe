import express from "express";
import {
  listar,
  criar,
  remover
} from "../controllers/funcionarios.controller.js";

const router = express.Router();

router.get("/:empresaId", listar);
router.post("/", criar);
router.delete("/:id", remover);

export default router;
