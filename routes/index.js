const express = require('express');
const passport = require('passport');

const router = express.Router();

// Import other route files
router.use('/students', require('./students'));
router.use('/teachers', require('./teachers'));
router.use('/', require('./swagger'));

// Home route
router.get('/', (req, res) => {
  res.send('Welcome to my API');
});

// GitHub Login Route
router.get('/login', passport.authenticate('github', { scope: ['user'] }));

// GitHub OAuth Callback Route
router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile'); // Redirect after successful login
  }
);

// Profile Route (Requires Authentication)
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.json({ message: 'Welcome to your profile', user: req.user });
});

// Logout Route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    
    req.session.destroy((err) => {
      if (err) return next(err);
      res.redirect('/');
    });
  });
});

// Middleware to check authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized. Please log in.' });
}

module.exports = router;
