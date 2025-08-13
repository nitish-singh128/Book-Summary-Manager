// Book Summary Manager - JavaScript functionality

class BookManager {
    constructor() {
        this.books = this.loadBooks();
        this.init();
    }

    init() {
        this.bindEvents();
        this.displayBooks();
        this.updateEmptyState();
    }

    bindEvents() {
        // Form submission
        document.getElementById('bookForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addBook();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', () => {
            this.filterBooks();
        });

        // Genre filter
        document.getElementById('genreFilter').addEventListener('change', () => {
            this.filterBooks();
        });

        // Sort filter
        document.getElementById('sortBy').addEventListener('change', () => {
            this.filterBooks();
        });
    }

    addBook() {
        const title = document.getElementById('bookTitle').value.trim();
        const author = document.getElementById('bookAuthor').value.trim();
        const genre = document.getElementById('bookGenre').value;
        const rating = document.getElementById('bookRating').value;
        const summary = document.getElementById('bookSummary').value.trim();
        const dateRead = document.getElementById('bookDate').value;

        if (!title || !author || !genre || !rating || !summary || !dateRead) {
            alert('Please fill in all fields!');
            return;
        }

        const book = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            title,
            author,
            genre,
            rating: parseInt(rating),
            summary,
            dateRead: dateRead,
            dateAdded: new Date().toISOString(),
            addedBy: this.getCurrentUser()
        };

        this.books.unshift(book); // Add to beginning of array
        this.saveBooks();
        this.displayBooks();
        this.updateEmptyState();
        this.clearForm();
        
        // Show success message
        this.showNotification('Book added successfully! 📚');
    }

    deleteBook(bookId) {
        if (confirm('Are you sure you want to delete this book summary?')) {
            this.books = this.books.filter(book => book.id !== bookId);
            this.saveBooks();
            this.displayBooks();
            this.updateEmptyState();
            this.showNotification('Book deleted successfully! 🗑️');
        }
    }

    displayBooks(booksToShow = this.books) {
        const booksContainer = document.getElementById('booksContainer') || document.getElementById('booksList');
        
        if (!booksContainer) {
            console.error('Books container not found');
            return;
        }
        
        if (booksToShow.length === 0) {
            booksContainer.innerHTML = '';
            return;
        }

        booksContainer.innerHTML = booksToShow.map(book => `
            <div class="book-card" data-book-id="${book.id}">
                <div class="book-header">
                    <div class="book-info">
                        <div class="book-title">${this.escapeHtml(book.title)}</div>
                        <div class="book-author">by ${this.escapeHtml(book.author)}</div>
                    </div>
                </div>
                <div class="book-meta">
                    <span class="book-genre">${book.genre}</span>
                    <span class="book-rating">${'⭐'.repeat(book.rating)} (${book.rating}/5)</span>
                    ${book.dateRead ? `<span class="book-date">📅 Read: ${new Date(book.dateRead).toLocaleDateString()}</span>` : ''}
                </div>
                <div class="book-summary" id="summary-${book.id}">
                    <strong>📝 Summary:</strong><br>
                    ${this.escapeHtml(book.summary)}
                </div>
                <div class="book-metadata">
                    <small>Added by: <strong>${book.addedBy || 'Unknown'}</strong> on ${new Date(book.dateAdded).toLocaleDateString()}</small>
                </div>
                <div class="book-actions">
                    <button class="read-more" onclick="bookManager.toggleSummary('${book.id}')">
                        Read ${this.isLongSummary(book.summary) ? 'more' : 'less'}
                    </button>
                    <button class="delete-btn" onclick="bookManager.deleteBook('${book.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    toggleSummary(bookId) {
        const summaryElement = document.getElementById(`summary-${bookId}`);
        const button = summaryElement.parentElement.querySelector('.read-more');
        
        if (summaryElement.classList.contains('expanded')) {
            summaryElement.classList.remove('expanded');
            button.textContent = 'Read more';
        } else {
            summaryElement.classList.add('expanded');
            button.textContent = 'Read less';
        }
    }

    isLongSummary(summary) {
        return summary.length > 200;
    }

    filterBooks() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const selectedGenre = document.getElementById('genreFilter').value;

        let filteredBooks = this.books.filter(book => {
            const matchesSearch = 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.genre.toLowerCase().includes(searchTerm) ||
                book.summary.toLowerCase().includes(searchTerm);

            const matchesGenre = !selectedGenre || book.genre === selectedGenre;

            return matchesSearch && matchesGenre;
        });

        // Apply sorting
        const sortBy = document.getElementById('sortBy').value;
        filteredBooks.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                case 'date-asc':
                    return new Date(a.dateAdded) - new Date(b.dateAdded);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'rating-desc':
                    return b.rating - a.rating;
                case 'rating-asc':
                    return a.rating - b.rating;
                default:
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
            }
        });

        this.displayBooks(filteredBooks);
        
        // Update empty state for filtered results
        const booksList = document.getElementById('booksList');
        const emptyState = document.getElementById('emptyState');
        
        if (filteredBooks.length === 0 && this.books.length > 0) {
            emptyState.style.display = 'block';
            emptyState.innerHTML = '<p>🔍 No books match your search criteria.</p>';
        } else {
            this.updateEmptyState();
        }
    }

    updateEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const searchInput = document.getElementById('searchInput');
        const genreFilter = document.getElementById('genreFilter');
        
        if (this.books.length === 0) {
            emptyState.style.display = 'block';
            emptyState.innerHTML = '<p>📖 No book summaries yet. Add your first book above!</p>';
        } else if (searchInput.value === '' && genreFilter.value === '') {
            emptyState.style.display = 'none';
        }
    }

    clearForm() {
        document.getElementById('bookForm').reset();
        // Reset star rating display
        document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('active');
        });
        document.getElementById('bookRating').value = '0';
    }

    getCurrentUser() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            return user.username || 'Unknown';
        }
        return 'Guest';
    }

    saveBooks() {
        localStorage.setItem('books', JSON.stringify(this.books));
        // Also save to the old key for compatibility
        localStorage.setItem('bookSummaries', JSON.stringify(this.books));
    }

    loadBooks() {
        const stored = localStorage.getItem('books') || localStorage.getItem('bookSummaries');
        return stored ? JSON.parse(stored) : [];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            z-index: 1000;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Export data functionality
    exportData() {
        const dataStr = JSON.stringify(this.books, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'book-summaries.json';
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully! 📥');
    }

    // Import data functionality
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedBooks = JSON.parse(e.target.result);
                if (Array.isArray(importedBooks)) {
                    this.books = importedBooks;
                    this.saveBooks();
                    this.displayBooks();
                    this.updateEmptyState();
                    this.showNotification('Data imported successfully! 📤');
                } else {
                    alert('Invalid file format!');
                }
            } catch (error) {
                alert('Error reading file!');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the main index page (no auth required)
    const isMainPage = window.location.pathname.endsWith('index.html') || 
                      window.location.pathname === '/' || 
                      window.location.pathname === '';
    
    if (isMainPage) {
        console.log('📖 Main page detected - initializing without authentication');
        window.bookManager = new BookManager();
        
        // Add some sample data if no books exist for demo
        if (bookManager.books.length === 0) {
                const sampleBooks = [
                    {
                        id: 'sample1',
                        title: 'The 7 Habits of Highly Effective People',
                        author: 'Stephen R. Covey',
                        genre: 'Self-Help',
                        rating: 5,
                        summary: 'This influential book presents a principle-centered approach to solving personal and professional problems. Covey outlines seven habits that can transform how we interact with others and view ourselves. The habits focus on moving from dependence to independence to interdependence, emphasizing proactive behavior, beginning with the end in mind, and putting first things first.',
                        dateAdded: new Date().toISOString()
                    },
                    {
                        id: 'sample2',
                        title: 'Atomic Habits',
                        author: 'James Clear',
                        genre: 'Self-Help',
                        rating: 5,
                        summary: 'Clear provides a comprehensive guide to building good habits and breaking bad ones. The book emphasizes that small changes can make a big difference over time. Key concepts include the four laws of behavior change, habit stacking, and the importance of identity-based habits. Clear shows how tiny improvements compound into remarkable results.',
                        dateAdded: new Date().toISOString()
                    }
                ];
                
                bookManager.books = sampleBooks;
                bookManager.saveBooks();
                bookManager.displayBooks();
                bookManager.updateEmptyState();
            }
        return;
    }
    
    // For other pages, wait for auth manager to be initialized
    setTimeout(() => {
        if (window.authManager && window.authManager.isAuthenticated()) {
            window.bookManager = new BookManager();
            
            // Update user display info
            updateUserDisplay();
            
            // Add some sample data if no books exist
            if (bookManager.books.length === 0) {
                const sampleBooks = [
                    {
                        id: 'sample1',
                        title: 'The 7 Habits of Highly Effective People',
                        author: 'Stephen R. Covey',
                        genre: 'Self-Help',
                        rating: 5,
                        summary: 'This influential book presents a principle-centered approach to solving personal and professional problems. Covey outlines seven habits that can transform how we interact with others and view ourselves. The habits focus on moving from dependence to independence to interdependence, emphasizing proactive behavior, beginning with the end in mind, and putting first things first.',
                        dateAdded: new Date().toISOString()
                    },
                    {
                        id: 'sample2',
                        title: 'Atomic Habits',
                        author: 'James Clear',
                        genre: 'Self-Help',
                        rating: 5,
                        summary: 'Clear provides a comprehensive guide to building good habits and breaking bad ones. The book emphasizes that small changes can make a big difference over time. Key concepts include the four laws of behavior change, habit stacking, and the importance of identity-based habits. Clear shows how tiny improvements compound into remarkable results.',
                        dateAdded: new Date().toISOString()
                    }
                ];
                
                bookManager.books = sampleBooks;
                bookManager.saveBooks();
                bookManager.displayBooks();
                bookManager.updateEmptyState();
            }
        }
    }, 100);
});

// Update user display information
function updateUserDisplay() {
    if (window.authManager) {
        const userDisplayName = document.getElementById('userDisplayName');
        const loginTime = document.getElementById('loginTime');
        
        if (userDisplayName) {
            userDisplayName.textContent = authManager.getUserDisplayName();
        }
        
        if (loginTime) {
            const loginTimeStr = authManager.getLoginTime();
            loginTime.textContent = loginTimeStr ? `Logged in: ${loginTimeStr}` : '';
        }
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        document.getElementById('searchInput').value = '';
        document.getElementById('genreFilter').value = '';
        if (window.bookManager) {
            bookManager.filterBooks();
        }
    }
}); 