document.addEventListener("DOMContentLoaded", function () {

    const pricingOptions =
        document.getElementById("pricingOptions");

    const addOptionButton =
        document.getElementById("addOptionButton");

    const calculateButton =
        document.getElementById("calculateButton");

    const resultsSection =
        document.getElementById("resultsSection");

    const resultsBody =
        document.getElementById("resultsBody");

    const salesUnit =
        document.getElementById("salesUnit");

    const customUnit =
        document.getElementById("customUnit");

    const customUnitContainer =
        document.getElementById("customUnitContainer");

    const costUnitLabel =
        document.getElementById("costUnitLabel");

    const variableUnitLabel =
        document.getElementById("variableUnitLabel");

    const salesHeader =
        document.getElementById("salesHeader");


    let optionNumber = 0;


    // ==========================================
    // MONEY
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
    // UNIT NAME
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


    function getPluralUnit() {

        const unit = getUnitName();

        const irregular = {

            Hour: "Hours",
            Job: "Jobs",
            Appointment: "Appointments",
            Project: "Projects",
            Client: "Clients"

        };

        return irregular[unit] || unit + "s";

    }


    // ==========================================
    // UPDATE LABELS
    // ==========================================

    function updateLabels() {

        const unit = getUnitName();

        costUnitLabel.textContent = unit;

        variableUnitLabel.textContent = unit;

        salesHeader.textContent =
            `${getPluralUnit()} Sold`;

    }


    // ==========================================
    // ADD PRICING OPTION
    // ==========================================

    function addOption() {

        if (optionNumber >= 10) {

            alert("You can compare up to 10 pricing options.");

            return;

        }


        optionNumber++;


        const optionLetter =
            String.fromCharCode(64 + optionNumber);


        const row =
            document.createElement("div");


        row.className = "pricing-option";


        row.dataset.option =
            optionNumber;


        row.innerHTML = `

            <div class="option-label">

                <strong>
                    Option ${optionLetter}
                </strong>

            </div>


            <div class="option-input">

                <label>
                    Selling Price
                </label>

                <div class="money-input">

                    <span>$</span>

                    <input
                        type="number"
                        class="option-price"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                    >

                </div>

            </div>


            <div class="option-input">

                <label>
                    Expected
                    <span class="option-unit">
                        ${getPluralUnit()}
                    </span>
                </label>

                <input
                    type="number"
                    class="option-sales"
                    min="0"
                    step="0.01"
                    placeholder="0"
                >

            </div>


            <button
                type="button"
                class="remove-option"
                aria-label="Remove option"
            >
                ×
            </button>

        `;


        pricingOptions.appendChild(row);


        row.querySelector(".remove-option")
            .addEventListener("click", function () {

                row.remove();

                renumberOptions();

            });

    }


    // ==========================================
    // RENUMBER OPTIONS
    // ==========================================

    function renumberOptions() {

        const options =
            document.querySelectorAll(
                ".pricing-option"
            );


        optionNumber = options.length;


        options.forEach(function (option, index) {

            const letter =
                String.fromCharCode(65 + index);


            option.querySelector(
                ".option-label strong"
            ).textContent =
                `Option ${letter}`;

        });

    }


    // ==========================================
    // CALCULATE
    // ==========================================

    function calculate() {

        const costPerUnit =
            parseFloat(
                document.getElementById(
                    "costPerUnit"
                ).value
            ) || 0;


        const variableCost =
            parseFloat(
                document.getElementById(
                    "variableCost"
                ).value
            ) || 0;


        const fixedExpenses =
            parseFloat(
                document.getElementById(
                    "fixedExpenses"
                ).value
            ) || 0;


        const options =
            document.querySelectorAll(
                ".pricing-option"
            );


        resultsBody.innerHTML = "";


        const results = [];


        options.forEach(function (option, index) {

            const price =
                parseFloat(
                    option.querySelector(
                        ".option-price"
                    ).value
                ) || 0;


            const sales =
                parseFloat(
                    option.querySelector(
                        ".option-sales"
                    ).value
                ) || 0;


            if (price <= 0 || sales <= 0) {
                return;
            }


            const revenue =
                price * sales;


            const variableExpenses =
                (costPerUnit + variableCost) * sales;


            const totalExpenses =
                variableExpenses + fixedExpenses;


            const netProfit =
                revenue - totalExpenses;


            const profitMargin =
                revenue > 0
                    ? (netProfit / revenue) * 100
                    : 0;


            results.push({

                option:
                    String.fromCharCode(
                        65 + index
                    ),

                price,
                sales,
                revenue,
                variableExpenses,
                fixedExpenses,
                totalExpenses,
                netProfit,
                profitMargin

            });

        });


        if (results.length === 0) {

            alert(
                "Please enter at least one complete pricing option."
            );

            return;

        }


        // ======================================
        // CREATE RESULTS TABLE
        // ======================================

        results.forEach(function (result) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        ${result.option}
                    </strong>
                </td>

                <td>
                    ${money(result.price)}
                </td>

                <td>
                    ${result.sales}
                </td>

                <td>
                    ${money(result.revenue)}
                </td>

                <td>
                    ${money(result.variableExpenses)}
                </td>

                <td>
                    ${money(result.fixedExpenses)}
                </td>

                <td>
                    ${money(result.totalExpenses)}
                </td>

                <td class="${
                    result.netProfit >= 0
                        ? "positive-profit"
                        : "negative-profit"
                }">

                    <strong>
                        ${money(result.netProfit)}
                    </strong>

                </td>

                <td>
                    ${result.profitMargin.toFixed(1)}%
                </td>

            `;


            resultsBody.appendChild(row);

        });


        // ======================================
        // BEST OPTIONS
        // ======================================

        const highestRevenue =
            [...results].sort(
                (a, b) =>
                    b.revenue - a.revenue
            )[0];


        const highestProfit =
            [...results].sort(
                (a, b) =>
                    b.netProfit - a.netProfit
            )[0];


        const bestMargin =
            [...results].sort(
                (a, b) =>
                    b.profitMargin -
                    a.profitMargin
            )[0];


        document.getElementById(
            "highestRevenue"
        ).textContent =
            money(highestRevenue.revenue);


        document.getElementById(
            "highestRevenueDetails"
        ).textContent =
            `Option ${highestRevenue.option}`;


        document.getElementById(
            "highestProfit"
        ).textContent =
            money(highestProfit.netProfit);


        document.getElementById(
            "highestProfitDetails"
        ).textContent =
            `Option ${highestProfit.option}`;


        document.getElementById(
            "bestMargin"
        ).textContent =
            `${bestMargin.profitMargin.toFixed(1)}%`;


        document.getElementById(
            "bestMarginDetails"
        ).textContent =
            `Option ${bestMargin.option}`;


        resultsSection.classList.remove(
            "hidden"
        );


        resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    // ==========================================
    // EVENTS
    // ==========================================

    addOptionButton.addEventListener(
        "click",
        addOption
    );


    calculateButton.addEventListener(
        "click",
        calculate
    );


    salesUnit.addEventListener(
        "change",
        function () {

            if (this.value === "custom") {

                customUnitContainer
                    .classList
                    .remove("hidden");

            } else {

                customUnitContainer
                    .classList
                    .add("hidden");

                customUnit.value = "";

            }


            updateLabels();


            document
                .querySelectorAll(".option-unit")
                .forEach(function (element) {

                    element.textContent =
                        getPluralUnit();

                });

        }
    );


    customUnit.addEventListener(
        "input",
        function () {

            updateLabels();

            document
                .querySelectorAll(".option-unit")
                .forEach(function (element) {

                    element.textContent =
                        getPluralUnit();

                });

        }
    );


    // ==========================================
    // INITIAL OPTIONS
    // ==========================================

    addOption();
    addOption();
    addOption();

    updateLabels();

});
