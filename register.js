import { auth } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

window.register = async function () {

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const errorBox = document.getElementById("error-message");

    if (!email || !password) {
        errorBox.innerText = "Please fill all fields";
        return;
    }

    if (password.length < 6) {
        errorBox.innerText = "Password must be at least 6 characters";
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;

        // optional profile update
        await updateProfile(user, {
            displayName: email.split("@")[0]
        });

        errorBox.style.color = "green";
        errorBox.innerText = "Account created successfully! Redirecting...";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch (error) {
        console.error(error);

        errorBox.style.color = "red";
        errorBox.innerText = error.message;
    }
};

/* =========================
   PASSWORD TOGGLE FIX
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
