const express = require('express');
const passport = require('passport');
const { isAuthenticated } = require('../middleware/isAuthenticated');

const router = express.Router();

// Import other route files
router.use('/students', isAuthenticated, require('./students')); // Protected Route
router.use('/teachers', isAuthenticated, require('./teachers')); // Protected Route
router.use('/', require('./swagger'));

// Home route
router.get('/', (req, res) => {
  res.send('Welcome to my API');
});

// GitHub Login Route
// GitHub Login Route
router.get('/login', passport.authenticate('github'), (req, res) => { });

// GitHub Logout Route (Fix session clearing)
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

// GitHub OAuth Callback Route (Avoid duplicate)
router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    req.session.user = req.user; // Store user in session
    res.redirect('/profile'); // Redirect after successful login
  }
);

module.exports = router;
