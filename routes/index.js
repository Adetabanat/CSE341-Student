const router = require("express").Router();

router.use("/", require("./swagger"));

const passport = require("passport");
const helloWorld = require("../controllers/helloWorld")




router.use("/tasks", require("./tasks"));

router.use("/users", require("./users"));




module.exports = router;