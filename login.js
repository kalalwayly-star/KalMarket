import { auth } from "./firebase-config.js";
import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

/* =========================
   LOGIN FUNCTION
========================= */
window.login = async function () {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const errorBox = document.getElementById("error-message");

    // Basic validation
    if (!email || !password) {
        errorBox.style.color = "red";
        errorBox.innerText = "Please enter email and password";
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;

        errorBox.style.color = "green";
        errorBox.innerText = "Login successful... redirecting";

        console.log("Logged in:", user.email);

        // redirect to homepage
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (error) {
        console.error(error);

        errorBox.style.color = "red";

        // Friendly error messages
        switch (error.code) {
            case "auth/user-not-found":
                errorBox.innerText = "No account found with this email";
                break;

            case "auth/wrong-password":
                errorBox.innerText = "Incorrect password";
                break;

            case "auth/invalid-email":
                errorBox.innerText = "Invalid email format";
                break;

            default:
                errorBox.innerText = error.message;
        }
    }
};

/* =========================
   PASSWORD TOGGLE FIX
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
