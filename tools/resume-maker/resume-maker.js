/* =========================================
   KALMARKET FREE RESUME MAKER
   Browser-Based Version
   No OpenAI API Required
========================================= */


/* =========================================
   BASIC ELEMENTS
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
   CREATE EXPERIENCE SECTION
   Your current HTML does not contain one,
   so we create it automatically.
========================================= */

let experienceContainer = null;

function createExperienceSection() {

    const educationSection =
        educationContainer
            ? educationContainer.closest(".form-section")
            : null;

    if (!educationSection) {
        console.warn("Education section not found.");
        return;
    }

    const experienceSection =
        document.createElement("div");

    experienceSection.className =
        "form-section experience-form-section";

    experienceSection.innerHTML = `
        <h3>💼 Work Experience</h3>

        <div id="experienceContainer"></div>

        <button
            type="button"
            class="add-btn"
            id="addExperienceButton">
            + Add Work Experience
        </button>

        <small>
            Add your jobs, work history, responsibilities and achievements.
        </small>
    `;

    educationSection.parentNode.insertBefore(
        experienceSection,
        educationSection
    );

    experienceContainer =
        document.getElementById("experienceContainer");

    document
        .getElementById("addExperienceButton")
        .addEventListener("click", addExperience);
}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    createExperienceSection();

    /*
       Start with one work experience box.
       This makes the form easier for visitors.
    */

    addExperience();

    /*
       Start with one education box.
       User can remove it if not needed.
    */

    addEducation();

    /*
       Update preview while typing.
    */

    setupLivePreview();

});


/* =========================================
   ADD EXPERIENCE
========================================= */

function addExperience() {

    if (!experienceContainer) {
        return;
    }

    const entry =
        document.createElement("div");

    entry.className =
        "dynamic-entry experience-entry";

    entry.innerHTML = `

        <div class="dynamic-entry-grid">

            <div>
                <label>Job Title</label>

                <input
                    type="text"
                    class="exp-title"
                    placeholder="Automotive Technician">
            </div>


            <div>
                <label>Company</label>

                <input
                    type="text"
                    class="exp-company"
                    placeholder="ABC Auto Service">
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

                <label>
                    Responsibilities & Achievements
                </label>

                <textarea
                    class="exp-description"
                    rows="5"
                    placeholder="Example: oil changes, brakes, tires, diagnostics, customer service"></textarea>

                <button
                    type="button"
                    class="ai-btn local-improve-experience">
                    ✨ Improve Wording
                </button>

            </div>

        </div>


        <button
            type="button"
            class="remove-btn remove-experience-btn">
            Remove
        </button>
    `;

    experienceContainer.appendChild(entry);


    /*
       Improve wording button
    */

    const improveButton =
        entry.querySelector(
            ".local-improve-experience"
        );

    improveButton.addEventListener(
        "click",
        () => improveExperience(improveButton)
    );


    /*
       Remove button
    */

    const removeButton =
        entry.querySelector(
            ".remove-experience-btn"
        );

    removeButton.addEventListener(
        "click",
        () => removeExperience(removeButton)
    );


    /*
       Live preview
    */

    entry
        .querySelectorAll("input, textarea")
        .forEach(input => {

            input.addEventListener(
                "input",
                generateResume
            );

        });
}


/* =========================================
   REMOVE EXPERIENCE
========================================= */

function removeExperience(button) {

    const entry =
        button.closest(".experience-entry");

    if (!entry) {
        return;
    }

    entry.remove();

    generateResume();
}


/* =========================================
   ADD EDUCATION
========================================= */

function addEducation() {

    if (!educationContainer) {
        return;
    }

    const entry =
        document.createElement("div");

    entry.className =
        "dynamic-entry education-entry";

    entry.innerHTML = `

        <div class="dynamic-entry-grid">

            <div>

                <label>
                    Degree / Diploma
                </label>

                <input
                    type="text"
                    class="edu-degree"
                    placeholder="Business Administration">

            </div>


            <div>

                <label>
                    School
                </label>

                <input
                    type="text"
                    class="edu-school"
                    placeholder="University of Manitoba">

            </div>


            <div>

                <label>
                    Location
                </label>

                <input
                    type="text"
                    class="edu-location"
                    placeholder="Winnipeg, Manitoba">

            </div>


            <div>

                <label>
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
            class="remove-btn remove-education-btn">
            Remove
        </button>
    `;

    educationContainer.appendChild(entry);


    const removeButton =
        entry.querySelector(
            ".remove-education-btn"
        );

    removeButton.addEventListener(
        "click",
        () => removeEducation(removeButton)
    );


    entry
        .querySelectorAll("input")
        .forEach(input => {

            input.addEventListener(
                "input",
                generateResume
            );

        });
}


/* =========================================
   REMOVE EDUCATION
========================================= */

function removeEducation(button) {

    const entry =
        button.closest(".education-entry");

    if (!entry) {
        return;
    }

    entry.remove();

    generateResume();
}


/* =========================================
   GENERATE RESUME
========================================= */

function generateResume() {

    /*
       PERSONAL INFORMATION
    */

    document.getElementById(
        "previewName"
    ).textContent =
        fullName.value.trim() ||
        "Your Name";


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


    document.getElementById(
        "previewLinkedin"
    ).textContent =
        linkedin.value.trim();


    /*
       SUMMARY
    */

    const summaryPreview =
        document.getElementById(
            "previewSummary"
        );

    summaryPreview.textContent =
        summary.value.trim();


    /*
       EXPERIENCE
    */

    generateExperience();


    /*
       EDUCATION
    */

    generateEducation();


    /*
       SKILLS
    */

    generateSkills();


    /*
       LANGUAGES
    */

    generateTextList(
        languages.value,
        "previewLanguages"
    );


    /*
       CERTIFICATIONS
    */

    generateTextList(
        certifications.value,
        "previewCertifications"
    );


    /*
       SHOW GENERATED STYLE
    */

    const preview =
        document.getElementById(
            "resumePreview"
        );

    if (preview) {

        preview.classList.add(
            "resume-generated"
        );

    }
}


/* =========================================
   EXPERIENCE PREVIEW
========================================= */

function generateExperience() {

    const preview =
        document.getElementById(
            "previewExperience"
        );

    if (!preview) {
        return;
    }

    const entries =
        document.querySelectorAll(
            ".experience-entry"
        );

    preview.innerHTML = "";


    /*
       No experience
    */

    const validEntries =
        Array.from(entries).filter(entry => {

            const title =
                entry.querySelector(
                    ".exp-title"
                )?.value.trim();

            const company =
                entry.querySelector(
                    ".exp-company"
                )?.value.trim();

            const description =
                entry.querySelector(
                    ".exp-description"
                )?.value.trim();

            return (
                title ||
                company ||
                description
            );

        });


    if (validEntries.length === 0) {

        preview.innerHTML = `
            <p class="empty-preview">
                Your work experience will appear here.
            </p>
        `;

        return;
    }


    validEntries.forEach(entry => {

        const title =
            entry.querySelector(
                ".exp-title"
            ).value.trim();

        const company =
            entry.querySelector(
                ".exp-company"
            ).value.trim();

        const location =
            entry.querySelector(
                ".exp-location"
            ).value.trim();

        const dates =
            entry.querySelector(
                ".exp-dates"
            ).value.trim();

        const description =
            entry.querySelector(
                ".exp-description"
            ).value.trim();


        const job =
            document.createElement("div");

        job.className =
            "preview-job";


        /*
           Convert responsibilities into
           professional bullet points.
        */

        let descriptionHTML = "";


        if (description) {

            const lines =
                description
                    .split(/\n|•/)
                    .map(line =>
                        line
                            .replace(/^[-*]\s*/, "")
                            .trim()
                    )
                    .filter(Boolean);


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


        job.innerHTML = `

            <h3>
                ${escapeHTML(
                    title || "Job Title"
                )}
            </h3>


            ${
                company
                ? `
                    <div class="preview-company">
                        ${escapeHTML(company)}
                    </div>
                  `
                : ""
            }


            ${
                location || dates
                ? `
                    <div class="preview-dates">

                        ${escapeHTML(location)}

                        ${
                            location && dates
                            ? " | "
                            : ""
                        }

                        ${escapeHTML(dates)}

                    </div>
                  `
                : ""
            }


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
        document.getElementById(
            "previewEducation"
        );

    if (!preview) {
        return;
    }

    const entries =
        document.querySelectorAll(
            ".education-entry"
        );

    preview.innerHTML = "";


    const validEntries =
        Array.from(entries).filter(entry => {

            const degree =
                entry.querySelector(
                    ".edu-degree"
                )?.value.trim();

            const school =
                entry.querySelector(
                    ".edu-school"
                )?.value.trim();

            return degree || school;

        });


    if (validEntries.length === 0) {

        preview.innerHTML = `
            <p class="empty-preview">
                Your education will appear here.
            </p>
        `;

        return;
    }


    validEntries.forEach(entry => {

        const degree =
            entry.querySelector(
                ".edu-degree"
            ).value.trim();

        const school =
            entry.querySelector(
                ".edu-school"
            ).value.trim();

        const location =
            entry.querySelector(
                ".edu-location"
            ).value.trim();

        const dates =
            entry.querySelector(
                ".edu-dates"
            ).value.trim();


        const education =
            document.createElement("div");

        education.className =
            "preview-school";


        education.innerHTML = `

            <h3>
                ${escapeHTML(
                    degree || "Degree / Diploma"
                )}
            </h3>


            ${
                school
                ? `
                    <div class="preview-school-name">
                        ${escapeHTML(school)}
                    </div>
                  `
                : ""
            }


            ${
                location || dates
                ? `
                    <div class="preview-dates">

                        ${escapeHTML(location)}

                        ${
                            location && dates
                            ? " | "
                            : ""
                        }

                        ${escapeHTML(dates)}

                    </div>
                  `
                : ""
            }

        `;


        preview.appendChild(
            education
        );

    });
}


/* =========================================
   SKILLS
========================================= */

function generateSkills() {

    const preview =
        document.getElementById(
            "previewSkills"
        );

    if (!preview) {
        return;
    }

    const values =
        skills.value
            .split(",")
            .map(skill =>
                skill.trim()
            )
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

function generateTextList(
    value,
    elementId
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {
        return;
    }


    /*
       Support both commas and new lines.
    */

    const values =
        value
            .split(/,|\n/)
            .map(item =>
                item.trim()
            )
            .filter(Boolean);


    if (values.length === 0) {

        element.innerHTML = "";

        return;
    }


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
   FREE SMART SUMMARY IMPROVEMENT
========================================= */

/*
   This replaces the paid AI call.

   It does NOT send information anywhere.

   It uses local JavaScript rules to create
   professional resume wording.
*/

function improveWithAI(type) {

    const textarea =
        document.getElementById(type);

    if (!textarea) {
        return;
    }


    const text =
        textarea.value.trim();


    if (!text) {

        alert(
            "Please enter a few words first."
        );

        textarea.focus();

        return;
    }


    if (type === "summary") {

        textarea.value =
            createProfessionalSummary(text);

    }


    generateResume();

}


/* =========================================
   PROFESSIONAL SUMMARY GENERATOR
========================================= */

function createProfessionalSummary(text) {

    const original =
        text.trim();


    /*
       If the user already entered a
       reasonably long sentence, improve
       punctuation and wording lightly.
    */

    if (original.length > 120) {

        return capitalizeSentence(
            original
        );

    }


    const lower =
        original.toLowerCase();


    let profession =
        "professional";


    if (
        lower.includes("mechanic") ||
        lower.includes("automotive") ||
        lower.includes("auto repair")
    ) {

        profession =
            "automotive professional";

    }
    else if (
        lower.includes("warehouse") ||
        lower.includes("shipping") ||
        lower.includes("receiving")
    ) {

        profession =
            "warehouse and logistics professional";

    }
    else if (
        lower.includes("customer service") ||
        lower.includes("customer")
    ) {

        profession =
            "customer service professional";

    }
    else if (
        lower.includes("sales") ||
        lower.includes("selling")
    ) {

        profession =
            "sales professional";

    }
    else if (
        lower.includes("security") ||
        lower.includes("security guard")
    ) {

        profession =
            "security professional";

    }
    else if (
        lower.includes("construction") ||
        lower.includes("construction worker")
    ) {

        profession =
            "construction professional";

    }
    else if (
        lower.includes("cleaning") ||
        lower.includes("cleaner")
    ) {

        profession =
            "cleaning and maintenance professional";

    }
    else if (
        lower.includes("restaurant") ||
        lower.includes("food") ||
        lower.includes("cook")
    ) {

        profession =
            "food service professional";

    }


    /*
       Extract useful skills/activities.
    */

    const activities =
        buildActivityPhrase(
            original
        );


    return `Motivated and dependable ${profession} with practical experience in ${activities}. Known for a strong work ethic, attention to detail, reliability, and a commitment to providing quality work. Adaptable team member with a professional approach and a willingness to learn and contribute.`;

}


/* =========================================
   ACTIVITY PHRASE
========================================= */

function buildActivityPhrase(text) {

    const lower =
        text.toLowerCase();


    const phrases = [];


    const keywordMap = [

        {
            keys: [
                "oil change",
                "oil changes"
            ],
            phrase:
                "vehicle maintenance"
        },

        {
            keys: [
                "brake",
                "brakes"
            ],
            phrase:
                "brake service"
        },

        {
            keys: [
                "tire",
                "tires"
            ],
            phrase:
                "tire service"
        },

        {
            keys: [
                "diagnostic",
                "diagnostics"
            ],
            phrase:
                "vehicle diagnostics"
        },

        {
            keys: [
                "customer service",
                "customers"
            ],
            phrase:
                "customer service"
        },

        {
            keys: [
                "cash",
                "cashier"
            ],
            phrase:
                "cash handling"
        },

        {
            keys: [
                "warehouse",
                "inventory"
            ],
            phrase:
                "warehouse operations and inventory"
        },

        {
            keys: [
                "shipping",
                "receiving"
            ],
            phrase:
                "shipping and receiving"
        },

        {
            keys: [
                "sales",
                "selling"
            ],
            phrase:
                "sales and customer support"
        },

        {
            keys: [
                "cleaning",
                "clean"
            ],
            phrase:
                "cleaning and maintenance"
        },

        {
            keys: [
                "security",
                "security guard"
            ],
            phrase:
                "security and safety procedures"
        },

        {
            keys: [
                "computer",
                "computers",
                "microsoft office"
            ],
            phrase:
                "computer and office tasks"
        }

    ];


    keywordMap.forEach(item => {

        const found =
            item.keys.some(
                key =>
                    lower.includes(key)
            );

        if (
            found &&
            !phrases.includes(
                item.phrase
            )
        ) {

            phrases.push(
                item.phrase
            );

        }

    });


    if (phrases.length === 0) {

        return cleanUserText(text);

    }


    if (phrases.length === 1) {

        return phrases[0];

    }


    if (phrases.length === 2) {

        return `${phrases[0]} and ${phrases[1]}`;

    }


    const last =
        phrases.pop();


    return `${phrases.join(", ")}, and ${last}`;

}


/* =========================================
   FREE EXPERIENCE WORDING
========================================= */

function improveExperience(button) {

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
        ).value.trim();


    const description =
        entry.querySelector(
            ".exp-description"
        );


    const text =
        description.value.trim();


    if (!title && !text) {

        alert(
            "Please enter a job title and/or a few words about the work."
        );

        return;
    }


    const improved =
        createProfessionalBullets(
            title,
            text
        );


    description.value =
        improved;


    generateResume();

}


/* =========================================
   EXPERIENCE BULLET GENERATOR
========================================= */

function createProfessionalBullets(
    title,
    text
) {

    const lower =
        text.toLowerCase();


    const bullets = [];


    /*
       Automotive
    */

    if (
        lower.includes("oil change") ||
        lower.includes("oil changes")
    ) {

        bullets.push(
            "Performed routine oil changes and vehicle maintenance services."
        );

    }


    if (
        lower.includes("brake") ||
        lower.includes("brakes")
    ) {

        bullets.push(
            "Inspected, serviced and replaced brake components as required."
        );

    }


    if (
        lower.includes("tire") ||
        lower.includes("tires")
    ) {

        bullets.push(
            "Performed tire installation, rotation and related tire services."
        );

    }


    if (
        lower.includes("diagnostic") ||
        lower.includes("diagnostics")
    ) {

        bullets.push(
            "Performed vehicle inspections and diagnostic procedures to identify mechanical issues."
        );

    }


    /*
       Customer service
    */

    if (
        lower.includes("customer") ||
        lower.includes("customers")
    ) {

        bullets.push(
            "Provided professional customer service and communicated clearly with customers."
        );

    }


    /*
       Sales
    */

    if (
        lower.includes("sales") ||
        lower.includes("selling")
    ) {

        bullets.push(
            "Assisted customers with product selection and supported sales activities."
        );

    }


    /*
       Cash
    */

    if (
        lower.includes("cash") ||
        lower.includes("cashier")
    ) {

        bullets.push(
            "Handled cash transactions accurately and maintained organized payment records."
        );

    }


    /*
       Warehouse
    */

    if (
        lower.includes("warehouse") ||
        lower.includes("inventory")
    ) {

        bullets.push(
            "Supported warehouse operations, inventory organization and material handling."
        );

    }


    if (
        lower.includes("shipping") ||
        lower.includes("receiving")
    ) {

        bullets.push(
            "Assisted with shipping and receiving activities while maintaining accurate records."
        );

    }


    /*
       Security
    */

    if (
        lower.includes("security") ||
        lower.includes("security guard")
    ) {

        bullets.push(
            "Monitored facilities, followed safety procedures and responded professionally to incidents."
        );

    }


    /*
       Cleaning
    */

    if (
        lower.includes("clean") ||
        lower.includes("cleaning")
    ) {

        bullets.push(
            "Maintained clean, organized and safe work areas."
        );

    }


    /*
       Construction
    */

    if (
        lower.includes("construction")
    ) {

        bullets.push(
            "Supported construction activities while following workplace safety procedures."
        );

    }


    /*
       Generic fallback
    */

    if (bullets.length === 0) {

        const cleaned =
            cleanUserText(text);


        if (cleaned) {

            bullets.push(
                `Performed ${cleaned.toLowerCase()} while maintaining quality, safety and professional standards.`
            );

        }

    }


    /*
       If user provided several separate
       lines, preserve useful information
       that the smart rules didn't recognize.
    */

    const originalLines =
        text
            .split(/\n|•/)
            .map(line =>
                line
                    .replace(/^[-*]\s*/, "")
                    .trim()
            )
            .filter(Boolean);


    originalLines.forEach(line => {

        const alreadyCovered =
            bullets.some(
                bullet =>
                    bullet
                        .toLowerCase()
                        .includes(
                            line.toLowerCase()
                        )
            );


        if (
            !alreadyCovered &&
            line.length > 3
        ) {

            bullets.push(
                professionalizeSimpleLine(
                    line
                )
            );

        }

    });


    /*
       Maximum 6 bullets.
    */

    return bullets
        .slice(0, 6)
        .map(
            bullet =>
                "• " + bullet
        )
        .join("\n");

}


/* =========================================
   SIMPLE PROFESSIONAL WORDING
========================================= */

function professionalizeSimpleLine(
    text
) {

    let cleaned =
        cleanUserText(text);


    const lower =
        cleaned.toLowerCase();


    if (
        lower.startsWith("worked ")
    ) {

        return capitalizeSentence(
            cleaned
        );

    }


    if (
        lower.startsWith("helped ")
    ) {

        return capitalizeSentence(
            cleaned.replace(
                /^helped /i,
                "Assisted "
            )
        );

    }


    if (
        lower.startsWith("did ")
    ) {

        return capitalizeSentence(
            cleaned.replace(
                /^did /i,
                "Performed "
            )
        );

    }


    if (
        lower.startsWith("made ")
    ) {

        return capitalizeSentence(
            cleaned.replace(
                /^made /i,
                "Prepared "
            )
        );

    }


    return capitalizeSentence(
        cleaned
    );

}


/* =========================================
   CLEAN USER TEXT
========================================= */

function cleanUserText(text) {

    return text
        .replace(/\s+/g, " ")
        .replace(/^[•\-*]\s*/, "")
        .trim();

}


/* =========================================
   CAPITALIZE SENTENCE
========================================= */

function capitalizeSentence(text) {

    const cleaned =
        cleanUserText(text);


    if (!cleaned) {
        return "";
    }


    return (
        cleaned.charAt(0).toUpperCase() +
        cleaned.slice(1)
    );
}


/* =========================================
   LIVE PREVIEW
========================================= */

function setupLivePreview() {

    const fields = [

        fullName,
        phone,
        email,
        locationInput,
        linkedin,
        summary,
        skills,
        languages,
        certifications

    ];


    fields.forEach(field => {

        if (!field) {
            return;
        }

        field.addEventListener(
            "input",
            generateResume
        );

    });


    generateResume();
}


/* =========================================
   PRINT / SAVE PDF
========================================= */

function printResume() {

    generateResume();

    window.print();

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


    /*
       Clear normal fields
    */

    [

        fullName,
        phone,
        email,
        locationInput,
        linkedin,
        summary,
        skills,
        languages,
        certifications

    ].forEach(field => {

        if (field) {
            field.value = "";
        }

    });


    /*
       Clear experience
    */

    if (experienceContainer) {

        experienceContainer.innerHTML = "";

        addExperience();

    }


    /*
       Clear education
    */

    if (educationContainer) {

        educationContainer.innerHTML = "";

        addEducation();

    }


    /*
       Reset preview
    */

    document.getElementById(
        "previewName"
    ).textContent =
        "Your Name";


    document.getElementById(
        "previewPhone"
    ).textContent = "";


    document.getElementById(
        "previewEmail"
    ).textContent = "";


    document.getElementById(
        "previewLocation"
    ).textContent = "";


    document.getElementById(
        "previewLinkedin"
    ).textContent = "";


    document.getElementById(
        "previewSummary"
    ).textContent = "";


    document.getElementById(
        "previewExperience"
    ).innerHTML = "";


    document.getElementById(
        "previewEducation"
    ).innerHTML = "";


    document.getElementById(
        "previewSkills"
    ).innerHTML = "";


    document.getElementById(
        "previewLanguages"
    ).innerHTML = "";


    document.getElementById(
        "previewCertifications"
    ).innerHTML = "";


    /*
       Scroll back to form
    */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   ESCAPE HTML
========================================= */

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


/* =========================================
   MAKE FUNCTIONS AVAILABLE TO HTML
========================================= */

window.generateResume =
    generateResume;

window.printResume =
    printResume;

window.clearResume =
    clearResume;

window.addEducation =
    addEducation;

window.addExperience =
    addExperience;

window.improveWithAI =
    improveWithAI;

window.improveExperience =
    improveExperience;
