require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("./data/database"); // Assuming you are using MongoDB, ensure the path is correct
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");
const { isAuthenticated } = require("./middleware/authenticate");

// Middleware for parsing JSON and setting up session
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || "0244724262", // Always keep this secure
    resave: false,
    saveUninitialized: false,
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: "*", // Allowing all origins for simplicity (you might want to restrict this in production)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Z-Key", "Authorization"]
}));

// Passport GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL || "http://localhost:3000/github/callback" // Use default if not in .env
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

// Serialize and Deserialize user to store/retrieve from session
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Routes
app.use("/", require("./routes/index")); // Your other routes (tasks, users, etc.)


// Logout Route
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.send("Logged out successfully.");
        });
    });
});

// Session Info (for debugging or checking current session status)
app.get("/session", (req, res) => {
    res.json({
        isAuthenticated: req.isAuthenticated(),
        user: req.user, // This will be populated after login via GitHub
        session: req.session
    });
});

// Protected Profile Route (only accessible if authenticated)
app.get("/profile", isAuthenticated, (req, res) => {
    res.json({
        id: req.user.id,
        username: req.user.username,
        displayName: req.user.displayName,
        avatar: req.user.photos?.[0]?.value // Optional: Display user's avatar if available
    });
});

// Uncaught exception handler
process.on("uncaughtException", (err, origin) => {
    console.error("Caught exception:", err);
    console.error("Exception origin:", origin);
});

// Database and Server Startup
const port = process.env.PORT || 3000;

mongoose.initdb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
});
