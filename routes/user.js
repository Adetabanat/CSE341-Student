const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/user');

// Register route
router.post('/register', userController.register);

// Login route (with GitHub OAuth)
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback route
router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), userController.githubCallback);

// Logout route
router.get('/logout', userController.logout);

// Dashboard route (requires authentication)
router.get('/dashboard', userController.dashboard);

module.exports = router;
