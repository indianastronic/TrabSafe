import db from "../db.js";

export async function buscarPrestadores(req, res) {
  try {
    const { regiao } = req.body;

    const [rows] = await db.query(
      "SELECT id, nome, regiao FROM usuarios WHERE tipo='prestador' AND regiao=?",
      [regiao]
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.json([]);
  }
}
