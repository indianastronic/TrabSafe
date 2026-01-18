import db from "../db.js";

/* =========================
   PERFIL DO PRESTADOR
========================= */

// Buscar perfil do prestador
export async function obterPerfilPrestador(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT id, nome, email, regiao, experiencias, contatos FROM prestadores WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("ERRO PERFIL PRESTADOR:", err);
    res.status(500).json({ success: false });
  }
}

// Atualizar perfil (modal do primeiro login)
export async function atualizarPerfilPrestador(req, res) {
  try {
    const { id } = req.params;
    const { experiencias, contatos, regiao } = req.body;

    await db.query(
      `UPDATE prestadores 
       SET experiencias = ?, contatos = ?, regiao = ?
       WHERE id = ?`,
      [experiencias, contatos, regiao, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("ERRO ATUALIZAR PERFIL:", err);
    res.status(500).json({ success: false });
  }
}
