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


// Tire pressure evaluation
function checkTirePressure() {
    const unit = document.getElementById("pressureUnit").value;
    const recommended = Number(
        document.getElementById("recommendedPressure").value
    );

    const result = document.getElementById("pressureResults");

    if (!Number.isFinite(recommended) ||
        recommended <= 0 || recommended > 100) {
        result.textContent = "Enter a valid recommended pressure.";
        return;
    }

    const positions = [
        ["Front Left", "frontLeftPressure"],
        ["Front Right", "frontRightPressure"],
        ["Rear Left", "rearLeftPressure"],
        ["Rear Right", "rearRightPressure"]
    ];

    const readings = positions.map(([name, id]) => ({
        name,
        value: document.getElementById(id).value.trim()
    }));

    if (readings.some(item =>
        item.value === "" ||
        !Number.isFinite(Number(item.value)) ||
        Number(item.value) < 0 ||
        Number(item.value) > 100
    )) {
        result.textContent =
            "Enter valid pressure readings for all four tires.";
        return;
    }

    const tolerance = unit === "PSI" ? 1 : 7;
    const list = document.createElement("ul");

    readings.forEach(item => {
        const measured = Number(item.value);
        const difference = measured - recommended;

        let status;

        if (measured === 0) {
            status = "DANGER — no measured pressure";
        } else if (difference < -tolerance) {
            status = "LOW — check and adjust cold pressure";
        } else if (difference > tolerance) {
            status = "HIGH — check and adjust cold pressure";
        } else {
            status = "WITHIN TARGET RANGE";
        }

        const row = document.createElement("li");
        row.textContent =
            `${item.name}: ${measured.toFixed(1)} ${unit} — ${status}`;
        list.appendChild(row);
    });

    result.replaceChildren(list);

    const note = document.createElement("p");
    note.className = "note";
    note.textContent =
        "Preliminary tolerance: ±1 PSI or ±7 kPa. Follow vehicle specifications.";
    result.appendChild(note);
}



function checkFrontBrakes() {
    const vehicleYear = document.getElementById("vehicleYear").value;
    const vehicleMake = document.getElementById("vehicleMake").value.trim();
    const vehicleModel = document.getElementById("vehicleModel").value.trim();

    if (!vehicleYear || !vehicleMake || !vehicleModel) {
        alert("Please select the vehicle year and enter the make and model.");
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

function checkBrakePair(
    sides, liningKey, liningLabel, rotorKey, rotorLabel,
    liningMax, rotorMax
) {
    sides.forEach(side => {
        const lining = document.getElementById(side.prefix + liningKey);
        const liningMin = document.getElementById(side.prefix + liningKey + "Min");
        const rotor = document.getElementById(side.prefix + rotorKey);
        const rotorMin = document.getElementById(side.prefix + rotorKey + "Min");
        const result = document.getElementById(side.resultId);

        const raw = [lining, liningMin, rotor, rotorMin].map(input =>
            input.value.trim()
        );

        if (raw.some(value =>
            value === "" || !Number.isFinite(Number(value)) ||
            Number(value) <= 0
        )) {
            result.textContent =
                "Enter all measurements and verified limits.";
            result.style.color = "#b45309";
            return;
        }

        const [liningValue, liningLimit, rotorValue, rotorLimit] =
            raw.map(Number);

        if (liningValue > liningMax || liningLimit > liningMax ||
            rotorValue > rotorMax || rotorLimit > rotorMax) {
            result.textContent = "Check the values and units.";
            result.style.color = "#b45309";
            return;
        }

        const problems = [];

        if (liningValue <= liningLimit) {
            problems.push(
                `${liningLabel} lining at or below minimum — replace`
            );
        }

        if (rotorValue <= rotorLimit) {
            problems.push(
                `${rotorLabel} at or below discard thickness — replace`
            );
        }

        if (problems.length) {
            result.textContent = problems.join(". ");
            result.style.color = "#b91c1c";
        } else {
            result.textContent =
                "Above entered minimum limits. Complete all other required inspections.";
            result.style.color = "#15803d";
        }
    });
}
