/* =========================================
   KALMARKET FREE RESUME MAKER
   No API / No AI / No paid service
   Smart wording works locally in browser
========================================= */

const fullName = document.getElementById("fullName");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const locationInput = document.getElementById("location");
const linkedin = document.getElementById("linkedin");
const summary = document.getElementById("summary");
const skills = document.getElementById("skills");
const languages = document.getElementById("languages");
const certifications = document.getElementById("certifications");

const educationContainer =
    document.getElementById("educationContainer");


/* =========================================
   ADD EXPERIENCE
   Experience is now created properly
   inside the page.
========================================= */

function addExperience() {

    const container = document.getElementById("experienceContainer");

    if (!container) {
        console.error("experienceContainer not found.");
        return;
    }

    const entry = document.createElement("div");

    entry.className = "dynamic-entry experience-entry";

    entry.innerHTML = `
        <div class="dynamic-entry-grid">

            <div>
                <label>Job Title</label>
                <input
                    type="text"
                    class="exp-title"
                    placeholder="Sales Associate">
            </div>

            <div>
                <label>Company</label>
                <input
                    type="text"
                    class="exp-company"
                    placeholder="ABC Company">
            </div>

            <div>
                <label>Location</label>
                <input
                    type="text"
                    class="exp-location"
                    placeholder="Winnipeg, Manitoba">
            </div>

            <div>
                <label>Dates</label>
                <input
                    type="text"
                    class="exp-dates"
                    placeholder="2022 - Present">
            </div>

            <div class="full-width">
                <label>Responsibilities & Achievements</label>

                <textarea
                    class="exp-description"
                    rows="4"
                    placeholder="Example:
Served customers
Handled cash
Maintained inventory
Helped increase sales"></textarea>

                <button
                    type="button"
                    class="smart-btn"
                    onclick="smartExperience(this)">
                    ✨ Smart Wording
                </button>

                <small>
                    Turns simple notes into professional resume wording.
                </small>
            </div>

        </div>

        <button
            type="button"
            class="remove-btn"
            onclick="removeExperience(this)">
            Remove
        </button>
    `;

    container.appendChild(entry);
}


/* =========================================
   REMOVE EXPERIENCE
========================================= */

function removeExperience(button) {

    const entry =
        button.closest(".experience-entry");

    if (entry) {
        entry.remove();
    }

    generateExperience();
}


/* =========================================
   ADD EDUCATION
========================================= */

function addEducation() {

    const container =
        document.getElementById("educationContainer");

    if (!container) {
        return;
    }

    const entry =
        document.createElement("div");

    entry.className =
        "dynamic-entry education-entry";

    entry.innerHTML = `
        <div class="dynamic-entry-grid">

            <div>
                <label>Degree / Diploma</label>
                <input
                    type="text"
                    class="edu-degree"
                    placeholder="Business Administration">
            </div>

            <div>
                <label>School</label>
                <input
                    type="text"
                    class="edu-school"
                    placeholder="University of Manitoba">
            </div>

            <div>
                <label>Location</label>
                <input
                    type="text"
                    class="edu-location"
                    placeholder="Winnipeg, Manitoba">
            </div>

            <div>
                <label>Dates</label>
                <input
                    type="text"
                    class="edu-dates"
                    placeholder="2018 - 2022">
            </div>

        </div>

        <button
            type="button"
            class="remove-btn"
            onclick="removeEducation(this)">
            Remove
        </button>
    `;

    container.appendChild(entry);
}


/* =========================================
   REMOVE EDUCATION
========================================= */

function removeEducation(button) {

    const entry =
        button.closest(".education-entry");

    if (entry) {
        entry.remove();
    }

    generateEducation();
}


/* =========================================
   GENERATE RESUME
========================================= */

function generateResume() {

    document.getElementById("previewName").textContent =
        fullName.value.trim() || "Your Name";

    document.getElementById("previewPhone").textContent =
        phone.value.trim();

    document.getElementById("previewEmail").textContent =
        email.value.trim();

    document.getElementById("previewLocation").textContent =
        locationInput.value.trim();

    document.getElementById("previewLinkedin").textContent =
        linkedin.value.trim();


    /* SUMMARY */

    document.getElementById("previewSummary").textContent =
        summary.value.trim();


    /* EXPERIENCE */

    generateExperience();


    /* EDUCATION */

    generateEducation();


    /* SKILLS */

    generateSkills();


    /* LANGUAGES */

    generateTextList(
        languages.value,
        "previewLanguages"
    );


    /* CERTIFICATIONS */

    generateTextList(
        certifications.value,
        "previewCertifications"
    );


    document
        .getElementById("resumePreview")
        .classList.add("resume-generated");
}


/* =========================================
   EXPERIENCE PREVIEW
========================================= */

function generateExperience() {

    const preview =
        document.getElementById("previewExperience");

    if (!preview) {
        return;
    }

    const entries =
        document.querySelectorAll(".experience-entry");

    preview.innerHTML = "";

    if (entries.length === 0) {

        preview.innerHTML = `
            <p class="empty-preview">
                No work experience added.
            </p>
        `;

        return;
    }


    entries.forEach(entry => {

        const title =
            entry.querySelector(".exp-title")?.value.trim() || "";

        const company =
            entry.querySelector(".exp-company")?.value.trim() || "";

        const location =
            entry.querySelector(".exp-location")?.value.trim() || "";

        const dates =
            entry.querySelector(".exp-dates")?.value.trim() || "";

        const description =
            entry.querySelector(".exp-description")?.value.trim() || "";


        const job =
            document.createElement("div");

        job.className =
            "preview-job";


        let descriptionHTML = "";

        if (description) {

            const lines =
                description
                    .split("\n")
                    .map(line => line.trim())
                    .filter(Boolean);

            descriptionHTML = `
                <ul>
                    ${lines.map(line =>
                        `<li>${escapeHTML(line)}</li>`
                    ).join("")}
                </ul>
            `;
        }


        job.innerHTML = `
            <h3>
                ${escapeHTML(title || "Job Title")}
            </h3>

            <div class="preview-company">
                ${escapeHTML(company)}
            </div>

            <div class="preview-dates">
                ${escapeHTML(location)}
                ${location && dates ? " | " : ""}
                ${escapeHTML(dates)}
            </div>

            ${descriptionHTML}
        `;

        preview.appendChild(job);
    });
}


/* =========================================
   EDUCATION PREVIEW
========================================= */

function generateEducation() {

    const preview =
        document.getElementById("previewEducation");

    if (!preview) {
        return;
    }

    const entries =
        document.querySelectorAll(".education-entry");

    preview.innerHTML = "";

    if (entries.length === 0) {

        preview.innerHTML = `
            <p class="empty-preview">
                No education added.
            </p>
        `;

        return;
    }


    entries.forEach(entry => {

        const degree =
            entry.querySelector(".edu-degree")?.value.trim() || "";

        const school =
            entry.querySelector(".edu-school")?.value.trim() || "";

        const location =
            entry.querySelector(".edu-location")?.value.trim() || "";

        const dates =
            entry.querySelector(".edu-dates")?.value.trim() || "";


        const education =
            document.createElement("div");

        education.className =
            "preview-school";


        education.innerHTML = `
            <h3>
                ${escapeHTML(degree || "Degree / Diploma")}
            </h3>

            <div class="preview-school-name">
                ${escapeHTML(school)}
            </div>

            <div class="preview-dates">
                ${escapeHTML(location)}
                ${location && dates ? " | " : ""}
                ${escapeHTML(dates)}
            </div>
        `;

        preview.appendChild(education);
    });
}


/* =========================================
   SKILLS
========================================= */

function generateSkills() {

    const preview =
        document.getElementById("previewSkills");

    const values =
        skills.value
            .split(",")
            .map(skill => skill.trim())
            .filter(Boolean);


    if (values.length === 0) {

        preview.innerHTML = "";

        return;
    }


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


/* =========================================
   LANGUAGES / CERTIFICATIONS
========================================= */

function generateTextList(value, elementId) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    const values =
        value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);


    if (values.length === 0) {

        element.innerHTML = "";

        return;
    }


    element.innerHTML = `
        <ul>
            ${values.map(item =>
                `<li>${escapeHTML(item)}</li>`
            ).join("")}
        </ul>
    `;
}


/* =========================================
   FREE SMART SUMMARY
   No API required
========================================= */

function smartSummary() {

    const text =
        summary.value.trim();

    if (!text) {

        alert(
            "Please enter a few words about yourself first."
        );

        summary.focus();

        return;
    }


    const result =
        improveSummaryText(text);

    summary.value =
        result;

    generateResume();
}


/* =========================================
   SUMMARY WORDING ENGINE
========================================= */

function improveSummaryText(text) {

    let clean =
        text
            .replace(/\s+/g, " ")
            .trim();


    const lower =
        clean.toLowerCase();


    const openings = [];


    if (
        lower.includes("mechanic") ||
        lower.includes("automotive") ||
        lower.includes("auto")
    ) {
        openings.push(
            "Experienced automotive professional with hands-on experience in vehicle maintenance, repair, and customer service."
        );
    }

    else if (
        lower.includes("warehouse") ||
        lower.includes("shipping") ||
        lower.includes("receiving")
    ) {
        openings.push(
            "Reliable warehouse professional with experience supporting daily operations, inventory handling, and team-based work."
        );
    }

    else if (
        lower.includes("customer service") ||
        lower.includes("sales") ||
        lower.includes("retail")
    ) {
        openings.push(
            "Customer-focused professional with experience in customer service, sales, and day-to-day business operations."
        );
    }

    else if (
        lower.includes("security") ||
        lower.includes("guard")
    ) {
        openings.push(
            "Responsible security professional with experience maintaining safe environments, monitoring activity, and assisting customers and staff."
        );
    }

    else if (
        lower.includes("driver") ||
        lower.includes("driving")
    ) {
        openings.push(
            "Dependable professional with driving experience and a strong commitment to safety, reliability, and customer service."
        );
    }

    else {
        openings.push(
            "Motivated and dependable professional with practical experience and a strong commitment to quality work and customer service."
        );
    }


    let result =
        openings[0];


    const cleanedOriginal =
        clean.charAt(0).toUpperCase() +
        clean.slice(1);


    if (
        !result.toLowerCase().includes(clean.toLowerCase())
    ) {
        result += " " + cleanedOriginal + ".";
    }


    return result;
}


/* =========================================
   FREE SMART EXPERIENCE WORDING
========================================= */

function smartExperience(button) {

    const entry =
        button.closest(".experience-entry");

    if (!entry) {
        return;
    }


    const title =
        entry.querySelector(".exp-title")
            ?.value.trim() || "";

    const description =
        entry.querySelector(".exp-description");

    if (!description) {
        return;
    }


    const text =
        description.value.trim();


    if (!text) {

        alert(
            "Please enter a few simple notes first."
        );

        description.focus();

        return;
    }


    const lines =
        text
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean);


    const improved =
        lines.map(line =>
            improveExperienceLine(line, title)
        );


    description.value =
        [...new Set(improved)].join("\n");


    generateResume();
}


/* =========================================
   EXPERIENCE WORDING ENGINE
========================================= */

function improveExperienceLine(line, title) {

    let text =
        line
            .replace(/^[•\-*]\s*/, "")
            .trim();


    const lower =
        text.toLowerCase();


    const replacements = [

        [
            /^oil change$/i,
            "Performed routine oil changes and basic vehicle maintenance."
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
        ]
    ];


    for (const [pattern, replacement] of replacements) {

        if (pattern.test(text)) {
            return replacement;
        }
    }


    /* Already professional-looking sentence */

    if (
        text.length > 20 &&
        /[.!?]$/.test(text)
    ) {
        return capitalizeFirst(text);
    }


    /* Common action-word conversions */

    const actionMap = [

        ["helped", "Supported"],
        ["help", "Supported"],
        ["worked with", "Collaborated with"],
        ["work with", "Collaborate with"],
        ["did", "Performed"],
        ["made", "Prepared"],
        ["make", "Prepare"],
        ["used", "Used"],
        ["use", "Use"],
        ["fixed", "Repaired"],
        ["fix", "Repair"],
        ["sold", "Sold"],
        ["sell", "Sell"],
        ["cleaned", "Maintained"],
        ["clean", "Maintain"],
        ["organized", "Organized"],
        ["organize", "Organize"],
        ["checked", "Inspected"],
        ["check", "Inspect"],
        ["managed", "Managed"],
        ["manage", "Manage"]
    ];


    for (const [from, to] of actionMap) {

        if (
            lower.startsWith(from + " ")
        ) {

            text =
                to +
                text.substring(from.length);

            break;
        }
    }


    return capitalizeFirst(text) + ".";
}

/* =========================================
   SMART SKILLS
   FREE — NO AI/API REQUIRED
========================================= */

function smartSkills() {

    const textarea =
        document.getElementById("skills");

    const text =
        textarea.value.trim();

    if (!text) {

        alert(
            "Please enter some skills first."
        );

        textarea.focus();

        return;
    }


    const skills =
        text
            .split(",")
            .map(skill => skill.trim())
            .filter(Boolean);


    const improvedSkills =
        skills.map(skill =>
            improveSkill(skill)
        );


    textarea.value =
        improvedSkills.join(", ");


    generateResume();
}


/* =========================================
   IMPROVE INDIVIDUAL SKILL
========================================= */

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


        /* MICROSOFT */

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


        /* MECHANIC */

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


        /* CONSTRUCTION / LABOUR */

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


    if (skillMap[lower]) {

        return skillMap[lower];

    }


    /*
       If we don't have a specific
       improvement, keep the user's
       original skill instead of
       inventing anything.
    */

    return original;
}
/* =========================================
   CAPITALIZE
========================================= */

function capitalizeFirst(text) {

    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase() +
        text.slice(1);
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   PRINT / PDF
========================================= */

function printResume() {

    generateResume();

    window.print();
}


/* =========================================
   START OVER
========================================= */

function clearResume() {

    if (!confirm(
        "Are you sure you want to start over?"
    )) {
        return;
    }


    document
        .querySelectorAll(
            "input, textarea"
        )
        .forEach(input => {
            input.value = "";
        });


    const experienceContainer =
        document.getElementById("experienceContainer");

    if (experienceContainer) {
        experienceContainer.innerHTML = "";
    }


    if (educationContainer) {
        educationContainer.innerHTML = "";
    }


    document.getElementById("previewName").textContent =
        "Your Name";

    document.getElementById("previewPhone").textContent =
        "";

    document.getElementById("previewEmail").textContent =
        "";

    document.getElementById("previewLocation").textContent =
        "";

    document.getElementById("previewLinkedin").textContent =
        "";

    document.getElementById("previewSummary").textContent =
        "";

    document.getElementById("previewExperience").innerHTML =
        "";

    document.getElementById("previewEducation").innerHTML =
        "";

    document.getElementById("previewSkills").innerHTML =
        "";

    document.getElementById("previewLanguages").innerHTML =
        "";

    document.getElementById("previewCertifications").innerHTML =
        "";
}


/* =========================================
   MAKE FUNCTIONS AVAILABLE TO HTML
========================================= */

window.addExperience = addExperience;
window.removeExperience = removeExperience;
window.addEducation = addEducation;
window.removeEducation = removeEducation;
window.generateResume = generateResume;
window.printResume = printResume;
window.clearResume = clearResume;
window.smartSummary = smartSummary;
window.smartExperience = smartExperience;


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    generateResume();

});
