const express = require("express");
const router = express.Router();
const passport = require("passport");

// Controllers
const helloWorld = require("../controllers/helloWorld");

// Swagger docs route
router.use("/", require("./swagger"));

// Custom API routes
router.use("/tasks", require("./tasks"));
router.use("/users", require("./users"));

// GitHub OAuth login
router.get("/login", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub OAuth callback (MISSING BEFORE — now added)
router.get("/github/callback",
    passport.authenticate("github", { failureRedirect: "/api-docs" }),
    (req, res) => {
        req.session.user = req.user; // Save the user in the session
        res.redirect("/profile"); // Redirect after successful login
    }
);

// Logout
router.get("/logout", (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.redirect("/");
        });
    });
});

// Home route
router.get("/", (req, res) => {
    res.send(req.isAuthenticated() 
        ? `Logged in as ${req.user.displayName || req.user.username}` 
        : "Welcome to the API. Please log in");
});

module.exports = router;
