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

// Evaluate tire tread depth
function checkTires() {
    let allValid = true;

    tirePositions.forEach((position, index) => {
        const areas = ["Inner", "Centre", "Outer"];

        const readings = areas.map(area =>
            document.getElementById(`tire${index}${area}`).value.trim()
        );

        const result = document.getElementById(`tire${index}Result`);

        if (readings.some(value =>
            value === "" ||
            !Number.isFinite(Number(value)) ||
            Number(value) < 0 ||
            Number(value) > 30
        )) {
            result.textContent = "Enter all three valid measurements.";
            result.style.color = "#b45309";
            allValid = false;
            return;
        }

        const values = readings.map(Number);
        const lowest = Math.min(...values);
        const highest = Math.max(...values);

        if (lowest < 3.5) {
            result.textContent =
                `BELOW YOUR 3.5 mm THRESHOLD — lowest: ${lowest.toFixed(1)} mm. Inspect promptly.`;
            result.style.color = "#b91c1c";
        } else if (lowest <= 4.0) {
            result.textContent =
                `WORN — plan inspection and replacement. Lowest: ${lowest.toFixed(1)} mm.`;
            result.style.color = "#b45309";
        } else if (lowest <= 9.0) {
            result.textContent =
                `GOOD by your tread-depth rule — lowest: ${lowest.toFixed(1)} mm.`;
            result.style.color = "#15803d";
        } else {
            result.textContent =
                `CHECK READING — highest: ${highest.toFixed(1)} mm exceeds the 9 mm reference.`;
            result.style.color = "#b45309";
        }

        if (highest - lowest >= 2.0) {
            result.textContent +=
                " Uneven tread wear: inspect alignment, inflation and suspension.";
        }
    });

    document.getElementById("tireResults").textContent = allValid
        ? "Tire measurements evaluated. Review each tire result above."
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
    checkBrakePair([
        {
            prefix: "rearLeft",
            resultId: "rearLeftBrakeResult"
        },
        {
            prefix: "rearRight",
            resultId: "rearRightBrakeResult"
        }
    ], "pad", "Pad", "rotor", "Rotor", 40, 60);
}

function checkRearDrumBrakes() {
    const sides = [
        { prefix: "rearLeft", resultId: "rearLeftDrumResult" },
        { prefix: "rearRight", resultId: "rearRightDrumResult" }
    ];

    sides.forEach(side => {
        const shoe = document.getElementById(side.prefix + "Shoe");
        const shoeMin = document.getElementById(side.prefix + "ShoeMin");
        const drum = document.getElementById(side.prefix + "Drum");
        const drumMax = document.getElementById(side.prefix + "DrumMax");
        const result = document.getElementById(side.resultId);

        const raw = [shoe, shoeMin, drum, drumMax].map(input =>
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

        const [shoeValue, shoeLimit, drumValue, drumLimit] =
            raw.map(Number);

        if (shoeValue > 30 || shoeLimit > 30 ||
            drumValue > 500 || drumLimit > 500) {
            result.textContent = "Check the values and units.";
            result.style.color = "#b45309";
            return;
        }

        const problems = [];

        if (shoeValue <= shoeLimit) {
            problems.push("Shoe lining at or below minimum — replace");
        }

        if (drumValue >= drumLimit) {
            problems.push("Drum at or above maximum diameter — replace");
        }

        if (problems.length) {
            result.textContent = problems.join(". ");
            result.style.color = "#b91c1c";
        } else {
            result.textContent =
                "Above lining minimum and below drum maximum. Complete the remaining brake inspection.";
            result.style.color = "#15803d";
        }
    });
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
