const Attendant = require('../models/attendantModel');

// Create
exports.createAttendant = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Please provide all the required fields" });
        }
        const attendant = await Attendant.create(req.body);
        res.status(201).json(attendant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all
exports.getAttendants = async (req, res) => {
    try {
        const attendants = await Attendant.find();
        res.status(200).json(attendants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
