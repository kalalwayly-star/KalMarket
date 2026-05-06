import { auth } from "./firebase-config.js";
import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

/* =========================
   LOGIN FUNCTION
========================= */
window.login = async function () {
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;
    const errorBox = document.getElementById("error-message");

    if (!errorBox) return;

    // Reset previous message
    errorBox.innerText = "";

    // Basic validation
    if (!email || !password) {
        errorBox.style.color = "red";
        errorBox.innerText = "Please enter email and password.";
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        errorBox.style.color = "green";
        errorBox.innerText = "Login successful... Redirecting.";

        console.log("Logged in:", user.email);

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (error) {
        console.error("Login error:", error);

        errorBox.style.color = "red";

        switch (error.code) {
            case "auth/user-not-found":
                errorBox.innerText = "No account found with this email.";
                break;

            case "auth/wrong-password":
                errorBox.innerText = "Incorrect password.";
                break;

            case "auth/invalid-email":
                errorBox.innerText = "Invalid email format.";
                break;

            case "auth/too-many-requests":
                errorBox.innerText = "Too many failed attempts. Try again later.";
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
    const toggleBtn = document.getElementById("toggleLoginPassword");
    const passwordField = document.getElementById("loginPassword");

    if (toggleBtn && passwordField) {
        toggleBtn.addEventListener("click", () => {
            const isHidden = passwordField.type === "password";
            passwordField.type = isHidden ? "text" : "password";

            toggleBtn.classList.toggle("fa-eye-slash");
        });
    }
});
