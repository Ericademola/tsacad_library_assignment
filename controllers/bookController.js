const Book = require('../models/bookModel');
const Student = require('../models/studentModel');
const Attendant = require('../models/attendantModel');
const Author = require('../models/authorModel');

// Create
exports.createBook = async (req, res) => {
    try {
        const { title, isbn, authors } = req.body;
        if (!title || !isbn || !authors) {
            return res.status(400).json({ message: "Please provide all the required fields" });
        }

        const existingBook = await Book.findOne({ isbn });
        if (existingBook) {
            return res.status(400).json({ message: `A book with ISBN "${isbn}" already exists` });
        }

        const book = await Book.create(req.body);
        res.status(201).json({ message: "Book created successfully", data: book });
    } catch (error) {
        // Fallback catch for the unique index on the schema
        if (error.code === 11000) {
            return res.status(400).json({ message: "A book with this ISBN already exists" });
        }

        res.status(500).json({ message: error.message });
    }
};

// Get all
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({ message: "Books found successfully", data: books });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get one
exports.getBookById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'Please provide a valid product id' });
        }
        const book = await Book.findById(req.params.id)
            .populate("authors", "name")
            .populate("borrowedBy")   // Student details
            .populate("issuedBy");    // Attendant details

        if (!book) return res.status(404).json({ message: "Book not found" });

        res.status(200).json({ message: "Book found successfully", data: book });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update
exports.updateBook = async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Book updated successfully", data: book });
};

// Delete
exports.deleteBook = async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
};

// Borrow
exports.borrowBook = async (req, res) => {
    try {
        const { studentId, attendantId, returnDate } = req.body;
        if (!req.params.id) {
            return res.status(400).json({ message: 'Please provide a valid book id' });
        }

        if (attendantId === studentId) {
            return res.status(400).json({ message: 'Attendant cannot borrow the book' });
        }

        if (returnDate < new Date()) {
            return res.status(400).json({ message: 'Return date cannot be in the past' });
        }

        const book = await Book.findById(req.params.id);
        const student = await Student.findById(studentId);
        const attendant = await Attendant.findById(attendantId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.status !== 'IN') {
            return res.status(400).json({ message: 'Book is not available' });
        }

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (!attendant) {
            return res.status(404).json({ message: 'Attendant not found' });
        }

        if (book.borrowedBy === student._id) {
            return res.status(400).json({ message: 'Same student borrowed the book already' });
        }

        book.borrowedBy = student._id;
        book.status = 'OUT';
        book.issuedBy = attendant._id;
        book.returnDate = req.body.returnDate;
        await book.save();
        res.status(200).json({ message: "Book borrowed successfully", data: book });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Return
exports.returnBook = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'Please provide a valid book id' });
        }
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.status !== 'OUT') {
            return res.status(400).json({ message: 'Book is not borrowed' });
        }
        const student = await Student.findById(book.borrowedBy);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        book.borrowedBy = null;
        book.issuedBy = null;
        book.returnDate = null;
        book.status = 'IN';
        await book.save();
        res.status(200).json({ message: "Book returned successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Book.countDocuments();
        const books = await Book.find()
            .populate("authors", "name")
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            data: books,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// search based on author
exports.getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";

        // Find authors that match the search term first
        const matchingAuthors = await Author.find({
            name: { $regex: search, $options: "i" }
        }).select("_id");

        const authorIds = matchingAuthors.map((a) => a._id);

        // Build filter — match by title OR by author
        const filter = search
            ? {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { authors: { $in: authorIds } }
                ]
            }
            : {};

        const total = await Book.countDocuments(filter);
        const books = await Book.find(filter)
            .populate("authors", "name")
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            data: books,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getOverdueBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Book.countDocuments({ isOverdue: true });
        const books = await Book.find({ isOverdue: true })
            .populate("authors", "name")
            .populate("borrowedBy", "name email")
            .populate("issuedBy", "name")
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            data: books,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};