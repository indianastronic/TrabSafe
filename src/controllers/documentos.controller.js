import multer from "multer";
import path from "path";
import db from "../db.js";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });

export function salvarDocumento(req, res) {
  const { empresaId, tipo, status } = req.body;
  const arquivo = req.file.filename;

  db.query(
    "INSERT INTO documentos (empresa_id, tipo, status, arquivo) VALUES (?,?,?,?)",
    [empresaId, tipo, status, arquivo],
    () => res.json({ success: true })
  );
}
