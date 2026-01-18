import express from "express";
import { upload, salvarDocumento } from "../controllers/documentos.controller.js";

const router = express.Router();

router.post("/upload", upload.single("arquivo"), salvarDocumento);

export default router;
