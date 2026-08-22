document.addEventListener("DOMContentLoaded", function () {

    const scenarioBody =
        document.getElementById("scenarioBody");

    const costPerUnit =
        document.getElementById("costPerUnit");

    const salesUnit =
        document.getElementById("salesUnit");

    const customUnitContainer =
        document.getElementById("customUnitContainer");

    const customUnit =
        document.getElementById("customUnit");

    const costUnitLabel =
        document.getElementById("costUnitLabel");

    const salesUnitHeader =
        document.getElementById("salesUnitHeader");

    const profitUnitHeader =
        document.getElementById("profitUnitHeader");


    // ==========================================
    // CREATE 10 OPTIONS
    // ==========================================

    for (let i = 1; i <= 10; i++) {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td class="scenario-number">
                ${String.fromCharCode(64 + i)}
            </td>

            <td>
                <input
                    type="number"
                    class="selling-price"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                >
            </td>

            <td>
                <input
                    type="number"
                    class="expected-sales"
                    min="0"
                    step="0.01"
                    placeholder="0"
                >
            </td>

            <td id="revenue-${i}">
                —
            </td>

            <td id="profit-unit-${i}">
                —
            </td>

            <td id="total-profit-${i}">
                —
            </td>

            <td id="margin-${i}">
                —
            </td>

        `;

        scenarioBody.appendChild(row);
    }


    // ==========================================
    // UNIT NAMES
    // ==========================================

    function getUnitName() {

        if (salesUnit.value === "custom") {

            return customUnit.value.trim() || "Unit";

        }

        const names = {

            unit: "Unit",
            hour: "Hour",
            job: "Job",
            appointment: "Appointment",
            project: "Project",
            client: "Client"

        };

        return names[salesUnit.value] || "Unit";

    }


    function updateUnitLabels() {

        const unit = getUnitName();

        costUnitLabel.textContent = unit;

        salesUnitHeader.textContent =
            unit + "s";

        profitUnitHeader.textContent =
            unit;

    }


    // ==========================================
    // CUSTOM UNIT
    // ==========================================

    salesUnit.addEventListener("change", function () {

        if (this.value === "custom") {

            customUnitContainer.classList.remove("hidden");

        } else {

            customUnitContainer.classList.add("hidden");

            customUnit.value = "";

        }

        updateUnitLabels();

    });


    customUnit.addEventListener("input", function () {

        updateUnitLabels();

    });


    // ==========================================
    // MONEY FORMAT
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
    // CALCULATE
    // ==========================================

    function calculate() {

        const cost =
            parseFloat(costPerUnit.value) || 0;

        const results = [];


        for (let i = 1; i <= 10; i++) {

            const priceInput =
                document.querySelectorAll(
                    ".selling-price"
                )[i - 1];

            const salesInput =
                document.querySelectorAll(
                    ".expected-sales"
                )[i - 1];


            const price =
                parseFloat(priceInput.value) || 0;

            const sales =
                parseFloat(salesInput.value) || 0;


            const revenue =
                price * sales;


            const profitPerUnit =
                price - cost;


            const totalProfit =
                profitPerUnit * sales;


            const margin =
                price > 0
                    ? (profitPerUnit / price) * 100
                    : 0;


            if (price > 0 && sales > 0) {

                document.getElementById(
                    `revenue-${i}`
                ).textContent = money(revenue);


                document.getElementById(
                    `profit-unit-${i}`
                ).textContent =
                    money(profitPerUnit);


                document.getElementById(
                    `total-profit-${i}`
                ).textContent =
                    money(totalProfit);


                document.getElementById(
                    `margin-${i}`
                ).textContent =
                    `${margin.toFixed(1)}%`;


                results.push({

                    option: String.fromCharCode(64 + i),

                    price,
                    sales,
                    revenue,
                    profitPerUnit,
                    totalProfit,
                    margin

                });

            } else {

                document.getElementById(
                    `revenue-${i}`
                ).textContent = "—";


                document.getElementById(
                    `profit-unit-${i}`
                ).textContent = "—";


                document.getElementById(
                    `total-profit-${i}`
                ).textContent = "—";


                document.getElementById(
                    `margin-${i}`
                ).textContent = "—";

            }

        }


        compareResults(results);

    }


    // ==========================================
    // COMPARE RESULTS
    // ==========================================

    function compareResults(results) {

        const revenueElement =
            document.getElementById("highestRevenue");

        const revenueDetails =
            document.getElementById(
                "highestRevenueDetails"
            );


        const profitElement =
            document.getElementById("highestProfit");

        const profitDetails =
            document.getElementById(
                "highestProfitDetails"
            );


        const marginElement =
            document.getElementById("bestMargin");

        const marginDetails =
            document.getElementById(
                "bestMarginDetails"
            );


        if (results.length === 0) {

            revenueElement.textContent = "—";
            revenueDetails.textContent =
                "Enter pricing options";

            profitElement.textContent = "—";
            profitDetails.textContent =
                "Enter pricing options";

            marginElement.textContent = "—";
            marginDetails.textContent =
                "Enter pricing options";

            return;

        }


        const highestRevenue =
            [...results].sort(
                (a, b) => b.revenue - a.revenue
            )[0];


        const highestProfit =
            [...results].sort(
                (a, b) => b.totalProfit - a.totalProfit
            )[0];


        const bestMargin =
            [...results].sort(
                (a, b) => b.margin - a.margin
            )[0];


        revenueElement.textContent =
            money(highestRevenue.revenue);

        revenueDetails.textContent =
            `Option ${highestRevenue.option}`;


        profitElement.textContent =
            money(highestProfit.totalProfit);

        profitDetails.textContent =
            `Option ${highestProfit.option}`;


        marginElement.textContent =
            `${bestMargin.margin.toFixed(1)}%`;

        marginDetails.textContent =
            `Option ${bestMargin.option}`;

    }


    // ==========================================
    // INPUT EVENTS
    // ==========================================

    document.addEventListener("input", function (event) {

        if (

            event.target.matches(
                ".selling-price, .expected-sales"
            )

            ||

            event.target === costPerUnit

        ) {

            calculate();

        }

    });


    // ==========================================
    // START
    // ==========================================

    updateUnitLabels();

    calculate();

});
