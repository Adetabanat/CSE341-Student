const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();

const app = express();

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
      callbackURL: process.env.CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, { profile, accessToken });
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Login Route (Redirects to GitHub authentication)
app.get('/login', (req, res) => {
  res.redirect('/auth/github');
});

// GitHub Auth Routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user'] }));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

// Profile Route (Requires Authentication)
app.get('/profile', ensureAuthenticated, (req, res) => {
  res.json({ message: 'Welcome to your profile', user: req.user });
});


// Protected route middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized. Please log in.' });
}

// Protected API routes for Students
app.get('/students', ensureAuthenticated, (req, res) => {
  res.json({ message: 'Authenticated access to student records', user: req.user });
});

app.post('/students', ensureAuthenticated, (req, res) => {
  res.json({ message: 'Student record created successfully' });
});

app.get('/students/:id', ensureAuthenticated, (req, res) => {
  res.json({ message: `Authenticated access to student with ID ${req.params.id}` });
});

app.put('/students/:id', ensureAuthenticated, (req, res) => {
  res.json({ message: `Updated student with ID ${req.params.id}` });
});

app.delete('/students/:id', ensureAuthenticated, (req, res) => {
  res.json({ message: `Deleted student with ID ${req.params.id}` });
});

// Protected API routes for Teachers
app.get('/teachers', ensureAuthenticated, (req, res) => {
  res.json({ message: 'Authenticated access to teacher records', user: req.user });
});

app.post('/teachers', ensureAuthenticated, (req, res) => {
  res.json({ message: 'Teacher record created successfully' });
});

app.get('/teachers/:id', ensureAuthenticated, (req, res) => {
  res.json({ message: `Authenticated access to teacher with ID ${req.params.id}` });
});

app.put('/teachers/:id', ensureAuthenticated, (req, res) => {
  res.json({ message: `Updated teacher with ID ${req.params.id}` });
});

app.delete('/teachers/:id', ensureAuthenticated, (req, res) => {
  res.json({ message: `Deleted teacher with ID ${req.params.id}` });
});

// Serve Swagger UI (No authentication required for docs)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
