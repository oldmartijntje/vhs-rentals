const express = require('express');
const loginRouter = express.Router();
const { loginRequest } = require('../controllers/login.controller')


loginRouter.post("/", loginRequest);


module.exports = loginRouter;