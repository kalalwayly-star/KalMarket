
/* =========================================================
   KALMARKET AUTO REPAIR ESTIMATOR
   File: auto-repair-estimator.js
========================================================= */

"use strict";


/* =========================================================
   CANADIAN LOCATIONS & TAXES
========================================================= */

const canadianLocations = {

    "alberta": {
        name: "Alberta",
        tax: 5,
        cities: [
            "Calgary",
            "Edmonton",
            "Red Deer",
            "Lethbridge",
            "Medicine Hat",
            "Grande Prairie",
            "Airdrie",
            "St. Albert",
            "Fort McMurray"
        ]
    },

    "british-columbia": {
        name: "British Columbia",
        tax: 12,
        cities: [
            "Vancouver",
            "Victoria",
            "Surrey",
            "Burnaby",
            "Richmond",
            "Kelowna",
            "Abbotsford",
            "Coquitlam",
            "Kamloops",
            "Nanaimo"
        ]
    },

    "manitoba": {
        name: "Manitoba",
        tax: 14,
        cities: [
            "Winnipeg",
            "Brandon",
            "Steinbach",
            "Thompson",
            "Portage la Prairie",
            "Winkler",
            "Selkirk",
            "Dauphin"
        ]
    },

    "new-brunswick": {
        name: "New Brunswick",
        tax: 15,
        cities: [
            "Moncton",
            "Saint John",
            "Fredericton",
            "Dieppe",
            "Miramichi",
            "Bathurst",
            "Edmundston"
        ]
    },

    "newfoundland-and-labrador": {
        name: "Newfoundland and Labrador",
        tax: 15,
        cities: [
            "St. John's",
            "Mount Pearl",
            "Corner Brook",
            "Conception Bay South",
            "Paradise",
            "Grand Falls-Windsor"
        ]
    },

    "nova-scotia": {
        name: "Nova Scotia",
        tax: 15,
        cities: [
            "Halifax",
            "Sydney",
            "Dartmouth",
            "Truro",
            "New Glasgow",
            "Glace Bay",
            "Kentville"
        ]
    },

    "ontario": {
        name: "Ontario",
        tax: 13,
        cities: [
            "Toronto",
            "Ottawa",
            "Mississauga",
            "Brampton",
            "Hamilton",
            "London",
            "Markham",
            "Vaughan",
            "Kitchener",
            "Windsor",
            "Barrie",
            "Kingston",
            "Oshawa",
            "Sudbury",
            "Thunder Bay"
        ]
    },

    "prince-edward-island": {
        name: "Prince Edward Island",
        tax: 15,
        cities: [
            "Charlottetown",
            "Summerside",
            "Stratford",
            "Cornwall",
            "Montague"
        ]
    },

    "quebec": {
        name: "Quebec",
        tax: 14.975,
        cities: [
            "Montreal",
            "Quebec City",
            "Laval",
            "Gatineau",
            "Longueuil",
            "Sherbrooke",
            "Saguenay",
            "Trois-Rivières",
            "Terrebonne",
            "Saint-Jean-sur-Richelieu"
        ]
    },

    "saskatchewan": {
        name: "Saskatchewan",
        tax: 11,
        cities: [
            "Saskatoon",
            "Regina",
            "Prince Albert",
            "Moose Jaw",
            "Yorkton",
            "Swift Current",
            "North Battleford",
            "Lloydminster"
        ]
    },

    "northwest-territories": {
        name: "Northwest Territories",
        tax: 5,
        cities: [
            "Yellowknife",
            "Hay River",
            "Inuvik",
            "Fort Smith"
        ]
    },

    "nunavut": {
        name: "Nunavut",
        tax: 5,
        cities: [
            "Iqaluit",
            "Rankin Inlet",
            "Arviat",
            "Cambridge Bay"
        ]
    },

    "yukon": {
        name: "Yukon",
        tax: 5,
        cities: [
            "Whitehorse",
            "Dawson City",
            "Watson Lake",
            "Haines Junction"
        ]
    }

};


/* =========================================================
   INTERNATIONAL LOCATIONS
========================================================= */

const internationalLocations = {

    "united-states": {
        name: "United States",
        currency: "USD",
        regions: [
            "Alabama",
            "Alaska",
            "Arizona",
            "Arkansas",
            "California",
            "Colorado",
            "Connecticut",
            "Florida",
            "Georgia",
            "Illinois",
            "Maryland",
            "Massachusetts",
            "Michigan",
            "Minnesota",
            "New Jersey",
            "New York",
            "North Carolina",
            "Ohio",
            "Oregon",
            "Pennsylvania",
            "Texas",
            "Virginia",
            "Washington",
            "Wisconsin"
        ],
        defaultTax: 0
    },

    "united-kingdom": {
        name: "United Kingdom",
        currency: "GBP",
        regions: [
            "England",
            "Scotland",
            "Wales",
            "Northern Ireland"
        ],
        defaultTax: 20
    },

    "australia": {
        name: "Australia",
        currency: "AUD",
        regions: [
            "New South Wales",
            "Victoria",
            "Queensland",
            "Western Australia",
            "South Australia",
            "Tasmania",
            "Northern Territory",
            "Australian Capital Territory"
        ],
        defaultTax: 10
    },

    "new-zealand": {
        name: "New Zealand",
        currency: "NZD",
        regions: [
            "Auckland",
            "Wellington",
            "Canterbury",
            "Waikato",
            "Otago",
            "Bay of Plenty",
            "Manawatū-Whanganui"
        ],
        defaultTax: 15
    },

    "other": {
        name: "Other",
        currency: "USD",
        regions: [
            "Other / Not Listed"
        ],
        defaultTax: 0
    }

};


/* =========================================================
   DOM ELEMENTS
========================================================= */

const countrySelect =
    document.getElementById("repairCountry");

const regionSelect =
    document.getElementById("repairRegion");

const citySelect =
    document.getElementById("repairCity");

const currencySelect =
    document.getElementById("repairCurrency");

const taxSelect =
    document.getElementById("repairTax");

const customTaxGroup =
    document.getElementById("customTaxGroup");

const customTaxRate =
    document.getElementById("customTaxRate");

const calculateButton =
    document.getElementById("calculateRepair");

const resetButton =
    document.getElementById("resetRepair");

const resultsBox =
    document.getElementById("repairResults");

const currentYear =
    document.getElementById("currentYear");


/* =========================================================
   VEHICLE / REPAIR INPUTS
========================================================= */

const vehicleYear =
    document.getElementById("vehicleYear");

const vehicleMake =
    document.getElementById("vehicleMake");

const vehicleModel =
    document.getElementById("vehicleModel");

const vehicleMileage =
    document.getElementById("vehicleMileage");

const repairCategory =
    document.getElementById("repairCategory");

const repairDescription =
    document.getElementById("repairDescription");

const labourHours =
    document.getElementById("labourHours");

const labourRate =
    document.getElementById("labourRate");

const partsCost =
    document.getElementById("partsCost");

const partsMarkup =
    document.getElementById("partsMarkup");

const shopSupplies =
    document.getElementById("shopSupplies");

const diagnosticFee =
    document.getElementById("diagnosticFee");

const otherFees =
    document.getElementById("otherFees");


/* =========================================================
   RESULT ELEMENTS
========================================================= */

const resultLabour =
    document.getElementById("resultLabour");

const resultParts =
    document.getElementById("resultParts");

const resultShopSupplies =
    document.getElementById("resultShopSupplies");

const resultDiagnostic =
    document.getElementById("resultDiagnostic");

const resultOtherFees =
    document.getElementById("resultOtherFees");

const resultSubtotal =
    document.getElementById("resultSubtotal");

const resultTax =
    document.getElementById("resultTax");

const resultTotal =
    document.getElementById("resultTotal");

const estimateLocation =
    document.getElementById("estimateLocation");

const resultVehicle =
    document.getElementById("resultVehicle");

const resultRepair =
    document.getElementById("resultRepair");


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }

    populateRegions();

    updateTaxForLocation();

});


/* =========================================================
   COUNTRY CHANGE
========================================================= */

if (countrySelect) {

    countrySelect.addEventListener(
        "change",
        function () {

            populateRegions();

            updateCurrency();

            updateTaxForLocation();

        }
    );

}


/* =========================================================
   REGION CHANGE
========================================================= */

if (regionSelect) {

    regionSelect.addEventListener(
        "change",
        function () {

            populateCities();

            updateTaxForLocation();

        }
    );

}


/* =========================================================
   TAX CHANGE
========================================================= */

if (taxSelect) {

    taxSelect.addEventListener(
        "change",
        function () {

            if (taxSelect.value === "custom") {

                customTaxGroup.hidden = false;

                customTaxRate.focus();

            } else {

                customTaxGroup.hidden = true;

            }

        }
    );

}


/* =========================================================
   POPULATE REGIONS
========================================================= */

function populateRegions() {

    if (!regionSelect || !countrySelect) {
        return;
    }

    const country =
        countrySelect.value;

    regionSelect.innerHTML = "";

    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";
    defaultOption.textContent =
        "Select location";

    regionSelect.appendChild(
        defaultOption
    );


    if (country === "canada") {

        Object.keys(canadianLocations)
            .forEach(function (key) {

                const option =
                    document.createElement("option");

                option.value = key;

                option.textContent =
                    canadianLocations[key].name;

                regionSelect.appendChild(
                    option
                );

            });

    } else if (
        internationalLocations[country]
    ) {

        internationalLocations[country]
            .regions
            .forEach(function (region) {

                const option =
                    document.createElement("option");

                option.value = region;

                option.textContent = region;

                regionSelect.appendChild(
                    option
                );

            });

    }

    populateCities();

}


/* =========================================================
   POPULATE CITIES
========================================================= */

function populateCities() {

    if (!citySelect || !countrySelect) {
        return;
    }

    const country =
        countrySelect.value;

    const region =
        regionSelect.value;

    citySelect.innerHTML = "";

    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        "Select city";

    citySelect.appendChild(
        defaultOption
    );


    if (
        country === "canada" &&
        canadianLocations[region]
    ) {

        canadianLocations[region]
            .cities
            .forEach(function (city) {

                const option =
                    document.createElement("option");

                option.value = city;

                option.textContent = city;

                citySelect.appendChild(
                    option
                );

            });

    } else {

        const option =
            document.createElement("option");

        option.value = "not-selected";

        option.textContent =
            "City / Area";

        citySelect.appendChild(
            option
        );

    }

}


/* =========================================================
   UPDATE CURRENCY
========================================================= */

function updateCurrency() {

    if (!currencySelect || !countrySelect) {
        return;
    }

    const country =
        countrySelect.value;

    let currency = "USD";


    if (country === "canada") {

        currency = "CAD";

    } else if (
        internationalLocations[country]
    ) {

        currency =
            internationalLocations[country]
                .currency;

    }


    const option =
        Array.from(
            currencySelect.options
        ).find(function (item) {

            return item.value === currency;

        });


    if (option) {

        currencySelect.value =
            currency;

    }

}


/* =========================================================
   UPDATE TAX BASED ON LOCATION
========================================================= */

function updateTaxForLocation() {

    if (!taxSelect || !countrySelect) {
        return;
    }

    const country =
        countrySelect.value;

    let tax = 0;


    if (country === "canada") {

        const region =
            regionSelect.value;

        if (
            region &&
            canadianLocations[region]
        ) {

            tax =
                canadianLocations[region].tax;

        }

    } else if (
        internationalLocations[country]
    ) {

        tax =
            internationalLocations[country]
                .defaultTax;

    }


    const matchingOption =
        Array.from(
            taxSelect.options
        ).find(function (option) {

            return (
                option.value !== "custom" &&
                Number(option.value) === tax
            );

        });


    if (matchingOption) {

        taxSelect.value =
            matchingOption.value;

        customTaxGroup.hidden = true;

    } else {

        taxSelect.value =
            "custom";

        customTaxGroup.hidden = false;

        customTaxRate.value =
            tax;

    }

}


/* =========================================================
   GET TAX RATE
========================================================= */

function getTaxRate() {

    if (!taxSelect) {
        return 0;
    }

    if (taxSelect.value === "custom") {

        return Math.max(
            0,
            parseFloat(customTaxRate.value) || 0
        );

    }

    return Math.max(
        0,
        parseFloat(taxSelect.value) || 0
    );

}


/* =========================================================
   NUMBER HELPER
========================================================= */

function getNumber(element) {

    if (!element) {
        return 0;
    }

    const value =
        parseFloat(element.value);

    return Number.isFinite(value)
        ? Math.max(0, value)
        : 0;

}


/* =========================================================
   CURRENCY FORMATTER
========================================================= */

function formatMoney(amount) {

    const currency =
        currencySelect
            ? currencySelect.value
            : "USD";


    const validCurrencyCodes = [
        "CAD",
        "USD",
        "GBP",
        "AUD",
        "NZD",
        "EUR"
    ];


    const code =
        validCurrencyCodes.includes(currency)
            ? currency
            : "USD";


    try {

        return new Intl.NumberFormat(
            undefined,
            {
                style: "currency",
                currency: code,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ).format(amount);

    } catch (error) {

        return (
            code +
            " " +
            amount.toFixed(2)
        );

    }

}


/* =========================================================
   CALCULATE REPAIR ESTIMATE
========================================================= */

function calculateRepairEstimate() {

    /* -----------------------------------------------------
       LABOUR
    ----------------------------------------------------- */

    const hours =
        getNumber(labourHours);

    const hourlyRate =
        getNumber(labourRate);

    const labourTotal =
        hours * hourlyRate;


    /* -----------------------------------------------------
       PARTS
    ----------------------------------------------------- */

    const baseParts =
        getNumber(partsCost);

    const markup =
        getNumber(partsMarkup);

    const markupAmount =
        baseParts * (markup / 100);

    const partsTotal =
        baseParts + markupAmount;


    /* -----------------------------------------------------
       ADDITIONAL COSTS
    ----------------------------------------------------- */

    const supplies =
        getNumber(shopSupplies);

    const diagnostic =
        getNumber(diagnosticFee);

    const other =
        getNumber(otherFees);


    /* -----------------------------------------------------
       SUBTOTAL
    ----------------------------------------------------- */

    const subtotal =
        labourTotal +
        partsTotal +
        supplies +
        diagnostic +
        other;


    /* -----------------------------------------------------
       TAX
    ----------------------------------------------------- */

    const taxRate =
        getTaxRate();

    const taxAmount =
        subtotal * (taxRate / 100);


    /* -----------------------------------------------------
       TOTAL
    ----------------------------------------------------- */

    const total =
        subtotal + taxAmount;


    /* -----------------------------------------------------
       DISPLAY RESULTS
    ----------------------------------------------------- */

    resultLabour.textContent =
        formatMoney(labourTotal);

    resultParts.textContent =
        formatMoney(partsTotal);

    resultShopSupplies.textContent =
        formatMoney(supplies);

    resultDiagnostic.textContent =
        formatMoney(diagnostic);

    resultOtherFees.textContent =
        formatMoney(other);

    resultSubtotal.textContent =
        formatMoney(subtotal);

    resultTax.textContent =
        formatMoney(taxAmount);

    resultTotal.textContent =
        formatMoney(total);


    /* -----------------------------------------------------
       LOCATION
    ----------------------------------------------------- */

    const countryName =
        countrySelect.options[
            countrySelect.selectedIndex
        ]
            ? countrySelect.options[
                countrySelect.selectedIndex
            ].textContent
            : "";


    const regionName =
        regionSelect.options[
            regionSelect.selectedIndex
        ]
            ? regionSelect.options[
                regionSelect.selectedIndex
            ].textContent
            : "";


    const cityName =
        citySelect.options[
            citySelect.selectedIndex
        ]
            ? citySelect.options[
                citySelect.selectedIndex
            ].textContent
            : "";


    const locationParts = [
        cityName,
        regionName,
        countryName
    ].filter(function (item) {

        return (
            item &&
            item !== "Select city" &&
            item !== "Select location"
        );

    });


    estimateLocation.textContent =
        locationParts.join(", ") ||
        "Location not selected";


    /* -----------------------------------------------------
       VEHICLE INFORMATION
    ----------------------------------------------------- */

    const year =
        vehicleYear.value.trim();

    const make =
        vehicleMake.value.trim();

    const model =
        vehicleModel.value.trim();

    const mileage =
        vehicleMileage.value.trim();


    const vehicleParts = [
        year,
        make,
        model
    ].filter(Boolean);


    let vehicleText =
        vehicleParts.join(" ");


    if (mileage) {

        vehicleText +=
            " • Mileage: " +
            Number(mileage).toLocaleString();

    }


    resultVehicle.textContent =
        vehicleText ||
        "Vehicle information not provided";


    /* -----------------------------------------------------
       REPAIR INFORMATION
    ----------------------------------------------------- */

    const categoryName =
        repairCategory.options[
            repairCategory.selectedIndex
        ]
            ? repairCategory.options[
                repairCategory.selectedIndex
            ].textContent
            : "";


    const description =
        repairDescription.value.trim();


    if (categoryName &&
        categoryName !== "Select repair category") {

        resultRepair.textContent =
            description
                ? categoryName +
                  " — " +
                  description
                : categoryName;

    } else if (description) {

        resultRepair.textContent =
            description;

    } else {

        resultRepair.textContent =
            "Repair information not provided";

    }


    /* -----------------------------------------------------
       SHOW RESULTS
    ----------------------------------------------------- */

    resultsBox.hidden = false;


    /* -----------------------------------------------------
       SCROLL TO RESULTS
    ----------------------------------------------------- */

    setTimeout(function () {

        resultsBox.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}


/* =========================================================
   CALCULATE BUTTON
========================================================= */

if (calculateButton) {

    calculateButton.addEventListener(
        "click",
        calculateRepairEstimate
    );

}


/* =========================================================
   RESET CALCULATOR
========================================================= */

function resetCalculator() {

    /* -----------------------------------------------------
       RESET COUNTRY
    ----------------------------------------------------- */

    countrySelect.value =
        "canada";


    /* -----------------------------------------------------
       RESET VEHICLE
    ----------------------------------------------------- */

    vehicleYear.value = "";

    vehicleMake.value = "";

    vehicleModel.value = "";

    vehicleMileage.value = "";


    /* -----------------------------------------------------
       RESET REPAIR
    ----------------------------------------------------- */

    repairCategory.value = "";

    repairDescription.value = "";


    /* -----------------------------------------------------
       RESET LABOUR
    ----------------------------------------------------- */

    labourHours.value = "1";

    labourRate.value = "100";


    /* -----------------------------------------------------
       RESET PARTS
    ----------------------------------------------------- */

    partsCost.value = "0";

    partsMarkup.value = "0";


    /* -----------------------------------------------------
       RESET ADDITIONAL COSTS
    ----------------------------------------------------- */

    shopSupplies.value = "0";

    diagnosticFee.value = "0";

    otherFees.value = "0";


    /* -----------------------------------------------------
       RESET LOCATION
    ----------------------------------------------------- */

    populateRegions();

    updateCurrency();

    updateTaxForLocation();


    /* -----------------------------------------------------
       RESET RESULTS
    ----------------------------------------------------- */

    resultsBox.hidden = true;


    /* -----------------------------------------------------
       RESET CUSTOM TAX
    ----------------------------------------------------- */

    customTaxRate.value = "0";

    customTaxGroup.hidden = true;


    /* -----------------------------------------------------
       SCROLL TOP
    ----------------------------------------------------- */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   RESET BUTTON
========================================================= */

if (resetButton) {

    resetButton.addEventListener(
        "click",
        resetCalculator
    );

}


/* =========================================================
   ENTER KEY SUPPORT
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            event.target.tagName !== "TEXTAREA"
        ) {

            const activeElement =
                document.activeElement;

            if (
                activeElement &&
                activeElement.tagName === "INPUT"
            ) {

                event.preventDefault();

                calculateRepairEstimate();

            }

        }

    }
);


/* =========================================================
   INPUT VALIDATION
========================================================= */

[
    labourHours,
    labourRate,
    partsCost,
    partsMarkup,
    shopSupplies,
    diagnosticFee,
    otherFees,
    customTaxRate
].forEach(function (input) {

    if (!input) {
        return;
    }

    input.addEventListener(
        "input",
        function () {

            if (
                input.value !== "" &&
                Number(input.value) < 0
            ) {

                input.value = "0";

            }

        }
    );

});


/* =========================================================
   EXPORT CALCULATOR FUNCTION
   Makes the calculator easy to extend later.
========================================================= */

window.KalMarketAutoRepairEstimator = {

    calculate:
        calculateRepairEstimate,

    reset:
        resetCalculator,

    getTaxRate:
        getTaxRate,

    formatMoney:
        formatMoney

};
