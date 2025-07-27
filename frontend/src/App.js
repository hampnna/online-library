// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

// Icons (you can replace these with actual icon library or SVGs)
const BookIcon = () => (
  <svg className="w-8 h-8 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecab="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    publishedYear: '',
    description: '',
    coverUrl: ''
  });

  // Fetch books from API
  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
        setFilteredBooks(data);
      } else {
        throw new Error('Failed to fetch books');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please make sure the server is running.');
    }
    setLoading(false);
  };

  // Add new book
  const addBook = async () => {
    if (!formData.title || !formData.author || !formData.genre || !formData.isbn || !formData.publishedYear) {
      alert('Please fill in all required fields (Title, Author, Genre, ISBN, Published Year)');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          publishedYear: parseInt(formData.publishedYear)
        }),
      });

      if (response.ok) {
        await fetchBooks();
        resetForm();
        setShowAddForm(false);
        alert('Book added successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book. Please check your connection.');
    }
  };

  // Update book
  const updateBook = async () => {
    if (!formData.title || !formData.author || !formData.genre || !formData.isbn || !formData.publishedYear) {
      alert('Please fill in all required fields (Title, Author, Genre, ISBN, Published Year)');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/books/${editingBook._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          publishedYear: parseInt(formData.publishedYear)
        }),
      });

      if (response.ok) {
        await fetchBooks();
        resetForm();
        setEditingBook(null);
        alert('Book updated successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update book');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book. Please check your connection.');
    }
  };

  // Delete book
  const deleteBook = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/books/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchBooks();
          alert('Book deleted successfully!');
        } else {
          alert('Failed to delete book');
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book. Please check your connection.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      genre: '',
      isbn: '',
      publishedYear: '',
      description: '',
      coverUrl: ''
    });
  };

  const startEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      publishedYear: book.publishedYear.toString(),
      description: book.description || '',
      coverUrl: book.coverUrl || ''
    });
  };

  const closeModal = () => {
    setShowAddForm(false);
    setEditingBook(null);
    resetForm();
  };

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, books]);

  // Load books when navigating to books page
  useEffect(() => {
    if (currentPage === 'books') {
      fetchBooks();
    }
  }, [currentPage]);

  if (currentPage === 'welcome') {
    return (
      <div className="welcome-container">
        <div className="welcome-card">
          <div className="welcome-content">
            <BookIcon />
            <h1>Welcome to</h1>
            <h2>Online Library</h2>
          </div>
          
          <p>Discover, manage, and explore your digital book collection</p>
          
          <button
            onClick={() => setCurrentPage('books')}
            className="continue-btn"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <BookIcon />
            <h1>Online Library</h1>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="add-btn"
          >
            <PlusIcon />
            Add Book
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search books by title, author, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading books...</p>
          </div>
        ) : (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book._id} className="book-card">
                <div className="book-header">
                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p className="author">by {book.author}</p>
                    <p className="genre">{book.genre}</p>
                  </div>
                  <div className="book-actions">
                    <button
                      onClick={() => startEdit(book)}
                      className="action-btn edit-btn"
                      title="Edit book"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => deleteBook(book._id, book.title)}
                      className="action-btn delete-btn"
                      title="Delete book"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
                
                <div className="book-details">
                  <p><strong>ISBN:</strong> {book.isbn}</p>
                  <p><strong>Year:</strong> {book.publishedYear}</p>
                  {book.description && (
                    <p className="description">{book.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredBooks.length === 0 && !loading && !error && (
          <div className="empty-state">
            <BookIcon />
            <p className="empty-title">No books found</p>
            <p className="empty-subtitle">
              {searchQuery ? 'Try adjusting your search terms' : 'Add your first book to get started'}
            </p>
          </div>
        )}
      </main>

      {/* Add/Edit Book Modal */}
      {(showAddForm || editingBook) && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
              <button onClick={closeModal} className="close-btn">
                <CloseIcon />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="form-input"
                  placeholder="Enter book title"
                />
              </div>

              <div className="form-group">
                <label>Author *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="form-input"
                  placeholder="Enter author name"
                />
              </div>

              <div className="form-group">
                <label>Genre *</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({...formData, genre: e.target.value})}
                  className="form-input"
                  placeholder="e.g., Fiction, Non-fiction, Mystery"
                />
              </div>

              <div className="form-group">
                <label>ISBN *</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                  className="form-input"
                  placeholder="Enter ISBN number"
                />
              </div>

              <div className="form-group">
                <label>Published Year *</label>
                <input
                  type="number"
                  value={formData.publishedYear}
                  onChange={(e) => setFormData({...formData, publishedYear: e.target.value})}
                  className="form-input"
                  placeholder="e.g., 2023"
                  min="1000"
                  max="2100"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="form-textarea"
                  placeholder="Enter book description (optional)"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Cover URL</label>
                <input
                  type="url"
                  value={formData.coverUrl}
                  onChange={(e) => setFormData({...formData, coverUrl: e.target.value})}
                  className="form-input"
                  placeholder="Enter cover image URL (optional)"
                />
              </div>

              <div className="modal-actions">
                <button
                  onClick={editingBook ? updateBook : addBook}
                  className="primary-btn"
                >
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
                <button
                  onClick={closeModal}
                  className="secondary-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;