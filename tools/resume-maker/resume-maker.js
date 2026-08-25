```javascript
/* =========================================
   KALMARKET RESUME MAKER
========================================= */


/* =========================================
   ELEMENTS
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

const experienceContainer =
    document.getElementById("experienceContainer");

const educationContainer =
    document.getElementById("educationContainer");


/* =========================================
   LIVE INPUTS
========================================= */

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
].forEach(input => {

    input.addEventListener("input", updateResume);

});


/* =========================================
   ADD EXPERIENCE
========================================= */

function addExperience() {

    const entry = document.createElement("div");

    entry.className = "dynamic-entry";

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

                <label>
                    Responsibilities & Achievements
                </label>

                <textarea
                    class="exp-description"
                    rows="4"
                    placeholder="Served customers, handled cash, increased sales..."></textarea>

            </div>

        </div>

        <button
            type="button"
            class="remove-btn"
            onclick="removeEntry(this)">
            Remove
        </button>

    `;

    experienceContainer.appendChild(entry);

    entry.querySelectorAll("input, textarea")
        .forEach(input => {
            input.addEventListener("input", updateResume);
        });

    updateResume();
}


/* =========================================
   ADD EDUCATION
========================================= */

function addEducation() {

    const entry = document.createElement("div");

    entry.className = "dynamic-entry";

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
            onclick="removeEntry(this)">
            Remove
        </button>

    `;

    educationContainer.appendChild(entry);

    entry.querySelectorAll("input, textarea")
        .forEach(input => {
            input.addEventListener("input", updateResume);
        });

    updateResume();
}


/* =========================================
   REMOVE ENTRY
========================================= */

function removeEntry(button) {

    button.closest(".dynamic-entry").remove();

    updateResume();
}


/* =========================================
   UPDATE RESUME
========================================= */

function updateResume() {

    document.getElementById("previewName").textContent =
        fullName.value.trim() || "Your Name";

    document.getElementById("previewPhone").textContent =
        phone.value.trim() || "Phone";

    document.getElementById("previewEmail").textContent =
        email.value.trim() || "Email";

    document.getElementById("previewLocation").textContent =
        locationInput.value.trim() || "City, Province";


    const linkedinPreview =
        document.getElementById("previewLinkedin");

    linkedinPreview.textContent =
        linkedin.value.trim();


    /* SUMMARY */

    const summaryPreview =
        document.getElementById("previewSummary");

    summaryPreview.textContent =
        summary.value.trim() ||
        "Your professional summary will appear here.";


    /* EXPERIENCE */

    updateExperience();


    /* EDUCATION */

    updateEducation();


    /* SKILLS */

    updateSkills();


    /* LANGUAGES */

    updateTextSection(
        languages.value,
        "previewLanguages",
        "Your languages will appear here."
    );


    /* CERTIFICATIONS */

    updateTextSection(
        certifications.value,
        "previewCertifications",
        "Your certifications will appear here."
    );
}


/* =========================================
   EXPERIENCE PREVIEW
========================================= */

function updateExperience() {

    const preview =
        document.getElementById("previewExperience");

    const entries =
        document.querySelectorAll(".dynamic-entry");

    const experienceEntries = [];

    entries.forEach(entry => {

        const title =
            entry.querySelector(".exp-title");

        if (!title) return;

        experienceEntries.push(entry);

    });


    if (experienceEntries.length === 0) {

        preview.innerHTML =
            `<p class="empty-preview">
                Your work experience will appear here.
            </p>`;

        return;
    }


    preview.innerHTML = "";


    experienceEntries.forEach(entry => {

        const title =
            entry.querySelector(".exp-title").value.trim();

        const company =
            entry.querySelector(".exp-company").value.trim();

        const location =
            entry.querySelector(".exp-location").value.trim();

        const dates =
            entry.querySelector(".exp-dates").value.trim();

        const description =
            entry.querySelector(".exp-description").value.trim();


        const job = document.createElement("div");

        job.className = "preview-job";


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
                ${escapeHTML(company || "Company")}
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

function updateEducation() {

    const preview =
        document.getElementById("previewEducation");

    const entries =
        document.querySelectorAll(".dynamic-entry");

    const educationEntries = [];

    entries.forEach(entry => {

        const degree =
            entry.querySelector(".edu-degree");

        if (!degree) return;

        educationEntries.push(entry);

    });


    if (educationEntries.length === 0) {

        preview.innerHTML =
            `<p class="empty-preview">
                Your education will appear here.
            </p>`;

        return;
    }


    preview.innerHTML = "";


    educationEntries.forEach(entry => {

        const degree =
            entry.querySelector(".edu-degree").value.trim();

        const school =
            entry.querySelector(".edu-school").value.trim();

        const location =
            entry.querySelector(".edu-location").value.trim();

        const dates =
            entry.querySelector(".edu-dates").value.trim();


        const education =
            document.createElement("div");

        education.className = "preview-school";


        education.innerHTML = `

            <h3>
                ${escapeHTML(degree || "Degree / Diploma")}
            </h3>

            <div class="preview-school-name">
                ${escapeHTML(school || "School")}
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

function updateSkills() {

    const preview =
        document.getElementById("previewSkills");

    const values =
        skills.value
            .split(",")
            .map(skill => skill.trim())
            .filter(Boolean);


    if (values.length === 0) {

        preview.innerHTML =
            "Your skills will appear here.";

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
   TEXT SECTIONS
========================================= */

function updateTextSection(
    value,
    elementId,
    placeholder
) {

    const element =
        document.getElementById(elementId);

    const values =
        value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);


    if (values.length === 0) {

        element.textContent = placeholder;

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
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   PRINT / SAVE PDF
========================================= */

function printResume() {

    window.print();

}


/* =========================================
   CLEAR
========================================= */

function clearResume() {

    const confirmed =
        confirm(
            "Are you sure you want to start over?"
        );

    if (!confirmed) return;


    document.querySelectorAll(
        "input, textarea"
    ).forEach(input => {

        input.value = "";

    });


    experienceContainer.innerHTML = "";

    educationContainer.innerHTML = "";

    updateResume();

}


/* =========================================
   START WITH ONE EXPERIENCE + EDUCATION
========================================= */

addExperience();

addEducation();

updateResume();
```

