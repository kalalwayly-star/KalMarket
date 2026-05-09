// ===============================
// MESSAGES.JS (FULL FIRESTORE VERSION)
// ===============================

import { auth, db } from "./firebase-config.js";

import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    orderBy,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

// ===============================
// GLOBAL VARIABLES
// ===============================
let currentUser = null;
let currentTab = "received";
let globalMessages = [];
let currentLanguage = localStorage.getItem("language") || "en";

// ===============================
// LANGUAGE SYSTEM
// ===============================
async function loadLanguage(lang) {
    try {
        const response = await fetch(`languages/${lang}.json`);
        const translations = await response.json();

        localStorage.setItem("language", lang);
        window.translations = translations;

        updatePageContent(translations, lang);
    } catch (err) {
        console.error("Language load error:", err);
    }
}

function updatePageContent(translations, lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[key]) el.innerText = translations[key];
    });

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

// ===============================
// AUTH CHECK
// ===============================
onAuthStateChanged(auth, (user) => {
    currentUser = user;

    if (!user) {
        const container = document.getElementById("messageList");
        if (container) {
            container.innerHTML = "<p style='text-align:center;'>Please login to view messages.</p>";
        }
        return;
    }

    initMessages();
});

// ===============================
// TAB SWITCHING
// ===============================
window.changeTab = function(tab) {
    currentTab = tab;

    document.getElementById("btnReceived")?.classList.toggle("active", tab === "received");
    document.getElementById("btnSent")?.classList.toggle("active", tab === "sent");

    renderMessages();
};

// ===============================
// LOAD MESSAGES
// ===============================
function initMessages() {
    if (!currentUser) return;

    const messagesRef = collection(db, "marketplace_messages");

    onSnapshot(
        query(messagesRef, orderBy("createdAt", "desc")),
        (snapshot) => {
            globalMessages = [];

            snapshot.forEach(docSnap => {
                const data = docSnap.data();

                if (
                    data.senderId === currentUser.uid ||
                    data.receiverId === currentUser.uid
                ) {
                    globalMessages.push({
                        firebaseId: docSnap.id,
                        ...data
                    });
                }
            });

            renderMessages();
        },
        (error) => {
            console.error("Message loading error:", error);
        }
    );
}

// ===============================
// RENDER MESSAGES
// ===============================
function renderMessages() {
    const container = document.getElementById("messageList");
    if (!container) return;

    const filtered = globalMessages.filter(msg => {
        if (currentTab === "received") {
            return msg.receiverId === currentUser.uid;
        } else {
            return msg.senderId === currentUser.uid;
        }
    });

    if (filtered.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>No messages found.</p>";
        return;
    }

    container.innerHTML = filtered.map(msg => {
        const person =
            currentTab === "received"
                ? msg.senderEmail
                : msg.receiverEmail;

        return `
        <div class="message-card" style="border:1px solid #ddd; padding:15px; margin-bottom:15px; border-radius:10px; background:white;">
            
            <h4 style="margin-bottom:8px;">${msg.adTitle || "Marketplace Message"}</h4>

            <p style="font-size:0.9rem; color:#007bff;">
                <strong>${currentTab === "received" ? "From" : "To"}:</strong> ${person}
            </p>

            <p style="margin:10px 0;">${msg.message}</p>

            <small style="color:#777;">
                ${msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : ""}
            </small>

            <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
                
                <button onclick="deleteMsg('${msg.firebaseId}')"
                    style="background:#ff4d4d; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;">
                    Delete
                </button>

                ${
                    currentTab === "received"
                        ? `
                    <button onclick="toggleReply('${msg.firebaseId}')"
                        style="background:#007bff; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;">
                        Reply
                    </button>
                `
                        : ""
                }

            </div>

            ${
                currentTab === "received"
                    ? `
                <div id="reply-box-${msg.firebaseId}" style="display:none; margin-top:10px;">
                    <textarea id="reply-text-${msg.firebaseId}"
                        style="width:100%; min-height:70px; padding:10px; border-radius:6px; border:1px solid #ccc;"
                        placeholder="Write your reply..."></textarea>

                    <button onclick="sendReply('${msg.firebaseId}')"
                        style="margin-top:8px; background:#28a745; color:white; border:none; padding:8px 15px; border-radius:6px; cursor:pointer;">
                        Send Reply
                    </button>
                </div>
                `
                    : ""
            }

        </div>
        `;
    }).join("");
}

// ===============================
// TOGGLE REPLY BOX
// ===============================
window.toggleReply = function(id) {
    const box = document.getElementById(`reply-box-${id}`);
    if (!box) return;

    box.style.display =
        box.style.display === "none" || box.style.display === ""
            ? "block"
            : "none";
};

// ===============================
// SEND REPLY
// ===============================
window.sendReply = async function(id) {
    const input = document.getElementById(`reply-text-${id}`);
    if (!input) return;

    const text = input.value.trim();

    if (!text) {
        alert("Reply cannot be empty.");
        return;
    }

    const original = globalMessages.find(msg => msg.firebaseId === id);
    if (!original) return;

    try {
        await addDoc(collection(db, "marketplace_messages"), {
            adId: original.adId,
            adTitle: original.adTitle,
            senderId: currentUser.uid,
            senderEmail: currentUser.email,
            receiverId: original.senderId,
            receiverEmail: original.senderEmail,
            message: text,
            createdAt: serverTimestamp(),
            status: "unread"
        });

        alert("Reply sent successfully!");
        input.value = "";
        toggleReply(id);

    } catch (error) {
        console.error("Reply error:", error);
        alert("Failed to send reply.");
    }
};

// ===============================
// DELETE MESSAGE
// ===============================
window.deleteMsg = async function(id) {
    if (!confirm("Delete this message?")) return;

    try {
        await deleteDoc(doc(db, "marketplace_messages", id));
        alert("Message deleted.");
    } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete message.");
    }
};

// ===============================
// START
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    loadLanguage(currentLanguage);
});

