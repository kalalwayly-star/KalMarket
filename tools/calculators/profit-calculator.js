document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("calculateProfitBtn")
        ?.addEventListener("click", calculateProfit);

    document
        .getElementById("resetProfitBtn")
        ?.addEventListener("click", resetProfit);
});

function calculateProfit() {

    const revenue =
        Number(document.getElementById("revenue").value) || 0;

    const costOfGoods =
        Number(document.getElementById("costOfGoods").value) || 0;

    const rent =
        Number(document.getElementById("rent").value) || 0;

    const utilities =
        Number(document.getElementById("utilities").value) || 0;

    const payroll =
        Number(document.getElementById("payroll").value) || 0;

    const marketing =
        Number(document.getElementById("marketing").value) || 0;

    const otherExpenses =
        Number(document.getElementById("otherExpenses").value) || 0;

    const period =
        document.getElementById("period").value;

    let multiplier = 1;

    if (period === "yearly") {
        multiplier = 12;
    }

    const totalExpenses =
        (
            costOfGoods +
            rent +
            utilities +
            payroll +
            marketing +
            otherExpenses
        ) * multiplier;

    const totalRevenue =
        revenue * multiplier;

    const netProfit =
        totalRevenue - totalExpenses;

    let profitMargin = 0;


    if (totalRevenue > 0) {

        profitMargin =
            (netProfit / totalRevenue) * 100;

    }

    document.getElementById("totalExpenses").textContent =
        formatCurrency(totalExpenses);

    document.getElementById("netProfit").textContent =
        formatCurrency(netProfit);

    document.getElementById("profitMargin").textContent =
        profitMargin.toFixed(1) + "%";

    generateProfitRecommendations(
        totalRevenue,
        totalExpenses,
        netProfit,
        profitMargin
    );

    calculateBusinessHealth(
        profitMargin,
        netProfit,
        totalExpenses
    );

}

function generateProfitRecommendations(
    revenue,
    expenses,
    profit,
    margin
) {

    const recommendations = [];

    if (profit <= 0) {

        recommendations.push(
            window.translations["profit_negative"]
        );
    }

    if (margin < 10 && profit > 0) {

        recommendations.push(
            window.translations["profit_low_margin"]
        );
    }

    if (margin >= 20) {

        recommendations.push(
            window.translations["profit_good_margin"]
        );

    }

    if (expenses > revenue * 0.80) {

        recommendations.push(
            window.translations["expenses_high"]
        );

    }

    if (recommendations.length === 0) {

        recommendations.push(
            window.translations["profit_balanced"]
        );

    }

    document.getElementById("profitRecommendations").innerHTML =

        recommendations
        .map(item =>
            `<div class="recommendation-item">${item}</div>`
        )
        .join("");

}

function calculateBusinessHealth(
    margin,
    profit,
    expenses
) {

    let score = 100;

    if (profit <= 0) {
        score -= 40;
    }

    if (margin < 10) {
        score -= 20;
    }

    if (expenses > 80) {
        score -= 15;
    }

    if (score < 0) {
        score = 0;
    }

    let message;

    if (score >= 80) {

        message =
        window.translations["health_excellent"];

    }
    else if (score >= 60) {

        message =
        window.translations["health_good"];

    }
    else if (score >= 40) {

        message =
        window.translations["health_attention"];

    }
    else {

        message =
        window.translations["health_risk"];

    }

    document.getElementById("healthScore").textContent =
        score + " / 100";

    document.getElementById("healthMessage").textContent =
        message;

}

function resetProfit() {


    document.querySelectorAll(
        ".calculator-card input"
    )
    .forEach(input => {

        input.value = "";

    });



    document.getElementById("totalExpenses").textContent =
        "$0.00";

    document.getElementById("netProfit").textContent =
        "$0.00";

    document.getElementById("profitMargin").textContent =
        "0%";

    document.getElementById("profitRecommendations").innerHTML =
        "";

    document.getElementById("healthScore").textContent =
        "0 / 100";

}

function formatCurrency(amount) {

    return amount.toLocaleString("en-CA", {

        style: "currency",

        currency: "CAD"

    });

}
