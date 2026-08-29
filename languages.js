// Set the default language to English or the language from localStorage
let currentLanguage = localStorage.getItem("language") || "en";
window.translations = {};

function loadLanguage(language) {

    let languagePath = `${language}.json`;

    if (window.location.pathname.includes("/tools/")) {

      if (
    window.location.pathname.includes("/calculators/resume-maker/")
) {

    languagePath = `../../../${language}.json`;

}
        if (
            window.location.pathname.includes("/calculators/") ||
            window.location.pathname.includes("/guides/") ||
            window.location.pathname.includes("/checklists/")
        ) {

            languagePath = `../../${language}.json`;

        } else {

            languagePath = `../${language}.json`;

        }
    }

    fetch(languagePath)
        .then(response => {

            if (!response.ok) {
                throw new Error(`Could not load ${language}.json`);
            }

            return response.json();
        })
        .then(mainTranslations => {

            /*
             * Restaurant Business Guide
             * Load guide-specific translations
             * only when Arabic is selected.
             */
            if (
                language === "ar" &&
                window.location.pathname.includes("/tools/guides/")
            ) {

                const guideLanguagePath =
                    `../../tools/guides/ar.json`;

                return fetch(guideLanguagePath)
                    .then(response => {

                        if (!response.ok) {
                            throw new Error(
                                `Could not load ${guideLanguagePath}`
                            );
                        }

                        return response.json();
                    })
                    .then(guideTranslations => {

                        return {
                            ...mainTranslations,
                            ...guideTranslations
                        };

                    });
            }

            return mainTranslations;

        })
        .then(translations => {

            window.translations = translations;

            localStorage.setItem("language", language);

            updateText(translations, language);

            window.dispatchEvent(
                new CustomEvent("languageChanged", {
                    detail: { language }
                })
            );

        })
        .catch(error => {

            console.error(
                "Error loading language file:",
                error
            );

            if (language !== "en") {
                loadLanguage("en");
            }

        });
}
function updateText(translations, language) {

    // 1. Translate normal text
    document.querySelectorAll("[data-i18n]").forEach(el => {

        const key = el.getAttribute("data-i18n");

        if (translations[key]) {
            el.textContent = translations[key];
        } else {
            console.warn("Missing translation:", key);
        }

    });

    // 2. Translate placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {

        const key = el.getAttribute("data-i18n-placeholder");

        if (translations[key]) {
            el.placeholder = translations[key];
        }

    });

    // 3. RTL / LTR support
    const isArabic = (language === "ar");

    document.documentElement.setAttribute(
        "dir",
        isArabic ? "rtl" : "ltr"
    );

    document.documentElement.lang = language;

    document.body.style.textAlign =
        isArabic ? "right" : "left";
}

// Set up language buttons and switcher
document.addEventListener("DOMContentLoaded", () => {
    // 1. Handle Button Clicks (English, Arabic)
    const langButtons = {
    "lang-en": "en",
    "lang-fr": "fr",
    "lang-ar": "ar"
};

    Object.entries(langButtons).forEach(([id, lang]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                loadLanguage(lang);
            });
        }
    });

    // 2. Handle Dropdown Switcher (if used)
    const switcher = document.getElementById("languageSwitcher");
    if (switcher) {
        switcher.value = currentLanguage;
        switcher.onchange = (e) => loadLanguage(e.target.value);
    }

    // 3. Initial Load on page open
    loadLanguage(currentLanguage);
});
// Get translated text from JavaScript
window.t = function (key) {

    return window.translations[key] || "";

};
