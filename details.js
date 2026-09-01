import { db, auth } from "./firebase-config.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp,
    updateDoc,
    increment
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";


// ============================================================
// CURRENCY SYMBOLS
// ============================================================

const symbolMap = {
    USD: "$",
    CAD: "$",
    AUD: "$",
    EUR: "€",
    GBP: "£",

    SAR: "﷼",
    AED: "د.إ",
    QAR: "ر.ق",
    KWD: "د.ك",
    BHD: ".د.ب",
    OMR: "ر.ع",

    IQD: "ع.د",
    JOD: "د.أ",
    LBP: "ل.ل",
    EGP: "ج.م",
    LYD: "ل.د",
    TND: "د.ت",
    DZD: "د.ج",
    MAD: "د.م",

    TRY: "₺",
    INR: "₹",
    PKR: "₨",
    BDT: "৳",
    LKR: "Rs",

    CNY: "¥",
    JPY: "¥",
    KRW: "₩",

    RUB: "₽",
    UAH: "₴",

    CHF: "CHF",
    NOK: "kr",
    SEK: "kr",
    DKK: "kr",

    ZAR: "R",
    NGN: "₦",
    GHS: "₵",
    KES: "KSh",

    BRL: "R$",
    MXN: "$",
    ARS: "$",
    CLP: "$",
    COP: "$"
};


// ============================================================
// GET AD ID FROM URL
// ============================================================

const params = new URLSearchParams(window.location.search);
const adId = params.get("id");


// ============================================================
// GLOBAL SELLER INFORMATION
// ============================================================

window.currentSellerId = null;
window.currentSellerEmail = null;


// ============================================================
// LOAD AD DETAILS
// ============================================================

async function loadAdDetails() {

    console.log("====================================");
    console.log("KALMARKET DETAIL PAGE");
    console.log("Ad ID:", adId);
    console.log("====================================");

    // --------------------------------------------------------
    // Check for missing ID
    // --------------------------------------------------------

    if (!adId) {

        console.error("No ad ID found in URL.");

        alert("Ad not found.");

        return;
    }


    try {

        // ----------------------------------------------------
        // Get Firestore document
        // ----------------------------------------------------

        const adRef = doc(
            db,
            "marketplace_ads",
            adId
        );

        console.log("Loading Firestore document:", adId);

        const adSnap = await getDoc(adRef);


        // ----------------------------------------------------
        // Check document exists
        // ----------------------------------------------------

        if (!adSnap.exists()) {

            console.error(
                "Firestore document does not exist:",
                adId
            );

            alert("Ad not found.");

            return;
        }


        // ----------------------------------------------------
        // Get ad data
        // ----------------------------------------------------

        let ad = adSnap.data();

        console.log("AD DATA FROM FIRESTORE:");
        console.log(ad);


        // ====================================================
        // VIEW COUNTER
        // ====================================================

        try {

            await updateDoc(adRef, {

                views: increment(1)

            });

            console.log("View count updated.");

            // Reload document so we have the latest view count

            const updatedSnap = await getDoc(adRef);

            if (updatedSnap.exists()) {

                ad = updatedSnap.data();

            }

        } catch (viewError) {

            console.warn(
                "View count update failed:",
                viewError
            );

            // Continue loading the page even if views fail
        }


        // ====================================================
        // TITLE
        // ====================================================

        const titleElement =
            document.getElementById("adTitle");

        if (titleElement) {

            titleElement.innerText =
                ad.title || "No Title";

        }


        // ====================================================
        // SEO PAGE TITLE
        // ====================================================

        document.title =
            `${ad.title || "Ad Details"} | KalMarket`;


        // ====================================================
        // META DESCRIPTION
        // ====================================================

        const metaDescription =
            document.getElementById("metaDescription");

        if (metaDescription) {

            const description =
                ad.description ||
                ad.title ||
                "Browse items for sale on KalMarket.";

            metaDescription.setAttribute(
                "content",
                description.substring(0, 160)
            );

        }


        // ====================================================
        // CATEGORY
        // ====================================================

        const categoryElement =
            document.getElementById("adCategory");

        if (categoryElement) {

            categoryElement.innerText =
                ad.category || "";

        }


        // ====================================================
        // PRICE
        // ====================================================

        const priceElement =
            document.getElementById("adPrice");

        if (priceElement) {

            const currency =
                ad.currency || "CAD";

            const symbol =
                symbolMap[currency] || currency;

            const price =
                ad.price !== undefined &&
                ad.price !== null &&
                ad.price !== ""
                    ? ad.price
                    : "0";

            priceElement.innerText =
                `${symbol} ${price} ${currency}`;

        }


        // ====================================================
        // LOCATION
        // ====================================================

        const locationElement =
            document.getElementById("adLocation");

        if (locationElement) {

            locationElement.innerText =
                ad.location || "Unknown";

        }


        // ====================================================
        // VIEW COUNT
        // ====================================================

        const viewElement =
            document.getElementById("viewCount");

        if (viewElement) {

            viewElement.innerText =
                ad.views || 0;

        }


        // ====================================================
        // DESCRIPTION
        // ====================================================

        const descriptionElement =
            document.getElementById("adDesc");

        if (descriptionElement) {

            descriptionElement.innerText =
                ad.description ||
                "No description provided.";

        }


        // ====================================================
        // SELLER INFORMATION
        // ====================================================

        window.currentSellerId =
            ad.userId || null;

        window.currentSellerEmail =
            ad.userEmail || null;


        console.log(
            "Seller ID:",
            window.currentSellerId
        );

        console.log(
            "Seller Email:",
            window.currentSellerEmail
        );


        // ====================================================
        // IMAGE GALLERY
        // ====================================================

        loadAdImages(ad);


        // ====================================================
        // SOLD ITEM
        // ====================================================

        if (ad.status === "sold") {

            disableSoldItem();

        }


        console.log(
            "KalMarket ad loaded successfully."
        );

    } catch (error) {

        console.error(
            "ERROR LOADING AD:",
            error
        );

        alert(
            "Failed to load ad details. Please try again."
        );

    }
}


// ============================================================
// LOAD AD IMAGES
// ============================================================

function loadAdImages(ad) {

    const mainImage =
        document.getElementById("mainAdImage");

    const thumbnailGallery =
        document.getElementById("thumbnailGallery");


    if (!mainImage) {

        console.error(
            "mainAdImage element not found."
        );

        return;
    }


    if (!thumbnailGallery) {

        console.error(
            "thumbnailGallery element not found."
        );

        return;
    }


    // --------------------------------------------------------
    // Default image
    // --------------------------------------------------------

    const fallback =
        "https://dummyimage.com/600x400/cccccc/000000&text=No+Image";


    let images = [];


    // ========================================================
    // IMAGE FIELD = ARRAY
    // ========================================================

    if (Array.isArray(ad.image)) {

        images = ad.image;

    }


    // ========================================================
    // IMAGE FIELD = OBJECT
    // ========================================================

    else if (
        ad.image &&
        typeof ad.image === "object"
    ) {

        // Main image

        if (
            typeof ad.image.main === "string"
        ) {

            images.push(
                ad.image.main
            );

        }


        // Gallery array

        if (
            Array.isArray(ad.image.gallery)
        ) {

            images.push(
                ...ad.image.gallery
            );

        }


        // Gallery string

        if (
            typeof ad.image.gallery === "string"
        ) {

            images.push(
                ...ad.image.gallery
                    .split(",")
                    .map(img => img.trim())
            );

        }

    }


    // ========================================================
    // SINGLE IMAGE FIELD
    // ========================================================

    else if (
        typeof ad.image === "string"
    ) {

        images.push(ad.image);

    }


    // ========================================================
    // SUPPORT imageUrl
    // ========================================================

    if (
        typeof ad.imageUrl === "string"
    ) {

        images.push(ad.imageUrl);

    }


    // ========================================================
    // SUPPORT imageURL
    // ========================================================

    if (
        typeof ad.imageURL === "string"
    ) {

        images.push(ad.imageURL);

    }


    // ========================================================
    // SUPPORT images ARRAY
    // ========================================================

    if (Array.isArray(ad.images)) {

        images.push(
            ...ad.images
        );

    }


    // ========================================================
    // CLEAN IMAGE URLS
    // ========================================================

    images = images
        .filter(
            img =>
                typeof img === "string" &&
                img.trim() !== ""
        )
        .map(
            img => img.trim()
        )
        .filter(
            (img, index, array) =>
                array.indexOf(img) === index
        );


    console.log(
        "Images found:",
        images
    );


    // ========================================================
    // NO IMAGE
    // ========================================================

    if (images.length === 0) {

        console.warn(
            "No valid images found for this ad."
        );

        mainImage.src = fallback;

        thumbnailGallery.innerHTML = "";

        return;
    }


    // ========================================================
    // MAIN IMAGE
    // ========================================================

    mainImage.src = images[0];

    mainImage.alt =
        document.getElementById("adTitle")?.innerText ||
        "KalMarket Ad";


    // --------------------------------------------------------
    // Image loading error
    // --------------------------------------------------------

    mainImage.onerror = function () {

        console.error(
            "Main image failed to load:",
            this.src
        );

        this.src = fallback;

    };


    // ========================================================
    // THUMBNAILS
    // ========================================================

    thumbnailGallery.innerHTML = "";


    images.forEach(
        (imgUrl, index) => {

            const thumb =
                document.createElement("img");


            thumb.src = imgUrl;

            thumb.alt =
                `Ad image ${index + 1}`;


            // First thumbnail active

            if (index === 0) {

                thumb.classList.add(
                    "active"
                );

            }


            // Thumbnail error

            thumb.onerror = function () {

                console.warn(
                    "Thumbnail failed:",
                    imgUrl
                );

                this.style.display =
                    "none";

            };


            // Click thumbnail

            thumb.addEventListener(
                "click",
                () => {

                    mainImage.src =
                        imgUrl;


                    document
                        .querySelectorAll(
                            "#thumbnailGallery img"
                        )
                        .forEach(
                            img =>
                                img.classList.remove(
                                    "active"
                                )
                        );


                    thumb.classList.add(
                        "active"
                    );

                }
            );


            thumbnailGallery.appendChild(
                thumb
            );

        }
    );

}


// ============================================================
// SOLD ITEM UI
// ============================================================

function disableSoldItem() {

    const messageBox =
        document.getElementById(
            "messageText"
        );


    if (messageBox) {

        messageBox.disabled = true;

        messageBox.placeholder =
            "This item has been sold.";

    }


    const sendButton =
        document.querySelector(
            'button[onclick="sendMessage()"]'
        );


    if (sendButton) {

        sendButton.disabled = true;

        sendButton.innerText =
            "Sold";

        sendButton.style.background =
            "gray";

        sendButton.style.cursor =
            "not-allowed";

    }

}


// ============================================================
// SEND MESSAGE
// ============================================================

window.sendMessage = async function () {

    const user =
        auth.currentUser;


    // --------------------------------------------------------
    // Require login
    // --------------------------------------------------------

    if (!user) {

        alert(
            "Please login first."
        );

        window.location.href =
            "login.html";

        return;
    }


    // --------------------------------------------------------
    // Get message
    // --------------------------------------------------------

    const messageElement =
        document.getElementById(
            "messageText"
        );


    if (!messageElement) {

        alert(
            "Message box not found."
        );

        return;
    }


    const messageText =
        messageElement.value.trim();


    if (!messageText) {

        alert(
            "Message cannot be empty."
        );

        return;
    }


    // --------------------------------------------------------
    // Check seller
    // --------------------------------------------------------

    if (!window.currentSellerId) {

        alert(
            "Seller information is unavailable."
        );

        console.error(
            "Seller ID missing."
        );

        return;
    }


    try {

        // ====================================================
        // SAVE MESSAGE TO FIRESTORE
        // ====================================================

        await addDoc(
            collection(
                db,
                "marketplace_messages"
            ),
            {

                adId: adId,

                adTitle:
                    document.getElementById(
                        "adTitle"
                    )?.innerText || "",

                senderId:
                    user.uid,

                senderEmail:
                    user.email || "",

                receiverId:
                    window.currentSellerId,

                receiverEmail:
                    window.currentSellerEmail || "",

                message:
                    messageText,

                createdAt:
                    serverTimestamp(),

                status:
                    "sent"

            }
        );


        // ====================================================
        // SEND EMAIL NOTIFICATION
        // ====================================================

        if (
            typeof emailjs !== "undefined" &&
            window.currentSellerEmail
        ) {

            try {

                const language =
                    localStorage.getItem(
                        "language"
                    ) || "en";


                await emailjs.send(
                    "service_quc10ww",
                    "template_yl7gl6l",
                    {

                        to_email:
                            window.currentSellerEmail,

                        to_name:
                            window.currentSellerEmail,

                        from_email:
                            user.email || "",

                        message:
                            messageText,

                        ad_id:
                            adId,

                        lang:
                            language

                    }
                );


                console.log(
                    "EMAIL SENT SUCCESSFULLY"
                );

            } catch (emailError) {

                console.error(
                    "EMAILJS ERROR:",
                    emailError
                );

                // Message was already saved.
                // Do not tell user that the message failed.
            }

        }


        // ====================================================
        // SUCCESS
        // ====================================================

        alert(
            "Message sent successfully!"
        );


        messageElement.value = "";


    } catch (error) {

        console.error(
            "MESSAGE ERROR:",
            error
        );

        alert(
            "Failed to send message."
        );

    }

};


// ============================================================
// REPORT SYSTEM
// ============================================================

window.showReportModal = function () {

    const modal =
        document.getElementById(
            "reportModal"
        );


    if (modal) {

        modal.style.display =
            "block";

    }

};


window.closeModal = function () {

    const modal =
        document.getElementById(
            "reportModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

};


window.submitReport = async function () {

    const reasonElement =
        document.getElementById(
            "reportReason"
        );


    if (!reasonElement) {

        alert(
            "Report form not found."
        );

        return;
    }


    const reason =
        reasonElement.value;


    if (!reason) {

        alert(
            "Please select a reason."
        );

        return;
    }


    try {

        await addDoc(
            collection(
                db,
                "flaggedAds"
            ),
            {

                adId:
                    adId,

                reason:
                    reason,

                timestamp:
                    new Date().toISOString()

            }
        );


        alert(
            "Report submitted."
        );


        closeModal();


    } catch (error) {

        console.error(
            "REPORT ERROR:",
            error
        );

        alert(
            "Failed to submit report."
        );

    }

};


// ============================================================
// INITIALIZE PAGE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Details page initialized."
        );

        loadAdDetails();

    }
);


