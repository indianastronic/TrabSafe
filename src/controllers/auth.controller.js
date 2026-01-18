import db from "../db.js";

/* ======================
   CADASTRO
====================== */
export async function cadastro(req, res) {
  try {
    const { nome, email, senha, tipo, regiao } = req.body;

    if (!nome || !email || !senha || !tipo || !regiao) {
      return res.status(400).json({
        success: false,
        message: "Dados incompletos"
      });
    }

    const [existe] = await db.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existe.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email já cadastrado"
      });
    }

    const [result] = await db.query(
      `INSERT INTO usuarios 
       (nome, email, senha, tipo, regiao, primeiro_login) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, email, senha, tipo, regiao, tipo === "prestador"]
    );

    res.json({ success: true, id: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}

/* ======================
   LOGIN
====================== */
export async function login(req, res) {
  try {
    const { email, senha, tipo } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ? AND senha = ? AND tipo = ?",
      [email, senha, tipo]
    );

    if (!rows.length) {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      id: rows[0].id,
      tipo: rows[0].tipo
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
}
