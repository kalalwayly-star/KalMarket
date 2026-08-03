document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("analyzePricingBtn")
        ?.addEventListener("click", analyzePricing);

    document
        .getElementById("resetPricingBtn")
        ?.addEventListener("click", resetPricing);

});

console.log("variableCost:", document.getElementById("variableCost"));
console.log("rentCost:", document.getElementById("rentCost"));
console.log("insuranceCost:", document.getElementById("insuranceCost"));
console.log("utilitiesCost:", document.getElementById("utilitiesCost"));
console.log("payrollCost:", document.getElementById("payrollCost"));
console.log("marketingCost:", document.getElementById("marketingCost"));
console.log("otherFixedCost:", document.getElementById("otherFixedCost"));

function analyzePricing() {

    const variableCost =
        Number(document.getElementById("variableCost").value) || 0;

    const fixedCosts =
        getFixedCosts();

    const prices = [
        Number(document.getElementById("price1").value) || 0,
        Number(document.getElementById("price2").value) || 0,
        Number(document.getElementById("price3").value) || 0,
        Number(document.getElementById("price4").value) || 0,
        Number(document.getElementById("price5").value) || 0,
        Number(document.getElementById("price6").value) || 0,
        Number(document.getElementById("price7").value) || 0
    ];

    const salesVolumes = [
        Number(document.getElementById("sales1").value) || 0,
        Number(document.getElementById("sales2").value) || 0,
        Number(document.getElementById("sales3").value) || 0,
        Number(document.getElementById("sales4").value) || 0,
         Number(document.getElementById("sales5").value) || 0,
         Number(document.getElementById("sales6").value) || 0,
         Number(document.getElementById("sales7").value) || 0
    ];

    let results = [];

    let bestStrategy = null;

    prices.forEach(price => {

        salesVolumes.forEach(sales => {

            const revenue =
                price * sales;

            const variableTotal =
                variableCost * sales;

            const totalCost =
                variableTotal + fixedCosts;

            const profit =
                revenue - totalCost;

            const margin =
                revenue > 0
                ? (profit / revenue) * 100
                : 0;

            const result = {

                price,
                sales,
                revenue,
                totalCost,
                profit,
                margin

            };

            results.push(result);

            if (!bestStrategy || profit > bestStrategy.profit) {

                bestStrategy = result;

            }
        });
    });

    displayPricingResults(
        results,
        bestStrategy
    );
}

function getFixedCosts() {

    return (

        Number(document.getElementById("rentCost").value) || 0

        +

        Number(document.getElementById("insuranceCost").value) || 0

        +

        Number(document.getElementById("utilitiesCost").value) || 0

        +

        Number(document.getElementById("payrollCost").value) || 0

        +

        Number(document.getElementById("marketingCost").value) || 0

        +

        Number(document.getElementById("otherFixedCost").value) || 0
    );
}

function displayPricingResults(results, bestStrategy) {

    let html = `

    <div class="best-strategy">

        <h3>
        ⭐ ${window.translations?.best_strategy || "Best Strategy"}
        </h3>

        <p>
        ${window.translations?.selling_price || "Selling Price"}:
        ${formatCurrency(bestStrategy.price)}
        </p>

        <p>
        ${window.translations?.monthly_sales || "Monthly Sales"}:
        ${bestStrategy.sales}
        </p>

        <p>
        ${window.translations?.monthly_profit || "Monthly Profit"}:
        ${formatCurrency(bestStrategy.profit)}
        </p>

        <p>
        ${window.translations?.profit_margin || "Profit Margin"}:
        ${bestStrategy.margin.toFixed(1)}%
        </p>

    </div>
    <h3>
    📊 ${window.translations?.comparison || "Comparison"}
    </h3>


    <table class="pricing-table">

    <tr>

        <th>Price</th>
        <th>Sales</th>
        <th>Revenue</th>
        <th>Cost</th>
        <th>Profit</th>

    </tr>

    `;

   results.forEach(item => {

    const isBest =
        item.price === bestStrategy.price &&
        item.sales === bestStrategy.sales &&
        item.profit === bestStrategy.profit;


    html += `

    <tr class="${isBest ? 'best-row' : ''}">

        <td>
            ${isBest ? "⭐ Best Choice<br>" : ""}
            ${formatCurrency(item.price)}
        </td>

        <td>${item.sales}</td>

        <td>${formatCurrency(item.revenue)}</td>

        <td>${formatCurrency(item.totalCost)}</td>

        <td class="${item.profit < 0 ? 'negative-profit' : 'positive-profit'}">
            ${formatCurrency(item.profit)}
        </td>

    </tr>

    `;

});

    html += `</table>`;

    document.getElementById("pricingResults").innerHTML =
        html;
    generatePricingRecommendation(bestStrategy);
    calculateBreakEven(bestStrategy);
}

function resetPricing() {

    document
    .querySelectorAll(".calculator-card input")
    .forEach(input => {

        input.value = "";
    });

    document.getElementById("pricingResults").innerHTML = "";

}

function formatCurrency(amount) {

    return amount.toLocaleString("en-CA", {

        style: "currency",

        currency: "CAD"

    });

}
function generatePricingRecommendation(bestStrategy) {

    let recommendation = "";

    const averagePrice =
        (
            bestStrategy.price +
            bestStrategy.price
        ) / 2;

    if (bestStrategy.price <= averagePrice) {

        recommendation = `
        <div class="strategy-box">

            <h4>
            🟢 Volume Strategy
            </h4>

            <p>
            Your best result comes from a competitive price.
            Focus on selling more units and attracting more customers.
            </p>

        </div>
        `;
    } 
    else {

        recommendation = `
        <div class="strategy-box">

            <h4>
            🔵 Premium Strategy
            </h4>

            <p>
            Your best result comes from a higher price.
            Focus on quality, customer value, and service experience.
            </p>

        </div>
        `;
    }
    document.getElementById("pricingRecommendation").innerHTML =
        recommendation;
}
function calculateBreakEven(bestStrategy) {

    const fixedCosts = getFixedCosts();

    const contribution =
        bestStrategy.price -
        (
            Number(document.getElementById("variableCost").value) || 0
        );

    if (contribution <= 0) {

        document.getElementById("breakEvenResults").innerHTML = `

        <div class="strategy-box">

            <h4>
            ⚠️ Cannot Calculate Break-Even
            </h4>

            <p>
            Your selling price must be higher than your product cost.
            </p>

        </div>

        `;

        return;
    }

    const breakEvenUnits =
        Math.ceil(
            fixedCosts / contribution
        );

    const breakEvenRevenue =
        breakEvenUnits *
        bestStrategy.price;

    document.getElementById("breakEvenResults").innerHTML = `

    <div class="strategy-box">

        <h4>
        📉 Break-Even Point
        </h4>

        <p>
        <strong>
        Units Needed:
        </strong>

        ${breakEvenUnits}
        units/month

        </p>

        <p>
        <strong>
        Revenue Needed:
        </strong>

        ${formatCurrency(breakEvenRevenue)}

        </p>

    </div>

    `;
}
