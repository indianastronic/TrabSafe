import db from "../db.js";

/* ======================
   CRIAR SOLICITAÇÃO
====================== */
export async function criarSolicitacao(req, res) {
  try {
    const { empresa } = req.body;

    if (!empresa) {
      return res.status(400).json({ success: false, error: "Dados incompletos" });
    }

    // Busca a empresa
    const [empresaRow] = await db.query(
      "SELECT id FROM usuarios WHERE nome = ? AND tipo = 'empresa'",
      [empresa]
    );

    if (!empresaRow.length) {
      return res.status(400).json({ success: false, error: "Empresa não encontrada" });
    }

    const usuarioId = empresaRow[0].id;

    // Tipo de serviço padrão
    const tipo_servico = "PGR, PCMSO, ASO, NR-17, Avaliação Psicossocial, LTCAT";

    // Insere a solicitação
    await db.query(
      `INSERT INTO solicitacoes (usuario_id, tipo_servico, status)
       VALUES (?, ?, 'pendente')`,
      [usuarioId, tipo_servico]
    );

    res.json({ success: true, message: "Solicitação criada com sucesso" });

  } catch (err) {
    console.error("Erro criar solicitacao:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

/* ======================
   LISTAR TODAS AS SOLICITAÇÕES
====================== */
export async function listarTodasSolicitacoes(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT s.id, u.nome AS empresa, s.tipo_servico, s.status
       FROM solicitacoes s
       JOIN usuarios u ON u.id = s.usuario_id
       ORDER BY s.id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Erro listar solicitações:", err);
    res.status(500).json([]);
  }
}

/* ======================
   ATUALIZAR STATUS
====================== */
export async function atualizarStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.query(
      "UPDATE solicitacoes SET status = ? WHERE id = ?",
      [status, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Erro atualizar status:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
