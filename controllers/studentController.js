const Student = require('../models/studentModel');

// Create
exports.createStudent = async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email || !name) {
            return res.status(400).json({ message: "Please provide all the required fields" });
        }
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get one
exports.getStudentById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'Please provide a valid product id' });
        }
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
