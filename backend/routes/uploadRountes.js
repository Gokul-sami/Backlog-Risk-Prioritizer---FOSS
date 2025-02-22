// backend/routes/uploadRoutes.js
import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  res.json({ message: "File uploaded successfully", file: req.file });
});

export default router;