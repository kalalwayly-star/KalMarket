/* =====================================
   KALMARKET BRAKE & TIRE CALCULATOR
   ===================================== */

// Populate vehicle year dropdown
const yearSelect = document.getElementById("vehicleYear");
const currentYear = new Date().getFullYear();

for (let year = currentYear; year >= 1980; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
}

// Tire measurement setup
const tirePositions = [
    "Front Left",
    "Front Right",
    "Rear Left",
    "Rear Right"
];

const tireContainer = document.getElementById("tireMeasurements");

tirePositions.forEach((position, index) => {
    const tire = document.createElement("div");
    tire.className = "section";

    tire.innerHTML = `
        <h3>${position} Tire</h3>

        <label for="tire${index}Inner">Inner tread (mm)</label>
        <input type="number" id="tire${index}Inner"
               min="0" max="30" step="0.1">

        <label for="tire${index}Centre">Centre tread (mm)</label>
        <input type="number" id="tire${index}Centre"
               min="0" max="30" step="0.1">

        <label for="tire${index}Outer">Outer tread (mm)</label>
        <input type="number" id="tire${index}Outer"
               min="0" max="30" step="0.1">

        <p id="tire${index}Result" aria-live="polite"></p>
    `;

    tireContainer.appendChild(tire);
});


function checkTires() {
    let allValid = true;

    tirePositions.forEach((position, index) => {
        const areas = ["Inner", "Centre", "Outer"];

        const readings = areas.map(area =>
            document.getElementById(`tire${index}${area}`).value.trim()
        );

        const result = document.getElementById(`tire${index}Result`);

        if (
            readings.some(value =>
                value === "" ||
                !Number.isFinite(Number(value)) ||
                Number(value) < 0 ||
                Number(value) > 30
            )
        ) {
            result.textContent =
                "Enter all three valid tread-depth measurements in mm.";
            result.className = "result-warning";
            allValid = false;
            return;
        }

        const values = readings.map(Number);
        const lowest = Math.min(...values);
        const highest = Math.max(...values);
        const difference = highest - lowest;

        result.textContent =
            `Measurements recorded — Inner: ${values[0].toFixed(1)} mm, ` +
            `Centre: ${values[1].toFixed(1)} mm, ` +
            `Outer: ${values[2].toFixed(1)} mm. ` +
            `Lowest reading: ${lowest.toFixed(1)} mm. ` +
            `Difference between readings: ${difference.toFixed(1)} mm. ` +
            "Tire safety status requires applicable verified criteria.";

        result.className = "result-warning";
    });

    document.getElementById("tireResults").textContent = allValid
        ? "Measurements recorded. No universal pass/fail limit has been applied."
        : "Correct the missing or invalid measurements above.";
}



function checkTirePressure() {
    const unit = document.getElementById("pressureUnit").value;

    const frontRecommendedInput =
        document.getElementById("frontRecommendedPressure");

    const rearRecommendedInput =
        document.getElementById("rearRecommendedPressure");

    const results = document.getElementById("pressureResults");

    const frontRecommended = Number(frontRecommendedInput.value);
    const rearRecommended = Number(rearRecommendedInput.value);

    if (
        frontRecommendedInput.value.trim() === "" ||
        rearRecommendedInput.value.trim() === "" ||
        !Number.isFinite(frontRecommended) ||
        !Number.isFinite(rearRecommended) ||
        frontRecommended <= 0 ||
        rearRecommended <= 0
    ) {
        results.textContent =
            "Enter the verified recommended cold pressure for both axles.";
        results.className = "result-warning";
        return;
    }

    const tires = [
        {
            name: "Front Left",
            id: "frontLeftPressure",
            recommended: frontRecommended
        },
        {
            name: "Front Right",
            id: "frontRightPressure",
            recommended: frontRecommended
        },
        {
            name: "Rear Left",
            id: "rearLeftPressure",
            recommended: rearRecommended
        },
        {
            name: "Rear Right",
            id: "rearRightPressure",
            recommended: rearRecommended
        }
    ];

    const tolerance = {
        psi: 1,
        kpa: 7,
        bar: 0.07
    }[unit];

    const messages = [];
    let allValid = true;

    tires.forEach(tire => {
        const input = document.getElementById(tire.id);
        const measured = Number(input.value);

        if (
            input.value.trim() === "" ||
            !Number.isFinite(measured) ||
            measured <= 0
        ) {
            messages.push(
                `${tire.name}: Enter a valid measured pressure.`
            );
            allValid = false;
            return;
        }

        const difference = measured - tire.recommended;

        let status;

        if (Math.abs(difference) <= tolerance) {
            status = "Within comparison tolerance";
        } else if (difference < 0) {
            status = "Below recommended pressure";
        } else {
            status = "Above recommended pressure";
        }

        messages.push(
            `${tire.name}: ${status}. ` +
            `Measured: ${measured} ${unit.toUpperCase()}; ` +
            `recommended: ${tire.recommended} ${unit.toUpperCase()}.`
        );
    });

    results.textContent = messages.join(" ");

    results.className = allValid
        ? "result-warning"
        : "result-warning";
}

function checkFrontBrakes() {
    const vehicleCountry =
        document.getElementById("vehicleCountry").value;

    const vehicleYear =
        document.getElementById("vehicleYear").value;

    const vehicleMake =
        document.getElementById("vehicleMake").value.trim();

    const vehicleModel =
        document.getElementById("vehicleModel").value.trim();

    if (!vehicleCountry || !vehicleYear || !vehicleMake || !vehicleModel) {
        alert(
            "Please select the vehicle market and year, " +
            "and enter the vehicle make and model."
        );
        return;
    }

    checkFrontBrakeSide("frontLeft", "Front Left");
    checkFrontBrakeSide("frontRight", "Front Right");
}

function checkFrontBrakeSide(prefix, sideName) {
    const pad = Number(document.getElementById(prefix + "Pad").value);
    const rotor = Number(document.getElementById(prefix + "Rotor").value);

    const result = document.getElementById(prefix + "BrakeResult");

    if (
        document.getElementById(prefix + "Pad").value === "" ||
        document.getElementById(prefix + "Rotor").value === "" ||
        !Number.isFinite(pad) ||
        !Number.isFinite(rotor) ||
        pad <= 0 ||
        rotor <= 0
    ) {
        result.textContent = sideName + ": Enter valid pad and rotor measurements.";
        result.className = "result-warning";
        return;
    }

    result.textContent =
        sideName + ": Measurements recorded — waiting for verified vehicle specifications.";

    result.className = "result-warning";
}



function showRearBrakeFields() {
    const type = document.getElementById("rearBrakeType").value;

    document.getElementById("rearDiscFields").hidden = type !== "disc";
    document.getElementById("rearDrumFields").hidden = type !== "drum";
}

function checkRearDiscBrakes() {
    const year = document.getElementById("vehicleYear").value;
    const make = document.getElementById("vehicleMake").value.trim();
    const model = document.getElementById("vehicleModel").value.trim();

    if (!year || !make || !model) {
        alert("Please enter the vehicle year, make, and model.");
        return;
    }

    checkRearDiscSide("rearLeft", "Rear Left");
    checkRearDiscSide("rearRight", "Rear Right");
}

function checkRearDiscSide(prefix, sideName) {
    const padInput = document.getElementById(prefix + "Pad");
    const rotorInput = document.getElementById(prefix + "Rotor");
    const result = document.getElementById(prefix + "BrakeResult");

    const pad = Number(padInput.value);
    const rotor = Number(rotorInput.value);

    if (
        padInput.value.trim() === "" ||
        rotorInput.value.trim() === "" ||
        !Number.isFinite(pad) ||
        !Number.isFinite(rotor) ||
        pad <= 0 ||
        rotor <= 0
    ) {
        result.textContent =
            sideName + ": Enter valid pad and rotor measurements.";
        result.className = "result-warning";
        return;
    }

    result.textContent =
        sideName + ": Measurements recorded. Verified vehicle specifications are required to assess service limits.";
    result.className = "result-warning";
}

function checkRearDrumBrakes() {
    const year = document.getElementById("vehicleYear").value;
    const make = document.getElementById("vehicleMake").value.trim();
    const model = document.getElementById("vehicleModel").value.trim();

    if (!year || !make || !model) {
        alert("Please enter the vehicle year, make, and model.");
        return;
    }

    checkRearDrumSide("rearLeft", "Rear Left");
    checkRearDrumSide("rearRight", "Rear Right");
}

function checkRearDrumSide(prefix, sideName) {
    const shoeInput = document.getElementById(prefix + "Shoe");
    const drumInput = document.getElementById(prefix + "Drum");
    const result = document.getElementById(prefix + "DrumResult");

    const shoe = Number(shoeInput.value);
    const drum = Number(drumInput.value);

    if (
        shoeInput.value.trim() === "" ||
        drumInput.value.trim() === "" ||
        !Number.isFinite(shoe) ||
        !Number.isFinite(drum) ||
        shoe <= 0 ||
        drum <= 0
    ) {
        result.textContent =
            sideName + ": Enter valid shoe thickness and drum inside diameter.";
        result.className = "result-warning";
        return;
    }

    result.textContent =
        sideName + ": Measurements recorded. Verified vehicle specifications are required to assess service limits.";
    result.className = "result-warning";
}

async function lookupVehicleInfo() {
    const year = document.getElementById("vehicleYear").value;
    const make = document.getElementById("vehicleMake").value.trim();
    const model = document.getElementById("vehicleModel").value.trim();
    const trimInput = document.getElementById("vehicleTrim");
    const trim = trimInput ? trimInput.value.trim() : "";
    const results = document.getElementById("vehicleLookupResults");

    if (!year || !make || !model) {
        results.textContent =
            "Please enter the vehicle year, make, and model.";
        return;
    }

    results.textContent = "Looking up vehicle information...";

    try {
        const url =
            "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/" +
            encodeURIComponent(make) +
            "/modelyear/" + encodeURIComponent(year) +
            "?format=json";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Vehicle database request failed.");
        }

        const data = await response.json();

        const models = (data.Results || [])
            .map(vehicle => vehicle.Model_Name)
            .filter(Boolean);

        const matchingModels = models.filter(name =>
            name.toLowerCase() === model.toLowerCase()
        );

        if (matchingModels.length === 0) {
            results.textContent =
                "No exact model-name match was found for " +
                year + " " + make + " " + model +
                ". This database may not cover every vehicle or market.";
            return;
        }

        results.textContent =
            "Vehicle model match: " + year + " " + make + " " +
            matchingModels.join(", ") +
            (trim ? ". Entered trim: " + trim + "." : ".") +
            " The trim has not been independently verified. " +
            "Brake service limits are still unavailable until verified.";

    } catch (error) {
        console.error("Vehicle lookup failed:", error);
        results.textContent =
            "Vehicle lookup is unavailable right now. Please try again later.";
    }
}

async function decodeVehicleVIN() {
    const vinInput = document.getElementById("vehicleVIN");
   const results = document.getElementById("vinDecodeResults");
   const vin = vinInput.value.trim().toUpperCase();
    const year = document.getElementById("vehicleYear").value;

    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        results.textContent =
            "Please enter a valid 17-character VIN.";
        return;
    }

    results.textContent = "Decoding VIN...";

    try {
        let url =
            "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/" +
            encodeURIComponent(vin) +
            "?format=json";

        if (year) {
            url += "&modelyear=" + encodeURIComponent(year);
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("VIN lookup failed.");
        }

        const data = await response.json();
        const vehicle = data.Results && data.Results[0];

        if (!vehicle || !vehicle.Make || !vehicle.Model) {
            results.textContent =
                "The database could not identify this vehicle. " +
                "Check the VIN or try another source.";
            return;
        }

        document.getElementById("vehicleYear").value =
            vehicle.ModelYear || year;

        document.getElementById("vehicleMake").value =
            vehicle.Make || "";

        document.getElementById("vehicleModel").value =
            vehicle.Model || "";

        const trim = document.getElementById("vehicleTrim");
if (trim && !trim.value.trim() && vehicle.Trim) {
    trim.value = vehicle.Trim;
}

        const engine = document.getElementById("vehicleEngine");

// Keep the engine information already entered by the user.
if (engine && !engine.value.trim()) {
    engine.value = vehicle.DisplacementL
        ? vehicle.DisplacementL + " L"
        : (vehicle.EngineModel || "");
}
        const drive = document.getElementById("vehicleDrive");
        if (drive && !drive.value && vehicle.DriveType) {
            const driveType = vehicle.DriveType.toLowerCase();

            if (driveType.includes("front")) drive.value = "FWD";
            else if (driveType.includes("rear")) drive.value = "RWD";
            else if (driveType.includes("all")) drive.value = "AWD";
            else if (driveType.includes("4wd") ||
                     driveType.includes("four")) drive.value = "4WD";
        }

        results.textContent =
    "VIN identification completed. Make: " + vehicle.Make +
    "; Model: " + vehicle.Model +
    "; Year: " + (vehicle.ModelYear || "Not available") +
    "; Database trim: " + (vehicle.Trim || "Not available") +
    ". Please confirm the vehicle details manually. " +
    "Brake and tire service specifications have not been verified.";
       
    } catch (error) {
        console.error("VIN decoding failed:", error);

        results.textContent =
            "VIN lookup is unavailable right now. Please try again.";
    }
}
