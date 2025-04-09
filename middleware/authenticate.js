const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json("🔒 Unauthorized. Please log in.");
    }
    next();
  };
  
module.exports = {
    isAuthenticated
}