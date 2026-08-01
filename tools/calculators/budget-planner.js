document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("calculateBudgetBtn")
        .addEventListener("click", calculateBudget);

});

function calculateBudget() {

    const revenue =
        Number(document.getElementById("monthlyRevenue").value) || 0;

    const rent =
        Number(document.getElementById("rentExpense").value) || 0;

    const utilities =
        Number(document.getElementById("utilitiesExpense").value) || 0;

    const payroll =
        Number(document.getElementById("payrollExpense").value) || 0;

    const inventory =
        Number(document.getElementById("inventoryExpense").value) || 0;

    const marketing =
        Number(document.getElementById("marketingExpense").value) || 0;

    const insurance =
        Number(document.getElementById("insuranceExpense").value) || 0;

    const other =
        Number(document.getElementById("otherExpense").value) || 0;

    const totalExpenses =
        rent +
        utilities +
        payroll +
        inventory +
        marketing +
        insurance +
        other;

    const profit =
        revenue - totalExpenses;

    const margin =
        revenue > 0
            ? (profit / revenue) * 100
            : 0;

    document.getElementById("totalExpenses").textContent =
        formatCurrency(totalExpenses);

    document.getElementById("estimatedProfit").textContent =
        formatCurrency(profit);

    document.getElementById("profitMargin").textContent =
        margin.toFixed(1) + "%";

}

function formatCurrency(amount) {

    return amount.toLocaleString("en-CA", {
        style: "currency",
        currency: "CAD"
    });

}
