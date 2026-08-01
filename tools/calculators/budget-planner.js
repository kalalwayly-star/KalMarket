document.addEventListener("DOMContentLoaded", () => {

   document
    .getElementById("calculateBudgetBtn")
    .addEventListener("click", calculateBudget);

const inputs = document.querySelectorAll(".calculator-card input");

inputs.forEach(input => {
    input.addEventListener("input", calculateBudget);
});

    document
        .getElementById("resetBudgetBtn")
        .addEventListener("click", resetBudget);

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
document.getElementById("resultsSection").scrollIntoView({
    behavior: "smooth",
    block: "start"
});
const profitCard = document.getElementById("profitCard");

if (profit >= 0) {
    profitCard.classList.remove("loss");
    profitCard.classList.add("profit");
} else {
    profitCard.classList.remove("profit");
    profitCard.classList.add("loss");
}
}

function resetBudget() {

    document.getElementById("monthlyRevenue").value = "";
    document.getElementById("rentExpense").value = "";
    document.getElementById("utilitiesExpense").value = "";
    document.getElementById("payrollExpense").value = "";
    document.getElementById("inventoryExpense").value = "";
    document.getElementById("marketingExpense").value = "";
    document.getElementById("insuranceExpense").value = "";
    document.getElementById("otherExpense").value = "";

    document.getElementById("totalExpenses").textContent =
        formatCurrency(0);

    document.getElementById("estimatedProfit").textContent =
        formatCurrency(0);

    document.getElementById("profitMargin").textContent = "0%";

    document.getElementById("monthlyRevenue").focus();

}

function formatCurrency(amount) {

    return amount.toLocaleString("en-CA", {
        style: "currency",
        currency: "CAD"
    });

}
