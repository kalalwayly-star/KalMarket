// ============================================
// 1-Year Cash Flow & Business Projection
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    // ============================================
    // INPUTS
    // ============================================

    const startingCash =
        document.getElementById("startingCash");

    const projectionStartMonth =
        document.getElementById("projectionStartMonth");

    const monthlySales =
        document.getElementById("monthlySales");

    const salesGrowth =
        document.getElementById("salesGrowth");

    const otherIncome =
        document.getElementById("otherIncome");

    const rentExpense =
        document.getElementById("rentExpense");

    const payrollExpense =
        document.getElementById("payrollExpense");

    const inventoryExpense =
        document.getElementById("inventoryExpense");

    const utilitiesExpense =
        document.getElementById("utilitiesExpense");

    const insuranceExpense =
        document.getElementById("insuranceExpense");

    const marketingExpense =
        document.getElementById("marketingExpense");

    const transportationExpense =
        document.getElementById("transportationExpense");

    const softwareExpense =
        document.getElementById("softwareExpense");

    const taxExpense =
        document.getElementById("taxExpense");

    const otherExpense =
        document.getElementById("otherExpense");

    const expenseGrowth =
        document.getElementById("expenseGrowth");

    // Loan

    const loanAmount =
        document.getElementById("loanAmount");

    const loanInterest =
        document.getElementById("loanInterest");

    const loanTerm =
        document.getElementById("loanTerm");

    const loanStartMonth =
        document.getElementById("loanStartMonth");


    // ============================================
    // BUTTONS
    // ============================================

    const calculateBtn =
        document.getElementById("calculateCashFlowBtn");

    const resetBtn =
        document.getElementById("resetCashFlowBtn");


    // ============================================
    // RESULTS
    // ============================================

    const resultsSection =
        document.getElementById("cashFlowResults");

    const yearEndCash =
        document.getElementById("yearEndCash");

    const annualNetCashFlow =
        document.getElementById("annualNetCashFlow");

    const averageMonthlyCashFlow =
        document.getElementById("averageMonthlyCashFlow");

    const lowestCashBalance =
        document.getElementById("lowestCashBalance");

    const totalLoanPayments =
        document.getElementById("totalLoanPayments");

    const totalInterestPaid =
        document.getElementById("totalInterestPaid");

    const cashFlowStatus =
        document.getElementById("cashFlowStatus");

    const cashFlowStatusText =
        document.getElementById("cashFlowStatusText");


    // Loan result

    const resultLoanAmount =
        document.getElementById("resultLoanAmount");

    const monthlyLoanPayment =
        document.getElementById("monthlyLoanPayment");

    const totalLoanCost =
        document.getElementById("totalLoanCost");


    // Table

    const projectionTableBody =
        document.getElementById("projectionTableBody");

    const totalSales =
        document.getElementById("totalSales");

    const totalOtherIncome =
        document.getElementById("totalOtherIncome");

    const totalExpenses =
        document.getElementById("totalExpenses");

    const totalLoanPaymentsTable =
        document.getElementById("totalLoanPaymentsTable");

    const totalNetCashFlow =
        document.getElementById("totalNetCashFlow");

    const endingCashTable =
        document.getElementById("endingCashTable");


    // ============================================
    // MONTHS
    // ============================================

    const monthKeys = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december"
    ];


    const defaultMonthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    // ============================================
    // HELPERS
    // ============================================

    function getNumber(element) {

        const value =
            parseFloat(element.value);

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

        }).format(amount);

    }


    function getMonthName(index) {

        const key =
            monthKeys[index];

        // Use the active translation if available

        if (
            window.translations &&
            window.translations[key]
        ) {

            return window.translations[key];

        }

        return defaultMonthNames[index];

    }


    // ============================================
    // LOAN PAYMENT
    // ============================================

    function calculateMonthlyLoanPayment(
        principal,
        annualRate,
        years
    ) {

        if (principal <= 0) {
            return 0;
        }


        const months =
            years * 12;


        const monthlyRate =
            annualRate / 100 / 12;


        // Zero-interest loan

        if (monthlyRate === 0) {

            return principal / months;

        }


        const payment =
            principal *
            (
                monthlyRate *
                Math.pow(
                    1 + monthlyRate,
                    months
                )
            ) /
            (
                Math.pow(
                    1 + monthlyRate,
                    months
                ) - 1
            );


        return payment;

    }


    // ============================================
    // MAIN CALCULATION
    // ============================================

    function calculateCashFlow() {

        // ========================================
        // READ INPUTS
        // ========================================

        const startingCashValue =
            Math.max(
                0,
                getNumber(startingCash)
            );


        const startMonth =
            Math.min(
                11,
                Math.max(
                    0,
                    getNumber(projectionStartMonth)
                )
            );


        const baseSales =
            Math.max(
                0,
                getNumber(monthlySales)
            );


        const salesGrowthRate =
            getNumber(salesGrowth) / 100;


        const baseOtherIncome =
            Math.max(
                0,
                getNumber(otherIncome)
            );


        // Expenses

        const baseExpenses =
            Math.max(0, getNumber(rentExpense)) +
            Math.max(0, getNumber(payrollExpense)) +
            Math.max(0, getNumber(inventoryExpense)) +
            Math.max(0, getNumber(utilitiesExpense)) +
            Math.max(0, getNumber(insuranceExpense)) +
            Math.max(0, getNumber(marketingExpense)) +
            Math.max(0, getNumber(transportationExpense)) +
            Math.max(0, getNumber(softwareExpense)) +
            Math.max(0, getNumber(taxExpense)) +
            Math.max(0, getNumber(otherExpense));


        const expenseGrowthRate =
            getNumber(expenseGrowth) / 100;


        // Loan

        const principal =
            Math.max(
                0,
                getNumber(loanAmount)
            );


        const annualInterestRate =
            Math.max(
                0,
                getNumber(loanInterest)
            );


        const termYears =
            Math.max(
                1,
                getNumber(loanTerm)
            );


        const loanStart =
            Math.min(
                11,
                Math.max(
                    0,
                    getNumber(loanStartMonth)
                )
            );


        // ========================================
        // VALIDATION
        // ========================================

        if (baseSales <= 0 && baseOtherIncome <= 0) {

            alert(
                "Please enter expected monthly sales or other income."
            );

            monthlySales.focus();

            return;

        }


        if (principal > 0 && annualInterestRate < 0) {

            alert(
                "Loan interest rate cannot be negative."
            );

            loanInterest.focus();

            return;

        }


        // ========================================
        // LOAN CALCULATION
        // ========================================

        const loanPayment =
            calculateMonthlyLoanPayment(
                principal,
                annualInterestRate,
                termYears
            );


        const loanTermMonths =
            termYears * 12;


        // ========================================
        // PROJECTION VARIABLES
        // ========================================

        let cashBalance =
            startingCashValue;


        let annualSalesTotal = 0;

        let annualOtherIncomeTotal = 0;

        let annualExpensesTotal = 0;

        let annualLoanPaymentsTotal = 0;

        let annualInterestTotal = 0;

        let annualNetCashFlowTotal = 0;


        let lowestCash =
            startingCashValue;


        let lowestCashMonth =
            startMonth;


        let projectionRows = [];


        // ========================================
        // BUILD 12-MONTH PROJECTION
        // ========================================

        for (let i = 0; i < 12; i++) {

            // Month displayed on calendar

            const calendarMonth =
                (startMonth + i) % 12;


            // ====================================
            // SALES GROWTH
            // ====================================

            const salesForMonth =
                baseSales *
                Math.pow(
                    1 + salesGrowthRate,
                    i
                );


            // ====================================
            // OTHER INCOME
            // ====================================

            const otherIncomeForMonth =
                baseOtherIncome *
                Math.pow(
                    1 + salesGrowthRate,
                    i
                );


            // ====================================
            // EXPENSE GROWTH
            // ====================================

            const expensesForMonth =
                baseExpenses *
                Math.pow(
                    1 + expenseGrowthRate,
                    i
                );


            // ====================================
            // LOAN PAYMENT
            // ====================================

            let loanPaymentForMonth = 0;

            let interestForMonth = 0;


            if (
                principal > 0 &&
                i >=
                (
                    loanStart -
                    startMonth +
                    12
                ) % 12
            ) {

                const paymentNumber =
                    i -
                    (
                        loanStart -
                        startMonth +
                        12
                    ) % 12;


                if (
                    paymentNumber >= 0 &&
                    paymentNumber < loanTermMonths
                ) {

                    loanPaymentForMonth =
                        loanPayment;


                    // Remaining balance before payment

                    const monthlyRate =
                        annualInterestRate /
                        100 /
                        12;


                    let remainingBalance =
                        principal;


                    if (monthlyRate === 0) {

                        remainingBalance =
                            Math.max(
                                0,
                                principal -
                                loanPayment *
                                paymentNumber
                            );

                        interestForMonth = 0;

                    } else {

                        remainingBalance =
                            principal *
                            Math.pow(
                                1 + monthlyRate,
                                paymentNumber
                            ) -
                            loanPayment *
                            (
                                (
                                    Math.pow(
                                        1 + monthlyRate,
                                        paymentNumber
                                    ) - 1
                                ) /
                                monthlyRate
                            );


                        remainingBalance =
                            Math.max(
                                0,
                                remainingBalance
                            );


                        interestForMonth =
                            remainingBalance *
                            monthlyRate;

                    }


                    // Don't let final payment exceed
                    // the remaining balance + interest

                    if (
                        loanPaymentForMonth >
                        remainingBalance +
                        interestForMonth
                    ) {

                        loanPaymentForMonth =
                            remainingBalance +
                            interestForMonth;

                    }

                }

            }


            // ====================================
            // TOTAL CASH INFLOW
            // ====================================

            const totalIncome =
                salesForMonth +
                otherIncomeForMonth;


            // ====================================
            // TOTAL CASH OUTFLOW
            // ====================================

            const totalOutflow =
                expensesForMonth +
                loanPaymentForMonth;


            // ====================================
            // NET CASH FLOW
            // ====================================

            const netCashFlow =
                totalIncome -
                totalOutflow;


            // ====================================
            // ENDING CASH
            // ====================================

            cashBalance +=
                netCashFlow;


            // ====================================
            // LOWEST CASH
            // ====================================

            if (
                cashBalance <
                lowestCash
            ) {

                lowestCash =
                    cashBalance;

                lowestCashMonth =
                    calendarMonth;

            }


            // ====================================
            // TOTALS
            // ====================================

            annualSalesTotal +=
                salesForMonth;


            annualOtherIncomeTotal +=
                otherIncomeForMonth;


            annualExpensesTotal +=
                expensesForMonth;


            annualLoanPaymentsTotal +=
                loanPaymentForMonth;


            annualInterestTotal +=
                interestForMonth;


            annualNetCashFlowTotal +=
                netCashFlow;


            // ====================================
            // STORE ROW
            // ====================================

            projectionRows.push({

                month: calendarMonth,

                sales: salesForMonth,

                otherIncome:
                    otherIncomeForMonth,

                expenses:
                    expensesForMonth,

                loanPayment:
                    loanPaymentForMonth,

                interest:
                    interestForMonth,

                netCashFlow:
                    netCashFlow,

                endingCash:
                    cashBalance

            });

        }


        // ========================================
        // DISPLAY SUMMARY
        // ========================================

        yearEndCash.textContent =
            formatCurrency(
                cashBalance
            );


        annualNetCashFlow.textContent =
            formatCurrency(
                annualNetCashFlowTotal
            );


        averageMonthlyCashFlow.textContent =
            formatCurrency(
                annualNetCashFlowTotal / 12
            );


        lowestCashBalance.textContent =
            formatCurrency(
                lowestCash
            );


        totalLoanPayments.textContent =
            formatCurrency(
                annualLoanPaymentsTotal
            );


        totalInterestPaid.textContent =
            formatCurrency(
                annualInterestTotal
            );


        // ========================================
        // LOAN SUMMARY
        // ========================================

        resultLoanAmount.textContent =
            formatCurrency(
                principal
            );


        monthlyLoanPayment.textContent =
            formatCurrency(
                loanPayment
            );


        totalLoanCost.textContent =
            formatCurrency(
                loanPayment *
                loanTermMonths
            );


        // ========================================
        // CASH FLOW STATUS
        // ========================================

        cashFlowStatus.classList.remove(
            "positive",
            "negative"
        );


        if (lowestCash < 0) {

            cashFlowStatus.classList.add(
                "negative"
            );


            cashFlowStatusText.textContent =
                getTranslation(
                    "cash_flow_negative"
                ) ||
                "⚠️ Potential Cash Shortage: Your projected cash balance becomes negative during the year.";

        } else {

            cashFlowStatus.classList.add(
                "positive"
            );


            cashFlowStatusText.textContent =
                getTranslation(
                    "cash_flow_positive"
                ) ||
                "🟢 Positive Cash Flow: Your projected cash balance remains positive throughout the year.";

        }


        // ========================================
        // BUILD TABLE
        // ========================================

        projectionTableBody.innerHTML = "";


        projectionRows.forEach(row => {

            const tr =
                document.createElement("tr");


            tr.innerHTML = `

                <td>
                    ${getMonthName(row.month)}
                </td>

                <td>
                    ${formatCurrency(row.sales)}
                </td>

                <td>
                    ${formatCurrency(row.otherIncome)}
                </td>

                <td>
                    ${formatCurrency(row.expenses)}
                </td>

                <td>
                    ${formatCurrency(row.loanPayment)}
                </td>

                <td>
                    ${formatCurrency(row.netCashFlow)}
                </td>

                <td>
                    ${formatCurrency(row.endingCash)}
                </td>

            `;


            projectionTableBody.appendChild(tr);

        });


        // ========================================
        // TABLE TOTALS
        // ========================================

        totalSales.textContent =
            formatCurrency(
                annualSalesTotal
            );


        totalOtherIncome.textContent =
            formatCurrency(
                annualOtherIncomeTotal
            );


        totalExpenses.textContent =
            formatCurrency(
                annualExpensesTotal
            );


        totalLoanPaymentsTable.textContent =
            formatCurrency(
                annualLoanPaymentsTotal
            );


        totalNetCashFlow.textContent =
            formatCurrency(
                annualNetCashFlowTotal
            );


        endingCashTable.textContent =
            formatCurrency(
                cashBalance
            );


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
    // TRANSLATION HELPER
    // ============================================

    function getTranslation(key) {

        if (
            window.translations &&
            window.translations[key]
        ) {

            return window.translations[key];

        }

        return "";

    }


    // ============================================
    // RESET
    // ============================================

    function resetCalculator() {

        startingCash.value = "0";

        projectionStartMonth.value = "0";

        monthlySales.value = "0";

        salesGrowth.value = "0";

        otherIncome.value = "0";

        rentExpense.value = "0";

        payrollExpense.value = "0";

        inventoryExpense.value = "0";

        utilitiesExpense.value = "0";

        insuranceExpense.value = "0";

        marketingExpense.value = "0";

        transportationExpense.value = "0";

        softwareExpense.value = "0";

        taxExpense.value = "0";

        otherExpense.value = "0";

        expenseGrowth.value = "0";

        loanAmount.value = "0";

        loanInterest.value = "0";

        loanTerm.value = "5";

        loanStartMonth.value = "0";


        // Reset results

        yearEndCash.textContent =
            "$0.00";

        annualNetCashFlow.textContent =
            "$0.00";

        averageMonthlyCashFlow.textContent =
            "$0.00";

        lowestCashBalance.textContent =
            "$0.00";

        totalLoanPayments.textContent =
            "$0.00";

        totalInterestPaid.textContent =
            "$0.00";


        resultLoanAmount.textContent =
            "$0.00";

        monthlyLoanPayment.textContent =
            "$0.00";

        totalLoanCost.textContent =
            "$0.00";


        totalSales.textContent =
            "$0.00";

        totalOtherIncome.textContent =
            "$0.00";

        totalExpenses.textContent =
            "$0.00";

        totalLoanPaymentsTable.textContent =
            "$0.00";

        totalNetCashFlow.textContent =
            "$0.00";

        endingCashTable.textContent =
            "$0.00";


        projectionTableBody.innerHTML =
            "";


        cashFlowStatus.classList.remove(
            "positive",
            "negative"
        );


        cashFlowStatusText.textContent =
            "Cash flow status";


        resultsSection.classList.remove(
            "show"
        );

    }


    // ============================================
    // BUTTON EVENTS
    // ============================================

    calculateBtn.addEventListener(
        "click",
        calculateCashFlow
    );


    resetBtn.addEventListener(
        "click",
        resetCalculator
    );


    // ============================================
    // ENTER KEY
    // ============================================

    const inputs = [

        startingCash,
        projectionStartMonth,
        monthlySales,
        salesGrowth,
        otherIncome,

        rentExpense,
        payrollExpense,
        inventoryExpense,
        utilitiesExpense,
        insuranceExpense,
        marketingExpense,
        transportationExpense,
        softwareExpense,
        taxExpense,
        otherExpense,
        expenseGrowth,

        loanAmount,
        loanInterest,
        loanTerm,
        loanStartMonth

    ];


    inputs.forEach(input => {

        input.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    calculateCashFlow();

                }

            }
        );

    });


    // ============================================
    // UPDATE MONTH NAMES AFTER LANGUAGE CHANGE
    // ============================================

    window.addEventListener(
        "languageChanged",
        () => {

            /*
             * If results are currently visible,
             * recalculate so the 12-month table
             * updates to the selected language.
             */

            if (
                resultsSection.classList.contains("show")
            ) {

                calculateCashFlow();

            }

        }
    );

});
