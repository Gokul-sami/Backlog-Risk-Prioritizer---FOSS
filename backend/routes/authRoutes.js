import express from 'express';
import passport from 'passport';

const router = express.Router();

// GitHub Auth Route
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub Auth Callback
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect('http://localhost:5173/dashboard'); // Adjust if necessary
});

// Logout Route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.redirect('/');
  });
});

export default router;
