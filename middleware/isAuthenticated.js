// middleware/isAuthenticated.js
const isAuthenticated = (req, res, next) => {
  if (req.session.user== undefined) {
    return res.status(401).json({ message: 'Unauthorized Please Login' });
  }
  next();
};

module.exports = { isAuthenticated }
  