const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('./data/database');

const app = express();
const port = process.env.PORT || 8080;


// Middleware
app
    .use(bodyParser.json()) // Parses JSON body
    .use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true, // Set to true for debugging session persistence
    }))
    .use(passport.initialize())
    .use(passport.session())
 
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for frontend
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH , OPTIONS');
        
        next();
    })
    .use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'PATCH'] })) 
    .use(cors({ origin: '*' })) // Adjust to your frontend URL
    .use("/", require("./routes/index.js")); // Fixed route usage

 // GitHub OAuth Strategy
    passport.use(new GitHubStrategy({
     clientID: process.env.GITHUB_CLIENT_ID,
     clientSecret: process.env.GITHUB_CLIENT_SECRET,
     callbackURL: process.env.CALLBACK_URL // Ensure this matches GitHub settings
    },
   function (accessToken, refreshToken, profile, done) {  
      return done(null, profile);
    }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user); // Store full user object
});

passport.deserializeUser((user, done) => {
    done(null, user); // Restore full user object
});

// Debugging: Check if session is storing user info
app.get('/', (req, res) => {res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged out")});

// GitHub OAuth Callback Route (Ensures session is set)
app.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/api-docs' }), 
    (req, res) => {
        req.session.user = req.user; // Save user in session
        res.redirect('/');
    }
);


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
