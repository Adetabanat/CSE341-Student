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
    res.send('Welcome to my SMA API');
});

// GitHub Login Route
router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth Callback Route (Ensuring user is stored in session)
router.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/' }), 
    (req, res) => {
        console.log("GitHub Callback User:", req.user);
        req.session.user = req.user; // Store user in session
        res.redirect('/profile'); // Redirect to profile page after login
    }
);

// GitHub Logout Route (Fix session clearing)
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy((err) => {
            if (err) return next(err);
            res.clearCookie('connect.sid'); // Ensure session cookie is removed
            res.redirect('/');
        });
    });
});

module.exports = router;
