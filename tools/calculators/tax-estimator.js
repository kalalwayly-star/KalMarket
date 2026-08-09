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

    // ======================================================
    // BASIC INPUTS
    // ======================================================

    const employmentType =
        document.getElementById("employmentType")?.value || "employee";

    const country =
        document.getElementById("country")?.value || "CA";

    const region =
        document.getElementById("region")?.value || "MB";

    const annualIncome =
        getNumber("annualIncome");

    const taxPaid =
        getNumber("taxPaid");


    // ======================================================
    // DEDUCTIONS
    // ======================================================

    const rrspContributions =
        getNumber("rrspContributions");

    const professionalDues =
        getNumber("professionalDues");

    const employmentExpenses =
        getNumber("employmentExpenses");

    const tuitionAmount =
        getNumber("tuitionAmount");

    const medicalExpenses =
        getNumber("medicalExpenses");

    const charitableDonations =
        getNumber("charitableDonations");

    const otherDeductions =
        getNumber("otherDeductions");


    // ======================================================
    // PERSONAL INFORMATION
    // ======================================================

    const taxpayerAge =
        getNumber("taxpayerAge");

    const hasSpouse =
        document.getElementById("hasSpouse")?.value === "yes";

    const dependants =
        getNumber("dependants");

    const hasDisability =
        document.getElementById("hasDisability")?.value === "yes";


    // ======================================================
    // BUSINESS INPUTS
    // ======================================================

    const businessRevenue =
        getNumber("businessRevenue");

    const costOfGoodsSold =
        getNumber("costOfGoodsSold");

    const businessExpenses =
        getNumber("businessExpenses");


    // ======================================================
    // GST / HST
    // ======================================================

    const gstCollected =
        getNumber("gstCollected");

    const gstPaid =
        getNumber("gstPaid");

    const gstOwing =
        Math.max(
            0,
            gstCollected - gstPaid
        );


    // ======================================================
    // INCOME CALCULATION
    // ======================================================

    let grossIncome = annualIncome;

    let netBusinessIncome = 0;

    let businessDeductions = 0;


    if (employmentType === "self-employed") {

        netBusinessIncome =
            Math.max(
                0,
                businessRevenue -
                costOfGoodsSold -
                businessExpenses
            );

        grossIncome =
            netBusinessIncome;

        businessDeductions =
            costOfGoodsSold +
            businessExpenses;

    }


    // ======================================================
    // GENERAL DEDUCTIONS
    // ======================================================

    const generalDeductions =
        rrspContributions +
        professionalDues +
        employmentExpenses +
        otherDeductions;


    // ======================================================
    // TOTAL DEDUCTIONS
    // ======================================================

    const deductions =
        businessDeductions +
        generalDeductions;


    // ======================================================
    // TAXABLE INCOME
    // ======================================================

    let taxableIncome =
        Math.max(
            0,
            grossIncome -
            generalDeductions
        );


    if (employmentType === "self-employed") {

        taxableIncome =
            Math.max(
                0,
                netBusinessIncome -
                generalDeductions
            );

    }


    // ======================================================
    // FEDERAL TAX BEFORE CREDITS
    // ======================================================

    let federalTax =
        calculateFederalTax(taxableIncome);


    // ======================================================
    // FEDERAL BASIC PERSONAL CREDIT
    // ======================================================

    const federalBasicCredit =
        calculateFederalBasicCredit(
            taxableIncome
        );


    // ======================================================
    // OTHER FEDERAL NON-REFUNDABLE CREDITS
    // ======================================================

    const federalCredits =
        calculateFederalCredits({
            taxpayerAge,
            tuitionAmount,
            medicalExpenses,
            charitableDonations,
            hasDisability
        });


    // ======================================================
    // NET FEDERAL TAX
    // ======================================================

    const netFederalTax =
        Math.max(
            0,
            federalTax -
            federalBasicCredit -
            federalCredits
        );


    // ======================================================
    // PROVINCIAL TAX
    // ======================================================

    let provincialTax =
        calculateProvincialTax(
            taxableIncome,
            country,
            region
        );


    // ======================================================
    // PROVINCIAL BASIC CREDIT
    // ======================================================

    const provincialBasicCredit =
        calculateProvincialBasicCredit(
            taxableIncome,
            country,
            region
        );


    // ======================================================
    // NET PROVINCIAL TAX
    // ======================================================

    const netProvincialTax =
        Math.max(
            0,
            provincialTax -
            provincialBasicCredit
        );


    // ======================================================
    // CPP
    // ======================================================

    const cpp =
        calculateCPP(
            employmentType,
            netBusinessIncome
        );


    // ======================================================
    // EI
    // ======================================================

    const ei =
        calculateEI(
            employmentType,
            annualIncome
        );


    // ======================================================
    // TOTAL TAX / CONTRIBUTIONS
    // ======================================================

    const totalTax =
        netFederalTax +
        netProvincialTax +
        cpp +
        ei;


    // ======================================================
    // REFUND / BALANCE OWING
    // ======================================================

    const taxBalance =
        totalTax -
        taxPaid;


    // ======================================================
    // AFTER-TAX INCOME
    // ======================================================

    let afterTaxIncome;

    if (employmentType === "self-employed") {

        afterTaxIncome =
            netBusinessIncome -
            netFederalTax -
            netProvincialTax -
            cpp;

    } else {

        afterTaxIncome =
            annualIncome -
            netFederalTax -
            netProvincialTax -
            cpp -
            ei;

    }


    afterTaxIncome =
        Math.max(
            0,
            afterTaxIncome
        );


    // ======================================================
    // TAX RESERVE
    // ======================================================

    const monthlySavings =
        totalTax / 12;

    const quarterlySavings =
        totalTax / 4;


    // ======================================================
    // DISPLAY RESULTS
    // ======================================================

    setResult(
        "grossIncomeResult",
        grossIncome
    );

    setResult(
        "deductionsResult",
        deductions
    );

    setResult(
        "taxableIncomeResult",
        taxableIncome
    );

    setResult(
        "federalTaxResult",
        netFederalTax
    );

    setResult(
        "provincialTaxResult",
        netProvincialTax
    );

    setResult(
        "totalTaxResult",
        totalTax
    );

    setResult(
        "taxPaidResult",
        taxPaid
    );

    setResult(
        "afterTaxResult",
        afterTaxIncome
    );

    setResult(
        "monthlyTaxSavingsResult",
        monthlySavings
    );

    setResult(
        "quarterlyTaxResult",
        quarterlySavings
    );

    setResult(
        "gstCollectedResult",
        gstCollected
    );

    setResult(
        "gstPaidResult",
        gstPaid
    );

    setResult(
        "gstOwingResult",
        gstOwing
    );


    // ======================================================
    // REFUND / AMOUNT OWING
    // ======================================================

    displayTaxBalance(
        taxBalance
    );


    // ======================================================
    // RECOMMENDATION
    // ======================================================

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
