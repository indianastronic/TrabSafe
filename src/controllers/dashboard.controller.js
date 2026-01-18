import db from "../db.js";

export async function indicadoresEmpresa(req, res) {
  try {
    const { empresaId } = req.params;

    const hoje = new Date();
    const limite = new Date();
    limite.setDate(hoje.getDate() + 30);

    // Busca apenas datas de treinamento
    const [treinamentos] = await db.query(
      `
      SELECT treino_fim
      FROM funcionarios
      WHERE empresa_id = ?
        AND treino_fim IS NOT NULL
      `,
      [empresaId]
    );

    // Busca apenas datas de ASO
    const [asos] = await db.query(
      `
      SELECT aso_fim
      FROM funcionarios
      WHERE empresa_id = ?
        AND aso_fim IS NOT NULL
      `,
      [empresaId]
    );

    let treinamentosVencendo = 0;
    let treinamentosValidos = 0;
    let asosVencendo = 0;

    // ===== TREINAMENTOS =====
    treinamentos.forEach(t => {
      const fim = new Date(t.treino_fim);

      if (fim < hoje) {
        // vencido → ignora
        return;
      }

      treinamentosValidos++;

      if (fim <= limite) {
        treinamentosVencendo++;
      }
    });

    // ===== ASOS =====
    asos.forEach(a => {
      const fim = new Date(a.aso_fim);

      if (fim < hoje) {
        return;
      }

      if (fim <= limite) {
        asosVencendo++;
      }
    });

    res.json({
      treinamentosVencendo,
      asosVencendo,
      treinamentosValidos
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao carregar dashboard" });
  }
}
