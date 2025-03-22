const router = require('express').Router();
const passport = require('passport'); // ✅ Import passport

router.use('/', require('./swagger'));
router.use('/students', require('./students'));
router.use('/teachers', require('./teachers'));

router.get("/login", passport.authenticate("github"), (req, res) => { });

router.get("/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
