// ============================================
// Debt Repayment Calculator
// ============================================

document.addEventListener("DOMContentLoaded", () => {
const monthsArabicHint =
    document.getElementById("monthsArabicHint");
    const calculateBtn =
        document.getElementById("calculateDebtBtn");

    const resetBtn =
        document.getElementById("resetDebtBtn");

    const resultsSection =
        document.getElementById("debtResults");


    // ============================================
    // Inputs
    // ============================================

    const debtBalanceInput =
        document.getElementById("debtBalance");

    const interestRateInput =
        document.getElementById("debtInterestRate");

    const monthlyPaymentInput =
        document.getElementById("monthlyDebtPayment");

    const extraPaymentInput =
        document.getElementById("extraPayment");


    // ============================================
    // Results
    // ============================================

    const payoffTime =
        document.getElementById("payoffTime");

    const debtTotalInterest =
        document.getElementById("debtTotalInterest");

    const debtTotalPaid =
        document.getElementById("debtTotalPaid");

    const debtPayment =
        document.getElementById("debtPayment");

    const remainingBalance =
        document.getElementById("remainingBalance");

    const regularPayoffTime =
        document.getElementById("regularPayoffTime");

    const extraPayoffTime =
        document.getElementById("extraPayoffTime");

    const timeSaved =
        document.getElementById("timeSaved");

    const interestSaved =
        document.getElementById("interestSaved");


    // ============================================
    // Helper: Get Number
    // ============================================

    function getNumber(input) {

        const value = parseFloat(input.value);

        return Number.isFinite(value) ? value : 0;

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
    // Format Months
    // ============================================

   function formatMonths(months) {

    if (months === 1) {
        return "1 month";
    }

    return `${months} months`;

}
    // ============================================
    // Calculate Payoff
    // ============================================

    function calculatePayoff(
        balance,
        annualRate,
        monthlyPayment
    ) {

        const monthlyRate =
            annualRate / 100 / 12;


        let currentBalance = balance;

        let totalInterest = 0;

        let totalPaid = 0;

        let months = 0;


        // Safety limit prevents infinite loops
        // in case of an invalid calculation.

        const maximumMonths = 1200;


        // ----------------------------------------
        // Zero-interest debt
        // ----------------------------------------

        if (monthlyRate === 0) {

            if (monthlyPayment <= 0) {

                return null;

            }

            months =
                Math.ceil(
                    currentBalance /
                    monthlyPayment
                );

            totalPaid =
                Math.min(
                    months * monthlyPayment,
                    balance
                );

            totalInterest = 0;


            return {
                months,
                totalInterest,
                totalPaid
            };

        }


        // ----------------------------------------
        // Payment must be greater than
        // the first month's interest.
        // ----------------------------------------

        const firstMonthInterest =
            currentBalance * monthlyRate;


        if (monthlyPayment <= firstMonthInterest) {

            return null;

        }


        // ----------------------------------------
        // Monthly payoff calculation
        // ----------------------------------------

        while (
            currentBalance > 0.005 &&
            months < maximumMonths
        ) {

            const interest =
                currentBalance *
                monthlyRate;


            let principal =
                monthlyPayment -
                interest;


            // Final payment

            if (principal > currentBalance) {

                principal =
                    currentBalance;

            }


            currentBalance -= principal;

            totalInterest += interest;

            totalPaid +=
                principal + interest;

            months++;


            // Prevent tiny negative balances

            if (currentBalance < 0.005) {

                currentBalance = 0;

            }

        }


        // ----------------------------------------
        // Could not pay off debt
        // ----------------------------------------

        if (currentBalance > 0.005) {

            return null;

        }


        return {
            months,
            totalInterest,
            totalPaid
        };

    }


    // ============================================
    // Calculate
    // ============================================

    function calculateDebt() {

        const balance =
            getNumber(debtBalanceInput);

        const annualRate =
            getNumber(interestRateInput);

        const monthlyPayment =
            getNumber(monthlyPaymentInput);

        const extraPayment =
            getNumber(extraPaymentInput);


        // ========================================
        // Validation
        // ========================================

        if (balance <= 0) {

            alert(
                "Please enter a valid debt balance."
            );

            debtBalanceInput.focus();

            return;

        }


        if (annualRate < 0) {

            alert(
                "Interest rate cannot be negative."
            );

            return;

        }


        if (monthlyPayment <= 0) {

            alert(
                "Please enter a valid monthly payment."
            );

            monthlyPaymentInput.focus();

            return;

        }


        if (extraPayment < 0) {

            alert(
                "Extra payment cannot be negative."
            );

            return;

        }


        // ========================================
        // Regular Payment Calculation
        // ========================================

        const regularResult =
            calculatePayoff(
                balance,
                annualRate,
                monthlyPayment
            );


        if (!regularResult) {

            alert(
                "Your monthly payment is too low to pay off this debt. Please increase the monthly payment."
            );

            return;

        }


        // ========================================
        // Extra Payment Calculation
        // ========================================

        const paymentWithExtra =
            monthlyPayment +
            extraPayment;


        const extraResult =
            calculatePayoff(
                balance,
                annualRate,
                paymentWithExtra
            );


        if (!extraResult) {

            alert(
                "The payment amount is not enough to pay off this debt."
            );

            return;

        }


        // ========================================
        // Compare Results
        // ========================================

        const monthsSaved =
            Math.max(
                0,
                regularResult.months -
                extraResult.months
            );


        const interestSavedAmount =
            Math.max(
                0,
                regularResult.totalInterest -
                extraResult.totalInterest
            );


        // ========================================
        // Display Main Results
        // ========================================

        payoffTime.textContent =
            formatMonths(
                extraResult.months
            );


        debtTotalInterest.textContent =
            formatCurrency(
                extraResult.totalInterest
            );


        debtTotalPaid.textContent =
            formatCurrency(
                extraResult.totalPaid
            );


        debtPayment.textContent =
            formatCurrency(
                paymentWithExtra
            );


        remainingBalance.textContent =
            formatCurrency(0);


        // ========================================
        // Extra Payment Comparison
        // ========================================

        regularPayoffTime.textContent =
            formatMonths(
                regularResult.months
            );


        extraPayoffTime.textContent =
            formatMonths(
                extraResult.months
            );


        timeSaved.textContent =
            formatMonths(
                monthsSaved
            );


        interestSaved.textContent =
            formatCurrency(
                interestSavedAmount
            );


        // ========================================
        // Show Results
        // ========================================

        resultsSection.classList.add("show");


        // Scroll to results

        resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    // ============================================
    // Reset
    // ============================================

    function resetCalculator() {

        debtBalanceInput.value = "";

        interestRateInput.value = "";

        monthlyPaymentInput.value = "";

        extraPaymentInput.value = "0";


        payoffTime.textContent =
            "0 months";

        debtTotalInterest.textContent =
            "$0.00";

        debtTotalPaid.textContent =
            "$0.00";

        debtPayment.textContent =
            "$0.00";

        remainingBalance.textContent =
            "$0.00";


        regularPayoffTime.textContent =
            "0 months";

        extraPayoffTime.textContent =
            "0 months";

        timeSaved.textContent =
            "0 months";

        interestSaved.textContent =
            "$0.00";


        resultsSection.classList.remove("show");

    }


    // ============================================
    // Button Events
    // ============================================

    calculateBtn.addEventListener(
        "click",
        calculateDebt
    );


    resetBtn.addEventListener(
        "click",
        resetCalculator
    );


    // ============================================
    // Enter Key
    // ============================================

    [
        debtBalanceInput,
        interestRateInput,
        monthlyPaymentInput,
        extraPaymentInput

    ].forEach(input => {

        input.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    calculateDebt();

                }

            }
        );

    });

});
function updateArabicHint() {

    const language =
        document.documentElement.lang;

    if (monthsArabicHint) {

        monthsArabicHint.style.display =
            language === "ar" ? "block" : "none";

    }

}
updateArabicHint();
