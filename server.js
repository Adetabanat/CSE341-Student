require("dotenv").config();
const express = require("express");
const app = express();
const mongdb = require("./data/database");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");
const { isAuthenticated } = require("./middleware/authenticate");

// Middleware
app.use(bodyParser.json());

app.use(session({
    secret: "3948109348213048",
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

// Passport GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Routes
app.use("/", require("./routes/index")); // Your other routes

// Auth routes
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

app.get("/github/callback",
    passport.authenticate("github", { failureRedirect: "/api-docs" }),
    (req, res) => {
        res.redirect("/profile");
    }
);

app.get("/logout", (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.send("Logged out successfully.");
        });
    });
});

app.get("/session", (req, res) => {
    res.json({
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        session: req.session
    });
});

app.get("/profile", isAuthenticated, (req, res) => {
    res.json({
        id: req.user.id,
        username: req.user.username,
        displayName: req.user.displayName,
        avatar: req.user.photos?.[0]?.value
    });
});

// Uncaught error handling
process.on("uncaughtException", (err, origin) => {
    console.error("Caught exception:", err);
    console.error("Exception origin:", origin);
});

// DB + Server start
const port = process.env.PORT || 3000;

mongdb.initdb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log("Database is listening at port " + port);
        });
    }
});
