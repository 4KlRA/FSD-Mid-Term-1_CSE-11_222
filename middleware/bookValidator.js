const books = require('../data/books');

const validateId = (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID must be a number." });
    req.bookId = id;
    next();
};

const validateNewBook = (req, res, next) => {
    const { id, title, author, category, quantity } = req.body;
    if (id === undefined || !title || !author || !category || quantity === undefined) {
        return res.status(400).json({ message: "All fields are required." });
    }
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
        return res.status(400).json({ message: "Quantity must be a non-negative integer." });
    }
    if (books.some(b => b.id === Number(id))) {
        return res.status(409).json({ message: `Book ID ${id} already exists.` });
    }
    next();
};

module.exports = { validateId, validateNewBook };