// admin.js
// ===============================
// FIREBASE IMPORTS
// ===============================
import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";


// ===============================
// ADMIN CONFIG
// ===============================
const ADMIN_EMAIL = "youradmin@email.com"; // CHANGE THIS
const ADMIN_PASSWORD = "Kaledadmin1970!";


// ===============================
// ADMIN ACCESS CHECK
// ===============================
window.addEventListener("DOMContentLoaded", () => {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {
            alert("Please login first.");
            window.location.href = "login.html";
            return;
        }

        // Email check
        if (user.email !== ADMIN_EMAIL) {
            alert("Access denied.");
            window.location.href = "index.html";
            return;
        }

        // Optional password gate
        const pass = prompt("Enter Admin Password:");

        if (pass !== ADMIN_PASSWORD) {
            alert("Incorrect admin password.");
            window.location.href = "index.html";
            return;
        }

        // Load admin dashboard
        loadAllAds();
        loadReports();
    });

});


// ===============================
// LOAD ALL ADS
// ===============================
async function loadAllAds() {

    const container = document.getElementById("moderationList");
    if (!container) return;

    try {
        const snapshot = await getDocs(collection(db, "marketplace_ads"));

        if (snapshot.empty) {
            container.innerHTML = "<p>No ads found.</p>";
            return;
        }

        let adsHTML = "";

        snapshot.forEach(docSnap => {

            const ad = docSnap.data();
            const adId = docSnap.id;

            const image = Array.isArray(ad.image)
                ? ad.image[0]
                : (ad.image || "https://via.placeholder.com/300");

            adsHTML += `
                <div class="report-card">

                    <img src="${image}" 
                         style="width:100%; max-height:200px; object-fit:cover; border-radius:8px;">

                    <h3>${ad.title || "Untitled"}</h3>

                    <p><strong>Category:</strong> ${ad.category || "N/A"}</p>
                    <p><strong>Price:</strong> $${ad.price || "0"}</p>
                    <p><strong>Location:</strong> ${ad.location || "Unknown"}</p>
                    <p><strong>Seller:</strong> ${ad.userEmail || "Unknown"}</p>
                    <p><strong>Date:</strong> ${ad.date || ""}</p>

                    <button onclick="window.deleteMarketplaceAd('${adId}')">
                        ❌ Delete
                    </button>

                </div>
            `;
        });

        container.innerHTML = adsHTML;

    } catch (error) {
        console.error("Error loading ads:", error);
        container.innerHTML = "<p>Error loading ads.</p>";
    }
}


// ===============================
// DELETE AD
// ===============================
window.deleteMarketplaceAd = async function (adId) {

    if (!confirm("Delete this ad permanently?")) return;

    try {
        await deleteDoc(doc(db, "marketplace_ads", adId));

        alert("Ad deleted successfully.");

        loadAllAds();

    } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete ad.");
    }
};


// ===============================
// LOAD USER REPORTS
// ===============================
async function loadReports() {

    const reportList = document.getElementById("reportList");
    if (!reportList) return;

    try {
        const snapshot = await getDocs(collection(db, "flagged_ads"));

        if (snapshot.empty) {
            reportList.innerHTML = "<p>No flagged ads.</p>";
            return;
        }

        let reportsHTML = "";

        snapshot.forEach(docSnap => {

            const report = docSnap.data();
            const reportId = docSnap.id;

            reportsHTML += `
                <div class="report-card">

                    <strong>Ad ID:</strong> ${report.adId || "N/A"} <br>
                    <strong>Reason:</strong> ${report.reason || "No reason"} <br>
                    <small>${report.timestamp
                        ? new Date(report.timestamp).toLocaleString()
                        : ""}</small><br><br>

                    <button onclick="window.removeReport('${reportId}')">
                        Remove Report
                    </button>

                </div>
            `;
        });

        reportList.innerHTML = reportsHTML;

    } catch (error) {
        console.error("Error loading reports:", error);
        reportList.innerHTML = "<p>Error loading reports.</p>";
    }
}


// ===============================
// REMOVE REPORT
// ===============================
window.removeReport = async function (reportId) {

    if (!confirm("Remove this report?")) return;

    try {
        await deleteDoc(doc(db, "flagged_ads", reportId));

        alert("Report removed.");

        loadReports();

    } catch (error) {
        console.error("Failed to remove report:", error);
    }
};


// ===============================
// LOGOUT ADMIN
// ===============================
window.adminLogout = async function () {

    try {
        await signOut(auth);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Logout failed:", error);
    }
};
   

   
