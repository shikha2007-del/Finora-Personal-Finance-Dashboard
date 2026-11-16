const API_URL = "https://finora-lh13.onrender.com/api/dashboard";
let expenseChart = null;

const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "login.html";
}
console.log("Token exists:", !!token);


let editingTransactionId = null;
let allTransactions = [];

let totalIncome = 0;
let totalExpense = 0;
let totalBalance = 0;
// Budget elements
const budgetAmountInput = document.getElementById("budgetAmount");
const saveBudgetBtn = document.getElementById("saveBudgetBtn");
const monthlyBudgetDisplay = document.getElementById("monthlyBudget");
const monthlySpendingDisplay = document.getElementById("monthlySpending");
const remainingBudgetDisplay = document.getElementById("remainingBudget");
const budgetProgress = document.getElementById("budgetProgress");
const budgetMessage = document.getElementById("budgetMessage");
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
let currentYear = currentDate.getFullYear();
const budgetMonthSelect = document.getElementById("budgetMonth");
const monthNames = ["January", "February", "March", "April","May", "June", "July", "August", "September", "October", "November", "December"];
let selectedMonth = currentMonth;
const budgetYearSelect = document.getElementById("budgetYear");
const startYear = 2024;
const endYear = 2028;
for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    if (year === currentYear) {
        option.selected = true;
    }
    budgetYearSelect.appendChild(option);
}
let allBudgetTransactions = [];
let monthlySpending = 0;
let remainingBudget = 0;
let monthlyComparisonChart = null;

async function fetchDashboard() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message || "Failed to fetch dashboard");
        }
        totalBalance = data.balance;
        totalIncome = data.totalIncome;
        totalExpense = data.totalExpense;
        document.getElementById("balance").textContent = `₹${data.balance}`;
        document.getElementById("income").textContent = `₹${data.totalIncome}`;
        document.getElementById("expense").textContent = `₹${data.totalExpense}`;

        allTransactions = data.recentTransactions || data.recentTransaction || [];
        renderTransactions(allTransactions);
        createMonthlyComparisonChart();
        renderExpenseChart(data.expenseAnalytics || []);

        console.log(data);

    } catch(error) {
        console.log("Dashboard Error:", error.message);
    }
}
fetchDashboard();


function renderTransactions(transactions) {

    const container = document.getElementById("transactions");

    container.innerHTML = "";

    if(transactions.length === 0){
        container.textContent = "No transactions found";
        return;
    }

    transactions.forEach((item) => {
        const row = document.createElement("tr");
        row.className = "border-b";

        const values = [
            item.title,
            item.category,
            new Date(item.date).toLocaleDateString("en-IN"),
            `₹${item.amount}`,
            item.type
        ];

        values.forEach((value) => {
            const cell = document.createElement("td");
            cell.className = "p-3";
            cell.textContent = value;
            row.appendChild(cell);
        });
        const actionCell = document.createElement("td");
        actionCell.className = "p-3";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "bg-orange-500 text-white px-2 py-1 rounded mr-2";
        editBtn.addEventListener("click", () => {
            editTransaction(item);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete",
        deleteBtn.className = "bg-orange-500 text-white px-2 py-1 rounded";
        deleteBtn.addEventListener("click", () => {
            deleteTransaction(item._id);
        });
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);
        container.appendChild(row);
    });
}


const searchInput = document.getElementById("searchTransaction");
const filterType = document.getElementById("filterType");
const filterCategory = document.getElementById("filterCategory");
const sortTransactions = document.getElementById("sortTransactions");

function applyFilters() {
    const searchValue = searchInput.value.toLowerCase();
    const selectedType = filterType.value;
    const selectedCategory = filterCategory.value;

    const filteredTransactions = allTransactions.filter((item) => {

        const matchSearch = item.title.toLowerCase().includes(searchValue);
        const matchType = selectedType === "all" || item.type === selectedType;
        const matchCategory = selectedCategory == "all" || item.category == selectedCategory;
        return matchSearch && matchType && matchCategory;
    });
    const sortValue = sortTransactions.value;
    filteredTransactions.sort((a,b) => {
        if(sortValue === "newest") {
            return new Date(b.date) - new Date(a.date);
        }
        if(sortValue === "oldest") {
            return new Date(a.date) - new Date(b.date);
        }
        if(sortValue === "lowToHigh") {
            return a.amount - b.amount;
        }
        if(sortValue === "highToLow") {
            return b.amount - a.amount;
        }
    });
    renderTransactions(filteredTransactions);
}

function exportTransactionsCSV() {
    const searchValue = searchInput.value.toLowerCase();
    const selectedType = filterType.value;
    const selectedCategory = filterCategory.value;
    const filteredTransactions = allTransactions.filter((item) => {
        const matchSearch = item.title.toLowerCase().includes(searchValue);
        const matchType = selectedType == "all" || item.type === selectedType;
        const matchCategory = selectedCategory === "all" || item.category === selectedCategory;
        return matchSearch && matchType && matchCategory;
    });
    if(filteredTransactions.length === 0) {
        alert("No transactions available to export!");
        return;
    }
    const headers = ["Title", "Category", "Date", "Amount", "Type"];
    const rows = filteredTransactions.map((item) => [
        item.title,
        item.category,
        new Date(item.date).toLocaleDateString("en-IN"),
        item.amount,
        item.type
    ]);
    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
    ].join("\n");
    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Finora_Transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
}
if(searchInput) {
    searchInput.addEventListener("input", applyFilters);
}
if(filterType) {
    filterType.addEventListener("change", applyFilters);
}
if(filterCategory) {
    filterCategory.addEventListener("change", applyFilters);
}
if(sortTransactions) {
    sortTransactions.addEventListener("change", applyFilters);
}
const exportCSVBtn = document.getElementById("exportCSVBtn");
if(exportCSVBtn) {
    exportCSVBtn.addEventListener("click", exportTransactionsCSV);
}


async function deleteTransaction(id) {

    const confirmDelete = confirm("Are you sure you want to delete this transaction?");
    if(!confirmDelete) {
        return;
    }
    try {
        const response = await fetch(`https://finora-lh13.onrender.com/api/transactions/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if(!response.ok) {
            throw new Error(data.message || "Failed to delete transaction");
        }
        alert("Transaction deleted successfully!");
        await fetchDashboard();
        await loadBudgetSummary();
    
    } catch(error) {
        console.log("Delete Error:", error.message);
        alert(error.message);
    }
}

function editTransaction(item) {
    console.log("Editing transaction:", item);
    editingTransactionId = item._id;
    document.getElementById("title").value = item.title;
    document.getElementById("amount").value = item.amount;
    document.getElementById("type").value = item.type;
    document.getElementById("category").value = item.category;
    const transactionDate = new Date(item.date);
    if (!isNaN(transactionDate.getTime())) {
        const year = transactionDate.getFullYear();
        const month = String(transactionDate.getMonth() + 1).padStart(2, "0");
        const day = String(transactionDate.getDate()).padStart(2, "0");
        document.getElementById("date").value = `${year}-${month}-${day}`;
    }
    document.getElementById("description").value = item.description || "";
    document.getElementById("addTransactionBtn").textContent = "Update Transaction";
    transactionForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


function renderExpenseChart(analytics) {
    const canvas = document.getElementById("expenseChart");
    if(analytics.length === 0) {
        canvas.insertAdjacentHTML(
            "afterend",
            "<p>No expense data available</p>"
        );
        return;
    }
    const labels = analytics.map(item => item._id);
    const amounts = analytics.map(item => item.totalAmount);
    if(expenseChart) {
        expenseChart.destroy();
    }
    console.log("Labels:", labels);
    console.log("Amounts:", amounts);
    expenseChart = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                label: "Expense",
                data: amounts
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
    console.log("Chart created:", expenseChart);
}


function createMonthlyComparisonChart() {
    const monthlyData = {};
    allBudgetTransactions.forEach((item) => {
        const date = new Date(item.date);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const key = `${year}-${month}`;
        if(!monthlyData[key]) {
            monthlyData[key] = { income: 0, expense: 0 };
        }
        if(item.type === "income") {
            monthlyData[key].income += Number(item.amount);
        } else if(item.type === "expense") {
            monthlyData[key].expense += Number(item.amount);
        }
    });
    const monthKey = `${currentYear}-${selectedMonth}`;
    const chartLabel = new Date(currentYear, selectedMonth - 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
    const labels = [chartLabel];
    const incomeAmounts = [monthlyData[monthKey]?.income || 0];
    const expenseAmounts = [monthlyData[monthKey]?.expense || 0];
    const maxValue = Math.max(...incomeAmounts, ...expenseAmounts);
    const ctx = document.getElementById("monthlyComparisonChart");
    console.log("Selected month:", selectedMonth);
    console.log("Selected year:", currentYear);
    console.log("Monthly data:", monthlyData);
    console.log("Month key:", monthKey);
    console.log("Chart labels:", labels);
    console.log("Income:", incomeAmounts);
    console.log("Expense:", expenseAmounts);
    if(monthlyComparisonChart) {
        monthlyComparisonChart.destroy();
    }
    monthlyComparisonChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Income",
                    data: incomeAmounts,
                    backgroundColor: "#22c55e"
                },
                {
                    label: "Expense",
                    data: expenseAmounts,
                    backgroundColor: "#ef4444"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: maxValue === 0 ? 8 : undefined, 
                    ticks: { 
                        precision: 0,
                        stepsSize: maxValue === 0 ? 1 : undefined
                       
                    }
                }
            }
        }
    });
    console.log("Monthly comparison:", monthlyData);
}



const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
}

const goalsProgressChartCanvas = document.getElementById("goalsProgressChart");
let goalsProgressChart = null;

function createGoalsProgressChart(goals) {
    if(goalsProgressChart) {
        goalsProgressChart.destroy();
    }
    const goalsLabels = goals.map((goal) => goal.goalName);
    const savedAmounts = goals.map((goal) => Number(goal.savedAmount));
    const remainingAmounts = goals.map((goal) => Math.max(Number(goal.targetAmount) - Number(goal.savedAmount), 0));
    goalsProgressChart = new Chart(goalsProgressChartCanvas, {
        type: "bar",
        data: {
            labels: goalsLabels,
            datasets: [
                {
                    label: "Saved Amount",
                    data: savedAmounts,
                    backgroundColor: "#22c55e"
                },
                {
                    label: "Remaining Amount",
                    data: remainingAmounts,
                    backgroundColor: "#e5e7eb"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top"
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ": ₹" + context.parsed.y.toLocaleString("en-IN");
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return "₹" + value.toLocaleString("en-IN");
                        }
                    }
                }
            }
        }
    });
}


const transactionForm = document.getElementById("transactionForm");
if(transactionForm){
    transactionForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const amount = document.getElementById("amount").value;
        const type = document.getElementById("type").value;
        const category = document.getElementById("category").value;
        const date = document.getElementById("date").value;
        const description = document.getElementById("description").value;
        console.log(title,amount,type,category,date,description);

        try {
            const url = editingTransactionId ? `https://finora-lh13.onrender.com/api/transactions/${editingTransactionId}` : "https://finora-lh13.onrender.com/api/transactions";

            const response = await fetch(url, {
                method: editingTransactionId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    amount,
                    type,
                    category,
                    date,
                    description
                })
            });
            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || "Transaction failed");
            }
            alert(editingTransactionId ? "Transaction updated successfully!" : "Transaction added successfully!");
            transactionForm.reset();
            editingTransactionId = null;
            document.getElementById("addTransactionBtn").textContent = "Add Transaction";
            fetchDashboard();
            await loadBudgetSummary();

        } catch(error) {
            console.log("Transaction Error:", error.message);
            alert(error.message);
        }
    });
}

async function saveBudget() {
    try {
        const amount = Number(budgetAmountInput.value);
        if(!amount || amount <= 0) {
            alert("Please enter a valid budget amount!");
            return;
        }
        const response = await fetch("https://finora-lh13.onrender.com/api/budget", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                amount,
                month: selectedMonth,
                year: currentYear
            })
        });
        const data = await response.json();
        if(!response.ok) {
            throw new Error(data.message || "Failed to save budget");
        }
        alert("Monthly budget saved successfully!");
        await loadBudgetSummary();
        budgetAmountInput.value = ""; 

    } catch(error) {
        console.log("Budget Error:", error);
        alert(error.message);
    }
}
if(saveBudgetBtn) {
    saveBudgetBtn.addEventListener("click", saveBudget);
}


async function fetchBudget() {
    try {
        console.log("Fetching budget...");
        console.log("fetchBudget function started");

        const response = await fetch(`https://finora-lh13.onrender.com/api/budget?month=${selectedMonth}&year=${currentYear}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log("Budget response:", response.status, data);
        console.log("Budget API response:", data);

        if(!response.ok) {
            if(response.status == 404) {
                monthlyBudgetDisplay.textContent = "0";
                return;
            }
            throw new Error(data.message || "Failed to feetch budget");
        }

        monthlyBudgetDisplay.textContent = data.budget.amount;

    } catch(error) {
        console.log("Failed budget error:", error);
    }
}


async function fetchBudgetTransactions() {
    try {
        const response = await fetch("https://finora-lh13.onrender.com/api/transactions", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if(!response.ok) {
            throw new Error(data.message || "Failed to fetch transactions");
        }
        allBudgetTransactions = data.transaction || [];
    
    } catch(error) {
        console.log("Budget transactions error:", error);
    }
}


function calculateMonthlySpending() {
    monthlySpending = allBudgetTransactions.filter((item) => {
        const transactionDate = new Date(item.date);
        return (
            item.type === "expense" && 
            transactionDate.getMonth() + 1 === selectedMonth && 
            transactionDate.getFullYear() === currentYear
        );
    }).reduce((total, item) => {
        return total + Number(item.amount);
    }, 0);
    monthlySpendingDisplay.textContent = monthlySpending;
    console.log("Monthly spending", monthlySpending);
}


function updateBudgetSummary() {
    const budget = Number(monthlyBudgetDisplay.textContent);
    remainingBudget = budget - monthlySpending;
    remainingBudgetDisplay.textContent = remainingBudget;
    const percentage = budget > 0 ? (monthlySpending / budget) * 100 : 0;
    budgetProgress.style.width = `${Math.min(percentage, 100)}%`;

    if(remainingBudget < 0) {
        budgetMessage.textContent = "Warning! You have exceeded your monthly budget.";
        budgetMessage.className = "text-orange-500 mt-3";
        budgetProgress.style.backgroundColor = "#ef4444";
    } else {
        budgetMessage.textContent = "You are within your monthly budget!";
        budgetMessage.className = "font-semibold mt-3";
        budgetProgress.style.backgroundColor = "#f97316";
    }
    console.log("Remaining budget:", remainingBudget);
}


async function loadBudgetSummary() {
    await fetchBudget();
    await fetchBudgetTransactions();
    createMonthlyComparisonChart();
    calculateMonthlySpending();
    updateBudgetSummary();
}

monthNames.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = index + 1;
    option.textContent = month;
    if(index + 1 === currentMonth) {
        option.selected = true;
    }
    budgetMonthSelect.appendChild(option);
});

budgetMonthSelect.addEventListener("change", async () => {
    selectedMonth = Number(budgetMonthSelect.value);
    console.log("Selected month:", selectedMonth);
    await loadBudgetSummary();
    await loadGoals();
    createMonthlyComparisonChart();
});

budgetYearSelect.addEventListener("change", async () => {
    currentYear = Number(budgetYearSelect.value);
    await loadBudgetSummary();
    await loadGoals();
});

selectedMonth = Number(budgetMonthSelect.value) || currentMonth;
currentYear = Number(budgetYearSelect.value) || currentYear;
loadBudgetSummary();


function downloadMonthlyRepport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Finora - Monthly Expense Report", 20, 20);
    const monthName = new Date(currentYear, selectedMonth - 1).toLocaleString("en-IN", { month: "long" });
    doc.setFontSize(12);
    doc.text(`Month: ${monthName} ${currentYear}`, 20, 35);
    const monthlyTransactions = allTransactions.filter((item) => {
        const date = new Date(item.date);
        return (
            date.getMonth() + 1 === selectedMonth && date.getFullYear() === currentYear
        );
    });
    const monthlyIncome = monthlyTransactions.filter(item => item.type === "income").reduce((total, item) => total + Number(item.amount), 0);
    const monthlyExpense = monthlyTransactions.filter(item => item.type === "expense").reduce((total, item) => total + Number(item.amount), 0);
    const savings = monthlyIncome - monthlyExpense;
    doc.text(`Total Income: Rs. ${monthlyIncome}`, 20, 50);
    doc.text(`Total Expense: Rs. ${monthlyExpense}`, 20, 60);
    doc.text(`Savings: Rs. ${savings}`, 20, 70);
    doc.setFontSize(14);
    doc.text("Category-wise Expense", 20, 90);
    const categoryExpenses ={};
    console.log(
        "Expense categories:",
        monthlyTransactions
            .filter(item => item.type === "expense")
            .map(item => ({
                title: item.title,
                category: item.category,
                amount: item.amount
        }))
    );
    monthlyTransactions.filter(item => item.type === "expense").forEach(item => {
        if(!categoryExpenses[item.category]) {
            categoryExpenses[item.category] = 0;
        }
        categoryExpenses[item.category] += Number(item.amount);
    });
    let y = 105;
    doc.setFontSize(11);
    Object.entries(categoryExpenses).forEach(([category, amount]) => {
        doc.text(`${category}: Rs. ${amount}`, 20,y);
        y += 10;
    });
    y += 10;
        doc.setFontSize(10);
        monthlyTransactions.forEach((item) => {
            if(y > 270) {
                doc.addPage();
                y = 20;
            }
            const transactionDate = new Date(item.date).toLocaleDateString("en-IN");
            doc.text(`${transactionDate} | ${item.title} | ${item.category} | Rs.${item.amount} | ${item.type}`, 20, y);
            y += 8;
        });
    doc.save(`Finora_Report_${monthName}_${currentYear}.pdf`);
}
const downloadPDFBtn = document.getElementById("downloadPDFBtn");
if(downloadPDFBtn) {
    downloadPDFBtn.addEventListener("click", downloadMonthlyRepport);
}


const goalNameInput = document.getElementById("goalName");
const targetAmountInput = document.getElementById("targetAmount");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalsContainer = document.getElementById("goalsContainer");
const totalGoalsElement = document.getElementById("totalGoals");
const completedGoalsElement = document.getElementById("completedGoals");
const inProgressGoalsElement = document.getElementById("inProgressGoals");
const totalGoalSavingsElement = document.getElementById("totalGoalSavings");
const overallGoalPercentage = document.getElementById("overallGoalPercentage");
const overallGoalProgressBar = document.getElementById("overallGoalProgressBar");
const overallGoalProgressText = document.getElementById("overallGoalProgressText");
const goalMonthSelect = document.getElementById("goalMonthSelect");
const goalYearSelect = document.getElementById("goalYearSelect");
goalMonthSelect.value = selectedMonth;
goalYearSelect.value = currentYear;
let goalSelectedMonth = selectedMonth;
let goalSelectedYear = currentYear;
goalMonthSelect.value = goalSelectedMonth;
goalYearSelect.value = goalSelectedYear;
const financialInsights = document.getElementById("financialInsights");

async function loadGoals() {
    try {
        const response = await fetch(`https://finora-lh13.onrender.com/api/goals?month=${goalSelectedMonth}&year=${goalSelectedYear}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        if(!response.ok) {
            alert(data.message || "Failed  to fetch goals");
            return;
        }
        updateGoalsSummary(data.goals);
        displayGoals(data.goals);
        createGoalsProgressChart(data.goals);
        generateFinancialInsights(data.goals);
    
    } catch(error) {
        console.log("Error loading goals:", error);
    }
}
loadGoals();


goalMonthSelect.addEventListener("change", async () => {
    goalSelectedMonth = Number(goalMonthSelect.value);
    console.log("Selected Goal Month:", goalSelectedMonth);
    await loadGoals();
});

goalYearSelect.addEventListener("change", async () => {
    goalSelectedYear = Number(goalYearSelect.value);
    console.log("Selected Goal Year:", goalSelectedYear);
    await loadGoals();
});


addGoalBtn.addEventListener("click", async () => {
    const goalName = goalNameInput.value.trim();
    const targetAmount = Number(targetAmountInput.value);
    if(!goalName || !targetAmount || targetAmount <= 0) {
        alert("Please enter a valid goal name and target amount!");
        return;
    }
    try {
        const response = await fetch("https://finora-lh13.onrender.com/api/goals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                goalName,
                targetAmount,
                savedAmount: 0,
                month: goalSelectedMonth,
                year: goalSelectedYear
            })
        });
        const data = await response.json();
        if (!response.ok) {
            alert(data.message || "Failed to add goal");
            return;
        }
        alert("Goal added successfully!");
        goalNameInput.value = "";
        targetAmountInput.value = "";
        await loadGoals();

    } catch(error) {
        console.log("Error adding goal:", error);
        alert("Something went wrong while adding the goal.");
    }
});

function displayGoals(goals) {
    goalsContainer.innerHTML = "";
    if(goals.length === 0) {
        goalsContainer.innerHTML = `<p class="text-gray-500 col-span-full text-center">No financial goals added yet.</p>`;
        return;
    }
    goals.forEach((goal) => {
        const percentage = Math.min(Number(goal.savedAmount) / Number(goal.targetAmount) * 100, 100);
        const remainingAmount = Math.max(Number(goal.targetAmount) - Number(goal.savedAmount), 0);
        const isCompleted = Number(goal.savedAmount) >= Number(goal.targetAmount);
        const goalCard = document.createElement("div");
        goalCard.className = "bg-white border border-gray-200 p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow min-w-0";
        goalCard.innerHTML = `
            <h3 class="font-bold text-base sm:text-lg text-gray-800 wrap-break-words"></h3>
            <p class="text-gray-600 text-sm sm:text-base mt-2 wrap-break-words"></p>
            <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700">Enter Amount Saved</label>
                <input type="number" class="savedAmountInput border border-gray-300 p-3 rounded-lg w-full mt-2 min-w-0 focus:ring-2 focus:ring-orange-300 outline-none" min="0" placeholder="Enter saved amount">
                <button class="updateProgressBtn w-full bg-green-500 hover:bg-green-600 text-white font-semibold p-3 rounded-lg mt-3 transition-colors">Update Progress</button>
            </div>
            <div class="mt-4 space-y-2">
                <p class="savedText text-sm text-gray-600 wrap-break-words"></p>
                <p class="remainingText text-sm font-medium text-gray-700 wrap-break-words"></p>
                <p class="goalStatus text-sm font-bold"></p>
            </div>
            <div class="w-full bg-gray-200 rounded-full mt-3 overflow:hidden">
                <div class="progressBar bg-green-500 h-3 rounded-full w-0 transition-all duration-500"></div>
            </div>
            <p class="progressText text-sm text-gray-500 mt-2"></p>
            <div class="grid grid-cols-2 gap-2 mt-4">
                <button class="editGoalBtn bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg transition-colors">Edit Goal</button>
                <button class="deleteGoalBtn bg-red-500 hover:bg-red-600 text-white font-semibold p-3 rounded-lg transition-colors">Delete Goal</button>
            </div>
        `;
        goalCard.querySelector("h3").textContent = `Goal: ${goal.goalName}`;
        goalCard.querySelector("p").textContent = `Target: ₹${Number(goal.targetAmount).toLocaleString("en-IN")}`;
        const savedInput = goalCard.querySelector(".savedAmountInput");
        const savedText = goalCard.querySelector(".savedText");
        const progressBar = goalCard.querySelector(".progressBar");
        const progressText = goalCard.querySelector(".progressText");
        const remainingText = goalCard.querySelector(".remainingText");
        const goalStatus = goalCard.querySelector(".goalStatus");
        savedInput.value = goal.savedAmount;
        savedInput.max = goal.targetAmount;
        savedText.textContent = `Saved: ₹${Number(goal.savedAmount).toLocaleString("en-IN")}`;
        remainingText.textContent = `Remaining: ₹${remainingAmount.toLocaleString("en-IN")}`;
        goalStatus.textContent = isCompleted ? "Goal Completed!" : "In progress";
        goalStatus.style.color = isCompleted ? "green" : "orange";
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage.toFixed(1)}% completed`;
        goalCard.querySelector(".updateProgressBtn").addEventListener("click", async () => {
            const additionalAmount = Number(savedInput.value);
            const savedAmount = Number(goal.savedAmount) + additionalAmount;
            if(savedInput.value === "" || additionalAmount <= 0 || savedAmount > goal.targetAmount) {
                alert("Please enter a valid amount. The total saved amount cannot exceed the target!");
                return;
            }
            try {
                const response = await fetch(`https://finora-lh13.onrender.com/api/goals/${goal._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ savedAmount })
                });
                const data = await response.json();
                if(!response.ok) {
                    alert(data.message || "Failed to update goal");
                    return;
                }
                await loadGoals();

            } catch(error) {
                console.log("Error updating goal:", error);
            }
        });
        goalCard.querySelector(".editGoalBtn").addEventListener("click", async () => {
            const newGoalName = prompt("Enter new goal name:", goal.goalName);
            if (newGoalName === null) return;
            const newTargetAmount = prompt("Enter new target amount:",  goal.targetAmount);
            if (newTargetAmount === null) return;
            if(newGoalName.trim() === "" || newTargetAmount.trim() === "" || !Number.isFinite(Number(newTargetAmount)) || Number(newTargetAmount) < 1) {
                alert("Please enter valid goal details!");
                return;
            }
            try {
                const response = await fetch(`https://finora-lh13.onrender.com/api/goals/${goal._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        goalName: newGoalName.trim(),
                        targetAmount: Number(newTargetAmount)
                    })
                });
                const data = await response.json();
                if (!response.ok) {
                    alert(data.message || "Failed to edit goal");
                    return;
                }
                alert("Goal updated successfully!");
                await loadGoals();

            } catch(error) {
                 console.log("Error editing goal:", error);
            }
        });
        goalCard.querySelector(".deleteGoalBtn").addEventListener("click", async () => {
            if(!confirm("Are you sure you want to delete this goal?")) {
                return;
            }
            try {
                const response = await fetch(`https://finora-lh13.onrender.com/api/goals/${goal._id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await response.json();
                if(!response.ok) {
                    alert(data.message || "Failed to delete goal");
                    return;
                }
                await loadGoals();
            
            } catch(error) {
                console.log("Error deleting goal:", error);
            }
        });
        goalsContainer.appendChild(goalCard);
    });
}

function updateGoalsSummary(goals) {
    const totalGoals = goals.length;
    const completedGoals = goals.filter((goal) => Number(goal.savedAmount) >= Number(goal.targetAmount)).length;
    const inProgressGoals = totalGoals - completedGoals;
    const totalSavings = goals.reduce((total, goal) => {
        return total + Number(goal.savedAmount);
    }, 0);
    const totalTarget = goals.reduce((total, goal) => {
        return total + Number(goal.targetAmount);
    }, 0);
    const overallPercentage = totalTarget > 0 ? Math.min((totalSavings / totalTarget) * 100, 100) : 0;
    totalGoalsElement.textContent = totalGoals;
    completedGoalsElement.textContent = completedGoals;
    inProgressGoalsElement.textContent = inProgressGoals;
    totalGoalSavingsElement.textContent = `₹${totalSavings.toLocaleString("en-IN")}`;
    overallGoalPercentage.textContent =  `${overallPercentage.toFixed(1)}%`;
    overallGoalProgressBar.style.width = `${overallPercentage}%`;
    overallGoalProgressText.textContent = `₹${totalSavings.toLocaleString("en-IN")} saved out of ₹${totalTarget.toLocaleString("en-IN")}`;
}


function generateFinancialInsights(goals) {
    financialInsights.innerHTML = "";
    if (goals.length === 0) {
        financialInsights.textContent = "Add a financial goal to see your insights.";
        return;
    }
    const totalGoals = goals.length;
    const completedGoals = goals.filter((goal) => Number(goal.savedAmount) >= Number(goal.targetAmount)).length;
    const totalSavings = goals.reduce((total, goal) =>  total + Number(goal.savedAmount), 0);
    const totalTarget = goals.reduce((total, goal) =>  total + Number(goal.targetAmount), 0);
    const remainingAmount = goals.reduce((total, goal) =>  total + Math.max(Number(goal.targetAmount) - Number(goal.savedAmount), 0), 0);
    const progress = totalTarget > 0  ? Math.min((totalSavings / totalTarget) * 100, 100) : 0;
    const insights = [
        `You have completed ${completedGoals} out of ${totalGoals} goals.`,
        `Your overall savings progress is ${progress.toFixed(1)}%.`,
        `You have saved ₹${totalSavings.toLocaleString("en-IN")} so far.`,
        `You need ₹${remainingAmount.toLocaleString("en-IN")} more to reach your remaining targets.`
    ];
    insights.forEach((message) => {
        const insight = document.createElement("p");
        insight.className = "bg-white border border-purple-100 p-4 rounded-xl text-gray-700 shadow-sm";
        insight.textContent = "💡 " + message;
        financialInsights.appendChild(insight);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    sidebar.classList.remove("open");
    function openSidebar() {
        sidebar.classList.add("open");
        overlay.classList.remove("opacity-0", "pointer-events-none");
        overlay.classList.add("opacity-100", "pointer-events-auto");
        menuToggle.textContent = "⇐";
    }
    function closeSidebar() {
        sidebar.classList.remove("open");
        overlay.classList.add("opacity-0", "pointer-events-none");
        overlay.classList.remove("opacity-100", "pointer-events-auto");
        menuToggle.textContent = "☰";
    }
    menuToggle.addEventListener("click", () => {
        sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
    });
    overlay.addEventListener("click", closeSidebar);
});


const lightThemeBtn = document.getElementById("lightThemeBtn");
const darkThemeBtn = document.getElementById("darkThemeBtn");

lightThemeBtn.addEventListener("click", () => {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
    lightThemeBtn.classList.add("border-orange-500");
    lightThemeBtn.classList.remove("border-gray-400");
    darkThemeBtn.classList.remove("border-orange-500");
    darkThemeBtn.classList.add("border-gray-400");
});
darkThemeBtn.addEventListener("click", () => {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
    darkThemeBtn.classList.add("border-orange-500");
    darkThemeBtn.classList.remove("border-gray-400");
    lightThemeBtn.classList.remove("border-orange-500");
    lightThemeBtn.classList.add("border-gray-400");
});
const savedTheme = localStorage.getItem("theme");
if(savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    darkThemeBtn.classList.add("border-orange-500");
    darkThemeBtn.classList.remove("border-gray-400");
} else {
    document.body.classList.remove("dark-mode");
    lightThemeBtn.classList.add("border-orange-500");
    lightThemeBtn.classList.remove("border-gray-400");
}