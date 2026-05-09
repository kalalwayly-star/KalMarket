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
        if (loginLink) loginLink.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
        if (emailSpan) emailSpan.innerText = user.email;
    } else {
        if (loginLink) loginLink.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
        if (emailSpan) emailSpan.innerText = "";
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
        // LOCAL PREVIEW ONLY
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.style.width = "100px";
        img.style.height = "100px";
        img.style.objectFit = "cover";
        preview.appendChild(img);

        try {
            // UPLOAD TO FIREBASE STORAGE
            const storageRef = ref(storage, `ads/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);

            // GET PERMANENT DOWNLOAD URL
            const url = await getDownloadURL(snapshot.ref);

            // SAVE PERMANENT URL
            uploadedImages.push(url);

        } catch (err) {
            console.error("Image upload error:", err);
            alert("Image upload failed");
        }
    }

    // RESET INPUT
    event.target.value = "";
};

/* =========================
   CATEGORY HANDLER
========================= */
window.handleCategoryChange = function () {
    const categorySelect = document.getElementById("postCategory");
    if (!categorySelect) return;

    const selectedValue = categorySelect.value.trim();

    document.querySelectorAll(".category-details").forEach(section => {
        section.style.display = "none";
    });

    const commonFields = document.getElementById("commonFields");
    if (commonFields) commonFields.style.display = "block";

    const categoryMap = {
        "Real Estate": "section-RealEstate",
        "Cars & Trucks": "section-Cars",
        "Electronics": "section-Electronics",
        "Auto Accessories": "section-Auto Accessories",
        "Furniture": "section-Furniture",
        "Jobs": "section-Jobs",
        "Fashion": "section-Fashion",
        "Pets": "section-Pets",
        "Sports": "section-Sports",
        "Books": "section-Books",
        "Appliances": "section-Appliances",
        "Toys": "section-Toys",
        "Services": "section-Services",
        "Garden": "section-Garden",
        "Health": "section-Health",
        "Baby": "section-Baby"
    };

    const targetSectionId = categoryMap[selectedValue];

    if (targetSectionId) {
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.style.display = "block";
        } else {
            console.warn("Missing section:", targetSectionId);
        }
    }

    const conditionBox = document.getElementById("globalCondition");
    const hideConditionFor = ["Pets", "Jobs", "Real Estate", "Services"];

    if (conditionBox) {
        conditionBox.style.display = hideConditionFor.includes(selectedValue)
            ? "none"
            : "block";
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

        const btn = document.getElementById("postBtn");
        if (btn) {
            btn.disabled = false;
            btn.innerText = "Post Ad";
        }

        return;
    }

    const newAd = {
        userId: user.uid,
        userEmail: user.email,
        category: document.getElementById("postCategory")?.value || "",
        title: title,
        price: document.getElementById("adPrice")?.value || "",
        location: document.getElementById("adLocation")?.value || "",
        description: document.getElementById("adDesc")?.value || "",
        condition: document.querySelector('input[name="condition"]:checked')?.value || "N/A",

        // IMPORTANT FIX:
        image: uploadedImages.length > 0
            ? uploadedImages
            : ["https://dummyimage.com/300x200/cccccc/000000&text=No+Image"],

        date: new Date().toLocaleDateString(),
        lat: window.currentAdLat || null,
        lng: window.currentAdLng || null,

        featured: localStorage.getItem("featuredAdPaid") === "true",
        featuredDays: parseInt(localStorage.getItem("featuredDays")) || 0
    };

    addDoc(collection(db, "marketplace_ads"), newAd)
        .then(() => {
            alert("Ad posted successfully!");

            // RESET
            uploadedImages = [];
            localStorage.removeItem("featuredAdPaid");
            localStorage.removeItem("featuredDays");

            window.location.href = "index.html";
        })
        .catch((err) => {
            console.error("Firestore save error:", err);

            const btn = document.getElementById("postBtn");
            if (btn) {
                btn.disabled = false;
                btn.innerText = "Post Ad";
            }

            alert(err.message);
        });
}

/* =========================
   PAGE INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("postCategory")
        ?.addEventListener("change", handleCategoryChange);

    handleCategoryChange();

    document.getElementById("photoInput")
        ?.addEventListener("change", handlePhotoUpload);

    document.getElementById("postForm")
        ?.addEventListener("submit", saveNewAd);

    const featureOptions = document.querySelectorAll('input[name="feature_selection"]');
    const paypalContainer = document.getElementById("paypal-button-container");

    featureOptions.forEach(option => {
        option.addEventListener("change", () => {

            if (!paypalContainer) return;

            if (option.value === "5days") {
                paypalContainer.style.display = "block";
                initPayPal("4.99", 5);

            } else if (option.value === "10days") {
                paypalContainer.style.display = "block";
                initPayPal("8.99", 10);

            } else {
                paypalContainer.style.display = "none";
                paypalContainer.innerHTML = "";

                localStorage.removeItem("featuredAdPaid");
                localStorage.removeItem("featuredDays");
            }
        });
    });

});

/* =========================
   PAYPAL INIT
========================= */
function initPayPal(price, days) {
    const paypalContainer = document.getElementById("paypal-button-container");

    if (!paypalContainer) return;

    paypalContainer.innerHTML = "";

    if (typeof paypal === "undefined") {
        console.error("PayPal SDK not loaded");
        return;
    }

    paypal.Buttons({

        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: price
                    }
                }]
            });
        },

        onApprove: function (data, actions) {
            return actions.order.capture().then(function () {

                alert(`Payment successful! Your ad is featured for ${days} days.`);

                localStorage.setItem("featuredAdPaid", "true");
                localStorage.setItem("featuredDays", days);
            });
        },

        onError: function (err) {
            console.error("PayPal Error:", err);
            alert("Payment failed.");
        }

    }).render("#paypal-button-container");
}
  
