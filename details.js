```javascript
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

function cleanText(text, maxLength = 160) {

    if (!text) return "";

    return String(text)
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, maxLength);
}


function setMetaTag(name, content) {

    if (!content) return;

    let meta = document.querySelector(`meta[name="${name}"]`);

    if (!meta) {

        meta = document.createElement("meta");
        meta.setAttribute("name", name);

        document.head.appendChild(meta);
    }

    meta.setAttribute("content", content);
}


function setPropertyMeta(property, content) {

    if (!content) return;

    let meta = document.querySelector(`meta[property="${property}"]`);

    if (!meta) {

        meta = document.createElement("meta");
        meta.setAttribute("property", property);

        document.head.appendChild(meta);
    }

    meta.setAttribute("content", content);
}


/* =========================================================
   CANONICAL URL
========================================================= */

function setCanonicalUrl() {

    const canonicalUrl =
        `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(adId)}`;

    let canonical = document.querySelector('link[rel="canonical"]');

    if (!canonical) {

        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");

        document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", canonicalUrl);

    return canonicalUrl;
}


/* =========================================================
   JSON-LD STRUCTURED DATA
========================================================= */

function addProductStructuredData(ad, images, canonicalUrl) {

    /* Remove previous structured data if script already exists */

    const oldSchema =
        document.getElementById("kalmarket-product-schema");

    if (oldSchema) {
        oldSchema.remove();
    }


    const price = Number(ad.price);

    const schema = {

        "@context": "https://schema.org",

        "@type": "Product",

        "name": ad.title || "Item for sale",

        "description":
            cleanText(
                ad.description ||
                `${ad.title || "Item"} for sale on KalMarket.`,
                500
            ),

        "url": canonicalUrl,

        "image": images.length > 0 ? images : undefined,

        "category": ad.category || undefined,

        "offers": {

            "@type": "Offer",

            "url": canonicalUrl,

            "priceCurrency":
                ad.currency || "CAD",

            "price":
                Number.isFinite(price) ? price : 0,

            "availability":
                ad.status === "sold"
                    ? "https://schema.org/SoldOut"
                    : "https://schema.org/InStock",

            "itemCondition":
                "https://schema.org/UsedCondition"
        }
    };


    /* Remove undefined properties */

    Object.keys(schema).forEach(key => {

        if (schema[key] === undefined) {
            delete schema[key];
        }

    });


    const script =
        document.createElement("script");

    script.type = "application/ld+json";
    script.id = "kalmarket-product-schema";

    script.textContent =
        JSON.stringify(schema);

    document.head.appendChild(script);
}


/* =========================================================
   UPDATE SEO INFORMATION
========================================================= */

function updateSEO(ad, images) {

    const title =
        ad.title || "Item for Sale";

    const location =
        ad.location || "";

    const category =
        ad.category || "Classifieds";

    const description =
        cleanText(
            ad.description ||
            `${title} for sale on KalMarket.`,
            155
        );


    /* PAGE TITLE */

    document.title =
        `${title} | KalMarket`;


    /* META DESCRIPTION */

    setMetaTag(
        "description",
        description
    );


    /* ROBOTS */

    setMetaTag(
        "robots",
        "index, follow"
    );


    /* CANONICAL */

    const canonicalUrl =
        setCanonicalUrl();


    /* OPEN GRAPH */

    setPropertyMeta(
        "og:title",
        `${title} | KalMarket`
    );

    setPropertyMeta(
        "og:description",
        description
    );

    setPropertyMeta(
        "og:type",
        "product"
    );

    setPropertyMeta(
        "og:url",
        canonicalUrl
    );


    if (images.length > 0) {

        setPropertyMeta(
            "og:image",
            images[0]
        );

    }


    /* TWITTER */

    setPropertyMeta(
        "twitter:card",
        "summary_large_image"
    );

    setPropertyMeta(
        "twitter:title",
        `${title} | KalMarket`
    );

    setPropertyMeta(
        "twitter:description",
        description
    );


    if (images.length > 0) {

        setPropertyMeta(
            "twitter:image",
            images[0]
        );

    }


    /* STRUCTURED DATA */

    addProductStructuredData(
        ad,
        images,
        canonicalUrl
    );


    console.log(
        "SEO updated:",
        {
            title,
            description,
            category,
            location,
            canonicalUrl
        }
    );
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
            doc(
                db,
                "marketplace_ads",
                adId
            );


        const adSnap =
            await getDoc(adRef);


        if (!adSnap.exists()) {

            alert("Ad not found.");
            return;
        }


        let ad =
            adSnap.data();


        const isSold =
            ad.status === "sold";


        /* =====================================================
           SAFE VIEW COUNTER UPDATE
        ===================================================== */

        try {

            await updateDoc(
                adRef,
                {
                    views: increment(1)
                }
            );


            const updatedSnap =
                await getDoc(adRef);


            if (updatedSnap.exists()) {

                ad =
                    updatedSnap.data();
            }

        } catch (viewError) {

            console.warn(
                "View count update failed:",
                viewError
            );

        }


        /* =====================================================
           TITLE
        ===================================================== */

        const title =
            ad.title || "No Title";


        const titleElement =
            document.getElementById("adTitle");


        if (titleElement) {

            titleElement.innerText =
                title;
        }


        /* =====================================================
           CATEGORY
        ===================================================== */

        const categoryElement =
            document.getElementById("adCategory");


        if (categoryElement) {

            categoryElement.innerText =
                ad.category || "";
        }


        /* =====================================================
           PRICE
        ===================================================== */

        const symbol =
            symbolMap[ad.currency] ||
            ad.currency ||
            "$";


        const priceElement =
            document.getElementById("adPrice");


        if (priceElement) {

            priceElement.innerText =
                `${symbol} ${ad.price || "0"} ${ad.currency || ""}`;
        }


        /* =====================================================
           LOCATION
        ===================================================== */

        const locationElement =
            document.getElementById("adLocation");


        if (locationElement) {

            locationElement.innerText =
                ad.location || "Unknown";
        }


        /* =====================================================
           VIEW COUNT
        ===================================================== */

        const viewElement =
            document.getElementById("viewCount");


        if (viewElement) {

            viewElement.innerText =
                ad.views || 0;
        }


        /* =====================================================
           DESCRIPTION
        ===================================================== */

        const descriptionElement =
            document.getElementById("adDesc");


        if (descriptionElement) {

            descriptionElement.innerText =
                ad.description ||
                "No description provided.";
        }


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


        /* CASE 1 — ARRAY */

        if (Array.isArray(ad.image)) {

            images =
                ad.image;
        }


        /* CASE 2 — OBJECT */

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
                    ...ad.image.gallery
                        .split(",")
                );
            }
        }


        /* =====================================================
           CLEAN IMAGE URLS
        ===================================================== */

        images =
            images
                .map(img =>
                    typeof img === "string"
                        ? img.trim()
                        : ""
                )
                .filter(img =>
                    img.startsWith("http")
                );


        /* FALLBACK */

        if (images.length === 0) {

            images =
                [fallback];
        }


        /* =====================================================
           MAIN IMAGE
        ===================================================== */

        if (mainImage) {

            mainImage.src =
                images[0];

            mainImage.alt =
                `${title} - ${ad.category || "item"} on KalMarket`;

            mainImage.loading =
                "eager";

            mainImage.decoding =
                "async";


            /* Image error fallback */

            mainImage.onerror =
                function () {

                    if (
                        this.src !== fallback
                    ) {

                        this.src =
                            fallback;
                    }

                };
        }


        /* =====================================================
           THUMBNAILS
        ===================================================== */

        if (thumbnailGallery) {

            thumbnailGallery.innerHTML =
                "";


            images.forEach(
                (imgUrl, index) => {

                    const thumb =
                        document.createElement("img");


                    thumb.src =
                        imgUrl;


                    thumb.alt =
                        `${title} image ${index + 1}`;


                    thumb.loading =
                        "lazy";


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
                                    `${title} - image ${index + 1}`;
                            }


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


        /* =====================================================
           SEO
        ===================================================== */

        updateSEO(
            ad,
            images
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

                messageBox.disabled =
                    true;

                messageBox.placeholder =
                    "This item has been sold.";
            }


            const sendBtn =
                document.querySelector(
                    'button[onclick="sendMessage()"]'
                );


            if (sendBtn) {

                sendBtn.disabled =
                    true;

                sendBtn.innerText =
                    "Sold";

                sendBtn.style.background =
                    "gray";

                sendBtn.style.cursor =
                    "not-allowed";
            }
        }


        /* =====================================================
           IMAGE DEBUG PROBE
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

window.sendMessage =
    async function () {

        const user =
            auth.currentUser;


        if (!user) {

            alert(
                "Please login first."
            );

            window.location.href =
                "login.html";

            return;
        }


        const messageText =
            document
                .getElementById(
                    "messageText"
                )
                .value
                .trim();


        if (!messageText) {

            alert(
                "Message cannot be empty."
            );

            return;
        }


        try {

            await addDoc(
                collection(
                    db,
                    "marketplace_messages"
                ),
                {

                    adId:
                        adId,

                    adTitle:
                        document
                            .getElementById(
                                "adTitle"
                            )
                            .innerText || "",

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


            /* =================================================
               EMAIL MESSAGE
            ================================================= */

            try {

                const res =
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
                    "EMAIL SENT SUCCESS:",
                    res
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


            document
                .getElementById(
                    "messageText"
                )
                .value = "";


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

        document
            .getElementById(
                "reportModal"
            )
            .style.display =
            "block";
    };


window.closeModal =
    function () {

        document
            .getElementById(
                "reportModal"
            )
            .style.display =
            "none";
    };


window.submitReport =
    async function () {

        const reason =
            document
                .getElementById(
                    "reportReason"
                )
                .value;


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
                        new Date()
                            .toISOString()
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


    for (
        const img of images
    ) {

        results.push({

            src:
                img.src,

            currentsrc:
                img.currentSrc,

            naturalwidth:
                img.naturalWidth,

            naturalheight:
                img.naturalHeight,

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
```


