const router = require('express').Router();

router.use('/', require('./swagger'));

router.get("/", (req, res) => {
    res.send("Welcome to my SMS Records API");
});

router.use('/students', require('./students'));
router.use('/teachers', require('./teachers')); 

module.exports = router;
