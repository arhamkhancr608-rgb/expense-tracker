const expenseName = document.getElementById("expense-name");
const expenseAmount = document.getElementById("expense-amount");
const expenseCategory = document.getElementById("expense-category");
const addExpenseButton = document.getElementById("add-expense");
const expenseList = document.getElementById("expenses");

const totalExpensesElement = document.getElementById("total-expenses");
const balanceElement = document.getElementById("balance");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

addExpenseButton.addEventListener("click", function () {
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

    expenseName.value = "";
    expenseAmount.value = "";

    displayExpenses();
    updateSummary();
});

function displayExpenses() {
    expenseList.innerHTML = "";

    expenses.forEach(function (expense) {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="expense-info">
                <strong>${expense.name}</strong>
                <small>${expense.category}</small>
            </div>

            <div>
                <strong>₹${expense.amount}</strong>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">
                    Delete
                </button>
            </div>
        `;

        expenseList.appendChild(li);
    });
}

function deleteExpense(id) {
    expenses = expenses.filter(function (expense) {
        return expense.id !== id;
    });

    displayExpenses();
    updateSummary();
}

 function updateSummary() {
    const total = expenses.reduce(function (sum, expense) {
        return sum + expense.amount;
    }, 0);

    totalExpensesElement.textContent = `₹${total}`;
    balanceElement.textContent = `₹${total}`;

    localStorage.setItem("expenses", JSON.stringify(expenses));
}


displayExpenses();
updateSummary();
