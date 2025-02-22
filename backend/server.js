import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import githubRoutes from "./routes/githubRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/github", githubRoutes);

// GitHub OAuth Strategy
passport.use(new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken;  // Store the access token
      return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, { id: user.id, username: user.username, accessToken: user.accessToken });
});
  
  passport.deserializeUser((obj, done) => {
    done(null, obj);
});
  
// GitHub Auth Routes
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

app.get("/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => res.redirect(`${process.env.FRONTEND_URL}?success=true`)
);

app.get("/auth/user", (req, res) => {
  res.json(req.user || null);
});

app.get("/auth/logout", (req, res) => {
  req.logout(() => res.send("Logged out"));
});

// Start Server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
