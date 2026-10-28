import { auth, db, storage } from "./firebase-config.js";
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    deleteDoc,
    doc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js";
const symbolMap = {
    USD: "$",
    CAD: "$",
    AUD: "$",
    EUR: "€",
    GBP: "£",
    SAR: "﷼",
    AED: "د.إ",
    IQD: "ع.د",
    JOD: "د.أ",
    EGP: "ج.م",
    INR: "₹",
    PKR: "₨",
    CNY: "¥",
    JPY: "¥",
    KRW: "₩",
    CHF: "CHF",
    NOK: "kr",
    SEK: "kr",
    DKK: "kr",
    ZAR: "R",
    NGN: "₦",
    BRL: "R$",
    MXN: "$"
};

const container = document.getElementById("myAdsContainer");

if (!container) {
    console.error("myAdsContainer not found.");
}

// Wait for login state
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        alert("Please log in first.");
        window.location.href = "login.html";
        return;
    }

    loadUserAds(user.uid);
});

// Load only logged-in user's ads
async function loadUserAds(userId) {
    try {
        const adsQuery = query(
            collection(db, "marketplace_ads"),
            where("userId", "==", userId)
        );

        const snapshot = await getDocs(adsQuery);

        if (snapshot.empty) {
            container.innerHTML = `<p style="text-align:center;">You have no active ads.</p>`;
            return;
        }

        let html = "";

        snapshot.forEach((docSnap) => {
            const ad = docSnap.data();
            const adId = docSnap.id;

            const image = (
    Array.isArray(ad.image) ? ad.image : [ad.image]
).find(url =>
    typeof url === "string" &&
    url.startsWith("https://firebasestorage.googleapis.com/")
) || "https://via.placeholder.com/300";
            html += `
<div class="card" data-status="${ad.status || 'active'}">                 
<img src="${image}" alt="${ad.title}" class="ad-image">

                    <div class="card-content">
                        <h3>${ad.title}</h3>
                        <p>📍 ${ad.location || "No location"}</p>
                        <p><b>${symbolMap[ad.currency] || ad.currency || "$"} ${ad.price}</b></p>
                        <p><strong>Condition:</strong> ${ad.condition || "N/A"}</p>
                        <p>👁️ ${ad.views || 0} views</p>

                        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
<button onclick="editMyAd('${adId}')"
    style="background:#1769aa;color:white;"
    type="button">
    Edit Ad
</button>
    <button onclick="markAsSold('${adId}')"
        style="background:orange;"
        data-i18n="sold_btn">
        Sold
    </button>

    <button onclick="markAsActive('${adId}')"
        style="background:green;"
        data-i18n="active_btn">
        Active
    </button>
     <button onclick="markAsPending('${adId}')"
        style="background:#ffc107;"
        data-i18n="pending_btn">
        Pending
    </button>

    <button onclick="deleteMyAd('${adId}')"
        data-i18n="delete_btn">
        Delete
    </button>

</div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // FILTER BUTTONS
const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".card");

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        // Active button style
        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const filter = button.dataset.filter;

        cards.forEach((card) => {

            const status = card.dataset.status;

            if (filter === "all" || status === filter) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

});

    } catch (error) {
        console.error("Error loading ads:", error);
        container.innerHTML = `<p style="color:red;">Failed to load ads.</p>`;
    }
}

// Delete ad
window.deleteMyAd = async function(adId) {
    if (!confirm("Are you sure you want to delete this ad?")) return;

    try {
        await deleteDoc(doc(db, "marketplace_ads", adId));
        alert("Ad deleted successfully!");
        location.reload();
    } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete ad.");
    }
};
// MARK AS SOLD
window.markAsSold = async function(adId) {

    try {

        await updateDoc(doc(db, "marketplace_ads", adId), {
            status: "sold"
        });

        alert("Ad marked as sold!");
        location.reload();

    } catch (error) {

        console.error(error);
        alert("Failed to update ad.");
    }
};


// MARK AS ACTIVE
window.markAsActive = async function(adId) {

    try {

        await updateDoc(doc(db, "marketplace_ads", adId), {
            status: "active"
        });

        alert("Ad marked as active!");
        location.reload();

    } catch (error) {

        console.error(error);
        alert("Failed to update ad.");
    }
};
// MARK AS PENDING
window.markAsPending = async function(adId) {

    try {

        await updateDoc(doc(db, "marketplace_ads", adId), {
            status: "pending"
        });

        alert("Ad marked as pending!");
        location.reload();

    } catch (error) {

        console.error(error);
        alert("Failed to update ad.");

    }

};

/* =========================
   EDIT MY AD
========================= */

window.editMyAd = async function(adId) {
    try {
const adRef = doc(db, "marketplace_ads", adId);
        

        const adSnap = await getDoc(adRef);

        if (!adSnap.exists()) {
            alert("This ad could not be found.");
            return;
        }

        const ad = adSnap.data();

        if (ad.userId !== auth.currentUser?.uid) {
            alert("You can only edit your own ads.");
            return;
        }

        const currentImages = (Array.isArray(ad.image)
    ? ad.image
    : (ad.image ? [ad.image] : [])
).filter(url =>
    typeof url === "string" &&
    url.startsWith("https://firebasestorage.googleapis.com/")
);

        const form = document.createElement("div");
        form.style.cssText = `
            position:fixed;
            inset:0;
            z-index:99999;
            background:rgba(0,0,0,0.65);
            display:flex;
            align-items:center;
            justify-content:center;
            padding:15px;
            overflow:auto;
        `;

        form.innerHTML = `
            <div style="
                background:white;
                color:#222;
                padding:22px;
                border-radius:12px;
                width:100%;
                max-width:600px;
                max-height:90vh;
                overflow:auto;
            ">
                <h2>Edit Your Ad</h2>

                <label>Title</label>
                <input id="editAdTitle" type="text"
                    maxlength="150"
                    style="width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;">

                <label>Category</label>
                <input id="editAdCategory" type="text"
                    style="width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;">

                <label>Location</label>
                <input id="editAdLocation" type="text"
                    style="width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;">

                <label>Price</label>
                <input id="editAdPrice" type="number" min="0" step="any"
                    style="width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;">

                <label>Currency</label>
                <input id="editAdCurrency" type="text" maxlength="5"
                    style="width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;">

                <label>Description</label>
                <textarea id="editAdDescription" rows="5"
                    style="width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;"></textarea>

                    <label>Existing photos</label>
                <div id="editAdExistingPhotos"
                    style="display:flex;gap:12px;flex-wrap:wrap;margin:10px 0 18px;">
                </div>


                <label>Add more photos</label>
                <input id="editAdPhotos" type="file" accept="image/*" multiple
                    style="display:block;margin:10px 0;">

                <p id="editAdPhotoStatus"></p>

                <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px;">
                    <button type="button" id="saveEditedAd"
                        style="background:#167a35;color:white;padding:10px 16px;border:0;border-radius:6px;">
                        Save Changes
                    </button>

                    <button type="button" id="cancelEditedAd"
                        style="background:#666;color:white;padding:10px 16px;border:0;border-radius:6px;">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(form);

        form.querySelector("#editAdTitle").value = ad.title || "";
        form.querySelector("#editAdCategory").value = ad.category || "";
        form.querySelector("#editAdLocation").value = ad.location || "";
        form.querySelector("#editAdPrice").value = ad.price ?? "";
        form.querySelector("#editAdCurrency").value = ad.currency || "CAD";
        form.querySelector("#editAdDescription").value = ad.description || "";

        form.querySelector("#cancelEditedAd").onclick = () => form.remove();

        form.querySelector("#saveEditedAd").onclick = async () => {
            const saveButton = form.querySelector("#saveEditedAd");
            const title = form.querySelector("#editAdTitle").value.trim();
            const category = form.querySelector("#editAdCategory").value.trim();
            const adLocation = form.querySelector("#editAdLocation").value.trim();
            const priceText = form.querySelector("#editAdPrice").value;
            const currency = form.querySelector("#editAdCurrency").value.trim().toUpperCase();
            const description = form.querySelector("#editAdDescription").value.trim();
            const photoInput = form.querySelector("#editAdPhotos");
            const status = form.querySelector("#editAdPhotoStatus");

            if (!title) {
                alert("Please enter an ad title.");
                return;
            }

            if (priceText === "" || !Number.isFinite(Number(priceText)) || Number(priceText) < 0) {
                alert("Please enter a valid price.");
                return;
            }

            if (!currency) {
                alert("Please enter a currency.");
                return;
            }

            if (photoInput.files.length + currentImages.length > 10) {
                alert("An ad can have a maximum of 10 photos.");
                return;
            }

            saveButton.disabled = true;
            saveButton.textContent = "Saving...";
            status.textContent = "Saving your changes...";

            try {
                const finalImages = [...currentImages];

                for (const file of Array.from(photoInput.files)) {
                    if (!file.type.startsWith("image/")) {
                        throw new Error("Please select image files only.");
                    }

                    const compressedFile = await compressImage(file);
                    const fileRef = storageRef(
                        storage,
                        `ads/${Date.now()}_${Math.random().toString(36).slice(2)}_${compressedFile.name}`
                    );

                    const snapshot = await uploadBytes(fileRef, compressedFile);
                    const url = await getDownloadURL(snapshot.ref);
                    finalImages.push(url);
                }

                await updateDoc(adRef, {
                    title,
                    category: category || "Uncategorized",
                    location: adLocation,
                    price: Number(priceText),
                    currency,
                    description,
                    image: [...new Set(finalImages)],
                    updatedAt: serverTimestamp()
                });

                alert("Your ad has been updated successfully.");
                form.remove();
                locationReloadSafely();
            } catch (error) {
                console.error("Failed to edit ad:", error);
                alert("Could not save your changes: " + error.message);
                saveButton.disabled = false;
                saveButton.textContent = "Save Changes";
                status.textContent = "";
            }
        };
    } catch (error) {
        console.error("Could not open edit form:", error);
        alert("Could not open the edit form. Please try again.");
    }
};

function locationReloadSafely() {
    window.location.reload();
}

/* Compress photos before uploading them */
async function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject(new Error("Could not process this photo."));
                return;
            }

            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error("Photo compression failed."));
                        return;
                    }

                    resolve(new File(
                        [blob],
                        file.name.replace(/\.[^.]+$/, "") + ".jpg",
                        {
                            type: "image/jpeg",
                            lastModified: Date.now()
                        }
                    ));
                },
                "image/jpeg",
                quality
            );
        };

        img.onerror = () => reject(new Error("Could not read this photo."));
        reader.onerror = () => reject(new Error("Could not open this photo."));

        reader.readAsDataURL(file);
    });
}




