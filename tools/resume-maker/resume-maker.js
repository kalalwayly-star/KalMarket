/* =========================================================
   KALMARKET FREE RESUME MAKER
   ---------------------------------------------------------
   No OpenAI
   No API
   No Cloudflare Worker
   No paid services

   Free Smart Wording Engine
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const fullName =
    document.getElementById("fullName");

const phone =
    document.getElementById("phone");

const email =
    document.getElementById("email");

const locationInput =
    document.getElementById("location");

const linkedin =
    document.getElementById("linkedin");

const summary =
    document.getElementById("summary");

const skills =
    document.getElementById("skills");

const languages =
    document.getElementById("languages");

const certifications =
    document.getElementById("certifications");

const experienceContainer =
    document.getElementById("experienceContainer");

const educationContainer =
    document.getElementById("educationContainer");

const generatedResumeSection =
    document.getElementById("generatedResumeSection");


/* =========================================================
   ADD EXPERIENCE
========================================================= */

function addExperience() {

    const entry =
        document.createElement("div");

    entry.className =
        "dynamic-entry experience-entry";


    entry.innerHTML = `

        <div class="dynamic-entry-header">

            <h4 data-i18n="work_experience_entry">
                Work Experience
            </h4>

        </div>


        <div class="dynamic-entry-grid">


            <div>

                <label
                    data-i18n="job_title">
                    Job Title
                </label>

                <input
                    type="text"
                    class="exp-title"
                    data-i18n-placeholder="job_title_placeholder"
                    placeholder="Sales Associate">

            </div>


            <div>

                <label
                    data-i18n="company">
                    Company
                </label>

                <input
                    type="text"
                    class="exp-company"
                    data-i18n-placeholder="company_placeholder"
                    placeholder="ABC Company">

            </div>


            <div>

                <label
                    data-i18n="location">
                    Location
                </label>

                <input
                    type="text"
                    class="exp-location"
                    data-i18n-placeholder="experience_location_placeholder"
                    placeholder="Winnipeg, Manitoba">

            </div>


            <div>

                <label
                    data-i18n="dates">
                    Dates
                </label>

                <input
                    type="text"
                    class="exp-dates"
                    data-i18n-placeholder="dates_placeholder"
                    placeholder="2022 - Present">

            </div>


            <div class="full-width">

                <label
                    data-i18n="responsibilities_achievements">
                    Responsibilities & Achievements
                </label>


                <textarea
                    class="exp-description"
                    rows="5"
                    data-i18n-placeholder="experience_placeholder"
                    placeholder="Example: oil change, brakes, tires"></textarea>


                <button
                    type="button"
                    class="smart-btn"
                    onclick="smartExperience(this)"
                    data-i18n="smart_wording">
                    ✨ Smart Wording
                </button>

            </div>

        </div>


        <button
            type="button"
            class="remove-btn"
            onclick="removeExperience(this)"
            data-i18n="remove">
            Remove
        </button>

    `;


    experienceContainer.appendChild(entry);


    applyTranslationsIfAvailable();
}


/* =========================================================
   REMOVE EXPERIENCE
========================================================= */

function removeExperience(button) {

    const entry =
        button.closest(".experience-entry");

    if (entry) {
        entry.remove();
    }

}


/* =========================================================
   ADD EDUCATION
========================================================= */

function addEducation() {

    const entry =
        document.createElement("div");

    entry.className =
        "dynamic-entry education-entry";


    entry.innerHTML = `

        <div class="dynamic-entry-header">

            <h4 data-i18n="education_entry">
                Education
            </h4>

        </div>


        <div class="dynamic-entry-grid">


            <div>

                <label
                    data-i18n="degree_diploma">
                    Degree / Diploma
                </label>

                <input
                    type="text"
                    class="edu-degree"
                    data-i18n-placeholder="degree_placeholder"
                    placeholder="Business Administration">

            </div>


            <div>

                <label
                    data-i18n="school">
                    School
                </label>

                <input
                    type="text"
                    class="edu-school"
                    data-i18n-placeholder="school_placeholder"
                    placeholder="University of Manitoba">

            </div>


            <div>

                <label
                    data-i18n="location">
                    Location
                </label>

                <input
                    type="text"
                    class="edu-location"
                    data-i18n-placeholder="education_location_placeholder"
                    placeholder="Winnipeg, Manitoba">

            </div>


            <div>

                <label
                    data-i18n="dates">
                    Dates
                </label>

                <input
                    type="text"
                    class="edu-dates"
                    data-i18n-placeholder="dates_placeholder"
                    placeholder="2018 - 2022">

            </div>

        </div>


        <button
            type="button"
            class="remove-btn"
            onclick="removeEducation(this)"
            data-i18n="remove">
            Remove
        </button>

    `;


    educationContainer.appendChild(entry);


    applyTranslationsIfAvailable();
}


/* =========================================================
   REMOVE EDUCATION
========================================================= */

function removeEducation(button) {

    const entry =
        button.closest(".education-entry");

    if (entry) {
        entry.remove();
    }

}


/* =========================================================
   GENERATE RESUME
========================================================= */

function generateResume() {

    updatePersonalInformation();

    generateSummary();

    generateExperience();

    generateEducation();

    generateSkills();

    generateTextList(
        languages.value,
        "previewLanguages"
    );

    generateTextList(
        certifications.value,
        "previewCertifications"
    );


    /* SHOW GENERATED RESUME */

    generatedResumeSection.classList.add(
        "show-resume"
    );


    /* SCROLL TO RESUME */

    setTimeout(() => {

        generatedResumeSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}


/* =========================================================
   PERSONAL INFORMATION
========================================================= */

function updatePersonalInformation() {

    document.getElementById(
        "previewName"
    ).textContent =
        fullName.value.trim() ||
        getText(
            "your_name"
        );


    document.getElementById(
        "previewPhone"
    ).textContent =
        phone.value.trim();


    document.getElementById(
        "previewEmail"
    ).textContent =
        email.value.trim();


    document.getElementById(
        "previewLocation"
    ).textContent =
        locationInput.value.trim();


    const contact =
        document.getElementById(
            "previewContact"
        );


    const values = [
        phone.value.trim(),
        email.value.trim(),
        locationInput.value.trim()
    ].filter(Boolean);


    contact.innerHTML =
        values
            .map(value =>
                `<span>${escapeHTML(value)}</span>`
            )
            .join("");


    const linkedinPreview =
        document.getElementById(
            "previewLinkedin"
        );


    const linkedinValue =
        linkedin.value.trim();


    if (linkedinValue) {

        linkedinPreview.innerHTML =
            `<span>${escapeHTML(linkedinValue)}</span>`;

    } else {

        linkedinPreview.innerHTML = "";

    }

}


/* =========================================================
   SUMMARY
========================================================= */

function generateSummary() {

    const section =
        document.getElementById(
            "previewSummarySection"
        );

    const preview =
        document.getElementById(
            "previewSummary"
        );


    const text =
        summary.value.trim();


    if (!text) {

        section.style.display =
            "none";

        preview.textContent =
            "";

        return;
    }


    section.style.display =
        "";


    preview.textContent =
        text;

}


/* =========================================================
   EXPERIENCE PREVIEW
========================================================= */

function generateExperience() {

    const preview =
        document.getElementById(
            "previewExperience"
        );

    const section =
        document.getElementById(
            "previewExperienceSection"
        );


    const entries =
        document.querySelectorAll(
            ".experience-entry"
        );


    preview.innerHTML = "";


    if (entries.length === 0) {

        section.style.display =
            "none";

        return;

    }


    let hasContent =
        false;


    entries.forEach(entry => {

        const title =
            entry.querySelector(
                ".exp-title"
            )?.value.trim() || "";


        const company =
            entry.querySelector(
                ".exp-company"
            )?.value.trim() || "";


        const location =
            entry.querySelector(
                ".exp-location"
            )?.value.trim() || "";


        const dates =
            entry.querySelector(
                ".exp-dates"
            )?.value.trim() || "";


        const description =
            entry.querySelector(
                ".exp-description"
            )?.value.trim() || "";


        if (
            !title &&
            !company &&
            !location &&
            !dates &&
            !description
        ) {
            return;
        }


        hasContent =
            true;


        const job =
            document.createElement(
                "div"
            );


        job.className =
            "preview-job";


        let descriptionHTML =
            "";


        if (description) {

            const lines =
                description
                    .split("\n")
                    .map(line =>
                        line
                            .replace(
                                /^[•\-*]\s*/,
                                ""
                            )
                            .trim()
                    )
                    .filter(Boolean);


            if (lines.length) {

                descriptionHTML = `
                    <ul>
                        ${lines.map(line =>
                            `<li>${escapeHTML(line)}</li>`
                        ).join("")}
                    </ul>
                `;

            }

        }


        const titleHTML =
            title
                ? `<h3>${escapeHTML(title)}</h3>`
                : "";


        const companyHTML =
            company
                ? `<div class="preview-company">
                        ${escapeHTML(company)}
                   </div>`
                : "";


        const details =
            [
                location,
                dates
            ]
            .filter(Boolean)
            .join(" | ");


        const detailsHTML =
            details
                ? `<div class="preview-dates">
                        ${escapeHTML(details)}
                   </div>`
                : "";


        job.innerHTML = `
            ${titleHTML}
            ${companyHTML}
            ${detailsHTML}
            ${descriptionHTML}
        `;


        preview.appendChild(job);

    });


    section.style.display =
        hasContent
            ? ""
            : "none";

}


/* =========================================================
   EDUCATION PREVIEW
========================================================= */

function generateEducation() {

    const preview =
        document.getElementById(
            "previewEducation"
        );

    const section =
        document.getElementById(
            "previewEducationSection"
        );


    const entries =
        document.querySelectorAll(
            ".education-entry"
        );


    preview.innerHTML = "";


    if (entries.length === 0) {

        section.style.display =
            "none";

        return;

    }


    let hasContent =
        false;


    entries.forEach(entry => {

        const degree =
            entry.querySelector(
                ".edu-degree"
            )?.value.trim() || "";


        const school =
            entry.querySelector(
                ".edu-school"
            )?.value.trim() || "";


        const location =
            entry.querySelector(
                ".edu-location"
            )?.value.trim() || "";


        const dates =
            entry.querySelector(
                ".edu-dates"
            )?.value.trim() || "";


        if (
            !degree &&
            !school &&
            !location &&
            !dates
        ) {
            return;
        }


        hasContent =
            true;


        const education =
            document.createElement(
                "div"
            );


        education.className =
            "preview-school";


        const details =
            [
                location,
                dates
            ]
            .filter(Boolean)
            .join(" | ");


        education.innerHTML = `

            ${
                degree
                    ? `<h3>${escapeHTML(degree)}</h3>`
                    : ""
            }

            ${
                school
                    ? `<div class="preview-school-name">
                            ${escapeHTML(school)}
                       </div>`
                    : ""
            }

            ${
                details
                    ? `<div class="preview-dates">
                            ${escapeHTML(details)}
                       </div>`
                    : ""
            }

        `;


        preview.appendChild(
            education
        );

    });


    section.style.display =
        hasContent
            ? ""
            : "none";

}


/* =========================================================
   SKILLS PREVIEW
========================================================= */

function generateSkills() {

    const preview =
        document.getElementById(
            "previewSkills"
        );

    const section =
        document.getElementById(
            "previewSkillsSection"
        );


    const values =
        skills.value
            .split(",")
            .map(skill =>
                skill.trim()
            )
            .filter(Boolean);


    if (values.length === 0) {

        preview.innerHTML =
            "";

        section.style.display =
            "none";

        return;
    }


    section.style.display =
        "";


    preview.innerHTML = `

        <div class="skills-list">

            ${values.map(skill => `

                <span class="skill-item">
                    ${escapeHTML(skill)}
                </span>

            `).join("")}

        </div>

    `;

}


/* =========================================================
   LANGUAGES / CERTIFICATIONS
========================================================= */

function generateTextList(
    value,
    elementId
) {

    const element =
        document.getElementById(
            elementId
        );


    const section =
        element.closest(
            ".preview-section"
        );


    const values =
        value
            .split(",")
            .map(item =>
                item.trim()
            )
            .filter(Boolean);


    if (values.length === 0) {

        element.innerHTML =
            "";

        section.style.display =
            "none";

        return;

    }


    section.style.display =
        "";


    element.innerHTML = `

        <ul class="resume-list">

            ${values.map(item =>
                `<li>${escapeHTML(item)}</li>`
            ).join("")}

        </ul>

    `;

}


/* =========================================================
   SMART SUMMARY
   FREE WORDING ENGINE
========================================================= */

function smartSummary() {

    const text =
        summary.value.trim();


    if (!text) {

        alert(
            getText(
                "enter_summary_first",
                "Please enter a few words first."
            )
        );

        summary.focus();

        return;
    }


    summary.value =
        improveSummaryText(
            text
        );


    generateResume();

}


/* =========================================================
   SUMMARY WORDING ENGINE
========================================================= */

function improveSummaryText(text) {

    const clean =
        text
            .replace(/\s+/g, " ")
            .trim();


    const lower =
        clean.toLowerCase();


    let opening =
        "";


    if (
        lower.includes("mechanic") ||
        lower.includes("automotive") ||
        lower.includes("auto")
    ) {

        opening =
            "Experienced automotive professional with hands-on experience in vehicle maintenance, repair, and customer service.";

    }

    else if (
        lower.includes("warehouse") ||
        lower.includes("shipping") ||
        lower.includes("receiving")
    ) {

        opening =
            "Reliable warehouse professional with experience supporting daily operations, inventory handling, and team-based work.";

    }

    else if (
        lower.includes("customer service") ||
        lower.includes("sales") ||
        lower.includes("retail")
    ) {

        opening =
            "Customer-focused professional with experience in customer service, sales, and day-to-day business operations.";

    }

    else if (
        lower.includes("security") ||
        lower.includes("guard")
    ) {

        opening =
            "Responsible security professional with experience maintaining safe environments, monitoring activity, and assisting customers and staff.";

    }

    else if (
        lower.includes("driver") ||
        lower.includes("driving") ||
        lower.includes("delivery")
    ) {

        opening =
            "Dependable professional with driving experience and a strong commitment to safety, reliability, and customer service.";

    }

    else if (
        lower.includes("cook") ||
        lower.includes("cooking") ||
        lower.includes("restaurant")
    ) {

        opening =
            "Dedicated food service professional with experience supporting food preparation, customer service, and daily operations.";

    }

    else {

        opening =
            "Motivated and dependable professional with practical experience and a strong commitment to quality work and customer service.";

    }


    const original =
        clean.charAt(0).toUpperCase() +
        clean.slice(1);


    if (
        lower.length > 0 &&
        !opening
            .toLowerCase()
            .includes(lower)
    ) {

        return opening +
            " " +
            original +
            ".";

    }


    return opening;

}


/* =========================================================
   SMART EXPERIENCE
========================================================= */

function smartExperience(button) {

    const entry =
        button.closest(
            ".experience-entry"
        );


    if (!entry) {
        return;
    }


    const title =
        entry.querySelector(
            ".exp-title"
        )?.value.trim() || "";


    const description =
        entry.querySelector(
            ".exp-description"
        );


    if (!description) {
        return;
    }


    const text =
        description.value.trim();


    if (!text) {

        alert(
            getText(
                "enter_experience_first",
                "Please enter a few simple notes first."
            )
        );

        description.focus();

        return;

    }


    const lines =
        text
            .split("\n")
            .map(line =>
                line
                    .replace(
                        /^[•\-*]\s*/,
                        ""
                    )
                    .trim()
            )
            .filter(Boolean);


    const improved =
        lines.map(line =>
            improveExperienceLine(
                line,
                title
            )
        );


    description.value =
        [...new Set(improved)]
            .join("\n");


    generateResume();

}


/* =========================================================
   EXPERIENCE WORDING ENGINE
========================================================= */

function improveExperienceLine(
    line,
    title
) {

    let text =
        line
            .replace(
                /^[•\-*]\s*/,
                ""
            )
            .trim();


    const replacements = [

        [
            /^oil change$/i,
            "Performed routine oil changes and basic vehicle maintenance."
        ],

        [
            /^oil changes$/i,
            "Performed routine oil changes and preventive vehicle maintenance."
        ],

        [
            /^brakes$/i,
            "Inspected and serviced brake systems to support safe vehicle operation."
        ],

        [
            /^tires$/i,
            "Installed, balanced, and serviced vehicle tires."
        ],

        [
            /^tire$/i,
            "Installed and serviced vehicle tires."
        ],

        [
            /^customer service$/i,
            "Provided professional and friendly customer service."
        ],

        [
            /^handled cash$/i,
            "Processed customer payments and handled cash transactions accurately."
        ],

        [
            /^cashier$/i,
            "Processed customer transactions and maintained accurate cash handling."
        ],

        [
            /^cleaning$/i,
            "Maintained a clean, organized, and safe work environment."
        ],

        [
            /^inventory$/i,
            "Assisted with inventory management, organization, and stock control."
        ],

        [
            /^stock shelves$/i,
            "Stocked and organized merchandise while maintaining an orderly sales area."
        ],

        [
            /^sales$/i,
            "Assisted customers with product selection and supported sales activities."
        ],

        [
            /^answer phones$/i,
            "Answered phone calls and assisted customers with questions and requests."
        ],

        [
            /^warehouse work$/i,
            "Supported daily warehouse operations, including material handling and organization."
        ],

        [
            /^loading and unloading$/i,
            "Loaded and unloaded materials safely and efficiently."
        ],

        [
            /^security$/i,
            "Monitored the premises and helped maintain a safe and secure environment."
        ],

        [
            /^delivery$/i,
            "Completed deliveries safely and efficiently while providing reliable customer service."
        ],

        [
            /^packing$/i,
            "Packed products accurately and prepared orders for shipment."
        ],

        [
            /^cooking$/i,
            "Prepared food while maintaining cleanliness, organization, and food safety standards."
        ],

        [
            /^food preparation$/i,
            "Prepared food and supported daily kitchen operations."
        ]

    ];


    for (
        const [pattern, replacement]
        of replacements
    ) {

        if (pattern.test(text)) {
            return replacement;
        }

    }


    /* Already professional sentence */

    if (
        text.length > 20 &&
        /[.!?]$/.test(text)
    ) {

        return capitalizeFirst(
            text
        );

    }


    /* Common action words */

    const actionMap = [

        ["helped", "Supported"],
        ["help", "Supported"],
        ["worked with", "Collaborated with"],
        ["work with", "Collaborated with"],
        ["did", "Performed"],
        ["made", "Prepared"],
        ["make", "Prepared"],
        ["used", "Used"],
        ["use", "Used"],
        ["fixed", "Repaired"],
        ["fix", "Repair"],
        ["sold", "Sold"],
        ["sell", "Sold"],
        ["cleaned", "Maintained"],
        ["clean", "Maintain"],
        ["organized", "Organized"],
        ["organize", "Organize"],
        ["checked", "Inspected"],
        ["check", "Inspect"],
        ["managed", "Managed"],
        ["manage", "Manage"],
        ["served", "Provided"],
        ["serve", "Provide"],
        ["assisted", "Assisted"],
        ["assist", "Assist"]

    ];


    const lower =
        text.toLowerCase();


    for (
        const [from, to]
        of actionMap
    ) {

        if (
            lower.startsWith(
                from + " "
            )
        ) {

            text =
                to +
                text.substring(
                    from.length
                );

            break;

        }

    }


    return capitalizeFirst(
        text
    ) + ".";

}


/* =========================================================
   SMART SKILLS
========================================================= */

function smartSkills() {

    const text =
        skills.value.trim();


    if (!text) {

        alert(
            getText(
                "enter_skills_first",
                "Please enter some skills first."
            )
        );

        skills.focus();

        return;
    }


    const values =
        text
            .split(",")
            .map(skill =>
                skill.trim()
            )
            .filter(Boolean);


    const improved =
        values.map(skill =>
            improveSkill(skill)
        );


    skills.value =
        [...new Set(improved)]
            .join(", ");


    generateResume();

}


/* =========================================================
   SKILL WORDING ENGINE
========================================================= */

function improveSkill(skill) {

    const original =
        skill.trim();


    const lower =
        original.toLowerCase();


    const skillMap = {

        /* CUSTOMER SERVICE */

        "customer service":
            "Customer Service & Client Relations",

        "customers":
            "Customer Service",

        "customer":
            "Customer Service",

        "cashier":
            "Cash Handling & Customer Service",

        "cash":
            "Cash Handling & Transaction Processing",


        /* COMMUNICATION */

        "communication":
            "Professional Communication",

        "talking":
            "Verbal Communication",

        "speaking":
            "Verbal Communication",


        /* TEAMWORK */

        "teamwork":
            "Teamwork & Collaboration",

        "team":
            "Teamwork & Collaboration",

        "working with others":
            "Teamwork & Collaboration",


        /* COMPUTER */

        "microsoft office":
            "Microsoft Office & Computer Skills",

        "word":
            "Microsoft Word",

        "excel":
            "Microsoft Excel",

        "computer":
            "Computer & Digital Skills",


        /* SALES */

        "sales":
            "Sales & Customer Relationship Management",

        "selling":
            "Sales & Customer Service",

        "retail":
            "Retail Sales & Customer Service",


        /* MANAGEMENT */

        "management":
            "Team Leadership & Management",

        "manager":
            "Team Leadership & Management",

        "leadership":
            "Leadership & Team Management",


        /* ORGANIZATION */

        "organization":
            "Organization & Time Management",

        "organized":
            "Organization & Time Management",

        "time management":
            "Time Management & Organization",


        /* AUTOMOTIVE */

        "mechanic":
            "Automotive Repair & Maintenance",

        "mechanics":
            "Automotive Repair & Maintenance",

        "brakes":
            "Brake Inspection, Service & Repair",

        "brake":
            "Brake Inspection, Service & Repair",

        "oil change":
            "Oil Changes & Preventive Maintenance",

        "oil changes":
            "Oil Changes & Preventive Maintenance",

        "tires":
            "Tire Installation, Rotation & Maintenance",

        "tire":
            "Tire Installation, Rotation & Maintenance",

        "alignment":
            "Wheel Alignment & Tire Service",

        "suspension":
            "Suspension Inspection & Repair",

        "diagnostics":
            "Automotive Diagnostics & Troubleshooting",

        "diagnostic":
            "Automotive Diagnostics & Troubleshooting",


        /* WAREHOUSE */

        "warehouse":
            "Warehouse Operations & Material Handling",

        "forklift":
            "Forklift Operation & Warehouse Safety",

        "inventory":
            "Inventory Management & Stock Control",

        "shipping":
            "Shipping & Receiving",

        "receiving":
            "Shipping & Receiving",

        "packing":
            "Packing, Packaging & Order Preparation",


        /* LABOUR */

        "construction":
            "Construction & General Labour",

        "labor":
            "General Labour & Physical Work",

        "labour":
            "General Labour & Physical Work",

        "hand tools":
            "Hand Tools & Equipment Operation",


        /* FOOD */

        "cooking":
            "Food Preparation & Kitchen Operations",

        "food preparation":
            "Food Preparation & Kitchen Operations",

        "restaurant":
            "Restaurant Operations & Customer Service",


        /* DRIVING */

        "driving":
            "Safe Driving & Vehicle Operation",

        "delivery":
            "Delivery Services & Route Management",


        /* GENERAL */

        "problem solving":
            "Problem Solving & Critical Thinking",

        "problem-solving":
            "Problem Solving & Critical Thinking",

        "attention to detail":
            "Attention to Detail & Accuracy",

        "reliable":
            "Reliability & Professionalism",

        "reliability":
            "Reliability & Professionalism",

        "punctual":
            "Punctuality & Dependability"

    };


    return skillMap[lower] ||
        original;

}


/* =========================================================
   PRINT
========================================================= */

function printResume() {

    window.print();

}


/* =========================================================
   START OVER
========================================================= */

function clearResume() {

    const message =
        getText(
            "confirm_start_over",
            "Are you sure you want to start over?"
        );


    if (!confirm(message)) {
        return;
    }


    document
        .querySelectorAll(
            "#fullName, #phone, #email, #location, #linkedin, #summary, #skills, #languages, #certifications"
        )
        .forEach(input => {

            input.value =
                "";

        });


    experienceContainer.innerHTML =
        "";

    educationContainer.innerHTML =
        "";


    generatedResumeSection.classList.remove(
        "show-resume"
    );


    document.getElementById(
        "resumePreview"
    ).scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   HELPERS
========================================================= */

function capitalizeFirst(text) {

    if (!text) {
        return "";
    }


    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   TRANSLATION HELPER
========================================================= */

function getText(
    key,
    fallback = ""
) {

    /*
       This helper tries to work with
       different versions of the
       KalMarket translation system.
    */

    try {

        if (
            typeof getTranslation ===
            "function"
        ) {

            const result =
                getTranslation(key);

            if (
                result &&
                result !== key
            ) {

                return result;

            }

        }

    } catch (error) {

        console.warn(
            "Translation lookup failed:",
            key
        );

    }


    return fallback;

}


/* =========================================================
   APPLY TRANSLATIONS TO DYNAMIC HTML
========================================================= */

function applyTranslationsIfAvailable() {

    try {

        if (
            typeof applyTranslations ===
            "function"
        ) {

            applyTranslations();

        }

    } catch (error) {

        console.warn(
            "Could not apply translations."
        );

    }

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
           Resume starts with the
           generated section hidden.
        */

        generatedResumeSection.classList.remove(
            "show-resume"
        );

    }
);
