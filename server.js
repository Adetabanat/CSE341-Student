const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 8080;

const routes = require('./routes/index'); // Import the routes

// Middleware to parse JSON
// Middleware
app.use(bodyParser.json()); // Parses JSON body

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});


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
      console.log(err);
  } else {
      app.listen(port, () => {
          console.log(`Connected to DB and listening on port ${port}`);
      });
  }
});
