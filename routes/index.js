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


// GitHub Logout Route (Fix session clearing)
router.get('/logout', function (req, res, next)  {
    req.logout(function (err) {
        if (err) return next(err);
    });
});

module.exports = router;
