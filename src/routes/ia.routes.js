import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/buscar-prestadores", async (req, res) => {
  try {
    const { empresa } = req.body;

    // 1️⃣ Busca a empresa na tabela usuários para pegar a região
    const [empresaRow] = await db.query(
      "SELECT id, regiao FROM usuarios WHERE tipo = 'empresa' AND TRIM(LOWER(nome)) = TRIM(LOWER(?))",
      [empresa]
    );

    if (!empresaRow.length) {
      return res.json({ prestadores: [], regiao: null });
    }

    const regiao = empresaRow[0].regiao;

    // 2️⃣ Busca prestadores da mesma região e junta com a tabela prestadores_detalhes
    const [prestadores] = await db.query(
      `SELECT u.id, u.nome, u.regiao, pd.experiencia, pd.contato
       FROM usuarios u
       LEFT JOIN prestadores_detalhes pd ON pd.prestador_id = u.id
       WHERE u.tipo = 'prestador' AND TRIM(LOWER(u.regiao)) = TRIM(LOWER(?))`,
      [regiao]
    );

    return res.json({ prestadores, regiao });
  } catch (err) {
    console.error("Erro buscar prestadores:", err.message);
    return res.json({ prestadores: [], regiao: null });
  }
});

export default router;
