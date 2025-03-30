// middleware/isAuthenticated.js
module.exports.isAuthenticated = (req, res, next) => {
    console.log("User session:", req.session);
    console.log("User:", req.user);
    console.log("Authenticated:", req.isAuthenticated ? req.isAuthenticated() : false);
  
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized Please Login' });
  };
  