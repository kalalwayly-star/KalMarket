// ============================================
// Canadian Paycheck & Salary Calculator
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    // ============================================
    // INPUTS
    // ============================================

    const hourlyWageInput =
        document.getElementById("hourlyWage");

    const hoursPerWeekInput =
        document.getElementById("hoursPerWeek");

    const weeksPerYearInput =
        document.getElementById("weeksPerYear");

    const overtimeHoursInput =
        document.getElementById("overtimeHours");

    const overtimeMultiplierInput =
        document.getElementById("overtimeMultiplier");

    const provinceInput =
        document.getElementById("province");

    const payFrequencyInput =
        document.getElementById("payFrequency");

    const basicTaxCreditInput =
        document.getElementById("basicTaxCredit");

    const otherDeductionsInput =
        document.getElementById("otherDeductions");


    // ============================================
    // BUTTONS
    // ============================================

    const calculateBtn =
        document.getElementById("calculateWageBtn");

    const resetBtn =
        document.getElementById("resetWageBtn");


    // ============================================
    // RESULTS
    // ============================================

    const resultsSection =
        document.getElementById("wageResults");

    const takeHomePay =
        document.getElementById("takeHomePay");

    const payFrequencyLabel =
        document.getElementById("payFrequencyLabel");

    const grossPay =
        document.getElementById("grossPay");

    const annualGrossIncome =
        document.getElementById("annualGrossIncome");

    const annualTakeHome =
        document.getElementById("annualTakeHome");

    const monthlyTakeHome =
        document.getElementById("monthlyTakeHome");

    const cppDeduction =
        document.getElementById("cppDeduction");

    const cpp2Deduction =
        document.getElementById("cpp2Deduction");

    const eiDeduction =
        document.getElementById("eiDeduction");

    const federalTax =
        document.getElementById("federalTax");

    const provincialTax =
        document.getElementById("provincialTax");

    const otherDeductionResult =
        document.getElementById("otherDeductionResult");

    const totalDeductions =
        document.getElementById("totalDeductions");

    const annualCpp =
        document.getElementById("annualCpp");

    const annualEi =
        document.getElementById("annualEi");

    const annualFederalTax =
        document.getElementById("annualFederalTax");

    const annualProvincialTax =
        document.getElementById("annualProvincialTax");


    // ============================================
    // 2026 ESTIMATE CONSTANTS
    // ============================================

    const CPP_RATE = 0.0595;

    const CPP_BASIC_EXEMPTION = 3500;

    const CPP_MAX_PENSIONABLE_EARNINGS = 74600;

    const CPP_MAX_CONTRIBUTION = 4034.10;

    const CPP2_RATE = 0.04;

    const CPP2_LOWER_LIMIT =
        CPP_MAX_PENSIONABLE_EARNINGS;

    const CPP2_UPPER_LIMIT = 85000;

    const EI_RATE = 0.0163;

    const EI_MAX_INSURABLE_EARNINGS = 68900;

    const EI_MAX_PREMIUM = 1123.07;


    // ============================================
    // 2026 FEDERAL BASIC PERSONAL AMOUNT
    // ============================================

    const FEDERAL_BASIC_PERSONAL_AMOUNT = 16452;


    // ============================================
    // PROVINCIAL BASIC PERSONAL AMOUNTS
    // Approximate values used for estimating
    // ============================================

    const provincialBasicAmounts = {

        AB: 22323,

        BC: 12932,

        MB: 15780,

        NB: 13396,

        NL: 11067,

        NS: 8481,

        NT: 18172,

        NU: 19160,

        ON: 12989,

        PE: 13500,

        QC: 18571,

        SK: 19368,

        YT: 16452

    };


    // ============================================
    // PROVINCIAL TAX RATES
    // First-bracket estimates
    // ============================================

    const provincialRates = {

        AB: 0.08,

        BC: 0.0506,

        MB: 0.108,

        NB: 0.094,

        NL: 0.087,

        NS: 0.0879,

        NT: 0.059,

        NU: 0.04,

        ON: 0.0505,

        PE: 0.095,

        QC: 0.14,

        SK: 0.105,

        YT: 0.064

    };


    // ============================================
    // FEDERAL TAX BRACKETS
    // Simplified 2026 estimate
    // ============================================

    const federalBrackets = [

        {
            limit: 58523,
            rate: 0.145
        },

        {
            limit: 117045,
            rate: 0.205
        },

        {
            limit: 181440,
            rate: 0.26
        },

        {
            limit: 258482,
            rate: 0.29
        },

        {
            limit: Infinity,
            rate: 0.33
        }

    ];


    // ============================================
    // HELPERS
    // ============================================

    function getNumber(input) {

        const value =
            parseFloat(input.value);

        return Number.isFinite(value)
            ? value
            : 0;

    }


    function formatCurrency(amount) {

        return new Intl.NumberFormat("en-CA", {

            style: "currency",

            currency: "CAD",

            minimumFractionDigits: 2,

            maximumFractionDigits: 2

        }).format(Math.max(0, amount));

    }


    // ============================================
    // FEDERAL TAX
    // ============================================

    function calculateFederalTax(taxableIncome) {

        if (taxableIncome <= 0) {
            return 0;
        }


        let tax = 0;

        let previousLimit = 0;


        for (const bracket of federalBrackets) {

            const taxableAtThisRate =
                Math.min(
                    taxableIncome,
                    bracket.limit
                ) - previousLimit;


            if (taxableAtThisRate > 0) {

                tax +=
                    taxableAtThisRate *
                    bracket.rate;

            }


            if (
                taxableIncome <=
                bracket.limit
            ) {
                break;
            }


            previousLimit =
                bracket.limit;

        }


        return Math.max(0, tax);

    }


    // ============================================
    // PROVINCIAL TAX
    // ============================================

    function calculateProvincialTax(
        taxableIncome,
        province
    ) {

        if (taxableIncome <= 0) {
            return 0;
        }


        const rate =
            provincialRates[province] ||
            provincialRates.AB;


        return taxableIncome * rate;

    }


    // ============================================
    // CPP
    // ============================================

    function calculateCPP(annualIncome) {

        const pensionableIncome =
            Math.max(
                0,
                Math.min(
                    annualIncome,
                    CPP_MAX_PENSIONABLE_EARNINGS
                ) - CPP_BASIC_EXEMPTION
            );


        const cpp =
            pensionableIncome *
            CPP_RATE;


        return Math.min(
            cpp,
            CPP_MAX_CONTRIBUTION
        );

    }


    // ============================================
    // CPP2
    // ============================================

    function calculateCPP2(annualIncome) {

        if (
            annualIncome <=
            CPP2_LOWER_LIMIT
        ) {
            return 0;
        }


        const cpp2Earnings =
            Math.min(
                annualIncome,
                CPP2_UPPER_LIMIT
            ) -
            CPP2_LOWER_LIMIT;


        return Math.max(
            0,
            cpp2Earnings * CPP2_RATE
        );

    }


    // ============================================
    // EI
    // ============================================

    function calculateEI(annualIncome) {

        const insurableEarnings =
            Math.min(
                annualIncome,
                EI_MAX_INSURABLE_EARNINGS
            );


        return Math.min(
            insurableEarnings * EI_RATE,
            EI_MAX_PREMIUM
        );

    }


    // ============================================
    // PAY FREQUENCY
    // ============================================

    function getPayPeriodsPerYear() {

        switch (payFrequencyInput.value) {

            case "weekly":
                return 52;

            case "biweekly":
                return 26;

            case "semimonthly":
                return 24;

            case "monthly":
                return 12;

            default:
                return 26;

        }

    }


    function getPayFrequencyName() {

        switch (payFrequencyInput.value) {

            case "weekly":
                return "Weekly";

            case "biweekly":
                return "Biweekly";

            case "semimonthly":
                return "Semi-Monthly";

            case "monthly":
                return "Monthly";

            default:
                return "Biweekly";

        }

    }


    // ============================================
    // MAIN CALCULATION
    // ============================================

    function calculatePaycheck() {

        const hourlyWage =
            getNumber(hourlyWageInput);

        const hoursPerWeek =
            getNumber(hoursPerWeekInput);

        const weeksPerYear =
            getNumber(weeksPerYearInput);

        const overtimeHours =
            getNumber(overtimeHoursInput);

        const overtimeMultiplier =
            getNumber(overtimeMultiplierInput);

        const province =
            provinceInput.value;

        const otherDeductions =
            getNumber(otherDeductionsInput);


        // ========================================
        // VALIDATION
        // ========================================

        if (hourlyWage <= 0) {

            alert(
                "Please enter a valid hourly wage."
            );

            hourlyWageInput.focus();

            return;

        }


        if (
            hoursPerWeek <= 0 ||
            hoursPerWeek > 168
        ) {

            alert(
                "Please enter valid weekly hours."
            );

            hoursPerWeekInput.focus();

            return;

        }


        if (
            weeksPerYear <= 0 ||
            weeksPerYear > 52
        ) {

            alert(
                "Weeks per year must be between 1 and 52."
            );

            weeksPerYearInput.focus();

            return;

        }


        if (overtimeHours < 0) {

            alert(
                "Overtime hours cannot be negative."
            );

            overtimeHoursInput.focus();

            return;

        }


        if (overtimeHours > hoursPerWeek) {

            alert(
                "Overtime hours cannot exceed total weekly hours."
            );

            overtimeHoursInput.focus();

            return;

        }


        // ========================================
        // REGULAR PAY
        // ========================================

        const regularWeeklyPay =
            hourlyWage *
            hoursPerWeek;


        const regularAnnualPay =
            regularWeeklyPay *
            weeksPerYear;


        // ========================================
        // OVERTIME PAY
        // ========================================

        const overtimeHourlyRate =
            hourlyWage *
            overtimeMultiplier;


        const overtimeWeeklyPay =
            overtimeHourlyRate *
            overtimeHours;


        const annualOvertimePay =
            overtimeWeeklyPay *
            weeksPerYear;


        // ========================================
        // TOTAL GROSS INCOME
        // ========================================

        const annualGross =
            regularAnnualPay +
            annualOvertimePay;


        // ========================================
        // PAYROLL DEDUCTIONS
        // ========================================

        const cpp =
            calculateCPP(annualGross);


        const cpp2 =
            calculateCPP2(annualGross);


        const ei =
            calculateEI(annualGross);


        // ========================================
        // TAXABLE INCOME
        // ========================================

        const federalBasicAmount =
            basicTaxCreditInput.value === "standard"
                ? FEDERAL_BASIC_PERSONAL_AMOUNT
                : 0;


        const provincialBasicAmount =
            provincialBasicAmounts[province] || 0;


        const federalTaxableIncome =
            Math.max(
                0,
                annualGross -
                cpp -
                cpp2 -
                federalBasicAmount -
                otherDeductions
            );


        const provincialTaxableIncome =
            Math.max(
                0,
                annualGross -
                cpp -
                cpp2 -
                provincialBasicAmount -
                otherDeductions
            );


        // ========================================
        // TAX
        // ========================================

        const federalTaxBeforeCredit =
            calculateFederalTax(
                federalTaxableIncome
            );


        const federalBasicCredit =
            federalBasicAmount *
            0.145;


        const estimatedFederalTax =
            Math.max(
                0,
                federalTaxBeforeCredit -
                federalBasicCredit
            );


        const estimatedProvincialTax =
            calculateProvincialTax(
                provincialTaxableIncome,
                province
            );


        // ========================================
        // TOTAL DEDUCTIONS
        // ========================================

        const totalAnnualDeductions =
            cpp +
            cpp2 +
            ei +
            estimatedFederalTax +
            estimatedProvincialTax +
            otherDeductions;


        // ========================================
        // TAKE HOME
        // ========================================

        const annualNetIncome =
            Math.max(
                0,
                annualGross -
                totalAnnualDeductions
            );


        const monthlyNetIncome =
            annualNetIncome / 12;


        // ========================================
        // PAY PERIOD
        // ========================================

        const payPeriods =
            getPayPeriodsPerYear();


        const grossPayForPeriod =
            annualGross /
            payPeriods;


        const netPayForPeriod =
            annualNetIncome /
            payPeriods;


        // ========================================
        // DISPLAY
        // ========================================

        grossPay.textContent =
            formatCurrency(
                grossPayForPeriod
            );


        annualGrossIncome.textContent =
            formatCurrency(
                annualGross
            );


        takeHomePay.textContent =
            formatCurrency(
                netPayForPeriod
            );


        annualTakeHome.textContent =
            formatCurrency(
                annualNetIncome
            );


        monthlyTakeHome.textContent =
            formatCurrency(
                monthlyNetIncome
            );


        cppDeduction.textContent =
            formatCurrency(cpp);


        cpp2Deduction.textContent =
            formatCurrency(cpp2);


        eiDeduction.textContent =
            formatCurrency(ei);


        federalTax.textContent =
            formatCurrency(
                estimatedFederalTax
            );


        provincialTax.textContent =
            formatCurrency(
                estimatedProvincialTax
            );


        otherDeductionResult.textContent =
            formatCurrency(
                otherDeductions
            );


        totalDeductions.textContent =
            formatCurrency(
                totalAnnualDeductions
            );


        annualCpp.textContent =
            formatCurrency(cpp);


        annualEi.textContent =
            formatCurrency(ei);


        annualFederalTax.textContent =
            formatCurrency(
                estimatedFederalTax
            );


        annualProvincialTax.textContent =
            formatCurrency(
                estimatedProvincialTax
            );


        payFrequencyLabel.textContent =
            getPayFrequencyName();


        // ========================================
        // SHOW RESULTS
        // ========================================

        resultsSection.classList.add("show");


        resultsSection.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }


    // ============================================
    // RESET
    // ============================================

    function resetCalculator() {

        hourlyWageInput.value = "";

        hoursPerWeekInput.value = "40";

        weeksPerYearInput.value = "52";

        overtimeHoursInput.value = "0";

        overtimeMultiplierInput.value = "1.5";

        provinceInput.value = "AB";

        payFrequencyInput.value = "biweekly";

        basicTaxCreditInput.value = "standard";

        otherDeductionsInput.value = "0";


        takeHomePay.textContent =
            "$0.00";

        grossPay.textContent =
            "$0.00";

        annualGrossIncome.textContent =
            "$0.00";

        annualTakeHome.textContent =
            "$0.00";

        monthlyTakeHome.textContent =
            "$0.00";

        cppDeduction.textContent =
            "$0.00";

        cpp2Deduction.textContent =
            "$0.00";

        eiDeduction.textContent =
            "$0.00";

        federalTax.textContent =
            "$0.00";

        provincialTax.textContent =
            "$0.00";

        otherDeductionResult.textContent =
            "$0.00";

        totalDeductions.textContent =
            "$0.00";

        annualCpp.textContent =
            "$0.00";

        annualEi.textContent =
            "$0.00";

        annualFederalTax.textContent =
            "$0.00";

        annualProvincialTax.textContent =
            "$0.00";


        payFrequencyLabel.textContent =
            "Biweekly";


        resultsSection.classList.remove("show");

    }


    // ============================================
    // BUTTON EVENTS
    // ============================================

    calculateBtn.addEventListener(
        "click",
        calculatePaycheck
    );


    resetBtn.addEventListener(
        "click",
        resetCalculator
    );


    // ============================================
    // ENTER KEY
    // ============================================

    [

        hourlyWageInput,
        hoursPerWeekInput,
        weeksPerYearInput,
        overtimeHoursInput,
        overtimeMultiplierInput,
        provinceInput,
        payFrequencyInput,
        basicTaxCreditInput,
        otherDeductionsInput

    ].forEach(input => {

        input.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    calculatePaycheck();

                }

            }
        );

    });

});
