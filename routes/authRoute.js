const express = require("express");
const routerAuth = express.Router();
const authController = require("../controllers/authController");

routerAuth.post("/auth/register", authController.register);
routerAuth.post("/auth/login", authController.login);

module.exports = routerAuth;