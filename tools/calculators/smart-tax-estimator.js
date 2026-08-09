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

function updateTaxEstimatorUI() {
    const employmentType = document.getElementById("employmentType")?.value || "employee";
    
    const businessIncomeSec = document.getElementById("businessIncomeSection");
    const employeeFieldsSec = document.getElementById("employeeFieldsSection");
    const taxPaidFieldsSec = document.getElementById("taxPaidFieldsSection");
    const businessExpensesSec = document.getElementById("businessExpensesFieldsSection");
    const gstSec = document.getElementById("gstSection");
    const businessResultsGrid = document.getElementById("businessResultsGrid");

    if (employmentType === "self-employed") {
        if (businessIncomeSec) businessIncomeSec.style.display = "block";
        if (businessExpensesSec) businessExpensesSec.style.display = "block";
        if (gstSec) gstSec.style.display = "block";
        if (businessResultsGrid) businessResultsGrid.style.display = "grid";
        
        if (employeeFieldsSec) employeeFieldsSec.style.display = "none";
        if (taxPaidFieldsSec) taxPaidFieldsSec.style.display = "none";
    } else {
        if (businessIncomeSec) businessIncomeSec.style.display = "none";
        if (businessExpensesSec) businessExpensesSec.style.display = "none";
        if (gstSec) gstSec.style.display = "none";
        if (businessResultsGrid) businessResultsGrid.style.display = "none";
        
        if (employeeFieldsSec) employeeFieldsSec.style.display = "block";
        if (taxPaidFieldsSec) taxPaidFieldsSec.style.display = "block";
    }
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD'
    }).format(value);
}

function calculateTax() {
    const employmentType = document.getElementById("employmentType")?.value || "employee";
    const country = document.getElementById("country")?.value || "CA";
    const region = document.getElementById("region")?.value || "MB";

    // Standard Inputs
    let annualIncome = Number(document.getElementById("annualIncome")?.value) || 0;
    let taxPaid = Number(document.getElementById("taxPaid")?.value) || 0;
    
    // Self-Employed Specific Inputs
    let businessRevenue = Number(document.getElementById("businessRevenue")?.value) || 0;
    let costOfGoodsSold = Number(document.getElementById("costOfGoodsSold")?.value) || 0;
    let businessExpenses = Number(document.getElementById("businessExpenses")?.value) || 0;
    
    let gstCollected = Number(document.getElementById("gstCollected")?.value) || 0;
    let gstPaid = Number(document.getElementById("gstPaid")?.value) || 0;

    let grossIncome = 0;
    let totalDeductions = 0;
    let taxableIncome = 0;
    const gstOwing = gstCollected - gstPaid;

    // ============================
    // FIXED DYNAMIC ACCOUNTING LOGIC
    // ============================
    if (employmentType === "self-employed") {
        // Gross profit calculation
        grossIncome = businessRevenue - costOfGoodsSold;
        
        // Net operating profit before tax and CPP
        const netBusinessIncome = grossIncome - businessExpenses;
        
        // Dynamic CPP calculation based on net business income
        const cppDeduction = netBusinessIncome > 0 ? netBusinessIncome * 0.0515 : 0;

        // Total calculated deductions including explicit business expenses
        totalDeductions = businessExpenses + costOfGoodsSold + cppDeduction;
        
        // Taxable income baseline
        taxableIncome = Math.max(0, netBusinessIncome - cppDeduction);
    } else {
        grossIncome = annualIncome;
        totalDeductions = 0;
        taxableIncome = annualIncome;
    }

    // Federal Progressive Brackets
    let federalTax = 0;
    if (taxableIncome <= 57375) {
        federalTax = taxableIncome * 0.15;
    } else if (taxableIncome <= 114750) {
        federalTax = (57375 * 0.15) + ((taxableIncome - 57375) * 0.205);
    } else {
        federalTax = (57375 * 0.15) + (57375 * 0.205) + ((taxableIncome - 114750) * 0.26);
    }

    // Provincial Calibration
    let provincialRate = 0;
    if (country === "CA") {
        if (region === "MB") provincialRate = 0.108;
        else if (region === "ON") provincialRate = 0.11;
        else if (region === "AB") provincialRate = 0.10;
        else if (region === "BC") provincialRate = 0.08;
    }
    let provincialTax = taxableIncome * provincialRate;

    // Basic Personal Amounts (Non-Refundable Credits)
    const federalBasicCredit = 16129 * 0.15;
    let provincialBasicCredit = 0;
    if (country === "CA" && region === "MB") {
        provincialBasicCredit = 15700 * 0.108;
    }

    federalTax = Math.max(0, federalTax - federalBasicCredit);
    provincialTax = Math.max(0, provincialTax - provincialBasicCredit);
    const totalTax = federalTax + provincialTax;

    // Balance Metrics
    const actualTaxPaid = employmentType === "self-employed" ? 0 : taxPaid;
    const taxBalance = totalTax - actualTaxPaid;

    // True Net Cash After Everything
    let afterTax = 0;
    if (employmentType === "self-employed") {
        afterTax = businessRevenue - totalDeductions - totalTax;
    } else {
        afterTax = annualIncome - actualTaxPaid - (taxBalance > 0 ? taxBalance : 0);
    }

    const monthlySavings = totalTax / 12;
    const quarterlySavings = totalTax / 4;

    // Update the DOM Elements
    document.getElementById("grossIncomeResult").textContent = formatCurrency(grossIncome);
    document.getElementById("deductionsResult").textContent = formatCurrency(totalDeductions);
    document.getElementById("taxableIncomeResult").textContent = formatCurrency(taxableIncome);
    document.getElementById("federalTaxResult").textContent = formatCurrency(federalTax);
    document.getElementById("provincialTaxResult").textContent = formatCurrency(provincialTax);
    document.getElementById("totalTaxResult").textContent = formatCurrency(totalTax);
    document.getElementById("taxPaidResult").textContent = formatCurrency(actualTaxPaid);
    document.getElementById("afterTaxResult").textContent = formatCurrency(afterTax);
    document.getElementById("monthlyTaxSavingsResult").textContent = formatCurrency(monthlySavings);
    document.getElementById("quarterlyTaxResult").textContent = formatCurrency(quarterlySavings);
    document.getElementById("gstCollectedResult").textContent = formatCurrency(gstCollected);
    document.getElementById("gstPaidResult").textContent = formatCurrency(gstPaid);
    document.getElementById("gstOwingResult").textContent = formatCurrency(gstOwing);

    displayTaxBalance(taxBalance);
    generateTaxRecommendation(totalTax, monthlySavings, employmentType);
}

function displayTaxBalance(balance) {
    const element = document.getElementById("taxBalanceResult");
    if (!element) return;

    if (balance > 0) {
        element.textContent = "Amount Owing: " + formatCurrency(balance);
        element.style.color = "#d9534f"; 
    } else if (balance < 0) {
        element.textContent = "Refund: " + formatCurrency(Math.abs(balance));
        element.style.color = "#5cb85c"; 
    } else {
        element.textContent = "No Balance Owing";
        element.style.color = "#777";
    }
}

function generateTaxRecommendation(totalTax, monthlySavings, employmentType) {
    const recommendation = document.getElementById("taxRecommendation");
    if (!recommendation) return;

    if (employmentType === "self-employed") {
        recommendation.innerHTML =
            "<div class=\"strategy-box warning\" style=\"background:#fcf8e3; padding:15px; border-radius:4px; margin-top:10px;\">" +
            "<h4>🧾 Self-Employed Tax Planning</h4>" +
            "<p>Consider saving approximately <strong>" + formatCurrency(monthlySavings) + "</strong> monthly for year-end taxes.</p>" +
            "</div>";
    } else {
        recommendation.innerHTML =
            "<div class=\"strategy-box success\" style=\"background:#dff0d8; padding:15px; border-radius:4px; margin-top:10px;\">" +
            "<h4>✅ Tax Planning Estimate</h4>" +
            "<p>Estimated yearly liability: <strong>" + formatCurrency(totalTax) + "</strong></p>" +
            "</div>";
    }
}

function resetTax() {
    document.querySelectorAll("input").forEach(input => {
        input.value = "";
    });
    
    document.querySelectorAll("[id$='Result']").forEach(el => {
        el.textContent = formatCurrency(0);
    });
    
    const balanceElement = document.getElementById("taxBalanceResult");
    if (balanceElement) {
        balanceElement.textContent = "No Balance Owing";
        balanceElement.style.color = "#777";
    }
    
    const recommendation = document.getElementById("taxRecommendation");
    if (recommendation) recommendation.innerHTML = "";
}
