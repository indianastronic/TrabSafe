import express from "express";
import db from "../db.js";

const router = express.Router();

/* ======================
   BUSCAR PRESTADORES (IA)
====================== */
router.post("/buscar", async (req, res) => {
  try {
    const { regiao } = req.body; // agora usamos a região enviada pelo usuário

    // Busca prestadores pela região
    const [rows] = await db.query(
      `
      SELECT id, nome, regiao
      FROM usuarios
      WHERE regiao = ?
      LIMIT 10
      `,
      [regiao]
    );

    // ⚠️ NUNCA retornar erro para a IA
    return res.json(Array.isArray(rows) ? rows : []);

  } catch (err) {
    console.error("Erro buscar prestadores:", err.message);
    return res.json([]); // IA nunca quebra
  }
});
router.get("/perfil/:id", (req, res) => {
  res.json({ primeiro_login: false, experiencia: "", contato: "" });
});
export default router;
