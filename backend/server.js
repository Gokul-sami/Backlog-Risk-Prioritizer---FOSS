import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import githubRoutes from "./routes/githubRoutes.js";
import Docker from "dockerode";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import axios from "axios";
import OpenAI from "openai";

dotenv.config();
const app = express();
const docker = new Docker();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/github", githubRoutes);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken;
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    username: user.username,
    accessToken: user.accessToken,
  });
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// GitHub Auth Routes
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => res.redirect(`${process.env.FRONTEND_URL}?success=true`)
);

app.get("/auth/user", (req, res) => {
  res.json(req.user || null);
});

app.get("/auth/logout", (req, res) => {
  req.logout(() => res.send("Logged out"));
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Store in .env file

async function getErrorSolution(errorMessage) {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [{ parts: [{ text: `Analyze this error and provide a fix:\n\n${errorMessage}` }] }],
      },
      {
        params: { key: GEMINI_API_KEY },
        headers: { "Content-Type": "application/json" },
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No solution found.";
    return `🛠 Suggested Fix: ${reply}`;
  } catch (error) {
    console.error("⚠ Gemini API Error:", error.message);
    return "Failed to get solution from Gemini.";
  }
}

// API to clone and install dependencies
app.post("/docker/run", (req, res) => {
  const { repoUrl, startCommand, envVariables } = req.body;
  if (!repoUrl || !startCommand) {
    return res.status(400).json({ error: "Repo URL and Start Command are required" });
  }

  const repoName = repoUrl.split("/").pop().replace(".git", "");
  const repoPath = path.join(process.cwd(), repoName);

  if (fs.existsSync(repoPath)) {
    fs.rmSync(repoPath, { recursive: true, force: true });
  }

  console.log("Cloning repository...");
  exec(`git clone ${repoUrl} ${repoPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Git Clone Error:", stderr);
      return res.status(500).json({ error: `Git clone failed: ${stderr}` });
    }

    console.log("✅ Git Clone Success:", stdout);

    console.log("Installing dependencies...");
    exec(`cd ${repoPath} && npm install`, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ NPM Install Error:", stderr);
        return res.status(500).json({ error: `NPM install failed: ${stderr}` });
      }

      console.log("✅ NPM Install Success:", stdout);

      console.log("Starting the application with user-defined variables...");
      const envCommand = envVariables.split("\n").map(line => `set ${line}`).join(" && ");
      const runCommand = `cd ${repoPath} && ${envCommand} && ${startCommand}`;

      const startProcess = exec(runCommand);

      // Handling process output and errors
      startProcess.stdout.on("data", async (data) => {
        console.log(`🟢 APP: ${data}`);
      });

      startProcess.stderr.on("data", async (data) => {
        console.error(`🔴 APP ERROR: ${data}`);
      
      try {
          const solution = await getErrorSolution(data);
          console.log("🛠 Suggested Fix:", solution);
        } catch (err) {
          console.error("⚠ Failed to fetch solution:", err.message);
        }
      });      

      res.json({
        message: "App started successfully!",
        logs: stdout
      });
    });
  });
});

// Start Server
app.listen((process.env.PORT || 5000), () => console.log("Server running on http://localhost:5000"));
