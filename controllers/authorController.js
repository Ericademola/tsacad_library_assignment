const Author = require('../models/authorModel');

// Create
exports.createAuthor = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Please provide all the required fields" });
        }
        const author = await Author.create(req.body);
        res.status(201).json(author);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all
exports.getAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        res.status(200).json(authors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get one
exports.getAuthorById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'Please provide a valid product id' });
        }
        const author = await Author.findById(req.params.id);

        if (!author) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(author);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update
exports.updateAuthor = async (req, res) => {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(author);
};

// Delete
exports.deleteAuthor = async (req, res) => {
    await Author.findByIdAndDelete(req.params.id);
    res.json({ message: 'Author deleted' });
};
