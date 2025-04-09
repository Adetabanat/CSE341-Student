const router = require("express").Router();

router.use("/", require("./swagger"));

const passport = require("passport");
const helloWorld = require("../controllers/helloWorld")




router.use("/tasks", require("./tasks"));

router.use("/users", require("./users"));


router.get("/login", passport.authenticate("github"), (req,res) =>{});

router.get("/logout", function (req,res,next){
    req.logOut(function(err){
        if (err) {return next (err);}
        res.redirect("/");
    });
});

module.exports = router;