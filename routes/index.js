const router = require('express').Router();

router.use('/', require('./swagger'));

router.get("/", (req, res) => {
    res.send("Welcome to my Students Records API");
});

router.use('/student', require('./students'));

module.exports = router;
