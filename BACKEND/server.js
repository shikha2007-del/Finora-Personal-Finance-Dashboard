const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db.js");
const app = express();
const dns = require("dns");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");
const transactionRoutes = require("./routes/transactionRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const budgetRoutes = require("./routes/budgetRoutes.js");
const goalRoutes = require("./routes/goalRoutes.js");

dns.setServers(["8.8.8.8"]);
const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://finora-personal-finance-dashboard.netlify.app"
];
app.use(cors({
    origin: allowedOrigins
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
connectDB()

app.use("/api/auth",authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/goals", goalRoutes);

app.get("/", (req,res) => {
    res.send("Welcome to Finora Finance Dashboard API!");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});