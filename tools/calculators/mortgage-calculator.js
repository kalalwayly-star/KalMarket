document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("calculateMortgageBtn")
        ?.addEventListener("click", calculateMortgage);

    document
        .getElementById("resetMortgageBtn")
        ?.addEventListener("click", resetMortgage);
    document
.getElementById("toggleScheduleBtn")
?.addEventListener("click", () => {

    const container =
        document.getElementById("scheduleContainer");

    container.style.display =
        container.style.display === "none"
            ? "block"
            : "none";

});
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
    const extraPayment =
    Number(document.getElementById("extraPayment")?.value) || 0;

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
    
    // Extra payment calculation

let savedInterest = 0;
let yearsSaved = 0;


if (extraPayment > 0 && monthlyRate > 0) {

    let balance = loanAmount;
    let months = 0;
    let interestPaid = 0;


    while (balance > 0 && months < numberOfPayments) {

        let interest =
            balance * monthlyRate;


        let principal =
            monthlyPayment + extraPayment - interest;


        balance -= principal;


        interestPaid += interest;

        months++;

    }


    savedInterest =
        totalInterest - interestPaid;


    yearsSaved =
        (numberOfPayments - months) / 12;

}const monthlyInterest =
    loanAmount * monthlyRate;

const monthlyPrincipal =
    monthlyPayment - monthlyInterest;

    // Display results

    document.getElementById("loanAmountResult").textContent =
        formatCurrency(loanAmount);

    document.getElementById("monthlyPaymentResult").textContent =
        formatCurrency(monthlyPayment);

    document.getElementById("totalPaymentsResult").textContent =
        formatCurrency(totalPayments);

    document.getElementById("totalInterestResult").textContent =
        formatCurrency(totalInterest);

    document.getElementById("interestSavingsResult").textContent =
    formatCurrency(savedInterest);


document.getElementById("timeSavedResult").textContent =
    yearsSaved.toFixed(1) + " Years";
    
document.getElementById("monthlyInterestResult").textContent =
    formatCurrency(monthlyInterest);


document.getElementById("monthlyPrincipalResult").textContent =
    formatCurrency(monthlyPrincipal); 
    
    generateMortgageRecommendation(
        monthlyPayment,
        totalInterest,
        loanAmount
    );
generateAmortizationTable(
    loanAmount,
    monthlyRate,
    monthlyPayment,
    numberOfPayments
);
}

function generateAmortizationTable(
    loanAmount,
    monthlyRate,
    monthlyPayment,
    numberOfPayments
) {

    const tbody =
        document.getElementById("scheduleBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    let balance = loanAmount;

    // Start from next month
    let paymentDate = new Date();
    paymentDate.setMonth(paymentDate.getMonth() + 1);


    for (let payment = 1; payment <= numberOfPayments; payment++) {


        const interest =
            balance * monthlyRate;


        const principal =
            monthlyPayment - interest;


        balance -= principal;


        if (balance < 0) balance = 0;


        const formattedDate =
            paymentDate.toLocaleDateString(
                "en-CA",
                {
                    year: "numeric",
                    month: "short"
                }
            );


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${payment}</td>

            <td>${formattedDate}</td>

            <td>${formatCurrency(monthlyPayment)}</td>

            <td>${formatCurrency(principal)}</td>

            <td>${formatCurrency(interest)}</td>

            <td>${formatCurrency(balance)}</td>

        `;


        tbody.appendChild(row);


        // Move to next month

        paymentDate.setMonth(
            paymentDate.getMonth() + 1
        );


        if (balance <= 0) {
            break;
        }

    }

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
document.getElementById("interestSavingsResult").textContent =
    formatCurrency(0);


document.getElementById("timeSavedResult").textContent =
    "0 Years";
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
