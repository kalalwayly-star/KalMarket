import { storage, auth, db } from "./firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js";

let uploadedImages = [];
let pendingUploads = 0;

navigator.geolocation.getCurrentPosition(
    (position) => {
        window.currentAdLat = position.coords.latitude;
        window.currentAdLng = position.coords.longitude;
    },
    (error) => {
        console.error("Location error:", error);
    }
);
   // NEW: country detection (add BELOW it)
async function getUserCountry() {
    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        return data.country_name;
    } catch (e) {
return "United States";    }
}

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
        pendingUploads++;
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
const fileRef = storageRef(storage, `ads/${Date.now()}_${compressedFile.name}`);          
const snapshot = await uploadBytes(fileRef, compressedFile);      
            const url = await getDownloadURL(snapshot.ref);

            // Add to your global array
uploadedImages.push({
    id: imageId,
    url: url
});

pendingUploads--;            
            // Mark as finished visually
            img.style.opacity = "1"; 
            console.log("Image ready:", url);

        } catch (error) {
            console.error("Upload failed:", error);
            wrapper.remove();
            alert("Image failed: " + error.message);
            pendingUploads--;
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
        "Buy & Sale": "section-Buy & Sale"
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

const conditionBox = document.getElementById("conditionFields");
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
   if (pendingUploads > 0) {
    alert("Please wait for photos to finish uploading...");
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
const currency = document.getElementById("currency")?.value || "USD";
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
    views: 0,
    status: "active",
    location: document.getElementById("adLocation")?.value || "",  
    price: document.getElementById("adPrice")?.value || "",
    currency: currency,
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
    document.addEventListener("DOMContentLoaded", async () => {

    const country = await getUserCountry();
    const currencySelect = document.getElementById("currency");

    const countryCurrencyMap = {
        // North America
        "United States": { code: "USD" },
        "Canada": { code: "CAD" },
        "Mexico": { code: "MXN" },

        // Europe
        "United Kingdom": { code: "GBP" },
        "Germany": { code: "EUR" },
        "France": { code: "EUR" },
        "Italy": { code: "EUR" },
        "Spain": { code: "EUR" },
        "Netherlands": { code: "EUR" },
        "Belgium": { code: "EUR" },
        "Switzerland": { code: "CHF" },
        "Sweden": { code: "SEK" },
        "Norway": { code: "NOK" },
        "Denmark": { code: "DKK" },
        "Poland": { code: "PLN" },

        // Middle East
        "Saudi Arabia": { code: "SAR" },
        "United Arab Emirates": { code: "AED" },
        "Qatar": { code: "QAR" },
        "Kuwait": { code: "KWD" },
        "Bahrain": { code: "BHD" },
        "Oman": { code: "OMR" },
        "Iraq": { code: "IQD" },
        "Jordan": { code: "JOD" },
        "Lebanon": { code: "LBP" },
        "Egypt": { code: "EGP" },
        "Morocco": { code: "MAD" },
        "Tunisia": { code: "TND" },
        "Algeria": { code: "DZD" },

        // Asia
        "India": { code: "INR" },
        "Pakistan": { code: "PKR" },
        "Bangladesh": { code: "BDT" },
        "Sri Lanka": { code: "LKR" },
        "China": { code: "CNY" },
        "Japan": { code: "JPY" },
        "South Korea": { code: "KRW" },
        "Philippines": { code: "PHP" },
        "Indonesia": { code: "IDR" },
        "Malaysia": { code: "MYR" },
        "Singapore": { code: "SGD" },
        "Thailand": { code: "THB" },
        "Vietnam": { code: "VND" },

        // Africa
        "Nigeria": { code: "NGN" },
        "Ghana": { code: "GHS" },
        "Kenya": { code: "KES" },
        "South Africa": { code: "ZAR" },
        "Ethiopia": { code: "ETB" },
        "Tanzania": { code: "TZS" },

        // South America
        "Brazil": { code: "BRL" },
        "Argentina": { code: "ARS" },
        "Chile": { code: "CLP" },
        "Colombia": { code: "COP" },
        "Peru": { code: "PEN" },

        // Oceania
        "Australia": { code: "AUD" },
        "New Zealand": { code: "NZD" }
    };

   if (currencySelect && country && countryCurrencyMap[country]) {
    const currencyCode = countryCurrencyMap[country].code;

    // Check if option exists
    let optionExists = Array.from(currencySelect.options).some(
        option => option.value === currencyCode
    );

    // If missing, create it
    if (!optionExists) {
        const newOption = document.createElement("option");
        newOption.value = currencyCode;
        newOption.textContent = currencyCode;
        currencySelect.appendChild(newOption);
    }

    currencySelect.value = currencyCode;

    console.log("Auto currency set:", currencyCode);
}

});
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
  
