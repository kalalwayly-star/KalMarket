// ============================================
// Hourly Wage & Salary Calculator
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    // ============================================
    // Inputs
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


    // ============================================
    // Buttons
    // ============================================

    const calculateBtn =
        document.getElementById("calculateWageBtn");

    const resetBtn =
        document.getElementById("resetWageBtn");


    // ============================================
    // Results
    // ============================================

    const resultsSection =
        document.getElementById("wageResults");

    const annualIncome =
        document.getElementById("annualIncome");

    const resultHourly =
        document.getElementById("resultHourly");

    const resultWeekly =
        document.getElementById("resultWeekly");

    const resultBiweekly =
        document.getElementById("resultBiweekly");

    const resultMonthly =
        document.getElementById("resultMonthly");

    const regularAnnualIncome =
        document.getElementById("regularAnnualIncome");

    const annualOvertimeIncome =
        document.getElementById("annualOvertimeIncome");

    const totalAnnualIncome =
        document.getElementById("totalAnnualIncome");


    // ============================================
    // Helper: Get Number
    // ============================================

    function getNumber(input) {

        const value =
            parseFloat(input.value);

        return Number.isFinite(value)
            ? value
            : 0;

    }


    // ============================================
    // Currency Formatter
    // ============================================

    function formatCurrency(amount) {

        return new Intl.NumberFormat("en-CA", {
            style: "currency",
            currency: "CAD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);

    }


    // ============================================
    // Calculate
    // ============================================

    function calculateWage() {

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


        // ========================================
        // Validation
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
                "Please enter valid hours per week."
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
                "Overtime hours cannot be greater than total hours worked per week."
            );

            overtimeHoursInput.focus();

            return;

        }


        // ========================================
        // Regular Income
        // ========================================

        const regularWeeklyIncome =
            hourlyWage *
            hoursPerWeek;


        const regularBiweeklyIncome =
            regularWeeklyIncome * 2;


        const regularAnnualIncomeValue =
            regularWeeklyIncome *
            weeksPerYear;


        const regularMonthlyIncome =
            regularAnnualIncomeValue / 12;


        // ========================================
        // Overtime Income
        // ========================================

        const overtimeHourlyRate =
            hourlyWage *
            overtimeMultiplier;


        const overtimeWeeklyIncome =
            overtimeHourlyRate *
            overtimeHours;


        const annualOvertimeIncomeValue =
            overtimeWeeklyIncome *
            weeksPerYear;


        // ========================================
        // Total Income
        // ========================================

        const totalAnnualIncomeValue =
            regularAnnualIncomeValue +
            annualOvertimeIncomeValue;


        const totalMonthlyIncome =
            totalAnnualIncomeValue / 12;


        const totalWeeklyIncome =
            regularWeeklyIncome +
            overtimeWeeklyIncome;


        const totalBiweeklyIncome =
            totalWeeklyIncome * 2;


        // ========================================
        // Display Results
        // ========================================

        resultHourly.textContent =
            formatCurrency(hourlyWage);


        resultWeekly.textContent =
            formatCurrency(totalWeeklyIncome);


        resultBiweekly.textContent =
            formatCurrency(totalBiweeklyIncome);


        resultMonthly.textContent =
            formatCurrency(totalMonthlyIncome);


        annualIncome.textContent =
            formatCurrency(totalAnnualIncomeValue);


        regularAnnualIncome.textContent =
            formatCurrency(regularAnnualIncomeValue);


        annualOvertimeIncome.textContent =
            formatCurrency(annualOvertimeIncomeValue);


        totalAnnualIncome.textContent =
            formatCurrency(totalAnnualIncomeValue);


        // ========================================
        // Show Results
        // ========================================

        resultsSection.classList.add("show");


        resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    // ============================================
    // Reset
    // ============================================

    function resetCalculator() {

        hourlyWageInput.value = "";

        hoursPerWeekInput.value = "40";

        weeksPerYearInput.value = "52";

        overtimeHoursInput.value = "0";

        overtimeMultiplierInput.value = "1.5";


        resultHourly.textContent =
            "$0.00";

        resultWeekly.textContent =
            "$0.00";

        resultBiweekly.textContent =
            "$0.00";

        resultMonthly.textContent =
            "$0.00";

        annualIncome.textContent =
            "$0.00";

        regularAnnualIncome.textContent =
            "$0.00";

        annualOvertimeIncome.textContent =
            "$0.00";

        totalAnnualIncome.textContent =
            "$0.00";


        resultsSection.classList.remove("show");

    }


    // ============================================
    // Button Events
    // ============================================

    calculateBtn.addEventListener(
        "click",
        calculateWage
    );


    resetBtn.addEventListener(
        "click",
        resetCalculator
    );


    // ============================================
    // Enter Key
    // ============================================

    [
        hourlyWageInput,
        hoursPerWeekInput,
        weeksPerYearInput,
        overtimeHoursInput,
        overtimeMultiplierInput

    ].forEach(input => {

        input.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    calculateWage();

                }

            }
        );

    });

});
