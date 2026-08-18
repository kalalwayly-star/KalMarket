// ============================================
// Loan Payment Calculator
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const calculateBtn =
        document.getElementById("calculateLoanBtn");

    const resetBtn =
        document.getElementById("resetLoanBtn");

    const resultsSection =
        document.getElementById("loanResults");


    // Inputs
    const loanAmountInput =
        document.getElementById("loanAmount");

    const interestRateInput =
        document.getElementById("interestRate");

    const loanTermInput =
        document.getElementById("loanTerm");

    const paymentFrequencyInput =
        document.getElementById("paymentFrequency");


    // Results
    const paymentAmount =
        document.getElementById("paymentAmount");

    const paymentLabel =
        document.getElementById("paymentLabel");

    const resultLoanAmount =
        document.getElementById("resultLoanAmount");

    const resultTotalInterest =
        document.getElementById("resultTotalInterest");

    const resultTotalPayments =
        document.getElementById("resultTotalPayments");

    const resultNumberPayments =
        document.getElementById("resultNumberPayments");


    // ============================================
    // Helper
    // ============================================

    function getNumber(input) {

        const value = parseFloat(input.value);

        return Number.isFinite(value) ? value : 0;

    }


    // ============================================
    // Currency
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

    function calculateLoan() {

        const loanAmount =
            getNumber(loanAmountInput);

        const annualInterestRate =
            getNumber(interestRateInput);

        const loanTermMonths =
            getNumber(loanTermInput);

        const frequency =
            paymentFrequencyInput.value;


        // Validation

        if (loanAmount <= 0) {

            alert("Please enter a valid loan amount.");

            loanAmountInput.focus();

            return;
        }


        if (annualInterestRate < 0) {

            alert("Interest rate cannot be negative.");

            return;
        }


        if (loanTermMonths <= 0) {

            alert("Please select a valid loan term.");

            return;
        }


        // ========================================
        // Determine Payment Frequency
        // ========================================

        let paymentsPerYear;
        let paymentLabelText;


        if (frequency === "weekly") {

            paymentsPerYear = 52;
            paymentLabelText = "Weekly Payment";

        } else if (frequency === "biweekly") {

            paymentsPerYear = 26;
            paymentLabelText = "Biweekly Payment";

        } else {

            paymentsPerYear = 12;
            paymentLabelText = "Monthly Payment";

        }


        // ========================================
        // Number of Payments
        // ========================================

        const numberOfPayments =
            Math.round(
                loanTermMonths *
                paymentsPerYear /
                12
            );


        // ========================================
        // Periodic Interest Rate
        // ========================================

        const periodicRate =
            annualInterestRate /
            100 /
            paymentsPerYear;


        // ========================================
        // Payment Calculation
        // ========================================

        let payment;


        if (periodicRate === 0) {

            payment =
                loanAmount /
                numberOfPayments;

        } else {

            payment =
                loanAmount *
                (
                    periodicRate *
                    Math.pow(
                        1 + periodicRate,
                        numberOfPayments
                    )
                ) /
                (
                    Math.pow(
                        1 + periodicRate,
                        numberOfPayments
                    ) - 1
                );

        }


        // ========================================
        // Total Payments
        // ========================================

        const totalPayments =
            payment *
            numberOfPayments;


        // ========================================
        // Total Interest
        // ========================================

        const totalInterest =
            Math.max(
                0,
                totalPayments - loanAmount
            );


        // ========================================
        // Display
        // ========================================

        paymentLabel.textContent =
            paymentLabelText;

        paymentAmount.textContent =
            formatCurrency(payment);

        resultLoanAmount.textContent =
            formatCurrency(loanAmount);

        resultTotalInterest.textContent =
            formatCurrency(totalInterest);

        resultTotalPayments.textContent =
            formatCurrency(totalPayments);

        resultNumberPayments.textContent =
            numberOfPayments;


        // Show results

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

        loanAmountInput.value = "";

        interestRateInput.value = "";

        loanTermInput.value = "60";

        paymentFrequencyInput.value = "monthly";


        paymentLabel.textContent =
            "Monthly Payment";

        paymentAmount.textContent =
            "$0.00";

        resultLoanAmount.textContent =
            "$0.00";

        resultTotalInterest.textContent =
            "$0.00";

        resultTotalPayments.textContent =
            "$0.00";

        resultNumberPayments.textContent =
            "0";


        resultsSection.classList.remove("show");

    }


    // ============================================
    // Events
    // ============================================

    calculateBtn.addEventListener(
        "click",
        calculateLoan
    );

    resetBtn.addEventListener(
        "click",
        resetCalculator
    );


    // Enter key

    [
        loanAmountInput,
        interestRateInput,
        loanTermInput,
        paymentFrequencyInput
    ].forEach(input => {

        input.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                calculateLoan();

            }

        });

    });

});
