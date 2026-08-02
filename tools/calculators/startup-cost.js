document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("calculateStartupBtn")
        .addEventListener("click", calculateStartupCost);


    document
        .getElementById("resetStartupBtn")
        .addEventListener("click", resetStartupCost);

});



function calculateStartupCost() {


    // Business Setup
    const registration =
        Number(document.getElementById("registrationCost").value) || 0;

    const license =
        Number(document.getElementById("licenseCost").value) || 0;

    const legal =
        Number(document.getElementById("legalCost").value) || 0;

    const branding =
        Number(document.getElementById("brandingCost").value) || 0;



    // Location
    const deposit =
        Number(document.getElementById("depositCost").value) || 0;

    const rent =
        Number(document.getElementById("rentCost").value) || 0;

    const renovation =
        Number(document.getElementById("renovationCost").value) || 0;

    const sign =
        Number(document.getElementById("signCost").value) || 0;



    // Equipment
    const equipment =
        Number(document.getElementById("equipmentCost").value) || 0;

    const computer =
        Number(document.getElementById("computerCost").value) || 0;

    const furniture =
        Number(document.getElementById("furnitureCost").value) || 0;



    // Inventory
    const inventory =
        Number(document.getElementById("inventoryCost").value) || 0;

    const materials =
        Number(document.getElementById("materialsCost").value) || 0;



    // Reserve
    const reserve =
        Number(document.getElementById("reserveCost").value) || 0;



    const setupTotal =
        registration +
        license +
        legal +
        branding +
        deposit +
        rent +
        renovation +
        sign;



    const equipmentTotal =
        equipment +
        computer +
        furniture;



    const inventoryTotal =
        inventory +
        materials;



    const startupTotal =
        setupTotal +
        equipmentTotal +
        inventoryTotal +
        reserve;



    document.getElementById("setupTotal").textContent =
        formatCurrency(setupTotal);


    document.getElementById("equipmentTotal").textContent =
        formatCurrency(equipmentTotal);


    document.getElementById("inventoryTotal").textContent =
        formatCurrency(inventoryTotal);


    document.getElementById("startupTotal").textContent =
        formatCurrency(startupTotal);



    document.getElementById("startupResults").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}




function resetStartupCost() {


    document.querySelectorAll(
        ".calculator-card input"
    ).forEach(input => {

        input.value = "";

    });


    document.getElementById("setupTotal").textContent =
        formatCurrency(0);


    document.getElementById("equipmentTotal").textContent =
        formatCurrency(0);


    document.getElementById("inventoryTotal").textContent =
        formatCurrency(0);


    document.getElementById("startupTotal").textContent =
        formatCurrency(0);


}



function formatCurrency(amount) {

    return amount.toLocaleString("en-CA", {

        style: "currency",

        currency: "CAD"

    });

}
