document.addEventListener("DOMContentLoaded", () => {

    document
    .getElementById("incomeType")
    ?.addEventListener(
        "change",
        changeIncomeType
    );

    document
    .getElementById("calculatePlanningBtn")
    ?.addEventListener(
        "click",
        calculatePlanning
    );

    document
    .getElementById("resetPlanningBtn")
    ?.addEventListener(
        "click",
        resetPlanning
    );
});

function changeIncomeType() {

    const type =
        document.getElementById("incomeType").value;

    document.getElementById("employeeFields").style.display = "none";

    document.getElementById("selfEmployeeFields").style.display = "none";

    document.getElementById("businessFields").style.display = "none";

    if(type === "employee") {

        document.getElementById("employeeFields")
        .style.display = "block";

    }

    if(type === "self-employed") {

        document.getElementById("selfEmployeeFields")
        .style.display = "block";
    }

    if(type === "business") {

        document.getElementById("businessFields")
        .style.display = "block";
    }
}

function calculatePlanning() {

const type =
document.getElementById("incomeType").value;

let revenue = 0;

let expenses = 0;


// ========================
// Employee
// ========================

if(type === "employee") {


const salary =
Number(document.getElementById("salary").value) || 0;


const otherIncome =
Number(document.getElementById("otherIncome").value) || 0;


const rrsp =
Number(document.getElementById("rrsp").value) || 0;


const deductions =
Number(document.getElementById("employeeDeductions").value) || 0;
const shelter =
Number(document.getElementById("shelterCost").value) || 0;

const utilities =
Number(document.getElementById("utilitiesCost").value) || 0;

const living =
Number(document.getElementById("livingExpenses").value) || 0;

const transportation =
Number(document.getElementById("transportationCost").value) || 0;

const otherLiving =
Number(document.getElementById("otherLivingExpenses").value) || 0;


const monthlyLivingExpenses =
shelter +
utilities +
living +
transportation +
otherLiving;

revenue =
salary + otherIncome;

expenses =
rrsp + deductions;

}


// ========================
// Self Employed
// ========================

if(type === "self-employed") {


revenue =
Number(document.getElementById("businessRevenue").value) || 0;


expenses =

Number(document.getElementById("costOfGoods").value) +

Number(document.getElementById("operatingExpenses").value) +

Number(document.getElementById("vehicleExpenses").value) +

Number(document.getElementById("equipmentExpenses").value) +

Number(document.getElementById("homeOfficeExpenses").value);

}


// ========================
// Business Owner
// ========================

if(type === "business") {


revenue =
Number(document.getElementById("companyRevenue").value) || 0;


expenses =

Number(document.getElementById("payroll").value) +

Number(document.getElementById("inventoryCosts").value) +

Number(document.getElementById("businessRent").value) +

Number(document.getElementById("utilities").value) +

Number(document.getElementById("marketing").value);

}

const netIncome =
revenue - expenses;

const profitMargin =
revenue > 0
?
(netIncome / revenue) * 100
:
0;


// Simple planning estimate

const estimatedTax =
netIncome > 0
?
netIncome * 0.25
:
0;

const monthlySavings =
estimatedTax / 12;

let gstEstimate = 0;

let cppEstimate = 0;


if(
type === "self-employed" ||
type === "business"
){

const gstCollected =
Number(
document.getElementById("gstCollectedPlanning")?.value
) || 0;


const gstPaid =
Number(
document.getElementById("gstPaidPlanning")?.value
) || 0;


gstEstimate =
gstCollected - gstPaid;

// simplified CPP planning estimate

cppEstimate =
netIncome > 0
?
netIncome * 0.12
:
0;

}

const totalReserve =
(monthlySavings * 12 + cppEstimate) / 12;

let availableIncome = 0;


if(type === "employee") {

availableIncome =
(revenue - estimatedTax) -
(monthlyLivingExpenses * 12);

}
// Results

document.getElementById("planningRevenue")
.textContent =
formatCurrency(revenue);

document.getElementById("planningExpenses")
.textContent =
formatCurrency(expenses);

document.getElementById("planningIncome")
.textContent =
formatCurrency(netIncome);

document.getElementById("profitMargin")
.textContent =
profitMargin.toFixed(1) + "%";

document.getElementById("planningTax")
.textContent =
formatCurrency(estimatedTax);

document.getElementById("planningSavings")
.textContent =
formatCurrency(monthlySavings);

    document.getElementById("availableIncomeResult")
.textContent =
formatCurrency(availableIncome);
    
document.getElementById("gstPlanningResult")
.textContent =
formatCurrency(gstEstimate);


document.getElementById("cppPlanningResult")
.textContent =
formatCurrency(cppEstimate);


document.getElementById("totalReserveResult")
.textContent =
formatCurrency(totalReserve);generatePlanningRecommendation(
netIncome,
profitMargin,
revenue,
expenses
);
}

function generatePlanningRecommendation(
netIncome,
profitMargin,
revenue,
expenses
){

let html = "";

if(netIncome < 0){

html = `

<div class="strategy-box warning">

<h4>
🔴 Business Loss Detected
</h4>

<p>
Your expenses are higher than your income.
Review pricing, costs, and cash flow.

</p>

</div>

`;
}

else if(profitMargin < 15){

html = `

<div class="strategy-box warning">

<h4>
🟡 Low Profit Margin
</h4>

<p>

Your business is generating revenue,
but costs are taking a large portion.
Consider reviewing expenses.

</p>

</div>

`;

}

else{

html = `

<div class="strategy-box success">

<h4>
🟢 Healthy Financial Position
</h4>

<p>

Your income and expenses show a balanced
financial position.

</p>

</div>

`;
}

document.getElementById(
"planningRecommendation"
)
.innerHTML = html;

}

function resetPlanning(){

document
.querySelectorAll("input")
.forEach(input => {

input.value = "";

});

document.getElementById(
"planningRecommendation"
)
.innerHTML =

"Complete your information to receive recommendations.";

}

function formatCurrency(amount){

return new Intl.NumberFormat(
"en-CA",
{
style:"currency",
currency:"CAD"
}
).format(amount);

}
