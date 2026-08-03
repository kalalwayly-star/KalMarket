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

updateInventoryHealth(
    currentStock,
    reorderPoint,
    daysRemaining,
    inventoryValue
);

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

const cashLocked =
    inventoryValue;


const stockCoverage =
    daysRemaining;


const inventoryTurnover =
    currentStock > 0
        ? monthlySales / currentStock
        : 0;


const nextOrderDate = new Date();

nextOrderDate.setDate(

    nextOrderDate.getDate() +

    Math.max(0, Math.floor(daysRemaining - deliveryDays))

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
document.getElementById("cashLockedResult").textContent =
    formatCurrency(cashLocked);

document.getElementById("stockCoverageResult").textContent =
    stockCoverage.toFixed(1) + " Days";

document.getElementById("turnoverResult").textContent =
    inventoryTurnover.toFixed(2);

document.getElementById("nextOrderDateResult").textContent =
    nextOrderDate.toLocaleDateString();

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

function updateInventoryHealth(
    currentStock,
    reorderPoint,
    daysRemaining,
    inventoryValue
) {

    let html = "";

    if (currentStock <= reorderPoint) {

        html = `
        <div class="strategy-box warning">

            <h4>🟠 Inventory Needs Attention</h4>

            <p>
            Your inventory has reached the reorder point.
            Place a new order soon to avoid running out of stock.
            </p>

        </div>`;

    }
    else if (daysRemaining < 14) {

        html = `
        <div class="strategy-box warning">

            <h4>🟡 Inventory Running Low</h4>

            <p>
            You have less than two weeks of inventory remaining.
            Plan your next purchase soon.
            </p>

        </div>`;

    }
    else if (inventoryValue > 10000) {

        html = `
        <div class="strategy-box">

            <h4>🔵 High Inventory Investment</h4>

            <p>
            A large amount of cash is tied up in inventory.
            Review whether your stock level is higher than necessary.
            </p>

        </div>`;

    }
    else {

        html = `
        <div class="strategy-box success">

            <h4>🟢 Excellent Inventory Health</h4>

            <p>
            Your inventory level is balanced and your reorder timing looks healthy.
            </p>

        </div>`;

    }

document.getElementById("inventoryHealth").innerHTML = `
<p data-i18n="inventory_health_placeholder">
Your inventory health will appear here.
</p>`;
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
