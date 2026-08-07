document.addEventListener("DOMContentLoaded", () => {

    document
    .getElementById("calculateTaxBtn")
    ?.addEventListener("click", calculateTax);


    document
    .getElementById("resetTaxBtn")
    ?.addEventListener("click", resetTax);

});

function calculateTax() {

    const taxPaid =
    Number(document.getElementById("taxPaid").value) || 0;

    const annualIncome =
        Number(document.getElementById("annualIncome").value) || 0;

    const businessExpenses =
        Number(document.getElementById("businessExpenses").value) || 0;

    const employmentType =
        document.getElementById("employmentType").value;

   const country =
document.getElementById("country").value;

const region =
document.getElementById("region").value;
const gstCollected =
    Number(document.getElementById("gstCollected").value) || 0;

const gstPaid =
    Number(document.getElementById("gstPaid").value) || 0;

const gstOwing =
    gstCollected - gstPaid;

    // Taxable income

    const taxableIncome =
    annualIncome - businessExpenses;

    // Simple estimated federal tax

    let federalTax = 0;


    if (taxableIncome <= 57375) {

        federalTax =
            taxableIncome * 0.15;

    }
    else if (taxableIncome <= 114750) {

        federalTax =
            (57375 * 0.15) +
            ((taxableIncome - 57375) * 0.205);

    }
    else {

        federalTax =
            (57375 * 0.15) +
            (57375 * 0.205) +
            ((taxableIncome - 114750) * 0.26);

    }

    // Provincial estimate

   let regionalRate = 0;


if (country === "CA") {


    if (region === "MB") {

        regionalRate = 0.108;

    }

    else if (region === "ON") {

        regionalRate = 0.11;

    }

    else if (region === "AB") {

        regionalRate = 0.10;

    }

    else if (region === "BC") {

        regionalRate = 0.08;

    }

}


else if (country === "US") {


    // Temporary USA estimate
    // We will improve state rules later

    if (region === "CA") {

        regionalRate = 0.09;

    }

    else if (region === "TX") {

        regionalRate = 0;

    }

    else if (region === "NY") {

        regionalRate = 0.06;

    }


}

   const regionalTax =
    taxableIncome * regionalRate;



    // Self employed adjustment

    let extraAdjustment = 0;

    if (employmentType === "self-employed") {

        extraAdjustment =
            taxableIncome * 0.02;

    }

    const totalTax =
        federalTax +
        regionalTax +
        extraAdjustment;

    const taxBalance =
    totalTax - taxPaid;
    
    const afterTax =
        annualIncome - totalTax;

    const monthlySavings =
        totalTax / 12;

const quarterlySavings =
    totalTax / 4;

    // Display results


    document.getElementById("grossIncomeResult").textContent =
        formatCurrency(annualIncome);


    document.getElementById("deductionsResult").textContent =
        formatCurrency(businessExpenses);


    document.getElementById("taxableIncomeResult").textContent =
        formatCurrency(taxableIncome);


    document.getElementById("federalTaxResult").textContent =
        formatCurrency(federalTax);


    document.getElementById("provincialTaxResult").textContent =
        formatCurrency(regionalTax);


    document.getElementById("totalTaxResult").textContent =
        formatCurrency(totalTax);

const taxBalanceElement =
document.getElementById("taxBalanceResult");


if (taxBalanceElement) {

    taxBalanceElement.classList.remove(
        "tax-refund",
        "tax-owing",
        "tax-zero"
    );


    if (taxBalance > 0) {

        taxBalanceElement.textContent =
        "Owing to Government: " + formatCurrency(taxBalance);

        taxBalanceElement.classList.add(
            "tax-owing"
        );

    }

    else if (taxBalance < 0) {

        taxBalanceElement.textContent =
        "Tax Refund: " + formatCurrency(Math.abs(taxBalance));

        taxBalanceElement.classList.add(
            "tax-refund"
        );

    }

    else {

        taxBalanceElement.textContent =
        "No Balance Owing";

        taxBalanceElement.classList.add(
            "tax-zero"
        );

    }

}

    document.getElementById("afterTaxResult").textContent =
        formatCurrency(afterTax);


    document.getElementById("monthlyTaxSavingsResult").textContent =
        formatCurrency(monthlySavings);
document.getElementById("gstCollectedResult").textContent =
    formatCurrency(gstCollected);

document.getElementById("gstPaidResult").textContent =
    formatCurrency(gstPaid);

document.getElementById("gstOwingResult").textContent =
    formatCurrency(gstOwing);

document.getElementById("quarterlyTaxResult").textContent =
    formatCurrency(quarterlySavings);


    generateTaxRecommendation(
        totalTax,
        monthlySavings,
        employmentType
    );


}

function generateTaxRecommendation(
    totalTax,
    monthlySavings,
    employmentType
) {

    let message = "";

    if (employmentType === "self-employed") {

        message = `
        <div class="strategy-box warning">

        <h4>🧾 Self-Employed Tax Planning</h4>

        <p>
        Consider setting aside approximately
        ${formatCurrency(monthlySavings)}
        every month for taxes.
        </p>

        </div>`;

    }

    else {

        message = `

        <div class="strategy-box success">

        <h4>✅ Tax Planning Estimate</h4>

        <p>
        Estimated yearly tax:
        ${formatCurrency(totalTax)}

        </p>

        <p>
        Recommended monthly savings:
        ${formatCurrency(monthlySavings)}
        </p>
        </div>
        `;
    }

    document.getElementById("taxRecommendation").innerHTML =
        message;
}


function resetTax() {


    document.querySelectorAll(
        "input"
    ).forEach(input => {

        input.value = "";

    });

    document.getElementById("businessExpenses").value = 0;


    document.getElementById("taxRecommendation").innerHTML =
    `
    Calculate your tax estimate to see recommendations.
    `;
}

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-CA",
        {
            style: "currency",
            currency: "CAD"
        }
    ).format(amount);
}
document
    .getElementById("employmentType")
    .addEventListener("change", updateTaxEstimatorUI);


function updateTaxEstimatorUI() {

    const employment =
        document.getElementById("employmentType").value;


    const gstSection =
        document.getElementById("gstSection");


    const gstResults =
        document.getElementById("gstResultsSection");


    const businessExpensesLabel =
        document.querySelector(
            'label[data-i18n="business_expenses"]'
        );


    const businessExpensesInput =
        document.getElementById("businessExpenses");



    if (employment === "employee") {


        // Hide GST for employees
        if (gstSection)
            gstSection.style.display = "none";


        if (gstResults)
            gstResults.style.display = "none";



        // Change expense label
        if (businessExpensesLabel) {

            businessExpensesLabel.textContent =
            "📉 Employment Deductions";

        }


        if (businessExpensesInput) {

            businessExpensesInput.placeholder =
            "RRSP, Union Dues, Employment Expenses";

        }


    } 
    
    else {


        // Show GST for self-employed
        if (gstSection)
            gstSection.style.display = "block";


        if (gstResults)
            gstResults.style.display = "grid";



        if (businessExpensesLabel) {

            businessExpensesLabel.textContent =
            "📉 Allowable Business Expenses";

        }


        if (businessExpensesInput) {

            businessExpensesInput.placeholder =
            "Allowable Business Expenses";

        }

    }

}



// Run when page loads
updateTaxEstimatorUI();


// Run when user changes status
document
.getElementById("employmentType")
.addEventListener(
"change",
updateTaxEstimatorUI
);
