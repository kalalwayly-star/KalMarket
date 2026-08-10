document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // Measurement Converter
    // Uses KalMarket's existing window.t() translation system
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
    // Unit Definitions
    // =========================================================

    const units = {

        length: {

            millimeter: {
                key: "measurement_millimeters",
                factor: 0.001
            },

            centimeter: {
                key: "measurement_centimeters",
                factor: 0.01
            },

            meter: {
                key: "measurement_meters",
                factor: 1
            },

            kilometer: {
                key: "measurement_kilometers",
                factor: 1000
            },

            inch: {
                key: "measurement_inches",
                factor: 0.0254
            },

            foot: {
                key: "measurement_feet",
                factor: 0.3048
            },

            yard: {
                key: "measurement_yards",
                factor: 0.9144
            },

            mile: {
                key: "measurement_miles",
                factor: 1609.344
            },

            nautical_mile: {
                key: "measurement_nautical_miles",
                factor: 1852
            }

        },


        weight: {

            milligram: {
                key: "measurement_milligrams",
                factor: 0.000001
            },

            gram: {
                key: "measurement_grams",
                factor: 0.001
            },

            kilogram: {
                key: "measurement_kilograms",
                factor: 1
            },

            metric_ton: {
                key: "measurement_metric_tons",
                factor: 1000
            },

            ounce: {
                key: "measurement_ounces",
                factor: 0.028349523125
            },

            pound: {
                key: "measurement_pounds",
                factor: 0.45359237
            },

            stone: {
                key: "measurement_stones",
                factor: 6.35029318
            },

            us_ton: {
                key: "measurement_us_tons",
                factor: 907.18474
            }

        },


        area: {

            square_millimeter: {
                key: "measurement_square_millimeters",
                factor: 0.000001
            },

            square_centimeter: {
                key: "measurement_square_centimeters",
                factor: 0.0001
            },

            square_meter: {
                key: "measurement_square_meters",
                factor: 1
            },

            square_kilometer: {
                key: "measurement_square_kilometers",
                factor: 1000000
            },

            square_inch: {
                key: "measurement_square_inches",
                factor: 0.00064516
            },

            square_foot: {
                key: "measurement_square_feet",
                factor: 0.09290304
            },

            square_yard: {
                key: "measurement_square_yards",
                factor: 0.83612736
            },

            acre: {
                key: "measurement_acres",
                factor: 4046.8564224
            },

            hectare: {
                key: "measurement_hectares",
                factor: 10000
            },

            square_mile: {
                key: "measurement_square_miles",
                factor: 2589988.110336
            }

        },


        volume: {

            milliliter: {
                key: "measurement_milliliters",
                factor: 0.001
            },

            liter: {
                key: "measurement_liters",
                factor: 1
            },

            cubic_centimeter: {
                key: "measurement_cubic_centimeters",
                factor: 0.001
            },

            cubic_meter: {
                key: "measurement_cubic_meters",
                factor: 1000
            },

            us_fluid_ounce: {
                key: "measurement_us_fluid_ounces",
                factor: 0.0295735295625
            },

            us_cup: {
                key: "measurement_us_cups",
                factor: 0.2365882365
            },

            us_pint: {
                key: "measurement_us_pints",
                factor: 0.473176473
            },

            us_quart: {
                key: "measurement_us_quarts",
                factor: 0.946352946
            },

            us_gallon: {
                key: "measurement_us_gallons",
                factor: 3.785411784
            },

            imperial_fluid_ounce: {
                key: "measurement_imperial_fluid_ounces",
                factor: 0.0284130625
            },

            imperial_pint: {
                key: "measurement_imperial_pints",
                factor: 0.56826125
            },

            imperial_gallon: {
                key: "measurement_imperial_gallons",
                factor: 4.54609
            }

        },


        time: {

            millisecond: {
                key: "measurement_milliseconds",
                factor: 0.001
            },

            second: {
                key: "measurement_seconds",
                factor: 1
            },

            minute: {
                key: "measurement_minutes",
                factor: 60
            },

            hour: {
                key: "measurement_hours",
                factor: 3600
            },

            day: {
                key: "measurement_days",
                factor: 86400
            },

            week: {
                key: "measurement_weeks",
                factor: 604800
            },

            month: {
                key: "measurement_months",
                factor: 2592000
            },

            year: {
                key: "measurement_years",
                factor: 31536000
            }

        },


        speed: {

            meter_second: {
                key: "measurement_meters_per_second",
                factor: 1
            },

            kilometer_hour: {
                key: "measurement_kilometers_per_hour",
                factor: 0.2777777778
            },

            mile_hour: {
                key: "measurement_miles_per_hour",
                factor: 0.44704
            },

            foot_second: {
                key: "measurement_feet_per_second",
                factor: 0.3048
            },

            knot: {
                key: "measurement_knots",
                factor: 0.5144444444
            }

        },


        digital: {

            bit: {
                key: "measurement_bits",
                factor: 1
            },

            byte: {
                key: "measurement_bytes",
                factor: 8
            },

            kilobyte: {
                key: "measurement_kilobytes",
                factor: 8000
            },

            megabyte: {
                key: "measurement_megabytes",
                factor: 8000000
            },

            gigabyte: {
                key: "measurement_gigabytes",
                factor: 8000000000
            },

            terabyte: {
                key: "measurement_terabytes",
                factor: 8000000000000
            },

            petabyte: {
                key: "measurement_petabytes",
                factor: 8000000000000000
            }

        }

    };


    // =========================================================
    // Temperature
    // =========================================================

    const temperatureUnits = {

        celsius: {
            key: "measurement_celsius"
        },

        fahrenheit: {
            key: "measurement_fahrenheit"
        },

        kelvin: {
            key: "measurement_kelvin"
        }

    };


    // =========================================================
    // Common Conversion Examples
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
    // Translation Helper
    // =========================================================

    function translate(key, fallback = "") {

        if (typeof window.t === "function") {

            const translated =
                window.t(key);

            if (translated) {
                return translated;
            }

        }

        return fallback || key;

    }


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
        ).toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 8
            }
        );

    }


    // =========================================================
    // Populate Unit Dropdowns
    // =========================================================

    function populateUnits() {

        const category =
            categorySelect.value;


        fromUnit.innerHTML = "";
        toUnit.innerHTML = "";


        // -----------------------------------------------------
        // Construction mode
        // -----------------------------------------------------

        if (category === "construction") {

            constructionSection.style.display =
                "block";

            document.querySelector(
                ".conversion-row"
            ).style.display = "none";

            document.querySelector(
                ".swap-container"
            ).style.display = "none";

            document.querySelector(
                ".result-box"
            ).style.display = "none";

            document.querySelector(
                ".quick-conversions"
            ).style.display = "none";

            convertConstruction();

            return;
        }


        // -----------------------------------------------------
        // Normal mode
        // -----------------------------------------------------

        constructionSection.style.display =
            "none";

        document.querySelector(
            ".conversion-row"
        ).style.display = "grid";

        document.querySelector(
            ".swap-container"
        ).style.display = "block";

        document.querySelector(
            ".result-box"
        ).style.display = "block";

        document.querySelector(
            ".quick-conversions"
        ).style.display = "block";


        // -----------------------------------------------------
        // Temperature
        // -----------------------------------------------------

        if (category === "temperature") {

            Object.entries(
                temperatureUnits
            ).forEach(
                ([value, data]) => {

                    const optionFrom =
                        document.createElement("option");

                    optionFrom.value =
                        value;

                    optionFrom.textContent =
                        translate(
                            data.key,
                            value
                        );


                    const optionTo =
                        document.createElement("option");

                    optionTo.value =
                        value;

                    optionTo.textContent =
                        translate(
                            data.key,
                            value
                        );


                    fromUnit.appendChild(
                        optionFrom
                    );

                    toUnit.appendChild(
                        optionTo
                    );

                }
            );


            fromUnit.value =
                "celsius";

            toUnit.value =
                "fahrenheit";

        }


        // -----------------------------------------------------
        // Standard units
        // -----------------------------------------------------

        else {

            Object.entries(
                units[category]
            ).forEach(
                ([value, data]) => {

                    const optionFrom =
                        document.createElement("option");

                    optionFrom.value =
                        value;

                    optionFrom.textContent =
                        translate(
                            data.key,
                            value
                        );


                    const optionTo =
                        document.createElement("option");

                    optionTo.value =
                        value;

                    optionTo.textContent =
                        translate(
                            data.key,
                            value
                        );


                    fromUnit.appendChild(
                        optionFrom
                    );

                    toUnit.appendChild(
                        optionTo
                    );

                }
            );


            const available =
                Object.keys(
                    units[category]
                );


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
                (value - 32) *
                5 /
                9;

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
                celsius *
                9 /
                5
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
            parseFloat(
                fromValue.value
            );


        if (Number.isNaN(value)) {

            resultValue.textContent =
                "0";

            return;

        }


        let result;


        if (category === "temperature") {

            result =
                convertTemperature(
                    value,
                    fromUnit.value,
                    toUnit.value
                );

        }

        else {

            const from =
                units[category][
                    fromUnit.value
                ];

            const to =
                units[category][
                    toUnit.value
                ];


            if (!from || !to) {

                resultValue.textContent =
                    "0";

                return;

            }


            const baseValue =
                value *
                from.factor;


            result =
                baseValue /
                to.factor;

        }


        resultValue.textContent =
            formatNumber(result);

    }


    // =========================================================
    // Construction Conversion
    // =========================================================

    function convertConstruction() {

        if (!feetInput) {
            return;
        }


        const feet =
            parseFloat(
                feetInput.value
            ) || 0;

        const inches =
            parseFloat(
                inchesInput.value
            ) || 0;


        const totalInches =
            (feet * 12) +
            inches;


        const centimeters =
            totalInches *
            2.54;

        const millimeters =
            totalInches *
            25.4;

        const meters =
            centimeters /
            100;

        const decimalFeet =
            totalInches /
            12;


        constructionInches.textContent =
            formatNumber(
                totalInches
            );

        constructionCm.textContent =
            formatNumber(
                centimeters
            );

        constructionMm.textContent =
            formatNumber(
                millimeters
            );

        constructionMeters.textContent =
            formatNumber(
                meters
            );

        constructionDecimalFeet.textContent =
            formatNumber(
                decimalFeet
            );

    }


    // =========================================================
    // Quick Conversion Examples
    // =========================================================

    function updateQuickConversions() {

        if (!quickConversions) {
            return;
        }


        const category =
            categorySelect.value;


        quickConversions.innerHTML =
            "";


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

                quickConversions.appendChild(
                    div
                );

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
    // Refresh Dynamic Translations
    // =========================================================

    window.addEventListener(
        "languageChanged",
        () => {

            populateUnits();

        }
    );


    // =========================================================
    // Initial Setup
    // =========================================================

    // Give the main language script time to load
    // its translation dictionary.
    setTimeout(
        () => {

            populateUnits();

        },
        100
    );

});
