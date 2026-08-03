document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("calculateInventoryBtn")
        ?.addEventListener("click", calculateInventory);

    document
        .getElementById("resetInventoryBtn")
        ?.addEventListener("click", resetInventory);

});


function calculateInventory() {

    // Product Information

    const unitCost =
        Number(document.getElementById("unitCost").value) || 0;

    const sellingPrice =
        Number(document.getElementById("sellingPrice").value) || 0;


    // Sales Information

    const monthlySales =
        Number(document.getElementById("monthlySales").value) || 0;

    const deliveryDays =
        Number(document.getElementById("deliveryDays").value) || 0;


    // Inventory Settings

    const currentStock =
        Number(document.getElementById("currentStock").value) || 0;

    const safetyStock =
        Number(document.getElementById("safetyStock").value) || 0;



    // =============================
    // Calculations
    // =============================

    const dailySales =
        monthlySales / 30;

    const reorderPoint =
        (dailySales * deliveryDays) + safetyStock;

    const daysRemaining =
        dailySales > 0
            ? currentStock / dailySales
            : 0;

    const inventoryValue =
        currentStock * unitCost;

    const profitPerUnit =
        sellingPrice - unitCost;

    const suggestedOrder =
        Math.max(
            0,
            Math.ceil(monthlySales - currentStock + safetyStock)
        );



    // =============================
    // Display Results
    // =============================

    document.getElementById("dailySalesResult").textContent =
        dailySales.toFixed(1);

    document.getElementById("reorderPointResult").textContent =
        Math.ceil(reorderPoint);

    document.getElementById("daysRemainingResult").textContent =
        daysRemaining.toFixed(1);

    document.getElementById("inventoryValueResult").textContent =
        formatCurrency(inventoryValue);

    document.getElementById("profitPerUnitResult").textContent =
        formatCurrency(profitPerUnit);

    document.getElementById("suggestedOrderResult").textContent =
        suggestedOrder;



    generateInventoryRecommendation(
        currentStock,
        reorderPoint,
        daysRemaining,
        inventoryValue
    );

}



function generateInventoryRecommendation(
    currentStock,
    reorderPoint,
    daysRemaining,
    inventoryValue
) {

    let html = "";



    if (currentStock <= reorderPoint) {

        html += `
        <div class="strategy-box">

            <h4>
            🟠 Reorder Soon
            </h4>

            <p>
            Your inventory has reached the reorder point.
            Consider placing a new order now.
            </p>

        </div>
        `;

    }
    else {

        html += `
        <div class="strategy-box">

            <h4>
            🟢 Healthy Inventory
            </h4>

            <p>
            Your inventory level is currently healthy.
            </p>

        </div>
        `;

    }



    if (daysRemaining < 7) {

        html += `
        <div class="strategy-box">

            <h4>
            🔴 Low Stock Warning
            </h4>

            <p>
            Your inventory may run out within one week.
            </p>

        </div>
        `;

    }



    if (inventoryValue > 10000) {

        html += `
        <div class="strategy-box">

            <h4>
            💰 High Inventory Investment
            </h4>

            <p>
            A large amount of cash is tied up in inventory.
            Review your purchasing strategy.
            </p>

        </div>
        `;

    }



    document.getElementById("inventoryRecommendation").innerHTML =
        html;

}



function resetInventory() {

    document
        .querySelectorAll(".calculator-card input")
        .forEach(input => {

            if (input.type === "text") {

                input.value = "";

            }
            else {

                input.value = "";

            }

        });



    document.getElementById("dailySalesResult").textContent = "0";

    document.getElementById("reorderPointResult").textContent = "0";

    document.getElementById("daysRemainingResult").textContent = "0";

    document.getElementById("inventoryValueResult").textContent =
        formatCurrency(0);

    document.getElementById("profitPerUnitResult").textContent =
        formatCurrency(0);

    document.getElementById("suggestedOrderResult").textContent = "0";



    document.getElementById("inventoryRecommendation").innerHTML = "";

}



function formatCurrency(amount) {

    return amount.toLocaleString("en-CA", {

        style: "currency",

        currency: "CAD"

    });

}
