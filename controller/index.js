const router = require('express').Router();
const userRoutes = require('./log/userRoutes');

router.use('/', userRoutes);

module.exports = router;