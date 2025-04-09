const isAuthenticated = (req, res, next) =>{
    if(req.session.user === undefined){
        return res.status(401).json("🔒 Unauthorized. Please log in.");
    }
    next();
};

module.exports = {
    isAuthenticated
}