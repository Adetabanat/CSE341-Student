const express = require("express");
const router = express.Router();
const passport = require("passport");

const helloWorld = require("../controllers/helloWorld");

// Swagger docs route
router.use("/", require("./swagger"));

// Your custom routes
router.use("/tasks", require("./tasks"));
router.use("/users", require("./users"));

// GitHub OAuth login
router.get("/login", passport.authenticate("github", { scope: ["user:email"] }));


router.get("/logout", (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.redirect("/");
        });
    });
});

// Optional: home or health check
router.get("/", (req, res) => {
    res.send(req.isAuthenticated() 
        ? `Logged in as ${req.user.displayName || req.user.username}` 
        : "Welcome to the API. Please log in ");
});

module.exports = router;
