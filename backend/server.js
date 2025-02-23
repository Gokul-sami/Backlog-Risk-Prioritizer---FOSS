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

      startProcess.stdout.on("data", (data) => console.log(`🟢 APP: ${data}`));
      startProcess.stderr.on("data", (data) => console.error(`🔴 APP ERROR: ${data}`));

      res.json({
        message: "App started successfully!",
        logs: stdout
      });
    });
  });
});

// Start Server
app.listen((process.env.PORT || 5000), () => console.log("Server running on http://localhost:5000"));
