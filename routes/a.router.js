const express = require('express');
const router = express.Router();
const aController = require('../controllers/a.controller');

router.get('/a', aController.getA);
router.get('/b', aController.getB);

module.exports = router;
