document.addEventListener("DOMContentLoaded", () => {

    document
    .getElementById("calculateTaxBtn")
    ?.addEventListener("click", calculateTax);


    document
    .getElementById("resetTaxBtn")
    ?.addEventListener("click", resetTax);

});

function calculateTax() {

    const annualIncome =
        Number(document.getElementById("annualIncome").value) || 0;

    const businessExpenses =
        Number(document.getElementById("businessExpenses").value) || 0;

    const employmentType =
        document.getElementById("employmentType").value;

    const province =
        document.getElementById("province").value;

const gstCollected =
    Number(document.getElementById("gstCollected").value) || 0;

const gstPaid =
    Number(document.getElementById("gstPaid").value) || 0;

const gstOwing =
    gstCollected - gstPaid;

    // Taxable income

    const taxableIncome =
        Math.max(
            0,
            annualIncome - businessExpenses
        );

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

    let provincialRate = 0.10;


    if (province === "MB") {

        provincialRate = 0.108;

    }

    else if (province === "ON") {

        provincialRate = 0.11;

    }

    else if (province === "AB") {

        provincialRate = 0.10;

    }

    else if (province === "BC") {

        provincialRate = 0.08;

    }

    const provincialTax =
        taxableIncome * provincialRate;



    // Self employed adjustment

    let extraAdjustment = 0;

    if (employmentType === "self-employed") {

        extraAdjustment =
            taxableIncome * 0.02;

    }

    const totalTax =
        federalTax +
        provincialTax +
        extraAdjustment;

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
        formatCurrency(provincialTax);


    document.getElementById("totalTaxResult").textContent =
        formatCurrency(totalTax);


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
