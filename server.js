const express = require("express");
const app = express();
const mongodb = require("./data/database");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");
require("dotenv").config();

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] }));

app.use(session({
  secret: "0244734362", // You can move this to .env
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Passport GitHub Strategy
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

// Check login
app.get("/", (req, res) => {
  res.send(req.session.user
    ? `✅ Logged in as ${req.session.user.displayName}`
    : "❌ Logged Out"
  );
});

// GitHub Login & Callback
app.get("/login", passport.authenticate("github")); 

app.get("/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/api-docs" }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

// Logout
app.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

// Routes
app.use("/", require("./routes/index"));

// Error listener
process.on("uncaughtException", (err, origin) => {
  console.error(`Caught exception: ${err}\nException origin: ${origin}`);
});

// Start server
const port = process.env.PORT || 3000;
mongodb.initdb(err => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => console.log(`✅ Server running on port ${port}`));
  }
});
