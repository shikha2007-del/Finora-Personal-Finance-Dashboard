# Finora – Personal Finance Dashboard

Finora is a full-stack personal finance management application that helps users track income, expenses, monthly budgets, and financial goals through an interactive dashboard.

## Features

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

## Tech Stack

### Frontend
- HTML
- Tailwind CSS
- JavaScript
- Chart.js

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Project Structure

Finora/
├── BACKEND/
├── FRONTEND/
├── .gitignore
└── README.md


## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Finora
```

### 2. Install backend dependencies

```bash
cd BACKEND
npm install
```

### 3. Configure environment variables

Create a `.env` file inside BACKEND.

```env
MONGO_URL=your_mongodb_connection_string
PORT=8080
JWT_SECRET=your_secret_key
```

### 4. Start the backend

```bash
npm start
```

### 5. Run the frontend

Open FRONTEND/index.html using VS Code Live Server.

## Security

- Environment variables are used for sensitive configuration.
- Passwords are hashed.
- Protected API routes use JWT authentication.

## Future Improvements

- Financial reports and insights
- Advanced spending analysis
- Additional dashboard visualizations

## Author

Developed as a full-stack web development project.
