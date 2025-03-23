const isAuthenticated = (req, res, next) => {
    if (!req.session.user == undefined) {  // Correctly checking if user is not set
        return res.status(401).json({ message: 'You dont not have access: Please log in.' });
    }
    next();
};

module.exports = { isAuthenticated };

