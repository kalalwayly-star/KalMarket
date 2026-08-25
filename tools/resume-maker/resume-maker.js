
/* =========================================
   KALMARKET RESUME MAKER
========================================= */

const form = document.getElementById("resumeForm");

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
   ADD EXPERIENCE
========================================= */

function addExperience() {

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
                    placeholder="Served customers, handled cash, increased sales..."></textarea>
            </div>

        </div>

        <button
            type="button"
            class="remove-btn"
            onclick="removeExperience(this)">
            Remove
        </button>
    `;

    experienceContainer.appendChild(entry);
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

    const entry = document.createElement("div");

    entry.className = "dynamic-entry education-entry";

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

    educationContainer.appendChild(entry);
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
========================================= */

function generateResume() {

    document.getElementById("previewName").textContent =
        fullName.value.trim() || "Your Name";

    document.getElementById("previewPhone").textContent =
        phone.value.trim() || "";

    document.getElementById("previewEmail").textContent =
        email.value.trim() || "";

    document.getElementById("previewLocation").textContent =
        locationInput.value.trim() || "";

    document.getElementById("previewLinkedin").textContent =
        linkedin.value.trim();


    /* SUMMARY */

    const summaryPreview =
        document.getElementById("previewSummary");

    summaryPreview.textContent =
        summary.value.trim() || "";


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


    /* SHOW PREVIEW */

    const preview =
        document.getElementById("resumePreview");

    preview.classList.add("resume-generated");

    preview.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================
   EXPERIENCE PREVIEW
========================================= */

function generateExperience() {

    const preview =
        document.getElementById("previewExperience");

    const entries =
        document.querySelectorAll(".experience-entry");

    preview.innerHTML = "";

    if (entries.length === 0) {

        preview.innerHTML =
            `<p class="empty-preview">
                No work experience added.
            </p>`;

        return;
    }


    entries.forEach(entry => {

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


        const job =
            document.createElement("div");

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

function generateEducation() {

    const preview =
        document.getElementById("previewEducation");

    const entries =
        document.querySelectorAll(".education-entry");

    preview.innerHTML = "";

    if (entries.length === 0) {

        preview.innerHTML =
            `<p class="empty-preview">
                No education added.
            </p>`;

        return;
    }


    entries.forEach(entry => {

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
   PRINT / PDF
========================================= */

function printResume() {

    window.print();

}


/* =========================================
   START OVER
========================================= */

function clearResume() {

    if (!confirm("Are you sure you want to start over?")) {
        return;
    }

    document
        .querySelectorAll(
            "#resumeForm input, #resumeForm textarea"
        )
        .forEach(input => {
            input.value = "";
        });

    experienceContainer.innerHTML = "";

    educationContainer.innerHTML = "";

    document.getElementById("previewName").textContent =
        "Your Name";

    document.getElementById("previewPhone").textContent = "";

    document.getElementById("previewEmail").textContent = "";

    document.getElementById("previewLocation").textContent = "";

    document.getElementById("previewLinkedin").textContent = "";

    document.getElementById("previewSummary").textContent = "";

    document.getElementById("previewExperience").innerHTML = "";

    document.getElementById("previewEducation").innerHTML = "";

    document.getElementById("previewSkills").innerHTML = "";

    document.getElementById("previewLanguages").innerHTML = "";

    document.getElementById("previewCertifications").innerHTML = "";
}
