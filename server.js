require("dotenv").config(); // Load environment variables
const express = require("express");
const app = express();
const mongodb = require("./data/database"); // ✅ Fixed import
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");

// Middleware
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Z-Key", "Authorization"]
}));

// Routes
app.use("/", require("./routes/index"));

passport.use(new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Test Route
app.get("/", (req, res) => {
    res.send(req.session.user ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
});

// GitHub OAuth Callback
app.get("/github/callback", passport.authenticate("github", {
    failureRedirect: "/api-docs", session: false
}), (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
});

// Start Server
const port = process.env.PORT || 8080;

process.on("uncaughtException", (err) => {
    console.error("Caught exception:", err);
});

// ✅ FIX: Corrected function call from `mongdb.initdb()` to `mongodb.initDb()`
mongodb.initDb((err) => {
    if (err) {
        console.error("Database initialization failed:", err);
    } else {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
});
