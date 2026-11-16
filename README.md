# Finora – Personal Finance Dashboard

Finora is a full-stack personal finance management application designed to help users manage their finances efficiently. It provides an interactive dashboard to track income, expenses, monthly budgets, and financial goals.

## ✨ Features

- User Registration and Login
- JWT Authentication
- Add, Edit and Delete Transactions
- Search, Filter and Sort Transactions
- Dashboard Financial Summary
- Expense Analytics with Charts
- Monthly Income vs Expense Comparison
- Monthly Budget Tracker
- Financial Goals Tracker
- CSV Export
- PDF Expense Reports
- Light and Dark Themes
- Responsive Design

## 🛠️ Tech Stack

**Frontend**
- HTML
- Tailwind CSS
- JavaScript
- Chart.js

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## 📁 Project Structure

```text
Finora-Personal-Finance-Dashboard/
│
├── BACKEND/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
├── FRONTEND/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── auth.js
│   ├── script.js
│   ├── style.css
│   └── output.css
│
├── .gitignore
└── README.md
```

## 🚀 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shikha2007-del/Finora-Personal-Finance-Dashboard.git
cd Finora-Personal-Finance-Dashboard
```

### 2. Install Backend Dependencies

```bash
cd BACKEND
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the BACKEND folder.

```env
MONGO_URL=your_mongodb_connection_string
PORT=8080
JWT_SECRET=your_secret_key
```

Use your own MongoDB connection string and a secure JWT secret. Never upload your `.env` file to GitHub.

### 4. Start the Backend

```bash
npm start
```

### 5. Run the Frontend

Open `FRONTEND/index.html` using the VS Code Live Server extension.

## 🔐 Security

- Environment variables are used for sensitive configuration.
- Passwords are hashed before storage.
- Protected API routes use JWT authentication.

## 🔮 Future Improvements

- Advanced financial reports and insights
- Enhanced spending analysis
- Additional dashboard visualizations

## 👩‍💻 Author

Developed as a Full-Stack Web Development Project.

**GitHub:** [shikha2007-del](https://github.com/shikha2007-del)
