import db from "../db.js";

export async function buscarPrestadores(req, res) {
  const { ramo } = req.body;

  const [rows] = await db.query(
    "SELECT id, nome, regiao FROM prestadores WHERE especialidade LIKE ?",
    [`%${ramo}%`]
  );

  if (rows.length === 0) {
    return res.json({ encontrados: false });
  }

  res.json({
    encontrados: true,
    lista: rows
  });
}

export async function criarSolicitacao(req, res) {
  const { empresa, ramo } = req.body;

  const [prestadores] = await db.query(
    "SELECT id FROM prestadores"
  );

  for (const p of prestadores) {
    await db.query(
      `INSERT INTO solicitacoes (prestador_id, empresa, ramo, status)
       VALUES (?, ?, ?, 'nova')`,
      [p.id, empresa, ramo]
    );
  }

  res.json({ success: true });
}
