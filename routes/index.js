const router = require('express').Router();

router.use('/', require('./swagger'));

router.get("/", (req, res) => {
    res.send("Welcome to my Students Records API");
});

router.use('/students', require('./students'));
router.use('/teachers', require('./teachers')); // ✅ Added teachers routes

module.exports = router;
