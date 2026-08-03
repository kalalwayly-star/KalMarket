document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("calculateMortgageBtn")
        ?.addEventListener("click", calculateMortgage);

    document
        .getElementById("resetMortgageBtn")
        ?.addEventListener("click", resetMortgage);
});

function calculateMortgage() {

    const homePrice =
        Number(document.getElementById("homePrice").value) || 0;

    const downPayment =
        Number(document.getElementById("downPayment").value) || 0;

    const interestRate =
        Number(document.getElementById("interestRate").value) || 0;

    const loanTerm =
        Number(document.getElementById("loanTerm").value) || 0;

    // Loan calculation

    const loanAmount =
        homePrice - downPayment;

    const monthlyRate =
        interestRate / 100 / 12;

    const numberOfPayments =
        loanTerm * 12;


    let monthlyPayment = 0;

    if (monthlyRate > 0) {

        monthlyPayment =
            loanAmount *
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } 
    else {

        monthlyPayment =
            loanAmount / numberOfPayments;

    }

    const totalPayments =
        monthlyPayment * numberOfPayments;


    const totalInterest =
        totalPayments - loanAmount;


    // Display results

    document.getElementById("loanAmountResult").textContent =
        formatCurrency(loanAmount);

    document.getElementById("monthlyPaymentResult").textContent =
        formatCurrency(monthlyPayment);

    document.getElementById("totalPaymentsResult").textContent =
        formatCurrency(totalPayments);

    document.getElementById("totalInterestResult").textContent =
        formatCurrency(totalInterest);

    generateMortgageRecommendation(
        monthlyPayment,
        totalInterest,
        loanAmount
    );

}


function generateMortgageRecommendation(
    monthlyPayment,
    totalInterest,
    loanAmount
) {

    const t = window.translations || {};

    let html = "";


    if (totalInterest > loanAmount * 0.5) {

        html = `
        <div class="strategy-box warning">

            <h4>
            ${t.high_interest_cost || "⚠️ High Interest Cost"}
            </h4>

            <p>
            ${t.high_interest_cost_desc || 
            "Your interest cost is high compared with your loan amount. Consider a larger down payment or shorter loan term."}
            </p>

        </div>
        `;

    }

    else {

        html = `
        <div class="strategy-box success">

            <h4>
            ${t.healthy_mortgage || "🟢 Healthy Mortgage Plan"}
            </h4>

            <p>
            ${t.healthy_mortgage_desc ||
            "Your mortgage structure looks balanced based on the information provided."}
            </p>

        </div>
        `;

    }

    document.getElementById("mortgageRecommendation").innerHTML =
        html;
}


function resetMortgage() {

    document
    .querySelectorAll(".calculator-card input")
    .forEach(input => {

        input.value = "";
    });


    document.getElementById("loanAmountResult").textContent =
        formatCurrency(0);

    document.getElementById("monthlyPaymentResult").textContent =
        formatCurrency(0);

    document.getElementById("totalPaymentsResult").textContent =
        formatCurrency(0);

    document.getElementById("totalInterestResult").textContent =
        formatCurrency(0);

    document.getElementById("mortgageRecommendation").innerHTML = `
        <p>
        Calculate your mortgage to see recommendations.
        </p>
    `;
}


function formatCurrency(amount) {

    return amount.toLocaleString("en-CA", {

        style: "currency",

        currency: "CAD"

    });

}
