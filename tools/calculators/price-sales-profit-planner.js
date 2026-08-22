document.addEventListener("DOMContentLoaded", function () {

    const scenarioBody = document.getElementById("scenarioBody");

    const fixedExpensesInput =
        document.getElementById("fixedExpenses");

    const variableCostInput =
        document.getElementById("variableCost");

    const totalMonthlyExpenses =
        document.getElementById("totalMonthlyExpenses");

    const salesUnit =
        document.getElementById("salesUnit");

    const customUnitContainer =
        document.getElementById("customUnitContainer");

    const customUnit =
        document.getElementById("customUnit");


    // ==========================================
    // CREATE 10 SCENARIO ROWS
    // ==========================================

    for (let i = 1; i <= 10; i++) {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td class="scenario-number">
                ${i}
            </td>

            <td>
                <input
                    type="number"
                    class="scenario-price"
                    data-scenario="${i}"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                >
            </td>

            <td>
                <input
                    type="number"
                    class="scenario-quantity"
                    data-scenario="${i}"
                    min="0"
                    step="0.01"
                    placeholder="0"
                >
            </td>

            <td class="scenario-revenue"
                id="revenue-${i}">
                —
            </td>

            <td class="scenario-expenses"
                id="expenses-${i}">
                —
            </td>

            <td class="scenario-profit"
                id="profit-${i}">
                —
            </td>

            <td class="scenario-margin"
                id="margin-${i}">
                —
            </td>

        `;

        scenarioBody.appendChild(row);
    }


    // ==========================================
    // CUSTOM SALES UNIT
    // ==========================================

    salesUnit.addEventListener("change", function () {

        if (this.value === "custom") {

            customUnitContainer.classList.remove("hidden");

        } else {

            customUnitContainer.classList.add("hidden");

            customUnit.value = "";
        }

        updateUnitLabels();
        calculate();
    });


    // ==========================================
    // UPDATE UNIT LABEL
    // ==========================================

    function updateUnitLabels() {

        let unitName = getUnitName();

        document.querySelectorAll(".scenario-quantity")
            .forEach(input => {

                input.placeholder = `Desired ${unitName}`;

            });
    }


    function getUnitName() {

        if (salesUnit.value === "custom") {

            return customUnit.value.trim() || "Units";

        }

        const names = {

            unit: "Units",
            hour: "Hours",
            job: "Jobs",
            appointment: "Appointments",
            project: "Projects",
            client: "Clients"

        };

        return names[salesUnit.value] || "Units";
    }


    customUnit.addEventListener("input", function () {

        updateUnitLabels();

    });


    // ==========================================
    // FORMAT MONEY
    // ==========================================

    function money(value) {

        return new Intl.NumberFormat("en-CA", {

            style: "currency",
            currency: "CAD",

            minimumFractionDigits: 2,
            maximumFractionDigits: 2

        }).format(value);

    }


    // ==========================================
    // CALCULATE TOTAL MONTHLY EXPENSES
    // ==========================================

    function getFixedExpenses() {

        return parseFloat(fixedExpensesInput.value) || 0;

    }


    function getVariableCost() {

        return parseFloat(variableCostInput.value) || 0;

    }


    function updateExpenseDisplay() {

        const fixed = getFixedExpenses();
        const variable = getVariableCost();

        const total = fixed + variable;

        totalMonthlyExpenses.textContent = money(total);

    }


    // ==========================================
    // MAIN CALCULATION
    // ==========================================

    function calculate() {

        updateExpenseDisplay();

        const fixedExpenses = getFixedExpenses();
        const variableCost = getVariableCost();

        const scenarioResults = [];


        for (let i = 1; i <= 10; i++) {

            const priceInput =
                document.querySelector(
                    `.scenario-price[data-scenario="${i}"]`
                );

            const quantityInput =
                document.querySelector(
                    `.scenario-quantity[data-scenario="${i}"]`
                );


            const price =
                parseFloat(priceInput.value) || 0;

            const quantity =
                parseFloat(quantityInput.value) || 0;


            const revenue = price * quantity;


            /*
             * Variable cost is treated as the monthly
             * variable expense entered by the user.
             *
             * This keeps Version 1 simple.
             */

            const expenses =
                fixedExpenses + variableCost;


            const profit =
                revenue - expenses;


            const margin =
                revenue > 0
                    ? (profit / revenue) * 100
                    : 0;


            // Display results

            const revenueCell =
                document.getElementById(`revenue-${i}`);

            const expensesCell =
                document.getElementById(`expenses-${i}`);

            const profitCell =
                document.getElementById(`profit-${i}`);

            const marginCell =
                document.getElementById(`margin-${i}`);


            if (price > 0 && quantity > 0) {

                revenueCell.textContent =
                    money(revenue);

                expensesCell.textContent =
                    money(expenses);

                profitCell.textContent =
                    money(profit);

                marginCell.textContent =
                    `${margin.toFixed(1)}%`;


                scenarioResults.push({

                    scenario: i,
                    price,
                    quantity,
                    revenue,
                    expenses,
                    profit,
                    margin

                });

            } else {

                revenueCell.textContent = "—";
                expensesCell.textContent = "—";
                profitCell.textContent = "—";
                marginCell.textContent = "—";

            }

        }


        compareScenarios(scenarioResults);

        calculateBreakEven();

    }


    // ==========================================
    // COMPARE SCENARIOS
    // ==========================================

    function compareScenarios(results) {

        const highestRevenue =
            document.getElementById("highestRevenue");

        const highestRevenueDetails =
            document.getElementById("highestRevenueDetails");


        const highestProfit =
            document.getElementById("highestProfit");

        const highestProfitDetails =
            document.getElementById("highestProfitDetails");


        const bestMargin =
            document.getElementById("bestMargin");

        const bestMarginDetails =
            document.getElementById("bestMarginDetails");


        if (results.length === 0) {

            highestRevenue.textContent = "—";
            highestRevenueDetails.textContent =
                "Enter scenarios above";

            highestProfit.textContent = "—";
            highestProfitDetails.textContent =
                "Enter scenarios above";

            bestMargin.textContent = "—";
            bestMarginDetails.textContent =
                "Enter scenarios above";

            return;
        }


        const revenueWinner =
            [...results].sort(
                (a, b) => b.revenue - a.revenue
            )[0];


        const profitWinner =
            [...results].sort(
                (a, b) => b.profit - a.profit
            )[0];


        const marginWinner =
            [...results].sort(
                (a, b) => b.margin - a.margin
            )[0];


        highestRevenue.textContent =
            money(revenueWinner.revenue);

        highestRevenueDetails.textContent =
            `Scenario ${revenueWinner.scenario}`;


        highestProfit.textContent =
            money(profitWinner.profit);

        highestProfitDetails.textContent =
            `Scenario ${profitWinner.scenario}`;


        bestMargin.textContent =
            `${marginWinner.margin.toFixed(1)}%`;

        bestMarginDetails.textContent =
            `Scenario ${marginWinner.scenario}`;

    }


    // ==========================================
    // BREAK-EVEN
    // ==========================================

    function calculateBreakEven() {

        const breakEvenElement =
            document.getElementById("breakEven");


        const fixedExpenses =
            getFixedExpenses();


        const firstScenario =
            document.querySelector(".scenario-price");


        const price =
            parseFloat(firstScenario.value) || 0;


        if (fixedExpenses <= 0) {

            breakEvenElement.textContent =
                "No fixed expenses";

            return;
        }


        if (price <= 0) {

            breakEvenElement.textContent =
                "Enter a price";

            return;
        }


        /*
         * Basic Version 1 break-even:
         *
         * Fixed Expenses ÷ Price
         *
         * This will be improved later when we
         * add true per-unit variable costs.
         */

        const breakEvenUnits =
            fixedExpenses / price;


        breakEvenElement.textContent =
            `${breakEvenUnits.toFixed(1)} ${getUnitName()}`;

    }


    // ==========================================
    // INPUT EVENTS
    // ==========================================

    document.addEventListener("input", function (event) {

        if (

            event.target.matches(
                ".scenario-price, .scenario-quantity"
            )

            ||

            event.target === fixedExpensesInput

            ||

            event.target === variableCostInput

        ) {

            calculate();

        }

    });


    // ==========================================
    // INITIALIZE
    // ==========================================

    updateUnitLabels();
    calculate();

});
