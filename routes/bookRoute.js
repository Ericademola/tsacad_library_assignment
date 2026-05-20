const express = require('express');
const routerBook = express.Router();
const bookController = require('../controllers/bookController.js');
const { validateBook, validateBorrow } = require('../middleware/validate');

const { protect, adminOnly } = require('../middleware/auth');

routerBook.get('/books', protect, bookController.getBooks);
routerBook.get('/books/overdue', protect, bookController.getOverdueBooks);
routerBook.get('/books/:id', protect, bookController.getBookById);
routerBook.post('/books', protect, adminOnly, validateBook, bookController.createBook);
routerBook.put('/books/:id', protect, adminOnly, bookController.updateBook);
routerBook.delete('/books/:id', protect, adminOnly, bookController.deleteBook);
routerBook.post('/books/:id/borrow', protect, validateBorrow, bookController.borrowBook);
routerBook.post('/books/:id/return', protect, bookController.returnBook);

module.exports = routerBook;




