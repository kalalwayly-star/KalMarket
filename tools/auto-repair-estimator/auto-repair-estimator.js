
/* =========================================================
   KALMARKET AUTO REPAIR ESTIMATOR
   Location + Tax System
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CANADIAN LOCATIONS & TAX RATES
       DO NOT CHANGE - ORIGINAL CANADA SYSTEM
    ===================================================== */

    const canadianLocations = {

        "Alberta": {
            tax: 5,
            cities: [
                "Calgary",
                "Edmonton",
                "Red Deer",
                "Lethbridge",
                "Medicine Hat",
                "Grande Prairie",
                "Fort McMurray",
                "Airdrie",
                "St. Albert",
                "Spruce Grove"
            ]
        },

        "British Columbia": {
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
                "Langley",
                "Kamloops"
            ]
        },

        "Manitoba": {
            tax: 14,
            cities: [
                "Winnipeg",
                "Brandon",
                "Steinbach",
                "Portage la Prairie",
                "Thompson",
                "Winkler",
                "Selkirk",
                "Dauphin",
                "Morden",
                "The Pas"
            ]
        },

        "New Brunswick": {
            tax: 15,
            cities: [
                "Moncton",
                "Saint John",
                "Fredericton",
                "Miramichi",
                "Bathurst",
                "Edmundston",
                "Campbellton",
                "Dieppe"
            ]
        },

        "Newfoundland and Labrador": {
            tax: 15,
            cities: [
                "St. John's",
                "Corner Brook",
                "Mount Pearl",
                "Conception Bay South",
                "Grand Falls-Windsor",
                "Gander",
                "Happy Valley-Goose Bay"
            ]
        },

        "Nova Scotia": {
            tax: 15,
            cities: [
                "Halifax",
                "Sydney",
                "Dartmouth",
                "Truro",
                "New Glasgow",
                "Glace Bay",
                "Kentville",
                "Amherst"
            ]
        },

        "Ontario": {
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
                "Guelph",
                "Sudbury",
                "Thunder Bay"
            ]
        },

        "Prince Edward Island": {
            tax: 15,
            cities: [
                "Charlottetown",
                "Summerside",
                "Stratford",
                "Cornwall",
                "Montague"
            ]
        },

        "Quebec": {
            tax: 14.975,
            cities: [
                "Montreal",
                "Quebec City",
                "Laval",
                "Gatineau",
                "Longueuil",
                "Sherbrooke",
                "Saguenay",
                "Trois-Rivieres",
                "Terrebonne",
                "Levis"
            ]
        },

        "Saskatchewan": {
            tax: 11,
            cities: [
                "Saskatoon",
                "Regina",
                "Prince Albert",
                "Moose Jaw",
                "Swift Current",
                "Yorkton",
                "North Battleford",
                "Weyburn"
            ]
        },

        "Northwest Territories": {
            tax: 5,
            cities: [
                "Yellowknife",
                "Hay River",
                "Inuvik",
                "Fort Smith",
                "Norman Wells"
            ]
        },

        "Nunavut": {
            tax: 5,
            cities: [
                "Iqaluit",
                "Rankin Inlet",
                "Arviat",
                "Cambridge Bay",
                "Baker Lake"
            ]
        },

        "Yukon": {
            tax: 5,
            cities: [
                "Whitehorse",
                "Dawson City",
                "Watson Lake",
                "Haines Junction",
                "Carmacks"
            ]
        }
    };


    /* =====================================================
       INTERNATIONAL DEFAULTS
    ===================================================== */

    const internationalLocations = {

        "united-states": {
            currency: "USD",
            tax: 0,
            regions: [
                "Alabama",
                "Alaska",
                "Arizona",
                "Arkansas",
                "California",
                "Colorado",
                "Connecticut",
                "Delaware",
                "Florida",
                "Georgia",
                "Hawaii",
                "Idaho",
                "Illinois",
                "Indiana",
                "Iowa",
                "Kansas",
                "Kentucky",
                "Louisiana",
                "Maine",
                "Maryland",
                "Massachusetts",
                "Michigan",
                "Minnesota",
                "Mississippi",
                "Missouri",
                "Montana",
                "Nebraska",
                "Nevada",
                "New Hampshire",
                "New Jersey",
                "New Mexico",
                "New York",
                "North Carolina",
                "North Dakota",
                "Ohio",
                "Oklahoma",
                "Oregon",
                "Pennsylvania",
                "Rhode Island",
                "South Carolina",
                "South Dakota",
                "Tennessee",
                "Texas",
                "Utah",
                "Vermont",
                "Virginia",
                "Washington",
                "West Virginia",
                "Wisconsin",
                "Wyoming"
            ]
        },

        "united-kingdom": {
            currency: "GBP",
            tax: 20,
            regions: [
                "England",
                "Scotland",
                "Wales",
                "Northern Ireland"
            ]
        },

        "australia": {
            currency: "AUD",
            tax: 10,
            regions: [
                "New South Wales",
                "Victoria",
                "Queensland",
                "Western Australia",
                "South Australia",
                "Tasmania",
                "Northern Territory",
                "Australian Capital Territory"
            ]
        },

        "new-zealand": {
            currency: "NZD",
            tax: 15,
            regions: [
                "Auckland",
                "Wellington",
                "Canterbury",
                "Waikato",
                "Bay of Plenty",
                "Otago",
                "Manawatu-Wanganui",
                "Hawke's Bay",
                "Taranaki",
                "Northland",
                "Southland",
                "Nelson",
                "Marlborough",
                "Gisborne",
                "West Coast"
            ]
        }
    };


    /* =====================================================
       GET ELEMENTS
    ===================================================== */

    const countrySelect = document.getElementById("repairCountry");
    const regionSelect = document.getElementById("repairRegion");
    const regionInput = document.getElementById("repairRegionInput");

    const citySelect = document.getElementById("repairCity");
    const cityInput = document.getElementById("repairCityInput");

    const currencySelect = document.getElementById("repairCurrency");
    const customCurrencyGroup =
        document.getElementById("customCurrencyGroup");

    const customCurrencyInput =
        document.getElementById("customCurrency");

    const taxSelect = document.getElementById("repairTax");
    const customTaxGroup =
        document.getElementById("customTaxGroup");

    const customTaxRate =
        document.getElementById("customTaxRate");


    /* =====================================================
       POPULATE CANADIAN PROVINCES
    ===================================================== */

    function populateCanadianRegions() {

        if (!regionSelect) return;

        regionSelect.innerHTML =
            '<option value="">Select location</option>';

        Object.keys(canadianLocations).forEach(region => {

            const option = document.createElement("option");

            option.value = region;
            option.textContent = region;

            regionSelect.appendChild(option);
        });
    }


    /* =====================================================
       POPULATE INTERNATIONAL REGIONS
    ===================================================== */

    function populateInternationalRegions(country) {

        if (!regionSelect) return;

        regionSelect.innerHTML =
            '<option value="">Select location</option>';

        const location = internationalLocations[country];

        if (!location || !location.regions) return;

        location.regions.forEach(region => {

            const option = document.createElement("option");

            option.value = region;
            option.textContent = region;

            regionSelect.appendChild(option);
        });
    }


    /* =====================================================
       POPULATE CANADIAN CITIES
       ORIGINAL CANADA BEHAVIOR
    ===================================================== */

    function populateCanadianCities(region) {

        if (!citySelect) return;

        citySelect.innerHTML =
            '<option value="">Select city</option>';

        if (
            !region ||
            !canadianLocations[region]
        ) {
            return;
        }

        canadianLocations[region].cities.forEach(city => {

            const option = document.createElement("option");

            option.value = city;
            option.textContent = city;

            citySelect.appendChild(option);
        });
    }


    /* =====================================================
       SHOW / HIDE CITY FIELD
       
       Canada = dropdown
       Everything else = writable city
    ===================================================== */

    function updateCityField(country) {

        if (!citySelect || !cityInput) return;

        if (country === "canada") {

            citySelect.style.display = "";
            citySelect.disabled = false;

            cityInput.style.display = "none";
            cityInput.disabled = true;

            cityInput.value = "";

        } else {

            citySelect.style.display = "none";
            citySelect.disabled = true;

            cityInput.style.display = "";
            cityInput.disabled = false;

            citySelect.value = "";

        }
    }


    /* =====================================================
       SHOW / HIDE REGION FIELD
       
       Canada = dropdown
       US / UK / Australia / NZ = dropdown
       Other = writable
    ===================================================== */

    function updateRegionField(country) {

        if (!regionSelect || !regionInput) return;

        if (country === "other") {

            regionSelect.style.display = "none";
            regionSelect.disabled = true;

            regionInput.style.display = "";
            regionInput.disabled = false;

            regionInput.value = "";

        } else {

            regionSelect.style.display = "";
            regionSelect.disabled = false;

            regionInput.style.display = "none";
            regionInput.disabled = true;

            regionInput.value = "";

        }
    }


    /* =====================================================
       UPDATE CURRENCY
    ===================================================== */

    function updateCurrency(country) {

        if (!currencySelect) return;

        if (country === "canada") {

            currencySelect.value = "CAD";
            currencySelect.disabled = true;

        } else if (
            internationalLocations[country]
        ) {

            currencySelect.value =
                internationalLocations[country].currency;

            currencySelect.disabled = true;

        } else if (country === "other") {

            currencySelect.disabled = false;

            /*
             * User can select Other and enter
             * a currency code.
             */
        }
    }


    /* =====================================================
       SHOW / HIDE CUSTOM CURRENCY
    ===================================================== */

    function updateCustomCurrency() {

        if (
            !currencySelect ||
            !customCurrencyGroup ||
            !customCurrencyInput
        ) {
            return;
        }

        if (currencySelect.value === "other") {

            customCurrencyGroup.style.display = "";
            customCurrencyInput.disabled = false;

        } else {

            customCurrencyGroup.style.display = "none";
            customCurrencyInput.disabled = true;
            customCurrencyInput.value = "";
        }
    }


    /* =====================================================
       UPDATE TAX FOR COUNTRY / REGION
    ===================================================== */

    function updateTaxForLocation() {

        if (!taxSelect) return;

        const country = countrySelect.value;

        /* -------------------------------
           CANADA
        -------------------------------- */

        if (country === "canada") {

            const region = regionSelect.value;

            if (
                region &&
                canadianLocations[region]
            ) {

                const tax =
                    canadianLocations[region].tax;

                setTaxValue(tax);
            }

            return;
        }


        /* -------------------------------
           INTERNATIONAL
        -------------------------------- */

        if (
            internationalLocations[country]
        ) {

            const tax =
                internationalLocations[country].tax;

            setTaxValue(tax);

            return;
        }


        /* -------------------------------
           OTHER
        -------------------------------- */

        if (country === "other") {

            /*
             * Do not force a tax rate.
             * User chooses the tax.
             */

            taxSelect.value = "custom";

            showCustomTax();

            return;
        }
    }


    /* =====================================================
       SET TAX VALUE
    ===================================================== */

    function setTaxValue(tax) {

        const taxString = String(tax);

        const matchingOption =
            Array.from(taxSelect.options)
                .find(option =>
                    option.value === taxString
                );

        if (matchingOption) {

            taxSelect.value = taxString;

        } else {

            taxSelect.value = "custom";

            if (customTaxRate) {
                customTaxRate.value = tax;
            }

            showCustomTax();
        }
    }


    /* =====================================================
       CUSTOM TAX DISPLAY
    ===================================================== */

    function showCustomTax() {

        if (!customTaxGroup) return;

        customTaxGroup.hidden = false;
    }


    function hideCustomTax() {

        if (!customTaxGroup) return;

        customTaxGroup.hidden = true;
    }


    /* =====================================================
       TAX SELECTION CHANGE
    ===================================================== */

    if (taxSelect) {

        taxSelect.addEventListener("change", () => {

            if (taxSelect.value === "custom") {

                showCustomTax();

            } else {

                hideCustomTax();
            }
        });
    }


    /* =====================================================
       COUNTRY CHANGE
    ===================================================== */

    if (countrySelect) {

        countrySelect.addEventListener("change", () => {

            const country =
                countrySelect.value;


            /* -------------------------------
               CANADA
            -------------------------------- */

            if (country === "canada") {

                populateCanadianRegions();

                updateRegionField("canada");

                updateCityField("canada");

                updateCurrency("canada");

                hideCustomTax();

                return;
            }


            /* -------------------------------
               UNITED STATES / UK / AUSTRALIA /
               NEW ZEALAND
            -------------------------------- */

            if (
                internationalLocations[country]
            ) {

                populateInternationalRegions(country);

                updateRegionField(country);

                updateCityField(country);

                updateCurrency(country);

                updateCustomCurrency();

                updateTaxForLocation();

                return;
            }


            /* -------------------------------
               OTHER
            -------------------------------- */

            if (country === "other") {

                updateRegionField("other");

                updateCityField("other");

                currencySelect.disabled = false;

                /*
                 * Allow user to choose any
                 * available currency or Other.
                 */

                updateCustomCurrency();

                updateTaxForLocation();

                return;
            }

        });
    }


    /* =====================================================
       REGION CHANGE
    ===================================================== */

    if (regionSelect) {

        regionSelect.addEventListener("change", () => {

            const country =
                countrySelect.value;

            if (country === "canada") {

                populateCanadianCities(
                    regionSelect.value
                );

                updateTaxForLocation();
            }
        });
    }


    /* =====================================================
       CURRENCY CHANGE
    ===================================================== */

    if (currencySelect) {

        currencySelect.addEventListener(
            "change",
            updateCustomCurrency
        );
    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    populateCanadianRegions();

    if (countrySelect) {

        countrySelect.value = "canada";
    }

    updateRegionField("canada");

    updateCityField("canada");

    updateCurrency("canada");

    updateCustomCurrency();

    hideCustomTax();


    /* =====================================================
       OTHER CALCULATOR CODE
       
       The following section keeps the actual
       repair estimate calculation.
    ===================================================== */

    const calculateButton =
        document.getElementById("calculateRepair");

    const resetButton =
        document.getElementById("resetRepair");

    const results =
        document.getElementById("repairResults");


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


    /* =====================================================
       NUMBER HELPER
    ===================================================== */

    function getNumber(element) {

        if (!element) return 0;

        const value =
            parseFloat(element.value);

        return Number.isFinite(value)
            ? value
            : 0;
    }


    /* =====================================================
       CURRENCY FORMAT
    ===================================================== */

    function formatMoney(amount, currency) {

        const validCurrency =
            currency || "CAD";

        try {

            return new Intl.NumberFormat(
                undefined,
                {
                    style: "currency",
                    currency: validCurrency
                }
            ).format(amount);

        } catch (error) {

            return `${validCurrency} ${amount.toFixed(2)}`;
        }
    }


    /* =====================================================
       GET SELECTED CITY
    ===================================================== */

    function getSelectedCity() {

        const country =
            countrySelect.value;

        if (country === "canada") {

            return citySelect.value || "Not specified";

        }

        return cityInput.value.trim() ||
            "Not specified";
    }


    /* =====================================================
       GET SELECTED REGION
    ===================================================== */

    function getSelectedRegion() {

        const country =
            countrySelect.value;

        if (country === "other") {

            return regionInput.value.trim() ||
                "Not specified";
        }

        return regionSelect.value ||
            "Not specified";
    }


    /* =====================================================
       GET COUNTRY DISPLAY NAME
    ===================================================== */

    function getCountryName() {

        const option =
            countrySelect.options[
                countrySelect.selectedIndex
            ];

        return option
            ? option.textContent.trim()
            : "";
    }


    /* =====================================================
       GET CURRENCY
    ===================================================== */

    function getSelectedCurrency() {

        if (
            countrySelect.value === "other" &&
            currencySelect.value === "other"
        ) {

            return (
                customCurrencyInput.value
                    .trim()
                    .toUpperCase()
                || "USD"
            );
        }

        return currencySelect.value || "CAD";
    }


    /* =====================================================
       GET TAX RATE
    ===================================================== */

    function getTaxRate() {

        if (taxSelect.value === "custom") {

            return getNumber(customTaxRate);
        }

        return getNumber(taxSelect);
    }


    /* =====================================================
       CALCULATE REPAIR ESTIMATE
    ===================================================== */

    function calculateRepairEstimate() {

        const hours =
            getNumber(labourHours);

        const rate =
            getNumber(labourRate);

        const parts =
            getNumber(partsCost);

        const markup =
            getNumber(partsMarkup);

        const supplies =
            getNumber(shopSupplies);

        const diagnostic =
            getNumber(diagnosticFee);

        const other =
            getNumber(otherFees);


        /* Labour */

        const labourTotal =
            hours * rate;


        /* Parts + markup */

        const markupAmount =
            parts * (markup / 100);

        const partsTotal =
            parts + markupAmount;


        /* Subtotal */

        const subtotal =
            labourTotal +
            partsTotal +
            supplies +
            diagnostic +
            other;


        /* Tax */

        const taxRate =
            getTaxRate();

        const taxAmount =
            subtotal * (taxRate / 100);


        /* Total */

        const total =
            subtotal + taxAmount;


        const currency =
            getSelectedCurrency();


        /* =================================================
           DISPLAY RESULTS
        ================================================= */

        const estimateLocation =
            document.getElementById("estimateLocation");

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

        const resultVehicle =
            document.getElementById("resultVehicle");

        const resultRepair =
            document.getElementById("resultRepair");


        const country =
            getCountryName();

        const region =
            getSelectedRegion();

        const city =
            getSelectedCity();


        if (estimateLocation) {

            estimateLocation.textContent =
                `${country} • ${region} • ${city}`;
        }


        if (resultLabour) {

            resultLabour.textContent =
                formatMoney(
                    labourTotal,
                    currency
                );
        }


        if (resultParts) {

            resultParts.textContent =
                formatMoney(
                    partsTotal,
                    currency
                );
        }


        if (resultShopSupplies) {

            resultShopSupplies.textContent =
                formatMoney(
                    supplies,
                    currency
                );
        }


        if (resultDiagnostic) {

            resultDiagnostic.textContent =
                formatMoney(
                    diagnostic,
                    currency
                );
        }


        if (resultOtherFees) {

            resultOtherFees.textContent =
                formatMoney(
                    other,
                    currency
                );
        }


        if (resultSubtotal) {

            resultSubtotal.textContent =
                formatMoney(
                    subtotal,
                    currency
                );
        }


        if (resultTax) {

            resultTax.textContent =
                `${formatMoney(
                    taxAmount,
                    currency
                )} (${taxRate}%)`;
        }


        if (resultTotal) {

            resultTotal.textContent =
                formatMoney(
                    total,
                    currency
                );
        }


        if (resultVehicle) {

            const vehicleParts = [
                vehicleYear?.value,
                vehicleMake?.value,
                vehicleModel?.value
            ].filter(Boolean);

            resultVehicle.textContent =
                vehicleParts.length
                    ? vehicleParts.join(" ")
                    : "Not specified";
        }


        if (resultRepair) {

            resultRepair.textContent =
                repairDescription?.value ||
                repairCategory?.value ||
                "Not specified";
        }


        if (results) {

            results.hidden = false;

            results.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }


    /* =====================================================
       CALCULATE BUTTON
    ===================================================== */

    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            calculateRepairEstimate
        );
    }


    /* =====================================================
       RESET
    ===================================================== */

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            () => {

                if (results) {
                    results.hidden = true;
                }

                if (countrySelect) {
                    countrySelect.value = "canada";
                }

                populateCanadianRegions();

                updateRegionField("canada");

                updateCityField("canada");

                updateCurrency("canada");

                updateCustomCurrency();

                hideCustomTax();

                if (taxSelect) {
                    taxSelect.value = "14";
                }

            }
        );
    }


    /* =====================================================
       ENTER KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                event.target.tagName !== "TEXTAREA"
            ) {

                event.preventDefault();

                calculateRepairEstimate();
            }
        }
    );


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    const currentYear =
        document.getElementById("currentYear");

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.KalMarketAutoRepairEstimator = {

        calculate:
            calculateRepairEstimate,

        getTaxRate:
            getTaxRate,

        getCurrency:
            getSelectedCurrency,

        getCity:
            getSelectedCity,

        getRegion:
            getSelectedRegion
    };

});
