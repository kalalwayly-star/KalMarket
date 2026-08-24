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
    // TRANSLATION HELPER
    // ==========================================

    function t(key, fallback) {

        const element =
            document.querySelector(
                `[data-i18n="${key}"]`
            );

        if (element) {

            const text =
                element.textContent.trim();

            if (text) {
                return text;
            }

        }

        return fallback;
    }


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

            return customUnit.value.trim()
                || t("unit", "Unit");

        }


        const keys = {

            unit: "unit",
            hour: "hour",
            job: "job",
            appointment: "appointment",
            project: "project",
            client: "client"

        };


        const key =
            keys[salesUnit.value] || "unit";


        return t(
            key,
            "Unit"
        );

    }


    // ==========================================
    // PLURAL UNIT
    // ==========================================

    function getPluralUnit() {

        const value =
            salesUnit.value;


        const translated = {

            unit: t("unit", "Unit"),
            hour: t("hour", "Hour"),
            job: t("job", "Job"),
            appointment: t(
                "appointment",
                "Appointment"
            ),
            project: t(
                "project",
                "Project"
            ),
            client: t(
                "client",
                "Client"
            )

        };


        const pluralTranslations = {

            unit: {
                en: "Units",
                fr: "Unités",
                ar: "وحدات"
            },

            hour: {
                en: "Hours",
                fr: "Heures",
                ar: "ساعات"
            },

            job: {
                en: "Jobs",
                fr: "Travaux",
                ar: "أعمال"
            },

            appointment: {
                en: "Appointments",
                fr: "Rendez-vous",
                ar: "مواعيد"
            },

            project: {
                en: "Projects",
                fr: "Projets",
                ar: "مشاريع"
            },

            client: {
                en: "Clients",
                fr: "Clients",
                ar: "عملاء"
            }

        };


        /*
         * Try to detect the current language.
         * Your languages.js normally sets <html lang="">.
         */

        const language =
            document.documentElement
                .lang
                .toLowerCase()
                .substring(0, 2);


        if (
            pluralTranslations[value] &&
            pluralTranslations[value][language]
        ) {

            return pluralTranslations[value][language];

        }


        // Custom unit

        if (value === "custom") {

            const custom =
                customUnit.value.trim();

            if (custom) {
                return custom;
            }

        }


        // English fallback

        const englishPlural = {

            Unit: "Units",
            Hour: "Hours",
            Job: "Jobs",
            Appointment: "Appointments",
            Project: "Projects",
            Client: "Clients"

        };


        return englishPlural[
            translated[value]
        ] || translated[value] + "s";

    }


    // ==========================================
    // UPDATE LABELS
    // ==========================================

    function updateLabels() {

        const unit =
            getUnitName();


        costUnitLabel.textContent =
            unit;


        variableUnitLabel.textContent =
            unit;


        salesHeader.textContent =
            getPluralUnit() +
            " " +
            t("sold", "Sold");

    }


    // ==========================================
    // ADD PRICING OPTION
    // ==========================================

    function addOption() {

        if (optionNumber >= 10) {

            alert(
                "You can compare up to 10 pricing options."
            );

            return;

        }


        optionNumber++;


        const optionLetter =
            String.fromCharCode(
                64 + optionNumber
            );


        const row =
            document.createElement("div");


        row.className =
            "pricing-option";


        row.dataset.option =
            optionNumber;


        row.innerHTML = `

            <div class="option-label">

                <strong>
                    ${t("option", "Option")}
                    ${optionLetter}
                </strong>

            </div>


            <div class="option-input">

                <label>
                    ${t(
                        "selling_price",
                        "Selling Price"
                    )}
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
                    ${t(
                        "expected",
                        "Expected"
                    )}

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


        row.querySelector(
            ".remove-option"
        ).addEventListener(
            "click",
            function () {

                row.remove();

                renumberOptions();

            }
        );

    }


    // ==========================================
    // RENUMBER OPTIONS
    // ==========================================

    function renumberOptions() {

        const options =
            document.querySelectorAll(
                ".pricing-option"
            );


        optionNumber =
            options.length;


        options.forEach(
            function (option, index) {

                const letter =
                    String.fromCharCode(
                        65 + index
                    );


                option.querySelector(
                    ".option-label strong"
                ).textContent =
                    `${t(
                        "option",
                        "Option"
                    )} ${letter}`;

            }
        );

    }


    // ==========================================
    // UPDATE DYNAMIC TRANSLATIONS
    // ==========================================

    function refreshDynamicTranslations() {

        const optionRows =
            document.querySelectorAll(
                ".pricing-option"
            );


        optionRows.forEach(
            function (row, index) {

                const letter =
                    String.fromCharCode(
                        65 + index
                    );


                const optionLabel =
                    row.querySelector(
                        ".option-label strong"
                    );


                if (optionLabel) {

                    optionLabel.textContent =
                        `${t(
                            "option",
                            "Option"
                        )} ${letter}`;

                }


                const sellingLabel =
                    row.querySelector(
                        ".option-input:nth-child(2) label"
                    );


                if (sellingLabel) {

                    sellingLabel.textContent =
                        t(
                            "selling_price",
                            "Selling Price"
                        );

                }


                const expectedLabel =
                    row.querySelector(
                        ".option-input:nth-child(3) label"
                    );


                if (expectedLabel) {

                    expectedLabel.innerHTML =
                        `${t(
                            "expected",
                            "Expected"
                        )}

                        <span class="option-unit">
                            ${getPluralUnit()}
                        </span>`;

                }

            }
        );


        updateLabels();

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


        resultsBody.innerHTML =
            "";


        const results = [];


        options.forEach(
            function (option, index) {

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


                if (
                    price <= 0 ||
                    sales <= 0
                ) {

                    return;

                }


                const revenue =
                    price * sales;


                const variableExpenses =
                    (
                        costPerUnit +
                        variableCost
                    ) * sales;


                const totalExpenses =
                    variableExpenses +
                    fixedExpenses;


                const netProfit =
                    revenue -
                    totalExpenses;


                const profitMargin =
                    revenue > 0
                        ? (
                            netProfit /
                            revenue
                        ) * 100
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

            }
        );


        if (results.length === 0) {

            alert(
                "Please enter at least one complete pricing option."
            );

            return;

        }


        // ======================================
        // CREATE RESULTS TABLE
        // ======================================

        results.forEach(
            function (result) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        <strong>
                            ${t(
                                "option",
                                "Option"
                            )}
                            ${result.option}
                        </strong>
                    </td>

                    <td>
                        ${money(
                            result.price
                        )}
                    </td>

                    <td>
                        ${result.sales}
                    </td>

                    <td>
                        ${money(
                            result.revenue
                        )}
                    </td>

                    <td>
                        ${money(
                            result.variableExpenses
                        )}
                    </td>

                    <td>
                        ${money(
                            result.fixedExpenses
                        )}
                    </td>

                    <td>
                        ${money(
                            result.totalExpenses
                        )}
                    </td>

                    <td class="${
                        result.netProfit >= 0
                            ? "positive-profit"
                            : "negative-profit"
                    }">

                        <strong>
                            ${money(
                                result.netProfit
                            )}
                        </strong>

                    </td>

                    <td>
                        ${result.profitMargin.toFixed(1)}%
                    </td>

                `;


                resultsBody.appendChild(
                    row
                );

            }
        );


        // ======================================
        // BEST OPTIONS
        // ======================================

        const highestRevenue =
            [...results].sort(
                (a, b) =>
                    b.revenue -
                    a.revenue
            )[0];


        const highestProfit =
            [...results].sort(
                (a, b) =>
                    b.netProfit -
                    a.netProfit
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
            money(
                highestRevenue.revenue
            );


        document.getElementById(
            "highestRevenueDetails"
        ).textContent =
            `${t(
                "option",
                "Option"
            )} ${highestRevenue.option}`;


        document.getElementById(
            "highestProfit"
        ).textContent =
            money(
                highestProfit.netProfit
            );


        document.getElementById(
            "highestProfitDetails"
        ).textContent =
            `${t(
                "option",
                "Option"
            )} ${highestProfit.option}`;


        document.getElementById(
            "bestMargin"
        ).textContent =
            `${bestMargin.profitMargin.toFixed(1)}%`;


        document.getElementById(
            "bestMarginDetails"
        ).textContent =
            `${t(
                "option",
                "Option"
            )} ${bestMargin.option}`;


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

            if (
                this.value === "custom"
            ) {

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
                .querySelectorAll(
                    ".option-unit"
                )
                .forEach(
                    function (element) {

                        element.textContent =
                            getPluralUnit();

                    }
                );

        }
    );


    customUnit.addEventListener(
        "input",
        function () {

            updateLabels();


            document
                .querySelectorAll(
                    ".option-unit"
                )
                .forEach(
                    function (element) {

                        element.textContent =
                            getPluralUnit();

                    }
                );

        }
    );


    // ==========================================
    // LANGUAGE CHANGE SUPPORT
    // ==========================================

    /*
     * languages.js updates the page translations.
     * This observer detects those changes and
     * refreshes the dynamically-created rows.
     */

    const languageObserver =
        new MutationObserver(
            function () {

                refreshDynamicTranslations();

            }
        );


    languageObserver.observe(
        document.documentElement,
        {
            attributes: true,
            attributeFilter: ["lang"]
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
