const express = require('express');
const router = express.Router();
let books = require('../data/books');
const { validateId, validateNewBook } = require('../middleware/bookValidator');

router.post('/', validateNewBook, (req, res) => {
    const { id, title, author, category, quantity } = req.body;
    const newBook = { id: Number(id), title: title.trim(), author: author.trim(), category: category.trim(), quantity: Number(quantity), available: Number(quantity) };
    books.push(newBook);
    res.status(201).json({ message: "Book added.", book: newBook });
});

router.get('/', (req, res) => res.json({ total: books.length, books }));

router.get('/search', (req, res) => {
    const { title } = req.query;
    if (!title) return res.status(400).json({ message: "Query 'title' is required." });
    const results = books.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));
    res.json({ total: results.length, books: results });
});

router.get('/:id', validateId, (req, res) => {
    const book = books.find(b => b.id === req.bookId);
    if (!book) return res.status(404).json({ message: "Book not found." });
    res.json(book);
});

router.put('/:id', validateId, (req, res) => {
    const book = books.find(b => b.id === req.bookId);
    if (!book) return res.status(404).json({ message: "Book not found." });

    const { title, author, category, quantity, available } = req.body;
    if (title) book.title = title.trim();
    if (author) book.author = author.trim();
    if (category) book.category = category.trim();
    if (quantity !== undefined) book.quantity = Number(quantity);
    if (available !== undefined) book.available = Number(available);

    res.json({ message: "Book updated.", book });
});

router.delete('/:id', validateId, (req, res) => {
    const idx = books.findIndex(b => b.id === req.bookId);
    if (idx === -1) return res.status(404).json({ message: "Book not found." });

    if (books[idx].available < books[idx].quantity) {
        return res.status(400).json({ message: "Cannot delete: copies are currently issued." });
    }

    const [deleted] = books.splice(idx, 1);
    res.json({ message: "Book deleted.", book: deleted });
});

router.post('/issue/:id', validateId, (req, res) => {
    const book = books.find(b => b.id === req.bookId);
    if (!book) return res.status(404).json({ message: "Book not found." });
    if (book.available <= 0) return res.status(400).json({ message: "No copies available." });

    book.available--;
    res.json({ message: "Book issued.", available: book.available });
});

router.post('/return/:id', validateId, (req, res) => {
    const book = books.find(b => b.id === req.bookId);
    if (!book) return res.status(404).json({ message: "Book not found." });
    if (book.available >= book.quantity) return res.status(400).json({ message: "All copies already returned." });

    book.available++;
    res.json({ message: "Book returned.", available: book.available });
});

module.exports = router;