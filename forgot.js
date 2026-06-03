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

       const message =
    localStorage.getItem("language") === "ar"
        ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. إذا لم تجده في البريد الوارد، يرجى التحقق من مجلد الرسائل غير المرغوب فيها (Spam)."
        : "A password reset email has been sent to your inbox. If you don't see it, please check your Spam/Junk folder.";

alert(message);

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
}

