const express = require('express');
const routerStudent = express.Router();
const studentController = require('../controllers/studentController.js');
const { validateStudent } = require('../middleware/validate');

routerStudent.post('/students', validateStudent, studentController.createStudent);
routerStudent.get('/students', studentController.getStudents);
routerStudent.get('/students/:id', studentController.getStudentById);

module.exports = routerStudent;
