import { storage, auth, db } from "./firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import {
    ref,
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
            const storageRef = ref(storage, `ads/${Date.now()}_${compressedFile.name}`);
            const snapshot = await uploadBytes(storageRef, compressedFile);
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

/* ========================================================
   COMPLETED AND CORRECTED SAVE AD FUNCTION
======================================================== */
async function saveNewAd(event) {
    event.preventDefault();
    const user = auth.currentUser;

    if (!user) {
        alert("Login required");
        return;
    }

    if (pendingUploads > 0) {
        alert("Please wait for photos to finish uploading...");
        return;
    }

    const btn = document.getElementById("postBtn");
    if (btn) {
        btn.disabled = true;
        btn.innerText = "Posting...";
    }

    // Fix: Convert object array to raw string URL array
    const finalImageUrls = uploadedImages.map(item => item.url);

    try {
        const adData = {
            title: document.getElementById("postTitle")?.value || "",
            price: document.getElementById("postPrice")?.value || "0",
            category: document.getElementById("postCategory")?.value || "",
            location: document.getElementById("postLocation")?.value || "Unknown",
            description: document.getElementById("postDescription")?.value || "",
            condition: document.getElementById("postCondition")?.value || "N/A",
            
            // Matches main.js and details.js variable expectations
            image: finalImageUrls, 
            
            userId: user.uid,
            userEmail: user.email,
            views: 0,
            createdAt: new Date().toISOString(),
            lat: window.currentAdLat || null,
            lng: window.currentAdLng || null
        };

        await addDoc(collection(db, "marketplace_ads"), adData);
        alert("Ad posted successfully!");
        window.location.href = "index.html";

    } catch (error) {
        console.error("Error creating listing:", error);
        alert("Failed to save ad: " + error.message);
        if (btn) {
            btn.disabled = false;
            btn.innerText = "Post Ad";
        }
    }
}

/* =========================
   INITIALIZATION
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const postForm = document.getElementById("postAdForm");
    if (postForm) {
        postForm.addEventListener("submit", saveNewAd);
    }
});

/* ========================================================
   PAYPAL INTEGRATION SECTION
======================================================== */
function initPayPal() {
    if (typeof paypal === "undefined") {
        console.warn("PayPal SDK script not found on this page.");
        return;
    }

    paypal.Buttons({
        createOrder: function(data, actions) {
            if (pendingUploads > 0) {
                alert("Please wait for photos to finish uploading before payment.");
                return false;
            }
            if (!auth.currentUser) {
                alert("Please login first.");
                return false;
            }

            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: "5.00" 
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                console.log("Transaction completed by " + details.payer.name.given_name);
                saveNewAd(); 
            });
        },
        onError: function(err) {
            console.error("PayPal Error:", err);
            alert("Payment process failed. Please try again.");
        }
    }).render("#paypal-button-container");
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const postForm = document.getElementById("postAdForm");
    if (postForm) {
        postForm.addEventListener("submit", saveNewAd);
    }
    initPayPal();
});
