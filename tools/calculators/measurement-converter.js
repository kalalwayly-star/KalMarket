document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // Measurement Converter
    // =========================================================

    const categorySelect =
        document.getElementById("categorySelect");

    const fromValue =
        document.getElementById("fromValue");

    const fromUnit =
        document.getElementById("fromUnit");

    const toUnit =
        document.getElementById("toUnit");

    const resultValue =
        document.getElementById("resultValue");

    const swapButton =
        document.getElementById("swapButton");

    const quickConversions =
        document.getElementById("quickConversions");

    const constructionSection =
        document.getElementById("constructionSection");

    const feetInput =
        document.getElementById("feetInput");

    const inchesInput =
        document.getElementById("inchesInput");

    const constructionInches =
        document.getElementById("constructionInches");

    const constructionCm =
        document.getElementById("constructionCm");

    const constructionMm =
        document.getElementById("constructionMm");

    const constructionMeters =
        document.getElementById("constructionMeters");

    const constructionDecimalFeet =
        document.getElementById("constructionDecimalFeet");


    // =========================================================
    // Standard Units
    // =========================================================

    const units = {

        length: {

            millimeter: {
                name: "Millimeters",
                factor: 0.001
            },

            centimeter: {
                name: "Centimeters",
                factor: 0.01
            },

            meter: {
                name: "Meters",
                factor: 1
            },

            kilometer: {
                name: "Kilometers",
                factor: 1000
            },

            inch: {
                name: "Inches",
                factor: 0.0254
            },

            foot: {
                name: "Feet",
                factor: 0.3048
            },

            yard: {
                name: "Yards",
                factor: 0.9144
            },

            mile: {
                name: "Miles",
                factor: 1609.344
            },

            nautical_mile: {
                name: "Nautical Miles",
                factor: 1852
            }

        },


        weight: {

            milligram: {
                name: "Milligrams",
                factor: 0.000001
            },

            gram: {
                name: "Grams",
                factor: 0.001
            },

            kilogram: {
                name: "Kilograms",
                factor: 1
            },

            metric_ton: {
                name: "Metric Tons",
                factor: 1000
            },

            ounce: {
                name: "Ounces",
                factor: 0.028349523125
            },

            pound: {
                name: "Pounds",
                factor: 0.45359237
            },

            stone: {
                name: "Stones",
                factor: 6.35029318
            },

            us_ton: {
                name: "US Tons",
                factor: 907.18474
            }

        },


        area: {

            square_millimeter: {
                name: "Square Millimeters",
                factor: 0.000001
            },

            square_centimeter: {
                name: "Square Centimeters",
                factor: 0.0001
            },

            square_meter: {
                name: "Square Meters",
                factor: 1
            },

            square_kilometer: {
                name: "Square Kilometers",
                factor: 1000000
            },

            square_inch: {
                name: "Square Inches",
                factor: 0.00064516
            },

            square_foot: {
                name: "Square Feet",
                factor: 0.09290304
            },

            square_yard: {
                name: "Square Yards",
                factor: 0.83612736
            },

            acre: {
                name: "Acres",
                factor: 4046.8564224
            },

            hectare: {
                name: "Hectares",
                factor: 10000
            },

            square_mile: {
                name: "Square Miles",
                factor: 2589988.110336
            }

        },


        volume: {

            milliliter: {
                name: "Milliliters",
                factor: 0.001
            },

            liter: {
                name: "Liters",
                factor: 1
            },

            cubic_centimeter: {
                name: "Cubic Centimeters",
                factor: 0.001
            },

            cubic_meter: {
                name: "Cubic Meters",
                factor: 1000
            },

            us_fluid_ounce: {
                name: "US Fluid Ounces",
                factor: 0.0295735295625
            },

            us_cup: {
                name: "US Cups",
                factor: 0.2365882365
            },

            us_pint: {
                name: "US Pints",
                factor: 0.473176473
            },

            us_quart: {
                name: "US Quarts",
                factor: 0.946352946
            },

            us_gallon: {
                name: "US Gallons",
                factor: 3.785411784
            },

            imperial_fluid_ounce: {
                name: "Imperial Fluid Ounces",
                factor: 0.0284130625
            },

            imperial_pint: {
                name: "Imperial Pints",
                factor: 0.56826125
            },

            imperial_gallon: {
                name: "Imperial Gallons",
                factor: 4.54609
            }

        },


        time: {

            millisecond: {
                name: "Milliseconds",
                factor: 0.001
            },

            second: {
                name: "Seconds",
                factor: 1
            },

            minute: {
                name: "Minutes",
                factor: 60
            },

            hour: {
                name: "Hours",
                factor: 3600
            },

            day: {
                name: "Days",
                factor: 86400
            },

            week: {
                name: "Weeks",
                factor: 604800
            },

            month: {
                name: "Months (30 days)",
                factor: 2592000
            },

            year: {
                name: "Years (365 days)",
                factor: 31536000
            }

        },


        speed: {

            meter_second: {
                name: "Meters / Second",
                factor: 1
            },

            kilometer_hour: {
                name: "Kilometers / Hour",
                factor: 0.2777777778
            },

            mile_hour: {
                name: "Miles / Hour",
                factor: 0.44704
            },

            foot_second: {
                name: "Feet / Second",
                factor: 0.3048
            },

            knot: {
                name: "Knots",
                factor: 0.5144444444
            }

        },


        digital: {

            bit: {
                name: "Bits",
                factor: 1
            },

            byte: {
                name: "Bytes",
                factor: 8
            },

            kilobyte: {
                name: "Kilobytes",
                factor: 8000
            },

            megabyte: {
                name: "Megabytes",
                factor: 8000000
            },

            gigabyte: {
                name: "Gigabytes",
                factor: 8000000000
            },

            terabyte: {
                name: "Terabytes",
                factor: 8000000000000
            },

            petabyte: {
                name: "Petabytes",
                factor: 8000000000000000
            }

        }

    };


    // =========================================================
    // Temperature
    // =========================================================

    const temperatureUnits = {

        celsius: "Celsius",

        fahrenheit: "Fahrenheit",

        kelvin: "Kelvin"

    };


    // =========================================================
    // Construction Examples
    // =========================================================

    const quickExamples = {

        length: [
            ["1 Foot", "12 Inches"],
            ["1 Meter", "3.28084 Feet"],
            ["1 Mile", "1.60934 Kilometers"],
            ["1 Inch", "2.54 Centimeters"]
        ],

        weight: [
            ["1 Kilogram", "2.20462 Pounds"],
            ["1 Pound", "453.592 Grams"],
            ["1 Ounce", "28.3495 Grams"],
            ["1 Stone", "6.35029 Kilograms"]
        ],

        temperature: [
            ["0°C", "32°F"],
            ["20°C", "68°F"],
            ["100°C", "212°F"],
            ["0°C", "273.15 K"]
        ],

        area: [
            ["1 Acre", "43,560 Square Feet"],
            ["1 Hectare", "2.47105 Acres"],
            ["1 Square Meter", "10.7639 Square Feet"],
            ["1 Square Mile", "640 Acres"]
        ],

        volume: [
            ["1 US Gallon", "3.78541 Liters"],
            ["1 Liter", "33.814 US Fluid Ounces"],
            ["1 US Quart", "0.946353 Liters"],
            ["1 US Pint", "473.176 Milliliters"]
        ],

        time: [
            ["1 Minute", "60 Seconds"],
            ["1 Hour", "60 Minutes"],
            ["1 Day", "24 Hours"],
            ["1 Week", "7 Days"]
        ],

        speed: [
            ["1 MPH", "1.60934 KM/H"],
            ["1 KM/H", "0.621371 MPH"],
            ["1 Knot", "1.852 KM/H"],
            ["1 M/S", "3.6 KM/H"]
        ],

        digital: [
            ["1 Byte", "8 Bits"],
            ["1 KB", "8,000 Bits"],
            ["1 MB", "8,000,000 Bits"],
            ["1 GB", "8,000,000,000 Bits"]
        ]

    };


    // =========================================================
    // Format Number
    // =========================================================

    function formatNumber(number) {

        if (!Number.isFinite(number)) {
            return "0";
        }

        if (
            Math.abs(number) < 0.000001 &&
            number !== 0
        ) {
            return number.toExponential(6);
        }

        return Number(
            number.toFixed(8)
        ).toLocaleString("en-US", {
            maximumFractionDigits: 8
        });

    }


    // =========================================================
    // Populate Units
    // =========================================================

    function populateUnits() {

        const category =
            categorySelect.value;

        fromUnit.innerHTML = "";
        toUnit.innerHTML = "";


        // Construction mode
        if (category === "construction") {

            if (constructionSection) {
                constructionSection.style.display = "block";
            }

            document.querySelector(".conversion-row").style.display =
                "none";

            document.querySelector(".swap-container").style.display =
                "none";

            document.querySelector(".result-box").style.display =
                "none";

            document.querySelector(".quick-conversions").style.display =
                "none";

            convertConstruction();

            return;
        }


        // Normal mode
        if (constructionSection) {
            constructionSection.style.display = "none";
        }

        document.querySelector(".conversion-row").style.display =
            "grid";

        document.querySelector(".swap-container").style.display =
            "block";

        document.querySelector(".result-box").style.display =
            "block";

        document.querySelector(".quick-conversions").style.display =
            "block";


        // Temperature
        if (category === "temperature") {

            Object.entries(temperatureUnits).forEach(
                ([value, name]) => {

                    const optionFrom =
                        document.createElement("option");

                    optionFrom.value = value;
                    optionFrom.textContent = name;

                    const optionTo =
                        document.createElement("option");

                    optionTo.value = value;
                    optionTo.textContent = name;

                    fromUnit.appendChild(optionFrom);
                    toUnit.appendChild(optionTo);

                }
            );

            fromUnit.value = "celsius";
            toUnit.value = "fahrenheit";

        }

        // All other categories
        else {

            Object.entries(units[category]).forEach(
                ([value, data]) => {

                    const optionFrom =
                        document.createElement("option");

                    optionFrom.value = value;
                    optionFrom.textContent = data.name;

                    const optionTo =
                        document.createElement("option");

                    optionTo.value = value;
                    optionTo.textContent = data.name;

                    fromUnit.appendChild(optionFrom);
                    toUnit.appendChild(optionTo);

                }
            );


            const available =
                Object.keys(units[category]);


            if (available.length > 1) {

                fromUnit.value =
                    available[0];

                toUnit.value =
                    available[1];

            }

        }


        updateQuickConversions();

        convert();

    }


    // =========================================================
    // Temperature Conversion
    // =========================================================

    function convertTemperature(
        value,
        from,
        to
    ) {

        let celsius;


        if (from === "celsius") {

            celsius = value;

        }

        else if (from === "fahrenheit") {

            celsius =
                (value - 32) * 5 / 9;

        }

        else if (from === "kelvin") {

            celsius =
                value - 273.15;

        }


        if (to === "celsius") {

            return celsius;

        }

        if (to === "fahrenheit") {

            return (
                celsius * 9 / 5
            ) + 32;

        }

        if (to === "kelvin") {

            return celsius + 273.15;

        }

    }


    // =========================================================
    // Standard Conversion
    // =========================================================

    function convert() {

        const category =
            categorySelect.value;


        if (category === "construction") {

            convertConstruction();
            return;

        }


        const value =
            parseFloat(fromValue.value);


        if (Number.isNaN(value)) {

            resultValue.textContent = "0";
            return;

        }


        let result;


        // Temperature
        if (category === "temperature") {

            result =
                convertTemperature(
                    value,
                    fromUnit.value,
                    toUnit.value
                );

        }

        // Standard units
        else {

            const from =
                units[category][fromUnit.value];

            const to =
                units[category][toUnit.value];


            if (!from || !to) {

                resultValue.textContent = "0";
                return;

            }


            const baseValue =
                value * from.factor;


            result =
                baseValue / to.factor;

        }


        resultValue.textContent =
            formatNumber(result);

    }


    // =========================================================
    // Construction Converter
    // =========================================================

    function convertConstruction() {

        if (!feetInput) {
            return;
        }


        const feet =
            parseFloat(feetInput.value) || 0;

        const inches =
            parseFloat(inchesInput.value) || 0;


        // Total inches
        const totalInches =
            (feet * 12) + inches;


        // Conversions
        const centimeters =
            totalInches * 2.54;

        const millimeters =
            totalInches * 25.4;

        const meters =
            centimeters / 100;

        const decimalFeet =
            totalInches / 12;


        constructionInches.textContent =
            formatNumber(totalInches);

        constructionCm.textContent =
            formatNumber(centimeters);

        constructionMm.textContent =
            formatNumber(millimeters);

        constructionMeters.textContent =
            formatNumber(meters);

        constructionDecimalFeet.textContent =
            formatNumber(decimalFeet);

    }


    // =========================================================
    // Quick Conversions
    // =========================================================

    function updateQuickConversions() {

        if (!quickConversions) {
            return;
        }


        const category =
            categorySelect.value;


        quickConversions.innerHTML = "";


        if (!quickExamples[category]) {
            return;
        }


        quickExamples[category].forEach(
            example => {

                const div =
                    document.createElement("div");

                div.className =
                    "quick-item";

                div.textContent =
                    example[0] +
                    " = " +
                    example[1];

                quickConversions.appendChild(div);

            }
        );

    }


    // =========================================================
    // Swap Units
    // =========================================================

    if (swapButton) {

        swapButton.addEventListener(
            "click",
            () => {

                const oldFrom =
                    fromUnit.value;

                fromUnit.value =
                    toUnit.value;

                toUnit.value =
                    oldFrom;

                convert();

            }
        );

    }


    // =========================================================
    // Event Listeners
    // =========================================================

    categorySelect.addEventListener(
        "change",
        populateUnits
    );


    fromValue.addEventListener(
        "input",
        convert
    );


    fromUnit.addEventListener(
        "change",
        convert
    );


    toUnit.addEventListener(
        "change",
        convert
    );


    if (feetInput) {

        feetInput.addEventListener(
            "input",
            convertConstruction
        );

    }


    if (inchesInput) {

        inchesInput.addEventListener(
            "input",
            convertConstruction
        );

    }


    // =========================================================
    // Initialize
    // =========================================================

    populateUnits();

});
