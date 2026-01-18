import db from "../db.js";

/* ================= LISTAR ================= */
export async function listar(req, res) {
  const { empresaId } = req.params;

  const [rows] = await db.query(
    "SELECT * FROM funcionarios WHERE empresa_id = ? ORDER BY nome",
    [empresaId]
  );

  res.json(rows);
}

/* ================= CRIAR ================= */
export async function criar(req, res) {
  const {
    empresa_id,
    nome,
    aso_inicio,
    aso_fim,
    treino_inicio,
    treino_fim,
    area
  } = req.body;

  if (!empresa_id || !nome) {
    return res.status(400).json({ message: "Empresa e nome são obrigatórios" });
  }

  await db.query(
    `INSERT INTO funcionarios
     (empresa_id, nome, aso_inicio, aso_fim, treino_inicio, treino_fim, area)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      empresa_id,
      nome,
      aso_inicio || null,
      aso_fim || null,
      treino_inicio || null,
      treino_fim || null,
      area || null
    ]
  );

  res.json({ success: true });
}

/* ================= REMOVER ================= */
export async function remover(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID não informado" });
    }

    await db.query(
      "DELETE FROM funcionarios WHERE id = ?",
      [id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover funcionário" });
  }
}
