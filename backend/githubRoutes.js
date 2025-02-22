import express from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import axios from "axios";

const router = express.Router();

router.get("/repos", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const response = await axios.get("https://api.github.com/user/repos", {
    headers: { Authorization: `token ${req.user.accessToken}` },
  });

  res.json(response.data);
});

router.post("/clone", (req, res) => {
  const { repoUrl, repoName } = req.body;
  if (!repoUrl) return res.status(400).json({ error: "Repository URL required" });

  const repoPath = path.join(__dirname, "cloned_repos", repoName);
  exec(`git clone ${repoUrl} ${repoPath}`, (error) => {
    if (error) return res.status(500).json({ error: "Failed to clone repository" });
    res.json({ message: "Repository cloned successfully!" });
  });
});

router.get("/files", (req, res) => {
  const { repoName } = req.query;
  const repoPath = path.join(__dirname, "cloned_repos", repoName);

  if (!fs.existsSync(repoPath)) return res.status(404).json({ error: "Repository not found" });

  const files = fs.readdirSync(repoPath).filter(file => fs.statSync(path.join(repoPath, file)).isFile());
  res.json({ files });
});

export default router;
