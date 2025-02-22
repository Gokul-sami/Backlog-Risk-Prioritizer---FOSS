import express from "express";
import axios from "axios";
import passport from "passport";

const router = express.Router();

// GitHub OAuth Authentication Route
router.get('/github', passport.authenticate('github', { scope: ['repo', 'read:user'] }));

// GitHub OAuth Callback
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect('http://localhost:5173/dashboard'); // Adjust if needed
});

// Fetch GitHub Repositories for the Authenticated User
router.get("/repos", async (req, res) => {
    console.log("Session Data:", req.session); // Check session storage
    console.log("User Data:", req.user);  // Check user object
  
    if (!req.isAuthenticated() || !req.user?.accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    try {
      const response = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${req.user.accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });
  
      res.json(response.data);
    } catch (error) {
      console.error("GitHub API Error:", error);
      res.status(500).json({ error: "Failed to fetch repositories" });
    }
});  

// Logout Route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.redirect('/');
  });
});

export default router;
