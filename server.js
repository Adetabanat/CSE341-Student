const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const dotenv = require('dotenv');
const mongodb = require('./data/database'); // Ensure this file exports an initDb() function

dotenv.config(); // Load environment variables

const app = express();
const routes = require('./routes/index'); // Import the routes

const PORT = process.env.PORT || 8080; // Define the port

// Middleware to parse JSON
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL, // Ensure this matches GitHub settings
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, { profile, accessToken });
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Use Routes
app.use('/', routes);

// Connect to MongoDB and Start Server
mongodb.initDb((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    app.listen(PORT, () => {
      console.log(`✅ Connected to DB and listening on port ${PORT}`);
    });
  }
});
