/* =========================================
KALMARKET FREE RESUME MAKER
No AI / No API / No Worker
========================================= */

/* =========================================
ELEMENTS
========================================= */

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

const resumePreviewArea =
document.getElementById("resumePreviewArea");

/* =========================================
ADD EXPERIENCE
========================================= */

function addExperience() {

const entry =
    document.createElement("div");

entry.className =
    "dynamic-entry experience-entry";


entry.innerHTML = `

    <div class="dynamic-entry-grid">

        <div>

            <label data-i18n="job_title">
                Job Title
            </label>

            <input
                type="text"
                class="exp-title"
                placeholder="Sales Associate">

        </div>


        <div>

            <label data-i18n="company">
                Company
            </label>

            <input
                type="text"
                class="exp-company"
                placeholder="ABC Company">

        </div>


        <div>

            <label data-i18n="location">
                Location
            </label>

            <input
                type="text"
                class="exp-location"
                placeholder="Winnipeg, Manitoba">

        </div>


        <div>

            <label data-i18n="dates">
                Dates
            </label>

            <input
                type="text"
                class="exp-dates"
                placeholder="2022 - Present">

        </div>


        <div class="full-width">

            <label data-i18n="responsibilities_achievements">
                Responsibilities & Achievements
            </label>

            <textarea
                class="exp-description"
                rows="4"
                placeholder="Example: oil change, brakes, tires"
                data-i18n-placeholder="experience_placeholder"></textarea>


            <button
                type="button"
                class="smart-btn experience-smart-btn"
                onclick="smartExperience(this)">

                ✨
                <span data-i18n="smart_wording">
                    Smart Wording
                </span>

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


applyDynamicTranslations();

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

}

/* =========================================
ADD EDUCATION
========================================= */

function addEducation() {

const entry =
    document.createElement("div");

entry.className =
    "dynamic-entry education-entry";


entry.innerHTML = `

    <div class="dynamic-entry-grid">

        <div>

            <label data-i18n="degree_diploma">
                Degree / Diploma
            </label>

            <input
                type="text"
                class="edu-degree"
                placeholder="Business Administration">

        </div>


        <div>

            <label data-i18n="school">
                School
            </label>

            <input
                type="text"
                class="edu-school"
                placeholder="University of Manitoba">

        </div>


        <div>

            <label data-i18n="location">
                Location
            </label>

            <input
                type="text"
                class="edu-location"
                placeholder="Winnipeg, Manitoba">

        </div>


        <div>

            <label data-i18n="dates">
                Dates
            </label>

            <input
                type="text"
                class="edu-dates"
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

applyDynamicTranslations();

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

}

/* =========================================
GENERATE RESUME
Only Generate Resume button scrolls
========================================= */

/* =========================================
   GENERATE RESUME
   ONLY SHOWS RESUME WHEN BUTTON IS CLICKED
========================================= */

function generateResume() {

    /* =========================================
       PERSONAL INFORMATION
    ========================================= */

    setText(
        "previewName",
        fullName.value.trim() || "Your Name"
    );

    setText(
        "previewPhone",
        phone.value.trim()
    );

    setText(
        "previewEmail",
        email.value.trim()
    );

    setText(
        "previewLocation",
        locationInput.value.trim()
    );

    setText(
        "previewLinkedin",
        linkedin.value.trim()
    );


    /* =========================================
       SUMMARY
    ========================================= */

    const summaryText =
        summary.value.trim();

    const summarySection =
        document.getElementById(
            "previewSummarySection"
        );

    const summaryPreview =
        document.getElementById(
            "previewSummary"
        );

    if (summaryText) {

        summaryPreview.textContent =
            summaryText;

        summarySection.style.display =
            "block";

    } else {

        summaryPreview.textContent =
            "";

        summarySection.style.display =
            "none";
    }


    /* =========================================
       EXPERIENCE
    ========================================= */

    generateExperience();


    /* =========================================
       EDUCATION
    ========================================= */

    generateEducation();


    /* =========================================
       SKILLS
    ========================================= */

    generateSkills();


    /* =========================================
       LANGUAGES
    ========================================= */

    generateTextList(
        languages.value,
        "previewLanguages",
        "previewLanguagesSection"
    );


    /* =========================================
       CERTIFICATIONS
    ========================================= */

    generateTextList(
        certifications.value,
        "previewCertifications",
        "previewCertificationsSection"
    );


    /* =========================================
       SHOW RESUME
    ========================================= */

    if (resumePreviewArea) {

        resumePreviewArea.classList.add(
            "show-preview"
        );

    }


    /* =========================================
       SCROLL TO RESUME
    ========================================= */

    setTimeout(function () {

        if (resumePreviewArea) {

            resumePreviewArea.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }, 100);

}
/* =========================================
EXPERIENCE PREVIEW
========================================= */

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


let hasContent = false;


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


    hasContent = true;


    const job =
        document.createElement("div");

    job.className =
        "preview-job";


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


    let datesHTML = "";

    if (location || dates) {

        datesHTML = `
            <div class="preview-dates">
                ${escapeHTML(location)}
                ${
                    location && dates
                        ? " | "
                        : ""
                }
                ${escapeHTML(dates)}
            </div>
        `;
    }


    let descriptionHTML = "";


    if (description) {

        const lines =
            description
                .split(/\n/)
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
                    ${lines.map(line => `
                        <li>
                            ${escapeHTML(line)}
                        </li>
                    `).join("")}
                </ul>
            `;
        }
    }


    job.innerHTML =
        titleHTML +
        companyHTML +
        datesHTML +
        descriptionHTML;


    preview.appendChild(job);

});


section.style.display =
    hasContent
        ? "block"
        : "none";

}

/* =========================================
EDUCATION PREVIEW
========================================= */

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


let hasContent = false;


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


    hasContent = true;


    const education =
        document.createElement("div");

    education.className =
        "preview-school";


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
            location || dates
                ? `<div class="preview-dates">
                     ${escapeHTML(location)}
                     ${
                        location && dates
                            ? " | "
                            : ""
                     }
                     ${escapeHTML(dates)}
                   </div>`
                : ""
        }

    `;


    preview.appendChild(education);

});


section.style.display =
    hasContent
        ? "block"
        : "none";


}

/* =========================================
SKILLS
========================================= */

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

    preview.innerHTML = "";

    section.style.display =
        "none";

    return;
}


section.style.display =
    "block";


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

function generateTextList(
value,
elementId,
sectionId
) {


const element =
    document.getElementById(
        elementId
    );

const section =
    document.getElementById(
        sectionId
    );


const values =
    value
        .split(",")
        .map(item =>
            item.trim()
        )
        .filter(Boolean);


if (values.length === 0) {

    element.innerHTML = "";

    section.style.display =
        "none";

    return;
}


section.style.display =
    "block";


element.innerHTML = `

    <ul>

        ${values.map(item => `

            <li>
                ${escapeHTML(item)}
            </li>

        `).join("")}

    </ul>

`;


}

/* =========================================
FREE SMART SUMMARY
========================================= */

function smartSummary() {


const text =
    summary.value.trim();


if (!text) {

    alert(
        "Please enter a few words first."
    );

    summary.focus();

    return;
}


summary.value =
    improveSummaryText(text);

}

/* =========================================
SUMMARY WORDING ENGINE
========================================= */

function improveSummaryText(text) {


const clean =
    text
        .replace(/\s+/g, " ")
        .trim();


const lower =
    clean.toLowerCase();


let result = "";


if (
    lower.includes("mechanic") ||
    lower.includes("automotive") ||
    lower.includes("auto")
) {

    result =
        "Experienced automotive professional with hands-on experience in vehicle maintenance, repair, and customer service.";

}

else if (
    lower.includes("warehouse") ||
    lower.includes("shipping") ||
    lower.includes("receiving")
) {

    result =
        "Reliable warehouse professional with experience supporting daily operations, inventory handling, and team-based work.";

}

else if (
    lower.includes("customer service") ||
    lower.includes("sales") ||
    lower.includes("retail")
) {

    result =
        "Customer-focused professional with experience in customer service, sales, and day-to-day business operations.";

}

else if (
    lower.includes("security") ||
    lower.includes("guard")
) {

    result =
        "Responsible security professional with experience maintaining safe environments, monitoring activity, and assisting customers and staff.";

}

else if (
    lower.includes("driver") ||
    lower.includes("driving")
) {

    result =
        "Dependable professional with driving experience and a strong commitment to safety, reliability, and customer service.";

}

else {

    result =
        "Motivated and dependable professional with practical experience and a strong commitment to quality work and customer service.";

}


/*
   Preserve the user's original
   information so we don't invent
   experience.
*/

const original =
    clean.charAt(0).toUpperCase() +
    clean.slice(1);


if (
    !result
        .toLowerCase()
        .includes(clean.toLowerCase())
) {

    result += " " + original + ".";

}


return result;


}

/* =========================================
FREE SMART EXPERIENCE
========================================= */

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
        "Please enter a few simple notes first."
    );

    description.focus();

    return;
}


const lines =
    text
        .split(/\n/)
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

}

/* =========================================
EXPERIENCE WORDING ENGINE
========================================= */

function improveExperienceLine(
line,
title
) {


let text =
    line.trim();


const lower =
    text.toLowerCase();


const replacements = [

    [
        /^oil change$/i,
        "Performed routine oil changes and basic vehicle maintenance."
    ],

    [
        /^brakes?$/i,
        "Inspected and serviced brake systems to support safe vehicle operation."
    ],

    [
        /^tires?$/i,
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
        "Stocked and organized merchandise while maintaining an orderly work area."
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
        /^packing$/i,
        "Packed products and prepared orders accurately and efficiently."
    ],

    [
        /^shipping$/i,
        "Supported shipping activities and prepared orders for delivery."
    ],

    [
        /^receiving$/i,
        "Received incoming materials and assisted with accurate organization and storage."
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


/*
   Already professional sentence
*/

if (
    text.length > 20 &&
    /[.!?]$/.test(text)
) {

    return capitalizeFirst(text);

}


/*
   Common action words
*/

const actionMap = [

    ["helped", "Supported"],
    ["help", "Supported"],
    ["worked with", "Collaborated with"],
    ["work with", "Collaborated with"],
    ["did", "Performed"],
    ["made", "Prepared"],
    ["make", "Prepared"],
    ["fixed", "Repaired"],
    ["fix", "Repair"],
    ["sold", "Sold"],
    ["sell", "Supported sales of"],
    ["cleaned", "Maintained"],
    ["clean", "Maintained"],
    ["organized", "Organized"],
    ["organize", "Organized"],
    ["checked", "Inspected"],
    ["check", "Inspected"],
    ["managed", "Managed"],
    ["manage", "Managed"]

];


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


return (
    capitalizeFirst(text) +
    (
        /[.!?]$/.test(text)
            ? ""
            : "."
    )
);


}

/* =========================================
FREE SMART SKILLS
========================================= */

function smartSkills() {


const text =
    skills.value.trim();


if (!text) {

    alert(
        "Please enter some skills first."
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

}

/* =========================================
SKILL WORDING ENGINE
========================================= */

function improveSkill(skill) {


const original =
    skill.trim();


const lower =
    original.toLowerCase();


const skillMap = {

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

    "communication":
        "Professional Communication",

    "talking":
        "Verbal Communication",

    "speaking":
        "Verbal Communication",

    "teamwork":
        "Teamwork & Collaboration",

    "team":
        "Teamwork & Collaboration",

    "working with others":
        "Teamwork & Collaboration",

    "microsoft office":
        "Microsoft Office & Computer Skills",

    "word":
        "Microsoft Word",

    "excel":
        "Microsoft Excel",

    "computer":
        "Computer & Digital Skills",

    "sales":
        "Sales & Customer Relationship Management",

    "selling":
        "Sales & Customer Service",

    "retail":
        "Retail Sales & Customer Service",

    "management":
        "Team Leadership & Management",

    "manager":
        "Team Leadership & Management",

    "leadership":
        "Leadership & Team Management",

    "organization":
        "Organization & Time Management",

    "organized":
        "Organization & Time Management",

    "time management":
        "Time Management & Organization",

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

    "construction":
        "Construction & General Labour",

    "labor":
        "General Labour & Physical Work",

    "labour":
        "General Labour & Physical Work",

    "hand tools":
        "Hand Tools & Equipment Operation",

    "cooking":
        "Food Preparation & Kitchen Operations",

    "food preparation":
        "Food Preparation & Kitchen Operations",

    "restaurant":
        "Restaurant Operations & Customer Service",

    "driving":
        "Safe Driving & Vehicle Operation",

    "delivery":
        "Delivery Services & Route Management",

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


return (
    skillMap[lower] ||
    original
);


}

/* =========================================
PRINT / SAVE PDF
========================================= */

function printResume() {


/*
   Generate first so the latest
   information is always printed.
*/

generateResume();

setTimeout(() => {

    window.print();

}, 300);


}

/* =========================================
START OVER
========================================= */

function clearResume() {


const confirmed =
    confirm(
        "Are you sure you want to start over?"
    );


if (!confirmed) {
    return;
}


document
    .querySelectorAll(
        "#fullName, #phone, #email, #location, #linkedin, #summary, #skills, #languages, #certifications"
    )
    .forEach(input => {

        input.value = "";

    });


experienceContainer.innerHTML =
    "";

educationContainer.innerHTML =
    "";


document.getElementById(
    "previewName"
).textContent =
    "Your Name";


[
    "previewPhone",
    "previewEmail",
    "previewLocation",
    "previewLinkedin",
    "previewSummary",
    "previewExperience",
    "previewEducation",
    "previewSkills",
    "previewLanguages",
    "previewCertifications"
].forEach(id => {

    const element =
        document.getElementById(id);

    if (element) {

        if (
            id === "previewExperience" ||
            id === "previewEducation" ||
            id === "previewSkills" ||
            id === "previewLanguages" ||
            id === "previewCertifications"
        ) {

            element.innerHTML = "";

        } else {

            element.textContent = "";

        }

    }

});


[
    "previewSummarySection",
    "previewExperienceSection",
    "previewEducationSection",
    "previewSkillsSection",
    "previewLanguagesSection",
    "previewCertificationsSection"
].forEach(id => {

    const section =
        document.getElementById(id);

    if (section) {
        section.style.display =
            "none";
    }

});


resumePreviewArea.classList.remove(
    "show-preview"
);


window.scrollTo({
    top: 0,
    behavior: "smooth"
});


}

/* =========================================
HELPERS
========================================= */

function setText(id, value) {


const element =
    document.getElementById(id);

if (element) {
    element.textContent =
        value || "";
}


}

function capitalizeFirst(text) {


if (!text) {
    return "";
}

return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
);


}

function escapeHTML(value) {


return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");


}

/* =========================================
TRANSLATION SUPPORT
========================================= */

function applyDynamicTranslations() {


/*
   This works with the existing
   KalMarket translation system
   when available.
*/

if (
    typeof window.applyTranslations ===
    "function"
) {

    window.applyTranslations();

    return;
}


if (
    typeof window.translatePage ===
    "function"
) {

    window.translatePage();

    return;
}

}

/* =========================================
INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /*
       Resume starts hidden.
    */

    if (resumePreviewArea) {
        resumePreviewArea.classList.remove("show-preview");
    }

});

