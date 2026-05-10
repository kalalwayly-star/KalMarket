import { auth } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

/* =========================
   REGISTER FUNCTION
========================= */
window.register = async function () {
    const email = document.getElementById("registerEmail")?.value.trim();
    const password = document.getElementById("registerPassword")?.value;
    const errorBox = document.getElementById("error-message");

    if (!errorBox) return;

    // Reset previous errors
    errorBox.innerText = "";

    // Validation
    if (!email || !password) {
        errorBox.style.color = "red";
        errorBox.innerText = "Please fill all fields.";
        return;
    }

    if (password.length < 6) {
        errorBox.style.color = "red";
        errorBox.innerText = "Password must be at least 6 characters.";
        return;
    }
const termsAccepted = document.getElementById("termsAgreement");

if (!termsAccepted.checked) {
    alert(translations[currentLanguage]?.must_accept_terms || "You must agree to the Terms of Use and Privacy Policy before registering.");
    return;
}
    
    try {
        // Create Firebase account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Optional display name
        await updateProfile(user, {
            displayName: email.split("@")[0]
        });

        errorBox.style.color = "green";
        errorBox.innerText = "Account created successfully! Redirecting...";

        console.log("Registered user:", user.email);

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch (error) {
        console.error("Registration error:", error);

        errorBox.style.color = "red";

        switch (error.code) {
            case "auth/email-already-in-use":
                errorBox.innerText = "This email is already registered.";
                break;

            case "auth/invalid-email":
                errorBox.innerText = "Invalid email format.";
                break;

            case "auth/weak-password":
                errorBox.innerText = "Password is too weak.";
                break;

            default:
                errorBox.innerText = error.message;
        }
    }
};

/* =========================
   PASSWORD TOGGLE
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggleRegPassword");
    const passInput = document.getElementById("registerPassword");

    if (toggleBtn && passInput) {
        toggleBtn.addEventListener("click", () => {
            const isHidden = passInput.type === "password";
            passInput.type = isHidden ? "text" : "password";

            toggleBtn.classList.toggle("fa-eye-slash");
        });
    }
});
