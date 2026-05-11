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
async function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = e => {
            img.src = e.target.result;
        };

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            let width = img.width;
            let height = img.height;

            // Resize while keeping aspect ratio
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                blob => {
                    if (!blob) {
                        reject(new Error("Compression failed"));
                        return;
                    }

                    const compressedFile = new File(
                        [blob],
                        file.name,
                        {
                            type: "image/jpeg",
                            lastModified: Date.now()
                        }
                    );

                    resolve(compressedFile);
                },
                "image/jpeg",
                quality
            );
        };

        img.onerror = reject;
        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
}

  
/* =========================
   FIXED PHOTO UPLOAD HANDLER
========================= */
window.handlePhotoUpload = async function (event) {
    const files = Array.from(event.target.files || []);
    const preview = document.getElementById("galleryPreview");

    if (!preview || !files.length) return;

    for (let file of files) {
        const imageId = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

        // --- CREATE PREVIEW UI ---
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.display = "inline-block";
        wrapper.style.margin = "8px";

        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.style.width = "100px";
        img.style.height = "100px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "8px";
        img.style.border = "1px solid #ccc";
        img.style.opacity = "0.5"; // Dimmed while uploading

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.innerHTML = "✕";
        deleteBtn.style.position = "absolute";
        deleteBtn.style.top = "4px";
        deleteBtn.style.right = "4px";
        deleteBtn.style.background = "red";
        deleteBtn.style.color = "white";
        deleteBtn.style.borderRadius = "50%";
        deleteBtn.style.cursor = "pointer";

        deleteBtn.addEventListener("click", function (e) {
            e.preventDefault();
            wrapper.remove();
            uploadedImages = uploadedImages.filter(img => img.id !== imageId);
        });

        wrapper.appendChild(img);
        wrapper.appendChild(deleteBtn);
        preview.appendChild(wrapper);

        // --- START UPLOAD ---
        try {
            const compressedFile = await compressImage(file);
            // Fix: Date.now() must be capitalized
            const storageRef = ref(storage, `ads/${Date.now()}_${compressedFile.name}`);
            const snapshot = await uploadBytes(storageRef, compressedFile);
            const url = await getDownloadURL(snapshot.ref);

            // Add to your global array
            uploadedImages.push({ id: imageId, url: url });
            
            // Mark as finished visually
            img.style.opacity = "1"; 
            console.log("Image ready:", url);

        } catch (error) {
            console.error("Upload failed:", error);
            wrapper.remove();
            alert("Image failed: " + error.message);
        }
    }
    // Clear input so user can re-select same file if they want
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
        "Baby": "section-Baby",
        "Buy&Sale": "section-Buy&Sale"
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
    // Add this inside saveNewAd
    const photoInput = document.getElementById("photoInput");
    const pendingFiles = photoInput ? photoInput.files.length : 0;

    if (pendingFiles > 0 && uploadedImages.length < pendingFiles) {
        alert("Images are still uploading. Please wait a moment.");
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


navigator.geolocation.getCurrentPosition(
    (position) => {
        window.currentAdLat = position.coords.latitude;
        window.currentAdLng = position.coords.longitude;
    },
    (error) => {
        console.error("Location error:", error);
    }
);
    
   const newAd = {
    userId: user.uid,
    userEmail: user.email,
    category: document.getElementById("postCategory")?.value || "",
    title: title,
    price: document.getElementById("adPrice")?.value || "",
    location: document.getElementById("adLocation")?.value || "",
    description: document.getElementById("adDesc")?.value || "",
    condition: document.querySelector('input[name="condition"]:checked')?.value || "N/A",

    image: Array.isArray(uploadedImages) && uploadedImages.length > 0
        ? uploadedImages.map(img => img.url || img)
        : ["https://placeholder.com"],

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
  
