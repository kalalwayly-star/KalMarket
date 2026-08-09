document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("calculateTaxBtn")
        ?.addEventListener("click", calculateTax);

    document
        .getElementById("resetTaxBtn")
        ?.addEventListener("click", resetTax);

    document
        .getElementById("employmentType")
        ?.addEventListener("change", updateTaxEstimatorUI);

    updateTaxEstimatorUI();

});

function calculateTax() {

    const employmentType =
        document.getElementById("employmentType")?.value || "employee";

    const taxPaid =
        Number(document.getElementById("taxPaid")?.value) || 0;

    const annualIncome =
        Number(document.getElementById("annualIncome")?.value) || 0;

    const businessRevenue =
        Number(document.getElementById("businessRevenue")?.value) || 0;

    const costOfGoodsSold =
        Number(document.getElementById("costOfGoodsSold")?.value) || 0;

    const businessExpenses =
        Number(document.getElementById("businessExpenses")?.value) || 0;

    const country =
        document.getElementById("country")?.value || "CA";

    const region =
        document.getElementById("region")?.value || "MB";

    const gstCollected =
        Number(document.getElementById("gstCollected")?.value) || 0;

    const gstPaid =
        Number(document.getElementById("gstPaid")?.value) || 0;

    const gstOwing =
        gstCollected - gstPaid;

    let grossIncome = annualIncome;

    let deductions = 0;

    let taxableIncome = annualIncome;

    // ============================
    // SELF EMPLOYED CALCULATION
    // ============================

    if (employmentType === "self-employed") {

        const grossBusinessIncome =
            businessRevenue - costOfGoodsSold;

        const netBusinessIncome =
            grossBusinessIncome - businessExpenses;

        // Simple CPP deduction estimate
        const cppDeduction =
            netBusinessIncome * 0.0515;

        taxableIncome =
            netBusinessIncome - cppDeduction;

        grossIncome =
            grossBusinessIncome;

        deductions =
            businessExpenses + cppDeduction;

    }

    // ============================
    // TAX CALCULATION
    // ============================

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

    // ============================
    // PROVINCIAL ESTIMATE
    // ============================

    let provincialRate = 0;

    if (country === "CA") {

        if (region === "MB") {

            provincialRate = 0.108;

        }

        else if (region === "ON") {

            provincialRate = 0.11;

        }

        else if (region === "AB") {

            provincialRate = 0.10;

        }

        else if (region === "BC") {

            provincialRate = 0.08;

        }

    }

    const provincialTax =
        taxableIncome * provincialRate;

// ======================================================
// BASIC PERSONAL CREDITS
// ======================================================

const federalBasicCredit =
    16129 * 0.15;

let provincialBasicCredit = 0;

if (country === "CA" && region === "MB") {

    provincialBasicCredit =
        15700 * 0.108;

}

// ======================================================
// TAX AFTER BASIC PERSONAL CREDITS
// ======================================================

federalTax =
    Math.max(
        0,
        federalTax - federalBasicCredit
    );

provincialTax =
    Math.max(
        0,
        provincialTax - provincialBasicCredit
    );

// ======================================================
// TOTAL ESTIMATED TAX
// ======================================================

const totalTax =
    federalTax + provincialTax;

// ======================================================
// REFUND OR AMOUNT OWING
// ======================================================

const taxBalance =
    totalTax - taxPaid;

// ======================================================
// ESTIMATED AFTER-TAX INCOME
// ======================================================

let afterTax;

if (employmentType === "self-employed") {

    afterTax =
        grossIncome -
        costOfGoodsSold -
        businessExpenses -
        totalTax;

} else {

    afterTax =
        annualIncome -
        totalTax;

}

// ======================================================
// TAX SAVINGS
// ======================================================

const monthlySavings =
    totalTax / 12;

const quarterlySavings =
    totalTax / 4;

    // ============================
    // DISPLAY RESULTS
    // ============================

    document.getElementById("grossIncomeResult").textContent =
        formatCurrency(grossIncome);

    document.getElementById("deductionsResult").textContent =
        formatCurrency(deductions);

    document.getElementById("taxableIncomeResult").textContent =
        formatCurrency(taxableIncome);

    document.getElementById("federalTaxResult").textContent =
        formatCurrency(federalTax);

    document.getElementById("provincialTaxResult").textContent =
        formatCurrency(provincialTax);

    document.getElementById("totalTaxResult").textContent =
        formatCurrency(totalTax);

    document.getElementById("taxPaidResult").textContent =
    formatCurrency(taxPaid);


    document.getElementById("afterTaxResult").textContent =
        formatCurrency(afterTax);

    document.getElementById("monthlyTaxSavingsResult").textContent =
        formatCurrency(monthlySavings);

    document.getElementById("quarterlyTaxResult").textContent =
        formatCurrency(quarterlySavings);

    document.getElementById("gstCollectedResult").textContent =
        formatCurrency(gstCollected);

    document.getElementById("gstPaidResult").textContent =
        formatCurrency(gstPaid);

    document.getElementById("gstOwingResult").textContent =
        formatCurrency(gstOwing);

    displayTaxBalance(taxBalance);

    generateTaxRecommendation(
        totalTax,
        monthlySavings,
        employmentType
    );
}

function displayTaxBalance(balance) {

    const element =
        document.getElementById("taxBalanceResult");

    if (!element) return;

    element.classList.remove(
        "tax-refund",
        "tax-owing",
        "tax-zero"
    );

    if (balance > 0) {

        element.textContent =
        "Amount Owing: " + formatCurrency(balance);

        element.classList.add("tax-owing");

    }

    else if (balance < 0) {

        element.textContent =
        "Refund: " + formatCurrency(Math.abs(balance));

        element.classList.add("tax-refund");

    }

    else {

        element.textContent =
        "No Balance Owing";

        element.classList.add("tax-zero");

    }
}

function generateTaxRecommendation(
    totalTax,
    monthlySavings,
    employmentType
) {

    const recommendation =
        document.getElementById("taxRecommendation");

    if (!recommendation) {
        return;
    }

    if (employmentType === "self-employed") {

        recommendation.innerHTML =
            "<div class=\"strategy-box warning\">" +
            "<h4>🧾 Self-Employed Tax Planning</h4>" +
            "<p>Consider saving approximately " +
            formatCurrency(monthlySavings) +
            " monthly for taxes.</p>" +
            "</div>";

    } else {

        recommendation.innerHTML =
            "<div class=\"strategy-box success\">" +
            "<h4>✅ Tax Planning Estimate</h4>" +
            "<p>Estimated yearly tax: " +
            formatCurrency(totalTax) +
            "</p>" +
            "<p>Recommended monthly savings: " +
            formatCurrency(monthlySavings) +
            "</p>" +
            "</div>";
    }
}

function resetTax() {

    document
    .querySelectorAll("input")
    .forEach(input => {

        input.value = "";
    });

    const box =
    document.getElementById("taxRecommendation");

    if (box) {

        box.innerHTML =
        "Calculate your tax estimate to see recommendations.";

    }

}

function updateTaxEstimatorUI() {

    const employment =
        document.getElementById("employmentType")?.value;

    const gstSection =
        document.getElementById("gstSection");

    const gstResults =
        document.getElementById("gstResultsSection");

    const label =
        document.querySelector(
        'label[data-i18n="business_expenses"]'
        );

    const expenseInput =
        document.getElementById("businessExpenses");

    if (employment === "employee") {

        if (gstSection)
            gstSection.style.display = "none";

        if (gstResults)
            gstResults.style.display = "none";

        if (label)
            label.textContent =
            "📉 Employment Deductions";

        if (expenseInput)
            expenseInput.placeholder =
            "RRSP, Union Dues, Employment Expenses";
    }
    else {

        if (gstSection)
            gstSection.style.display = "block";

        if (gstResults)
            gstResults.style.display = "grid";

        if (label)
            label.textContent =
            "📉 Allowable Business Expenses";

        if (expenseInput)
            expenseInput.placeholder =
            "Allowable Business Expenses";
    }
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
