

const expenseName = document.getElementById("expense-name");
const expenseAmount = document.getElementById("expense-amount");
const expenseCategory = document.getElementById("expense-category");
const addExpenseButton = document.getElementById("add-expense");

const expenseList = document.getElementById("expenses");
const totalExpensesElement = document.getElementById("total-expenses");
const transactionCountElement = document.getElementById("transaction-count");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

if (!Array.isArray(expenses)) {
    expenses = [];
}
let expenseChart = null;

addExpenseButton.addEventListener("click", addExpense);

function addExpense() {
    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    const category = expenseCategory.value;

    if (name === "" || amount <= 0) {
        alert("Please enter a valid expense.");
        return;
    }

    const expense = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category
    };

    expenses.push(expense);

    saveExpenses();

    expenseName.value = "";
    expenseAmount.value = "";

    renderExpenses();
    updateSummary();
    updateChart();
}

function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);

    saveExpenses();
    renderExpenses();
    updateSummary();
    updateChart();
}

function renderExpenses() {
    expenseList.innerHTML = "";

    expenses.forEach(expense => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="expense-info">
                <strong>${expense.name}</strong>
                <small>${expense.category}</small>
            </div>

            <div>
                <strong>₹${expense.amount}</strong>

                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})"
                >
                    Delete
                </button>
            </div>
        `;

        expenseList.appendChild(li);
    });
}

function updateSummary() {
    const total = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    totalExpensesElement.textContent = `₹${total}`;
    transactionCountElement.textContent = expenses.length;
}

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function updateChart() {
    const categories = {};

    expenses.forEach(expense => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }

        categories[expense.category] += expense.amount;
    });

    const canvas = document.getElementById("expense-chart");

    if (expenseChart) {
        expenseChart.destroy();
    }

    if (expenses.length === 0) {
        return;
    }

    expenseChart = new Chart(canvas, {
        type: "doughnut",

        data: {
            labels: Object.keys(categories),

            datasets: [{
                data: Object.values(categories)
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
}

renderExpenses();
updateSummary();
updateChart();
