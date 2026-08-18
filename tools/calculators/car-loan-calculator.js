// ============================================
// Car Loan & Payment Calculator
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const calculateBtn = document.getElementById("calculateCarLoanBtn");
    const resetBtn = document.getElementById("resetCarLoanBtn");

    const resultsSection = document.getElementById("carLoanResults");

    // Input fields
    const vehiclePriceInput = document.getElementById("vehiclePrice");
    const downPaymentInput = document.getElementById("downPayment");
    const tradeInInput = document.getElementById("tradeIn");
    const interestRateInput = document.getElementById("interestRate");
    const loanTermInput = document.getElementById("loanTerm");
    const taxRateInput = document.getElementById("taxRate");

    // Result fields
    const monthlyPaymentResult = document.getElementById("monthlyPayment");
    const loanAmountResult = document.getElementById("loanAmount");
    const totalInterestResult = document.getElementById("totalInterest");
    const totalPaymentsResult = document.getElementById("totalPayments");
    const totalVehicleCostResult = document.getElementById("totalVehicleCost");


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
    // Calculate Car Loan
    // ============================================

    function calculateCarLoan() {

        const vehiclePrice = getNumber(vehiclePriceInput);
        const downPayment = getNumber(downPaymentInput);
        const tradeIn = getNumber(tradeInInput);
        const interestRate = getNumber(interestRateInput);
        const loanTerm = getNumber(loanTermInput);
        const taxRate = getNumber(taxRateInput);


        // ----------------------------------------
        // Validation
        // ----------------------------------------

        if (vehiclePrice <= 0) {

            alert("Please enter a valid vehicle price.");

            vehiclePriceInput.focus();

            return;
        }


        if (downPayment < 0 || tradeIn < 0) {

            alert("Down payment and trade-in value cannot be negative.");

            return;
        }


        if (interestRate < 0) {

            alert("Interest rate cannot be negative.");

            return;
        }


        if (taxRate < 0) {

            alert("Sales tax cannot be negative.");

            return;
        }


        if (loanTerm <= 0) {

            alert("Please select a valid loan term.");

            return;
        }


        // ----------------------------------------
        // Calculate Sales Tax
        // ----------------------------------------

        const salesTax = vehiclePrice * (taxRate / 100);


        // ----------------------------------------
        // Calculate Amount Financed
        // ----------------------------------------

        let loanAmount =
            vehiclePrice +
            salesTax -
            downPayment -
            tradeIn;


        // Prevent negative loan amount

        if (loanAmount < 0) {

            loanAmount = 0;

        }


        // ----------------------------------------
        // Calculate Monthly Interest Rate
        // ----------------------------------------

        const monthlyInterestRate =
            interestRate / 100 / 12;


        // ----------------------------------------
        // Calculate Monthly Payment
        // ----------------------------------------

        let monthlyPayment = 0;


        if (loanAmount === 0) {

            monthlyPayment = 0;

        } else if (monthlyInterestRate === 0) {

            // No-interest loan

            monthlyPayment =
                loanAmount / loanTerm;

        } else {

            // Standard loan payment formula

            monthlyPayment =
                loanAmount *
                (
                    monthlyInterestRate *
                    Math.pow(
                        1 + monthlyInterestRate,
                        loanTerm
                    )
                ) /
                (
                    Math.pow(
                        1 + monthlyInterestRate,
                        loanTerm
                    ) - 1
                );

        }


        // ----------------------------------------
        // Total Loan Payments
        // ----------------------------------------

        const totalPayments =
            monthlyPayment * loanTerm;


        // ----------------------------------------
        // Total Interest
        // ----------------------------------------

        const totalInterest =
            Math.max(
                0,
                totalPayments - loanAmount
            );


        // ----------------------------------------
        // Total Vehicle Cost
        // ----------------------------------------

        const totalVehicleCost =
            vehiclePrice +
            salesTax +
            totalInterest;


        // ----------------------------------------
        // Display Results
        // ----------------------------------------

        monthlyPaymentResult.textContent =
            formatCurrency(monthlyPayment);


        loanAmountResult.textContent =
            formatCurrency(loanAmount);


        totalInterestResult.textContent =
            formatCurrency(totalInterest);


        totalPaymentsResult.textContent =
            formatCurrency(totalPayments);


        totalVehicleCostResult.textContent =
            formatCurrency(totalVehicleCost);


        // ----------------------------------------
        // Show Results
        // ----------------------------------------

        resultsSection.classList.add("show");


        // Scroll to results

        resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    // ============================================
    // Reset Calculator
    // ============================================

    function resetCalculator() {

        vehiclePriceInput.value = "";

        downPaymentInput.value = "0";

        tradeInInput.value = "0";

        interestRateInput.value = "";

        loanTermInput.value = "60";

        taxRateInput.value = "12";


        // Reset results

        monthlyPaymentResult.textContent = "$0.00";

        loanAmountResult.textContent = "$0.00";

        totalInterestResult.textContent = "$0.00";

        totalPaymentsResult.textContent = "$0.00";

        totalVehicleCostResult.textContent = "$0.00";


        // Hide results

        resultsSection.classList.remove("show");

    }


    // ============================================
    // Button Events
    // ============================================

    calculateBtn.addEventListener(
        "click",
        calculateCarLoan
    );


    resetBtn.addEventListener(
        "click",
        resetCalculator
    );


    // ============================================
    // Allow Enter Key to Calculate
    // ============================================

    [
        vehiclePriceInput,
        downPaymentInput,
        tradeInInput,
        interestRateInput,
        loanTermInput,
        taxRateInput
    ].forEach(input => {

        input.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                calculateCarLoan();

            }

        });

    });

});
