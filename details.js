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

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";


/* =========================================================
   CURRENCY SYMBOLS
========================================================= */

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


/* =========================================================
   GET AD ID FROM URL
========================================================= */

const params = new URLSearchParams(window.location.search);
const adId = params.get("id");


/* =========================================================
   SEO HELPERS
========================================================= */

function cleanText(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/\s+/g, " ")
        .trim();
}


function createSeoDescription(ad) {

    const title = cleanText(ad.title);
    const description = cleanText(ad.description);
    const category = cleanText(ad.category);
    const location = cleanText(ad.location);

    let text = "";

    if (description) {
        text = description;
    } else if (title) {
        text = `${title} listed for sale on KalMarket.`;
    } else {
        text = "Buy and sell items on KalMarket, a free local classifieds marketplace.";
    }

    if (category && !text.toLowerCase().includes(category.toLowerCase())) {
        text += ` ${category}.`;
    }

    if (location && !text.toLowerCase().includes(location.toLowerCase())) {
        text += ` Located in ${location}.`;
    }

    /*
       Google generally displays only part of a description.
       Keep the generated description reasonably short.
    */
    if (text.length > 300) {
        text = text.substring(0, 297).trim() + "...";
    }

    return text;
}


function getListingUrl() {

    return `${window.location.origin}/details.html?id=${encodeURIComponent(adId)}`;

}


function updateMetaTag(id, attribute, value) {

    const element = document.getElementById(id);

    if (element && value) {
        element.setAttribute(attribute, value);
    }

}


function updateListingSeo(ad, imageUrl) {

    const title = cleanText(ad.title) || "Ad Details";

    const category = cleanText(ad.category);

    const location = cleanText(ad.location);

    const description = createSeoDescription(ad);

    const listingUrl = getListingUrl();

    /*
       Main browser title
    */

    document.title = `${title} | KalMarket`;


    /*
       Standard description
    */

    updateMetaTag(
        "metaDescription",
        "content",
        description
    );


    /*
       Canonical URL
    */

    const canonical = document.getElementById("canonicalLink");

    if (canonical) {
        canonical.setAttribute("href", listingUrl);
    }


    /*
       Open Graph
    */

    updateMetaTag(
        "ogTitle",
        "content",
        `${title} | KalMarket`
    );

    updateMetaTag(
        "ogDescription",
        "content",
        description
    );

    updateMetaTag(
        "ogUrl",
        "content",
        listingUrl
    );

    if (imageUrl) {

        updateMetaTag(
            "ogImage",
            "content",
            imageUrl
        );

    }


    /*
       Twitter / X
    */

    updateMetaTag(
        "twitterTitle",
        "content",
        `${title} | KalMarket`
    );

    updateMetaTag(
        "twitterDescription",
        "content",
        description
    );

    if (imageUrl) {

        updateMetaTag(
            "twitterImage",
            "content",
            imageUrl
        );

    }


    /*
       Structured Data
    */

    const structuredData =
        document.getElementById("listingStructuredData");

    if (structuredData) {

        const price =
            ad.price !== undefined &&
            ad.price !== null &&
            ad.price !== ""
                ? String(ad.price)
                : "0";

        const currency =
            cleanText(ad.currency) || "CAD";


        const jsonLd = {

            "@context": "https://schema.org",

            "@type": "Product",

            "name": title,

            "description": description,

            "url": listingUrl

        };


        /*
           Add image when available
        */

        if (imageUrl) {

            jsonLd.image = [imageUrl];

        }


        /*
           Add category when available
        */

        if (category) {

            jsonLd.category = category;

        }


        /*
           Add offer information
        */

        if (
            ad.price !== undefined &&
            ad.price !== null &&
            ad.price !== ""
        ) {

            jsonLd.offers = {

                "@type": "Offer",

                "url": listingUrl,

                "priceCurrency": currency,

                "price": price,

                "availability":
                    ad.status === "sold"
                        ? "https://schema.org/SoldOut"
                        : "https://schema.org/InStock"

            };

        }


        structuredData.textContent =
            JSON.stringify(jsonLd, null, 2);

    }


    /*
       Improve the visible main image ALT text.
    */

    const mainImage =
        document.getElementById("mainAdImage");

    if (mainImage) {

        let altText = title;

        if (category) {
            altText += ` - ${category}`;
        }

        if (location) {
            altText += ` in ${location}`;
        }

        mainImage.setAttribute(
            "alt",
            altText
        );

    }

}


/* =========================================================
   LOAD AD DETAILS
========================================================= */

async function loadAdDetails() {

    if (!adId) {

        alert("Ad not found.");

        return;

    }


    try {

        const adRef =
            doc(db, "marketplace_ads", adId);

        const adSnap =
            await getDoc(adRef);


        if (!adSnap.exists()) {

            alert("Ad not found.");

            return;

        }


        let ad = adSnap.data();

        const isSold =
            ad.status === "sold";


        /* =====================================================
           SAFE VIEW COUNTER UPDATE
        ===================================================== */

        try {

            await updateDoc(adRef, {

                views: increment(1)

            });


            /*
               Reload updated data after increment
            */

            const updatedSnap =
                await getDoc(adRef);


            if (updatedSnap.exists()) {

                ad = updatedSnap.data();

            }

        } catch (viewError) {

            console.warn(
                "View count update failed:",
                viewError
            );

            /*
               Page continues even if view update fails.
            */

        }


        /* =====================================================
           TITLE
        ===================================================== */

        const adTitle =
            cleanText(ad.title) || "No Title";


        document.getElementById(
            "adTitle"
        ).innerText = adTitle;


        /* =====================================================
           CATEGORY
        ===================================================== */

        document.getElementById(
            "adCategory"
        ).innerText =
            ad.category || "";


        /* =====================================================
           PRICE
        ===================================================== */

        const symbol =
            symbolMap[ad.currency] ||
            ad.currency ||
            "$";


        document.getElementById(
            "adPrice"
        ).innerText =
            `${symbol} ${ad.price || "0"} ${ad.currency || ""}`;


        /* =====================================================
           LOCATION
        ===================================================== */

        document.getElementById(
            "adLocation"
        ).innerText =
            ad.location || "Unknown";


        /* =====================================================
           VIEW COUNT
        ===================================================== */

        const viewCount =
            document.getElementById("viewCount");


        if (viewCount) {

            viewCount.innerText =
                ad.views || 0;

        }


        /* =====================================================
           DESCRIPTION
        ===================================================== */

        document.getElementById(
            "adDesc"
        ).innerText =
            ad.description ||
            "No description provided.";


        /* =====================================================
           IMAGE GALLERY
        ===================================================== */

        const mainImage =
            document.getElementById("mainAdImage");

        const thumbnailGallery =
            document.getElementById("thumbnailGallery");


        const fallback =
            "https://dummyimage.com/600x400/cccccc/000000&text=No+Image";


        let images = [];


        /*
           CASE 1:
           image is an array
        */

        if (Array.isArray(ad.image)) {

            images = ad.image;

        }


        /*
           CASE 2:
           image is an object
        */

        else if (
            ad.image &&
            typeof ad.image === "object"
        ) {

            if (
                typeof ad.image.main === "string"
            ) {

                images.push(
                    ad.image.main
                );

            }


            if (
                Array.isArray(
                    ad.image.gallery
                )
            ) {

                images.push(
                    ...ad.image.gallery
                );

            }


            if (
                typeof ad.image.gallery === "string"
            ) {

                images.push(
                    ...ad.image.gallery.split(",")
                );

            }

        }


        /*
           Clean bad images
        */

        images = images

            .map(img =>
                typeof img === "string"
                    ? img.trim()
                    : ""
            )

            .filter(img =>
                img.startsWith("http")
            );


        /*
           Remove duplicate image URLs
        */

        images = [
            ...new Set(images)
        ];


        /*
           Fallback
        */

        if (images.length === 0) {

            images = [fallback];

        }


        /*
           Set main image
        */

        if (mainImage) {

            mainImage.src =
                images[0];

            mainImage.alt =
                cleanText(ad.title) ||
                "KalMarket listing image";

        }


        /*
           Build thumbnails
        */

        if (thumbnailGallery) {

            thumbnailGallery.innerHTML = "";


            images.forEach(
                (imgUrl, index) => {

                    const thumb =
                        document.createElement("img");


                    thumb.src =
                        imgUrl;


                    thumb.alt =
                        `${cleanText(ad.title) || "KalMarket listing"} image ${index + 1}`;


                    if (index === 0) {

                        thumb.classList.add(
                            "active"
                        );

                    }


                    thumb.addEventListener(
                        "click",
                        () => {

                            if (mainImage) {

                                mainImage.src =
                                    imgUrl;

                                mainImage.alt =
                                    `${cleanText(ad.title) || "KalMarket listing"} image ${index + 1}`;

                            }


                            document
                                .querySelectorAll(
                                    "#thumbnailGallery img"
                                )
                                .forEach(img =>
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


        /* =====================================================
           SEO
        ===================================================== */

        /*
           Use the first real listing image.
           Do not use the dummy fallback for social SEO.
        */

        const seoImage =
            images.length > 0 &&
            images[0] !== fallback
                ? images[0]
                : "";


        updateListingSeo(
            ad,
            seoImage
        );


        /* =====================================================
           SELLER INFORMATION
        ===================================================== */

        window.currentSellerId =
            ad.userId;

        window.currentSellerEmail =
            ad.userEmail;


        /* =====================================================
           SOLD ITEM UI
        ===================================================== */

        if (isSold) {

            const messageBox =
                document.getElementById(
                    "messageText"
                );


            if (messageBox) {

                messageBox.disabled = true;

                messageBox.placeholder =
                    "This item has been sold.";

            }


            const sendBtn =
                document.querySelector(
                    'button[onclick="sendMessage()"]'
                );


            if (sendBtn) {

                sendBtn.disabled = true;

                sendBtn.innerText =
                    "Sold";

                sendBtn.style.background =
                    "gray";

                sendBtn.style.cursor =
                    "not-allowed";

            }

        }


        /* =====================================================
           IMAGE PROBE
        ===================================================== */

        const data =
            await probeimageurls();


        console.log(
            "Probed Image Data:",
            data
        );


    } catch (error) {

        console.error(
            "Error loading ad:",
            error
        );

        alert(
            "Failed to load ad details."
        );

    }

}


/* =========================================================
   SEND MESSAGE
========================================================= */

window.sendMessage = async function () {

    const user =
        auth.currentUser;


    if (!user) {

        alert("Please login first.");

        window.location.href =
            "login.html";

        return;

    }


    const messageText =
        document
            .getElementById("messageText")
            .value
            .trim();


    if (!messageText) {

        alert("Message cannot be empty.");

        return;

    }


    try {

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
                    ).innerText || "",

                senderId:
                    user.uid,

                senderEmail:
                    user.email,

                receiverId:
                    window.currentSellerId,

                receiverEmail:
                    window.currentSellerEmail,

                message:
                    messageText,

                createdAt:
                    serverTimestamp(),

                status:
                    "sent"

            }
        );


        /*
           Email notification
        */

        try {

            await emailjs.send(
                "service_quc10ww",
                "template_yl7gl6l",
                {

                    to_email:
                        window.currentSellerEmail,

                    to_name:
                        window.currentSellerEmail,

                    from_email:
                        user.email,

                    message:
                        messageText,

                    ad_id:
                        adId,

                    lang:
                        localStorage.getItem(
                            "language"
                        ) || "en"

                }
            );


            console.log(
                "EMAIL SENT SUCCESS"
            );


        } catch (err) {

            console.error(
                "EMAILJS ERROR:",
                err
            );

        }


        alert(
            "Message sent successfully!"
        );


        document.getElementById(
            "messageText"
        ).value = "";


    } catch (error) {

        console.error(
            "Message error:",
            error
        );

        alert(
            "Failed to send message."
        );

    }

};


/* =========================================================
   REPORT SYSTEM
========================================================= */

window.showReportModal =
    function () {

        document.getElementById(
            "reportModal"
        ).style.display =
            "block";

    };


window.closeModal =
    function () {

        document.getElementById(
            "reportModal"
        ).style.display =
            "none";

    };


window.submitReport =
    async function () {

        const reason =
            document.getElementById(
                "reportReason"
            ).value;


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

                    adId,

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
                "Report failed:",
                error
            );

            alert(
                "Failed to submit report."
            );

        }

    };


/* =========================================================
   IMAGE PROBER
========================================================= */

async function probeimageurls() {

    const images =
        Array.from(
            document.querySelectorAll(
                "img"
            )
        );


    const results = [];


    for (const img of images) {

        results.push({

            src:
                img.src,

            currentsrc:
                img.currentSrc,

            naturalwidth:
                img.naturalWidth,

            complete:
                img.complete,

            error:
                img.naturalWidth === 0 &&
                img.complete

        });

    }


    const perfentries =
        performance
            .getEntriesByType(
                "resource"
            )
            .filter(
                e =>
                    e.initiatorType === "img"
            )
            .map(
                e => ({

                    name:
                        e.name,

                    duration:
                        e.duration

                })
            );


    return {

        imagestates:
            results,

        resourceentries:
            perfentries

    };

}


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadAdDetails();

    }
);

