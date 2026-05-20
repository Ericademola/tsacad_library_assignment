const express = require('express');
const routerAuthor = express.Router();
const authorController = require('../controllers/authorController.js');
const { validateAuthor } = require('../middleware/validate');
const { protect, adminOnly } = require('../middleware/auth');

routerAuthor.post('/authors', protect, validateAuthor, authorController.createAuthor);
routerAuthor.get('/authors', protect, authorController.getAuthors);
routerAuthor.get('/authors/:id', protect, authorController.getAuthorById);
routerAuthor.put('/authors/:id', protect, authorController.updateAuthor);
routerAuthor.delete('/authors/:id', protect, authorController.deleteAuthor);

module.exports = routerAuthor;
