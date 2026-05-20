const validateBook = (req, res, next) => {
    const { title, isbn, authors } = req.body;
    const errors = [];

    if (!title || title.trim() === "") errors.push("Title is required");
    if (!isbn || isbn.trim() === "") errors.push("ISBN is required");
    if (!authors || !Array.isArray(authors) || authors.length === 0)
        errors.push("At least one author is required");

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
};

const validateAuthor = (req, res, next) => {
    const { name } = req.body;
    const errors = [];

    if (!name || name.trim() === "") errors.push("Name is required");

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
};

const validateStudent = (req, res, next) => {
    const { name, email } = req.body;
    const errors = [];

    if (!name || name.trim() === "") errors.push("Name is required");
    if (!email || email.trim() === "") errors.push("Email is required");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.push("Email is invalid");

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
};

const validateAttendant = (req, res, next) => {
    const { name } = req.body;
    const errors = [];

    if (!name || name.trim() === "") errors.push("Name is required");

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
};

const validateBorrow = (req, res, next) => {
    const { studentId, attendantId, returnDate } = req.body;
    const errors = [];

    if (!studentId) errors.push("Student ID is required");
    if (!attendantId) errors.push("Attendant ID is required");
    if (!returnDate) errors.push("Return date is required");
    if (returnDate && isNaN(Date.parse(returnDate)))
        errors.push("Return date is invalid");
    if (returnDate && new Date(returnDate) <= new Date())
        errors.push("Return date must be in the future");

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
};

module.exports = { validateBook, validateAuthor, validateStudent, validateAttendant, validateBorrow };
