const express = require('express');
const routerAttendant = express.Router();
const attendantController = require('../controllers/attendantController.js');
const { validateAttendant } = require('../middleware/validate');

routerAttendant.post('/attendants', validateAttendant, attendantController.createAttendant);
routerAttendant.get('/attendants', attendantController.getAttendants);

module.exports = routerAttendant;

