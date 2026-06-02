import { auth } from "./firebase-config.js";

import {
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";



window.checkUser = async function() {
    const email = document.getElementById('resetEmail').value.trim();

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    try {

        await sendPasswordResetEmail(auth, email);

        alert(
            localStorage.getItem("language") === "ar"
                ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني."
                : "Password reset email has been sent. Please check your inbox."
        );

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
}

