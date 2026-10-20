/*
 * Toyota RAV4 brake database integration.
 * Informational reference only — does not change brake ratings.
 * Pending specifications must never be used for a safety decision.
 */

async function checkToyotaRav4Database() {
    const output = document.getElementById("toyotaDatabaseResults");
    if (!output) return;

    const getValue = id =>
        document.getElementById(id)?.value?.trim() || "";

    const year = Number(getValue("vehicleYear"));
    const make = getValue("vehicleMake").toLowerCase();
    const model = getValue("vehicleModel").toLowerCase();
    const trim = getValue("vehicleTrim").toLowerCase();
    const drivetrain = getValue("vehicleDrive").toUpperCase();
    const market = getValue("vehicleCountry");

    if (
        make !== "toyota" ||
        !/^rav\s*-?\s*4(?:\s|$)/i.test(model)
    ) {
        output.textContent =
            "This database checker currently covers Toyota RAV4 vehicles only.";
        return;
    }

    if (!year || year < 2019 || year > 2025) {
        output.textContent =
            "The current RAV4 database covers model years 2019–2025 only.";
        return;
    }

    output.textContent = "Checking Toyota RAV4 database…";

    try {
        const base = "../brake-database/toyota-rav4/data/";

        const indexResponse = await fetch(base + "index.json");
        const generationResponse = await fetch(
            base + "generation-5-2019-2025.json"
        );

        if (!indexResponse.ok || !generationResponse.ok) {
            throw new Error("Could not load the database files.");
        }

        const index = await indexResponse.json();
        const generation = await generationResponse.json();

        let configurations = generation.configurations.filter(config => {
            const firstYear =
                config.model_year_start || generation.model_year_start;
            const lastYear =
                config.model_year_end || generation.model_year_end;

            return (
                year >= firstYear &&
                year <= lastYear &&
                (
                    !drivetrain ||
                    drivetrain === "OTHER" ||
                    config.drivetrain === drivetrain
                )
            );
        });

        if (!configurations.length) {
            output.textContent =
                "No matching database configuration was found. " +
                "Vehicle-specific brake specifications remain unverified.";
            return;
        }

        const vehicleText = model + " " + trim;
        const mentionsPrime =
            /\bprime\b|\bplug[\s-]?in\b|\bphev\b/i.test(vehicleText);
        const mentionsHybrid = /\bhybrid\b/i.test(vehicleText);
        const mentionsGasoline =
            /\bgas(?:oline)?\b|\bpetrol\b|\bnon[\s-]?hybrid\b/i.test(
                vehicleText
            );

        if (mentionsPrime) {
            configurations = configurations.filter(
                config => config.powertrain === "plug-in hybrid"
            );
        } else if (mentionsHybrid) {
            configurations = configurations.filter(
                config => config.powertrain === "hybrid"
            );
        } else if (mentionsGasoline) {
            configurations = configurations.filter(
                config => config.powertrain === "gasoline"
            );
        }

        if (!configurations.length) {
            output.textContent =
                "The entered powertrain details do not match a database " +
                "configuration. Please confirm the vehicle details.";
            return;
        }

        let message =
            "Toyota RAV4 database loaded (version " +
            index.database_version + ").\n\n";

        message += "Possible configurations:\n";
        message += configurations.map(config =>
            "- " + config.powertrain + ", " +
            config.drivetrain + " — status: " + config.status
        ).join("\n");

        message += "\n\nMarket selected: " +
            (market || "not specified") + ".\n";

        /*
         * Show the specific reference record only when the entered
         * details match the intended 2021 RAV4 Prime SE application.
         * This is still a reference candidate, not fitment approval.
         */
        const trimIsSE =
            /\bse\b/i.test(trim) &&
            !/\bxse\b/i.test(trim);

        const marketIsSupported =
            market === "Canada" ||
            market === "United States";

        const eligibleForReference =
            year === 2021 &&
            mentionsPrime &&
            trimIsSE &&
            drivetrain === "AWD" &&
            marketIsSupported;

        if (eligibleForReference) {
            const recordResponse = await fetch(
                base + "rav4-prime-2021-front-brake-record-v2.json"
            );

            if (recordResponse.ok) {
                const record = await recordResponse.json();
                const front = record.brakes?.front;

                if (front) {
                    const formatMeasurement = (label, item) => {
                        if (!item || item.value == null) {
                            return label + ": Not verified";
                        }

                        return label + ": " + item.value + " mm " +
                            "(record status: " + item.status + ")";
                    };

                    message +=
                        "\n\n2021 RAV4 Prime SE front-brake reference record\n";

                    message += formatMeasurement(
                        "New pad friction lining",
                        front.pad_new_friction_lining_mm
                    ) + "\n";

                    message += formatMeasurement(
                        "Minimum pad friction lining",
                        front.pad_minimum_friction_lining_mm
                    ) + "\n";

                    message += formatMeasurement(
                        "New rotor thickness",
                        front.rotor_new_thickness_mm
                    ) + "\n";

                    message += formatMeasurement(
                        "Minimum rotor thickness",
                        front.rotor_minimum_thickness_mm
                    ) + "\n";

                    message += formatMeasurement(
                        "Rotor diameter",
                        front.rotor_diameter_mm
                    ) + "\n";

                    const source = record.sources?.[0];

                    if (source) {
                        message += "\nSource: " + source.title + "\n";
                        message += "Source URL: " + source.url + "\n";
                    }

                    message +=
                        "Overall record status: " +
                        (record.record_status || "not specified") + ".\n";

                    message +=
                        "Important: Exact vehicle fitment remains pending. " +
                        "Confirm the VIN, brake package, and applicable " +
                        "service information before using these values. " +
                        "This reference does not authorize a pass/fail " +
                        "or safe/unsafe decision.";
                } else {
                    message +=
                        "\n\nThe reference record has no readable front-brake " +
                        "data. No vehicle-specific decision can be made.";
                }
            } else {
                message +=
                    "\n\nThe specific front-brake reference record could not " +
                    "be loaded. No vehicle-specific decision can be made.";
            }
        } else if (mentionsPrime && year === 2021) {
            message +=
                "\n\nThe 2021 Prime front-brake reference was not displayed " +
                "because the entered trim, market, or drivetrain did not " +
                "match its intended application.";
        }

        message +=
            "\n\nDatabase information is for reference only. " +
            "Pending or unconfirmed specifications must not determine " +
            "a brake safety rating.";

        output.textContent = message;

    } catch (error) {
        console.error("Toyota RAV4 database check failed:", error);

        output.textContent =
            "The Toyota RAV4 database could not be loaded. " +
            "No vehicle-specific brake decision can be made from this panel.";
    }
}
