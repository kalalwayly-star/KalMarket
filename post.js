import { storage, auth, db } from "./firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js";

let uploadedImages = [];

/* =========================
   AUTH STATE
========================= */
onAuthStateChanged(auth, (user) => {
    const loginLink = document.getElementById("loginLink");
    const logoutBtn = document.getElementById("logoutBtn");
    const emailSpan = document.getElementById("emailSpan");

    if (user) {
        loginLink && (loginLink.style.display = "none");
        logoutBtn && (logoutBtn.style.display = "inline-block");
        emailSpan && (emailSpan.innerText = user.email);
    } else {
        loginLink && (loginLink.style.display = "inline-block");
        logoutBtn && (logoutBtn.style.display = "none");
        emailSpan && (emailSpan.innerText = "");
    }
});

/* =========================
   IMAGE UPLOAD (FIREBASE STORAGE)
========================= */
window.handlePhotoUpload = async function (event) {
    const files = Array.from(event.target.files || []);
    const preview = document.getElementById("galleryPreview");

    if (!preview || !files.length) return;

    for (let file of files) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.style.width = "100px";
        img.style.height = "100px";
        img.style.objectFit = "cover";
        preview.appendChild(img);

        try {
            const storageRef = ref(storage, `ads/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            uploadedImages.push(url);
        } catch (err) {
            console.error(err);
            alert("Image upload failed");
        }
    }

    event.target.value = "";
};

/* =========================
   CATEGORY HANDLER
========================= */
window.handleCategoryChange = function () {
    const select = document.getElementById("postCategory");
    if (!select) return;

    const value = select.value;

    document.querySelectorAll(".category-details").forEach(el => {
        el.style.display = "none";
    });

    const map = {
        "Cars & Trucks": "section-Cars",
        "Real Estate": "section-RealEstate",
        "Electronics": "section-Electronics",
        "Furniture": "section-Furniture"
    };

    const section = document.getElementById(map[value]);
    if (section) section.style.display = "block";

    const conditionBox = document.getElementById("globalCondition");
    const hideFor = ["Jobs", "Real Estate", "Services", "Pets"];

    if (conditionBox) {
        conditionBox.style.display = hideFor.includes(value) ? "none" : "block";
    }
};

/* =========================
   SAVE AD ENTRY POINT
========================= */
function saveNewAd(event) {
    event.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert("Login required");
        return;
    }

    const btn = document.getElementById("postBtn");
    if (btn) {
        btn.disabled = true;
        btn.innerText = "Posting...";
    }

    finalizeAd();
}

/* =========================
   FINALIZE & FIRESTORE SAVE
========================= */
function finalizeAd() {
    const user = auth.currentUser;
    if (!user) return;

    const title = document.getElementById("adTitle")?.value.trim();
    if (!title) {
        alert("Title is required");
        return;
    }

    const newAd = {
        userId: user.uid,
        userEmail: user.email,
        category: document.getElementById("postCategory")?.value || "",
        title,
        price: document.getElementById("adPrice")?.value || "",
        location: document.getElementById("adLocation")?.value || "",
        description: document.getElementById("adDesc")?.value || "",
        condition: document.querySelector('input[name="condition"]:checked')?.value || "N/A",
        image: uploadedImages.length ? uploadedImages : ["https://via.placeholder.com/300"],
        date: new Date().toLocaleDateString(),
        lat: window.currentAdLat || null,
        lng: window.currentAdLng || null
    };

    const refDB = collection(db, "marketplace_ads");

    addDoc(refDB, newAd)
        .then(() => {
            alert("Ad posted successfully!");

            const btn = document.getElementById("postBtn");
            if (btn) {
                btn.disabled = false;
                btn.innerText = "Post Ad";
            }

            window.location.href = "index.html";
        })
        .catch(err => {
            console.error(err);

            const btn = document.getElementById("postBtn");
            if (btn) {
                btn.disabled = false;
                btn.innerText = "Post Ad";
            }

            alert(err.message);
        });
}

/* =========================
   INIT EVENTS
========================= */
document.addEventListener("DOMContentLoaded", () => {
    handleCategoryChange();

    document.getElementById("postCategory")
        ?.addEventListener("change", handleCategoryChange);

    document.getElementById("photoInput")
        ?.addEventListener("change", handlePhotoUpload);

    document.getElementById("postForm")
        ?.addEventListener("submit", saveNewAd);
});

// =========================
// PAYPAL PAYMENT (SAFE)
// =========================
function initPayPal() {
    const container = document.getElementById("paypal-button-container");
    if (!container || typeof paypal === "undefined") return;

    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: "5.00" // change price if needed
                    }
                }]
            });
        },

        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                alert("Payment completed by " + details.payer.name.given_name);

                // OPTIONAL: mark ad as paid
                window.isPaid = true;
            });
        },

        onError: function (err) {
            console.error("PayPal error:", err);
            alert("Payment failed. Try again.");
        }

    }).render("#paypal-button-container");
}

// run after page loads
document.addEventListener("DOMContentLoaded", initPayPal);
