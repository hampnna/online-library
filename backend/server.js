// server.js - Backend Server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/onlinelibrary', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB successfully');
});

// Book Schema
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  publishedYear: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  coverUrl: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Book = mongoose.model('Book', bookSchema);

// API Routes

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// Get a single book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
});

// Add a new book
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, genre, isbn, publishedYear, description, coverUrl } = req.body;

    // Validation
    if (!title || !author || !genre || !isbn || !publishedYear) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, author, genre, isbn, publishedYear' 
      });
    }

    const book = new Book({
      title,
      author,
      genre,
      isbn,
      publishedYear: parseInt(publishedYear),
      description: description || '',
      coverUrl: coverUrl || ''
    });

    const newBook = await book.save();
    console.log('✅ New book added:', newBook.title);
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error adding book:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Book with this ISBN already exists' });
    } else {
      res.status(400).json({ message: 'Error adding book', error: error.message });
    }
  }
});

// Update a book
app.put('/api/books/:id', async (req, res) => {
  try {
    const { title, author, genre, isbn, publishedYear, description, coverUrl } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        genre,
        isbn,
        publishedYear: parseInt(publishedYear),
        description: description || '',
        coverUrl: coverUrl || ''
      },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    console.log('✅ Book updated:', updatedBook.title);
    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Book with this ISBN already exists' });
    } else {
      res.status(400).json({ message: 'Error updating book', error: error.message });
    }
  }
});

// Delete a book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    console.log('✅ Book deleted:', deletedBook.title);
    res.json({ message: 'Book deleted successfully', book: deletedBook });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
});

// Search books
app.get('/api/books/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(books);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ message: 'Error searching books', error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Online Library API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from React build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 Online Library API available at http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});