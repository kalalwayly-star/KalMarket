document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("calculateStartupBtn")
        .addEventListener("click", calculateStartupCost);


    document
        .getElementById("resetStartupBtn")
        .addEventListener("click", resetStartupCost);

});

function calculateStartupCost() {


    // Business Setup
    const registration =
        Number(document.getElementById("registrationCost").value) || 0;

    const license =
        Number(document.getElementById("licenseCost").value) || 0;

    const legal =
        Number(document.getElementById("legalCost").value) || 0;

    const branding =
        Number(document.getElementById("brandingCost").value) || 0;



    // Location
    const deposit =
        Number(document.getElementById("depositCost").value) || 0;

    const rent =
        Number(document.getElementById("rentCost").value) || 0;

    const renovation =
        Number(document.getElementById("renovationCost").value) || 0;

    const sign =
        Number(document.getElementById("signCost").value) || 0;



    // Equipment
    const equipment =
        Number(document.getElementById("equipmentCost").value) || 0;

    const computer =
        Number(document.getElementById("computerCost").value) || 0;

    const furniture =
        Number(document.getElementById("furnitureCost").value) || 0;



    // Inventory
    const inventory =
        Number(document.getElementById("inventoryCost").value) || 0;

    const materials =
        Number(document.getElementById("materialsCost").value) || 0;



    // Reserve
    const reserve =
        Number(document.getElementById("reserveCost").value) || 0;



    const setupTotal =
        registration +
        license +
        legal +
        branding +
        deposit +
        rent +
        renovation +
        sign;



    const equipmentTotal =
        equipment +
        computer +
        furniture;



    const inventoryTotal =
        inventory +
        materials;



    const startupTotal =
        setupTotal +
        equipmentTotal +
        inventoryTotal +
        reserve;



    document.getElementById("setupTotal").textContent =
        formatCurrency(setupTotal);
generateStartupRecommendations(
    setupTotal,
    equipmentTotal,
    inventoryTotal,
    reserve,
    startupTotal
);

    document.getElementById("equipmentTotal").textContent =
        formatCurrency(equipmentTotal);


    document.getElementById("inventoryTotal").textContent =
        formatCurrency(inventoryTotal);


    document.getElementById("startupTotal").textContent =
        formatCurrency(startupTotal);

const fundingOption =
    Number(document.getElementById("fundingOption").value) || 30;


const personalInvestment =
    startupTotal * (fundingOption / 100);


const businessLoan =
    startupTotal * ((100 - fundingOption) / 100);

    document.getElementById("personalInvestment").textContent =
    formatCurrency(personalInvestment);

document.getElementById("businessLoan").textContent =
    formatCurrency(businessLoan);

const recommendedReserve = startupTotal * 0.10;
    

document.getElementById("personalInvestmentPercent").textContent =
    fundingOption;


document.getElementById("businessLoanPercent").textContent =
    100 - fundingOption;

document.getElementById("recommendedReserve").textContent =
    formatCurrency(recommendedReserve);
    calculateReadinessScore(
    startupTotal,
    reserve,
    equipmentTotal,
    inventoryTotal
);

    document.getElementById("startupResults").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

function resetStartupCost() {


    document.querySelectorAll(
        ".calculator-card input"
    ).forEach(input => {

        input.value = "";

    });


    document.getElementById("setupTotal").textContent =
        formatCurrency(0);


    document.getElementById("equipmentTotal").textContent =
        formatCurrency(0);


    document.getElementById("inventoryTotal").textContent =
        formatCurrency(0);


    document.getElementById("startupTotal").textContent =
        formatCurrency(0);
}

function formatCurrency(amount) {

    return amount.toLocaleString("en-CA", {

        style: "currency",

        currency: "CAD"
    });
}

function generateStartupRecommendations(
    setupTotal,
    equipmentTotal,
    inventoryTotal,
    reserve,
    startupTotal
) {

    const recommendations = [];
    const actionPlan = [];


    if (equipmentTotal > startupTotal * 0.40) {

        recommendations.push(
            "🛠 Equipment is your biggest investment. Consider buying used equipment or starting with essential items only."
        );

    }


    if (inventoryTotal > startupTotal * 0.35) {

        recommendations.push(
    translations["inventory_high"]
);

actionPlan.push(
    translations["action_reduce_inventory"]
);

    }


    if (reserve < startupTotal * 0.10) {

        recommendations.push(
    translations["reserve_low"]
);

actionPlan.push(
    translations["action_increase_reserve"]
);

    }


    if (startupTotal < 10000) {

       recommendations.push(
    translations["startup_moderate"]
);

actionPlan.push(
    translations["action_cashflow_plan"]
);

    }


    if (startupTotal >= 10000 && startupTotal < 50000) {

        recommendations.push(
    translations["startup_high"]
);

actionPlan.push(
    translations["action_review_expenses"]
);
    }

    if (startupTotal >= 50000) {

        recommendations.push(
    translations["startup_high"]
);

actionPlan.push(
    translations["action_review_expenses"]
);
    }

    if (recommendations.length === 0) {

        recommendations.push(
            "✅ Your startup budget appears balanced."
        );
    }

    document.getElementById("startupRecommendations").innerHTML =

    recommendations
        .map(item =>
            `<div class="recommendation-item">${item}</div>`
        )
        .join("")

    +

    (actionPlan.length > 0
        ? `
        <hr>

        <h4 data-i18n="priority_action_plan">
            ⚠️ Priority Action Plan
        </h4>

        <ol class="action-plan">

            ${actionPlan
                .map(item => `<li>${item}</li>`)
                .join("")}

        </ol>
        `
        : "");
}
 function calculateReadinessScore(
    startupTotal,
    reserve,
    equipmentTotal,
    inventoryTotal
) {

    let score = 100;


    // Emergency reserve check
    if (reserve < startupTotal * 0.10) {
        score -= 20;
    }


    // Equipment cost check
    if (equipmentTotal > startupTotal * 0.40) {
        score -= 15;
    }


    // Inventory check
    if (inventoryTotal > startupTotal * 0.35) {
        score -= 15;
    }


    // Very high startup cost
    // Startup size
if (startupTotal >= 50000) {
    score -= 20;
}
else if (startupTotal >= 10000) {
    score -= 10;
}


    if (score < 0) {
        score = 0;
    }


    let message;


    if (score >= 80) {

        message =
        "🟢 Excellent. Your startup plan appears well prepared.";

    }
    else if (score >= 60) {

        message =
        "🟡 Good. Your plan is reasonable but can be improved.";

    }
    else if (score >= 40) {

        message =
        "🟠 Needs attention. Review your startup expenses.";

    }
    else {

        message =
        "🔴 High risk. Reduce costs and improve your funding plan.";

    }


    document.getElementById("readinessScore").textContent =
        score + " / 100";


    document.getElementById("readinessMessage").textContent =
        message;

}   
