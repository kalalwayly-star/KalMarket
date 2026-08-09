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
// ======================================================
// SAFE NUMBER INPUT
// ======================================================

function getNumber(id) {

    const element = document.getElementById(id);

    if (!element) return 0;

    const value = Number(element.value);

    return Number.isFinite(value) && value > 0
        ? value
        : 0;
}


// ======================================================
// 2025 FEDERAL TAX
// ======================================================

function calculateFederalTax(taxableIncome) {

    let tax = 0;

    // 2025 Federal brackets
    const bracket1 = 57375;
    const bracket2 = 114750;
    const bracket3 = 177882;
    const bracket4 = 253414;

    if (taxableIncome <= 0) {

        return 0;

    }

    if (taxableIncome <= bracket1) {

        tax =
            taxableIncome * 0.145;

    }

    else if (taxableIncome <= bracket2) {

        tax =
            (bracket1 * 0.145) +
            ((taxableIncome - bracket1) * 0.205);

    }

    else if (taxableIncome <= bracket3) {

        tax =
            (bracket1 * 0.145) +
            ((bracket2 - bracket1) * 0.205) +
            ((taxableIncome - bracket2) * 0.26);

    }

    else if (taxableIncome <= bracket4) {

        tax =
            (bracket1 * 0.145) +
            ((bracket2 - bracket1) * 0.205) +
            ((bracket3 - bracket2) * 0.26) +
            ((taxableIncome - bracket3) * 0.29);

    }

    else {

        tax =
            (bracket1 * 0.145) +
            ((bracket2 - bracket1) * 0.205) +
            ((bracket3 - bracket2) * 0.26) +
            ((bracket4 - bracket3) * 0.29) +
            ((taxableIncome - bracket4) * 0.33);

    }

    return tax;
}


// ======================================================
// 2025 FEDERAL BASIC PERSONAL CREDIT
// ======================================================

function calculateFederalBasicCredit(taxableIncome) {

    const basicAmount = 16129;

    const creditRate = 0.145;

    return basicAmount * creditRate;
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

// ======================================================
// 2025 MANITOBA PROVINCIAL TAX
// ======================================================

function calculateProvincialTax(taxableIncome, country, region) {

    if (country !== "CA" || region !== "MB") {
        return 0;
    }

    const bracket1 = 47564;
    const bracket2 = 101200;

    let tax = 0;

    if (taxableIncome <= 0) {
        return 0;
    }

    if (taxableIncome <= bracket1) {

        tax =
            taxableIncome * 0.108;

    } else if (taxableIncome <= bracket2) {

        tax =
            (bracket1 * 0.108) +
            ((taxableIncome - bracket1) * 0.1275);

    } else {

        tax =
            (bracket1 * 0.108) +
            ((bracket2 - bracket1) * 0.1275) +
            ((taxableIncome - bracket2) * 0.174);

    }

    return tax;
}


// ======================================================
// 2025 MANITOBA BASIC PERSONAL CREDIT
// ======================================================

function calculateProvincialBasicCredit(
    taxableIncome,
    country,
    region
) {

    if (country !== "CA" || region !== "MB") {
        return 0;
    }

    const basicAmount = 15780;

    const creditRate = 0.108;

    return basicAmount * creditRate;
}

// ======================================================
// 2025 CPP
// ======================================================

function calculateCPP(employmentType, netBusinessIncome) {

    if (employmentType !== "self-employed") {
        return 0;
    }

    const basicExemption = 3500;
    const cppRate = 0.1190;
    const maximumPensionableEarnings = 71300;

    const pensionableIncome =
        Math.max(
            0,
            Math.min(
                netBusinessIncome,
                maximumPensionableEarnings
            ) - basicExemption
        );

    return pensionableIncome * cppRate;
}


// ======================================================
// 2025 EI
// ======================================================

function calculateEI(employmentType, annualIncome) {

    // Self-employed people are not automatically
    // required to pay EI premiums.
    if (employmentType === "self-employed") {
        return 0;
    }

    const eiRate = 0.0164;
    const maximumInsurableEarnings = 65700;

    const insurableIncome =
        Math.min(
            Math.max(0, annualIncome),
            maximumInsurableEarnings
        );

    return insurableIncome * eiRate;
}

// ======================================================
// FEDERAL NON-REFUNDABLE CREDITS
// ======================================================

function calculateFederalCredits({
    taxpayerAge,
    tuitionAmount,
    medicalExpenses,
    charitableDonations,
    hasDisability
}) {

    const creditRate = 0.145;

    let credits = 0;

    // Age amount
    if (taxpayerAge >= 65) {

        credits +=
            8839 * creditRate;
    }

    // Disability amount
    if (hasDisability) {

        credits +=
            10138 * creditRate;
    }

    // Tuition amount
    if (tuitionAmount > 0) {

        credits +=
            tuitionAmount * creditRate;
    }

    // Medical expenses
    if (medicalExpenses > 0) {

        credits +=
            medicalExpenses * creditRate;
    }

    // Charitable donations
    if (charitableDonations > 0) {

        credits +=
            charitableDonations * creditRate;
    }

    return credits;
}

// ======================================================
// RESULT DISPLAY HELPER
// ======================================================

function setResult(id, value) {

    const element = document.getElementById(id);

    if (!element) return;

    element.textContent = formatCurrency(value);
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

    const businessIncomeSection =
        document.getElementById("businessIncomeSection");

    const gstSection =
        document.getElementById("gstSection");

    const gstResults =
        document.getElementById("gstResultsSection");


    // ======================================================
    // EMPLOYEE
    // ======================================================

    if (employment === "employee") {

        if (businessIncomeSection)
            businessIncomeSection.style.display = "none";

        if (gstSection)
            gstSection.style.display = "none";

        if (gstResults)
            gstResults.style.display = "none";
    }


    // ======================================================
    // SELF-EMPLOYED
    // ======================================================

    else if (employment === "self-employed") {

        if (businessIncomeSection)
            businessIncomeSection.style.display = "";

        if (gstSection)
            gstSection.style.display = "block";

        if (gstResults)
            gstResults.style.display = "grid";
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
document.addEventListener("DOMContentLoaded", () => {

    document
        .querySelectorAll(
            "#businessRevenue, #costOfGoodsSold, #businessExpenses, #employmentExpenses"
        )
        .forEach(el => {

            el.style.display = "";

            if (el.previousElementSibling) {
                el.previousElementSibling.style.display = "";
            }

        });

});
