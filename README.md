# 📚 Book Summary Manager with Excel Database & OTP Authentication

A secure, full-stack web application to manage and organize your book summaries with Node.js backend, Excel database, and OTP verification.

## 🏗️ **Architecture**

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Backend:** Node.js with Express.js
- **Database:** Excel (.xlsx) files using ExcelJS
- **Authentication:** JWT tokens with OTP verification
- **Storage:** File-based Excel database

## 🔐 **Authentication Features**

✅ **User Registration** - Multi-step registration with email verification  
✅ **OTP Verification** - 6-digit OTP sent to email (console demo)  
✅ **JWT Authentication** - Secure token-based authentication  
✅ **Session Management** - Persistent login with token refresh  
✅ **Rate Limiting** - Protection against brute force attacks  
✅ **Password Hashing** - Bcrypt password encryption  
✅ **Dual Access Modes** - Admin and User with different permissions

## 📊 **Database Features**

✅ **Excel Database** - User data stored in structured Excel files  
✅ **Multi-sheet Structure** - Users, Sessions, and OTP sheets  
✅ **Real-time Updates** - Live Excel file modifications  
✅ **Data Validation** - Input validation and sanitization  
✅ **Automatic Cleanup** - Expired sessions and OTPs removal  

## 📖 **Book Management Features**

✅ **Add Book Summaries** - Store title, author, genre, rating, and detailed summaries  
✅ **Search & Filter** - Find books by title, author, genre, or content  
✅ **Responsive Design** - Works on desktop, tablet, and mobile devices  
✅ **Local Storage** - Book data persists in browser storage  
✅ **Modern UI** - Clean, intuitive interface with smooth animations  

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 14+ installed
- Modern web browser

### **Backend Setup**

#### **Easy Method (Windows)**
1. Double-click `start-backend.bat` in the project root
2. The script will automatically install dependencies and start the server

#### **Manual Method**
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

4. Server will start on `http://localhost:3000`

### **Frontend Access**
1. Open `index.html` in your web browser
2. **Existing User:** Login with `User` / `user`
3. **New User:** Click "Sign Up" to register with OTP verification

## 📁 **Project Structure**

```
├── backend/
│   ├── server.js               # Main server file
│   ├── package.json            # Backend dependencies
│   ├── config/
│   │   └── excelDatabase.js    # Excel database operations
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── routes/
│   │   └── auth.js             # Authentication API routes
│   └── database/
│       └── users.xlsx          # Excel database (auto-created)
├── frontend/
│   ├── index.html              # Entry point (redirects to login)
│   ├── login.html              # Login page
│   ├── register.html           # Registration with OTP
│   ├── dashboard.html          # Main application
│   └── assets/
│       ├── css/
│       │   ├── auth.css        # Authentication styles
│       │   └── styles.css      # Main application styles
│       └── js/
│           ├── auth.js         # Login authentication
│           ├── register.js     # Registration with OTP
│           └── app.js          # Book management
└── README.md                   # This file
```

## 🔑 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - Start registration with OTP
- `POST /api/auth/verify-otp` - Verify OTP and complete registration
- `POST /api/auth/resend-otp` - Resend OTP code
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/refresh` - Refresh JWT token

### **System**
- `GET /health` - Server health check
- `GET /api` - API documentation

## 📧 **OTP System**

### **Registration Flow**
1. **Step 1:** Fill registration form
2. **Step 2:** Receive 6-digit OTP (saved to `%temp%` folder)
3. **Step 3:** Verify OTP to complete registration
4. **Step 4:** Automatic login with JWT token

### **Finding Your OTP**
- **Quick Access:** Press `Windows Key + R`, type `%temp%`, look for `otp_*.txt` files
- **File Path:** `C:\Users\[Username]\AppData\Local\Temp\otp_[email]_[timestamp].txt`
- **Content:** File contains your 6-digit code with expiration time
- **Backup:** OTP also displayed in backend server console

### **OTP Features**
- **6-digit codes** generated randomly
- **10-minute expiration** for security
- **Rate limiting** - 3 attempts per minute
- **Resend functionality** with 60-second cooldown
- **Temp folder storage** - OTP codes saved to Windows `%temp%` directory
- **Console backup** - Also displayed in server console

## 💾 **Excel Database Structure**

### **Users Sheet**
| Column | Description |
|--------|-------------|
| ID | Unique user identifier |
| Username | User login name |
| Email | User email address |
| PasswordHash | Encrypted password |
| FullName | User's full name |
| Role | User role (user/admin) |
| IsActive | Account status |
| IsVerified | Email verification status |
| Profile Data | Preferences and settings |

### **Sessions Sheet**
| Column | Description |
|--------|-------------|
| ID | Session identifier |
| UserID | Associated user |
| Token | JWT token |
| CreatedAt | Session start time |
| ExpiresAt | Token expiration |
| IsActive | Session status |

### **OTP Sheet**
| Column | Description |
|--------|-------------|
| ID | OTP identifier |
| Email | Target email |
| OTP | 6-digit code |
| Purpose | registration/login |
| ExpiresAt | Code expiration |
| IsUsed | Usage status |

## ⌨️ **Keyboard Shortcuts**

### **Registration Page**
- `Enter` - Submit current form step
- `Tab` - Navigate between fields

### **Dashboard**
- `Ctrl/Cmd + K` - Focus search bar
- `Escape` - Clear search and filters

## 🛡️ **Security Features**

### **Backend Security**
- **Helmet.js** - HTTP security headers
- **CORS protection** - Cross-origin request control
- **Rate limiting** - Request throttling
- **Input validation** - Data sanitization
- **JWT tokens** - Stateless authentication
- **Password hashing** - Bcrypt encryption

### **Frontend Security**
- **XSS protection** - Input escaping
- **CSRF prevention** - Token validation
- **Secure storage** - Proper token handling

## 🌐 **Browser Compatibility**

Works in all modern browsers:
- Chrome 70+
- Firefox 60+  
- Safari 12+
- Edge 79+

## 📊 **Development**

### **Backend Development**
```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### **Environment Variables**
Create `.env` file in backend directory:
```env
JWT_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

### **Production Deployment**
```bash
cd backend
npm start
# Serves frontend files in production mode
```

## 🔧 **Customization**

### **Email Integration**
Replace the console OTP display in `backend/routes/auth.js`:
```javascript
// Replace sendOTPEmail function with real email service:
// - Nodemailer + SMTP
// - SendGrid
// - AWS SES
// - Mailgun
```

### **Database Migration**
To switch to a real database:
1. Replace `excelDatabase.js` with your database adapter
2. Update authentication middleware
3. Maintain the same API interface

## 📈 **Features Roadmap**

- [ ] **Real Email Service** - SMTP/SendGrid integration
- [ ] **Password Reset** - Forgot password functionality  
- [ ] **Admin Panel** - User management interface
- [ ] **Book Sharing** - Share summaries between users
- [ ] **Export Options** - PDF/Word export functionality
- [ ] **Advanced Search** - Full-text search capabilities
- [ ] **Mobile App** - React Native companion
- [ ] **Real Database** - PostgreSQL/MySQL migration

## 🐛 **Troubleshooting**

### **Backend Issues**
- **Port already in use:** Change PORT in `.env` file
- **Excel file errors:** Delete `users.xlsx` to regenerate
- **Dependencies:** Run `npm install` in backend directory
- **Easy startup:** Use `start-backend.bat` for automatic setup

### **Frontend Issues**
- **CORS errors:** Ensure backend is running on port 3000
- **Token issues:** Clear browser localStorage/sessionStorage
- **Registration fails:** Check Windows `%temp%` folder for OTP files
- **Network errors:** Start backend server first (see `OTP_GUIDE.md`)

## 🎨 **UI Features**

- **Glass-morphism Design** - Modern translucent elements
- **Multi-step Forms** - Progressive registration flow
- **Loading States** - Visual feedback for all actions
- **Responsive Layout** - Mobile-first design approach
- **Real-time Validation** - Instant form feedback
- **Smooth Animations** - Enhanced user experience

---

**Made with ❤️ for secure book management**

### 🔑 **Quick Start Credentials**
- **Admin Mode:** `Admin/Admin` (Full access - user management, system settings, data export)
- **User Mode:** `User/User` (Limited access - personal books only)
- **New Registration:** Any email + password (OTP verification required)

*Full-stack application with Excel database and OTP authentication* 