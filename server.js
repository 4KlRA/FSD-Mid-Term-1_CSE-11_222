const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Library Management System API is running");
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

let books = {
    "id" : 101,
    "title": "Java Programming",
    "author": "Herbert Schildt",
    "category": "Programming",
    "quantity": 5,
    "available": 5
}

app.post('/api/books', (req, res) => {
    const { id, title, author, category, quantity } = req.body;

    if (id === undefined || !title || !author || !category || quantity === undefined) {
        return res.status(400).json({
        message: "All fields are required: 'id', 'title', 'author', 'category', and 'quantity'."
        });
    }

    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 0 || !Number.isInteger(parsedQuantity)) {
        return res.status(400).json({
            message: "'quantity' must be a non-negative integer."
        });
    }

    const parsedId = Number(id);
    const isDuplicate = books.some(b => b.id === parsedId);
    if (isDuplicate) {
        return res.status(409).json({
        message: `A book with ID ${parsedId} already exists.`
        });
    }

    const newBook = {
        id: parsedId,
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        quantity: parsedQuantity,
        available: parsedQuantity
    };

    books.push(newBook);

    return res.status(201).json({
        message: "Book added successfully.",
        book: newBook
    });
})

app.get('/api/books', (req, res) => {
    return res.status(200).json({
        total: books.length,
        books: books
    });
});

app.put('/api/books/:id', (req, res) => {
    const bookId = Number(req.params.id);

    if (isNaN(bookId)) {
        return res.status(400).json({
        message: "Invalid ID parameter. ID must be a number."
        });
    }

    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({
        message: `Book with ID ${bookId} not found.`
        });
    }

    const { title, author, category, quantity, available } = req.body;

    if (quantity !== undefined) {
        const parsedQuantity = Number(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity < 0 || !Number.isInteger(parsedQuantity)) {
        return res.status(400).json({
            message: "'quantity' must be a non-negative integer."
        });
        }
    }

    if (available !== undefined) {
        const parsedAvailable = Number(available);
        if (isNaN(parsedAvailable) || parsedAvailable < 0 || !Number.isInteger(parsedAvailable)) {
        return res.status(400).json({
            message: "'available' must be a non-negative integer."
        });
        }
    }

    const currentBook = books[bookIndex];

    books[bookIndex] = {
        ...currentBook,
        title: typeof title === 'string' ? title.trim() : currentBook.title,
        author: typeof author === 'string' ? author.trim() : currentBook.author,
        category: typeof category === 'string' ? category.trim() : currentBook.category,
        quantity: quantity !== undefined ? Number(quantity) : currentBook.quantity,
        available: available !== undefined ? Number(available) : currentBook.available,
        id: currentBook.id // Enforce original ID cannot be overwritten
    };

    return res.status(200).json({
        message: `Book with ID ${bookId} updated successfully.`,
        book: books[bookIndex]
    });
});

app.delete('/api/books/:id', (req, res) => {
    const bookId = Number(req.params.id);

    if (isNaN(bookId)) {
        return res.status(400).json({
        message: "Invalid ID parameter. ID must be a number."
        });
    }

    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({
        message: `Book with ID ${bookId} not found.`
        });
    }

    const bookToDelete = books[bookIndex];

    if (bookToDelete.available < bookToDelete.quantity) {
        const issuedCount = bookToDelete.quantity - bookToDelete.available;
        return res.status(400).json({
        message: `Cannot delete book. ${issuedCount} copy/copies are currently issued.`
        });
    }

    const deletedBook = books.splice(bookIndex, 1)[0];

    return res.status(200).json({
        message: `Book with ID ${bookId} deleted successfully.`,
        book: deletedBook
    });
});

