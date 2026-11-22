// admin.js
import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";


// =====================================
// ADMIN CONFIGURATION
// =====================================

// Your Firebase administrator UID
const ADMIN_UID = "k6GcZWBpwbZIuQBsWD1Bonyv2Ec2";


// =====================================
// AUTHENTICATION AND ADMIN ACCESS
// =====================================

window.addEventListener("DOMContentLoaded", () => {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {
            alert("Please log in first.");
            window.location.href = "login.html";
            return;
        }

        if (user.uid !== ADMIN_UID) {
            alert("Access denied. Administrator only.");
            await signOut(auth);
            window.location.href = "index.html";
            return;
        }

        // Authorized administrator
        loadVisitorStats();
        loadAllAds();
        loadReports();

    });

});


// =====================================
// HELPER: CREATE SAFE HTML TEXT
// =====================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


// =====================================
// MONTH KEY - WINNIPEG TIME
// =====================================

function getMonthKey(date = new Date()) {

    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Winnipeg",
        year: "numeric",
        month: "2-digit"
    }).formatToParts(date);

    const year = parts.find(part => part.type === "year").value;
    const month = parts.find(part => part.type === "month").value;

    return `${year}-${month}`;
}


function getPreviousMonthKey(currentKey) {

    const [year, month] = currentKey.split("-").map(Number);

    const previousDate = new Date(Date.UTC(year, month - 2, 1));

    return [
        previousDate.getUTCFullYear(),
        String(previousDate.getUTCMonth() + 1).padStart(2, "0")
    ].join("-");
}


function formatMonth(monthKey) {

    const date = new Date(`${monthKey}-01T12:00:00`);

    return date.toLocaleDateString("en-CA", {
        month: "long",
        year: "numeric",
        timeZone: "UTC"
    });
}


// =====================================
// LOAD MONTHLY VISITOR STATISTICS
// =====================================

async function loadVisitorStats() {

    const currentElement =
        document.getElementById("visitorCurrentMonth");

    const previousElement =
        document.getElementById("visitorPreviousMonth");

    const currentLabel =
        document.getElementById("visitorMonthLabel");

    const previousLabel =
        document.getElementById("visitorPreviousLabel");

    const historyElement =
        document.getElementById("visitorHistory");

    const statusElement =
        document.getElementById("visitorStatsStatus");

    if (!currentElement || !historyElement) return;

    try {

        const snapshot = await getDocs(collection(db, "site_stats"));

        const monthlyRecords = [];

        snapshot.forEach(documentSnapshot => {

            const documentId = documentSnapshot.id;

            if (!documentId.startsWith("monthly_")) return;

            const monthKey = documentId.substring(8);

            const data = documentSnapshot.data();

            // Support common counter field names
            const visitorCount = Number(
                data.visitors ??
                data.count ??
                data.totalVisitors ??
                0
            );

            monthlyRecords.push({
                month: monthKey,
                visitors: Number.isFinite(visitorCount)
                    ? visitorCount
                    : 0
            });

        });

        monthlyRecords.sort((a, b) =>
            b.month.localeCompare(a.month)
        );

        const currentMonth = getMonthKey();
        const previousMonth = getPreviousMonthKey(currentMonth);

        const currentRecord = monthlyRecords.find(
            record => record.month === currentMonth
        );

        const previousRecord = monthlyRecords.find(
            record => record.month === previousMonth
        );

        currentElement.textContent =
            (currentRecord?.visitors ?? 0).toLocaleString();

        previousElement.textContent =
            (previousRecord?.visitors ?? 0).toLocaleString();

        if (currentLabel) {
            currentLabel.textContent = formatMonth(currentMonth);
        }

        if (previousLabel) {
            previousLabel.textContent = formatMonth(previousMonth);
        }

        // Display all historical months
        historyElement.replaceChildren();

        if (monthlyRecords.length === 0) {

            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 2;
            cell.textContent = "No monthly visitor records found.";

            row.appendChild(cell);
            historyElement.appendChild(row);

        } else {

            monthlyRecords.forEach(record => {

                const row = document.createElement("tr");

                const monthCell = document.createElement("td");
                monthCell.textContent = formatMonth(record.month);

                const visitorCell = document.createElement("td");
                visitorCell.textContent =
                    record.visitors.toLocaleString();

                row.appendChild(monthCell);
                row.appendChild(visitorCell);

                historyElement.appendChild(row);

            });

        }

        if (statusElement) {
            statusElement.textContent =
                "Monthly visitor statistics loaded successfully.";
        }

    } catch (error) {

        console.error("Visitor statistics error:", error);

        if (statusElement) {
            statusElement.textContent =
                "Unable to load visitor statistics. Check Firebase permissions.";
        }

        historyElement.textContent =
            "Unable to load visitor history.";

    }

}


// =====================================
// LOAD ALL MARKETPLACE ADS
// =====================================

async function loadAllAds() {

    const container = document.getElementById("moderationList");

    if (!container) return;

    try {

        const snapshot = await getDocs(
            collection(db, "marketplace_ads")
        );

        container.replaceChildren();

        if (snapshot.empty) {
            container.textContent = "No ads found.";
            return;
        }

        snapshot.forEach(docSnap => {

            const ad = docSnap.data();
            const adId = docSnap.id;

            const card = document.createElement("div");
            card.className = "report-card";

            const image = document.createElement("img");

            const imageUrl = Array.isArray(ad.image)
                ? ad.image[0]
                : ad.image;

            image.src = typeof imageUrl === "string" &&
                /^https?:\/\//i.test(imageUrl)
                ? imageUrl
                : "https://via.placeholder.com/300";

            image.alt = "Marketplace ad image";
            image.style.cssText =
                "width:100%;max-height:200px;object-fit:cover;border-radius:8px;";

            const title = document.createElement("h3");
            title.textContent = ad.title || "Untitled";

            const details = document.createElement("div");

            details.innerHTML = `
                <p><strong>Category:</strong> ${escapeHTML(ad.category || "N/A")}</p>
                <p><strong>Price:</strong> $${escapeHTML(ad.price ?? "0")}</p>
                <p><strong>Location:</strong> ${escapeHTML(ad.location || "Unknown")}</p>
                <p><strong>Seller:</strong> ${escapeHTML(ad.userEmail || "Unknown")}</p>
                <p><strong>Date:</strong> ${escapeHTML(ad.date || "")}</p>
            `;

            const deleteButton = document.createElement("button");

            deleteButton.textContent = "❌ Delete";
            deleteButton.style.cssText =
                "background:#c62828;color:white;";

            deleteButton.addEventListener("click", () => {
                window.deleteMarketplaceAd(adId);
            });

            card.append(
                image,
                title,
                details,
                deleteButton
            );

            container.appendChild(card);

        });

    } catch (error) {

        console.error("Error loading ads:", error);
        container.textContent = "Error loading marketplace ads.";

    }

}


// =====================================
// DELETE MARKETPLACE AD
// =====================================

window.deleteMarketplaceAd = async function (adId) {

    if (!confirm("Delete this ad permanently?")) return;

    try {

        await deleteDoc(doc(db, "marketplace_ads", adId));

        alert("Ad deleted successfully.");

        loadAllAds();

    } catch (error) {

        console.error("Delete failed:", error);

        alert("Failed to delete ad. Check administrator permissions.");

    }

};


// =====================================
// LOAD USER REPORTS
// =====================================

async function loadReports() {

    const reportList = document.getElementById("reportList");

    if (!reportList) return;

    try {

        const snapshot = await getDocs(
            collection(db, "flagged_ads")
        );

        reportList.replaceChildren();

        if (snapshot.empty) {
            reportList.textContent = "No flagged ads.";
            return;
        }

        snapshot.forEach(docSnap => {

            const report = docSnap.data();
            const reportId = docSnap.id;

            const card = document.createElement("div");
            card.className = "report-card";

            const details = document.createElement("div");

            details.innerHTML = `
                <strong>Ad ID:</strong> ${escapeHTML(report.adId || "N/A")}<br>
                <strong>Reason:</strong> ${escapeHTML(report.reason || "No reason")}
            `;

            const timestamp = document.createElement("small");

            if (report.timestamp) {
                const date = report.timestamp.toDate
                    ? report.timestamp.toDate()
                    : new Date(report.timestamp);

                timestamp.textContent =
                    Number.isNaN(date.getTime())
                        ? ""
                        : date.toLocaleString();
            }

            const removeButton = document.createElement("button");

            removeButton.textContent = "Remove Report";

            removeButton.addEventListener("click", () => {
                window.removeReport(reportId);
            });

            card.append(
                details,
                timestamp,
                removeButton
            );

            reportList.appendChild(card);

        });

    } catch (error) {

        console.error("Error loading reports:", error);

        reportList.textContent = "Error loading reports.";

    }

}


// =====================================
// REMOVE REPORTED AD
// =====================================

window.removeReport = async function (reportId) {

    if (!confirm("Remove this report?")) return;

    try {

        await deleteDoc(doc(db, "flagged_ads", reportId));

        alert("Report removed.");

        loadReports();

    } catch (error) {

        console.error("Failed to remove report:", error);

        alert("Failed to remove report.");

    }

};


// =====================================
// ADMIN LOGOUT
// =====================================

window.adminLogout = async function () {

    try {

        await signOut(auth);

        window.location.href = "index.html";

    } catch (error) {

        console.error("Logout failed:", error);

    }

};


   
