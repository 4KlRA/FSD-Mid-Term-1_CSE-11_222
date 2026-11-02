Here is a comprehensive `README.md` file designed for your project repository and practical submission:

# Library Management System REST API

A lightweight RESTful API built with **Node.js** and **Express.js** to manage library books and handle inventory, search, and checkout operations.

---

## Features

- **Express Middleware**: Parses incoming JSON request payloads using `express.json()`.
- **CRUD Operations**: Create, read, update, and delete library book records.
- **Data Validation**: Ensures required fields exist, enforces numeric non-negative quantities, and prevents duplicate IDs.
- **Search Functionality**: Case-insensitive title search via query parameters.
- **Safe Deletion**: Restricts deletion of books that currently have issued copies.
- **Transaction Controls**: Prevents checkout when stock is 0 and restricts returns from exceeding total quantity.

---

## Book Schema

Each book entry adheres to the following structure:

```json
{
  "id": 101,
  "title": "Java Programming",
  "author": "Herbert Schildt",
  "category": "Programming",
  "quantity": 5,
  "available": 5
}

```

## Installation & Setup

1. **Clone the repository / navigate to project directory**:
```bash
cd FSD-Mid-Term-1_CSE-11_222

```


2. **Install dependencies**:
```bash
npm install express

```


3. **Start the application**:
```bash
npm start

```


*The server runs by default on `http://localhost:3000`.*

---

## API Endpoints

### 1. Books Management (CRUD)

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/books` | Add a new book (validates fields and checks duplicate IDs). |
| `GET` | `/api/books` | Retrieve a list of all library books. |
| `GET` | `/api/books/:id` | Retrieve details of a specific book by ID. |
| `PUT` | `/api/books/:id` | Update book details (ID cannot be modified). |
| `DELETE` | `/api/books/:id` | Delete a book (blocked if copies are currently issued). |

### 2. Search & Transactions

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/books/search?title=<keyword>` | Search books by title (case-insensitive). |
| `POST` | `/api/books/issue/:id` | Check out a copy (decreases `available` by 1). |
| `POST` | `/api/books/return/:id` | Return a copy (increases `available` by 1 up to `quantity`). |

---

## Sample Request & Response

### Add a Book (`POST /api/books`)

**Request Body:**

```json
{
  "id": 102,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "category": "Software Engineering",
  "quantity": 3
}

```

**Response (`201 Created`):**

```json
{
  "message": "Book added successfully.",
  "book": {
    "id": 102,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "category": "Software Engineering",
    "quantity": 3,
    "available": 3
  }
}

```

### Search Books (`GET /api/books/search?title=java`)

**Response (`200 OK`):**

```json
{
  "total": 1,
  "books": [
    {
      "id": 101,
      "title": "Java Programming",
      "author": "Herbert Schildt",
      "category": "Programming",
      "quantity": 5,
      "available": 5
    }
  ]
}

```