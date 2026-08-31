import { app, storage, auth, db } from "./firebase-config.js";

import {
    getAI,
    getGenerativeModel,
    GoogleAIBackend,
    Schema
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-ai.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    Timestamp
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js";


/* =========================================================
   FIREBASE AI
========================================================= */

const ai = getAI(app, {
    backend: new GoogleAIBackend()
});


/* =========================================================
   GLOBAL PHOTO / AI VARIABLES
========================================================= */

let uploadedImages = [];
let pendingUploads = 0;

/*
   These variables are used only for AI.
   They do NOT change your Firebase Storage upload system.
*/

let lastSelectedPhoto = null;
let lastCompressedPhoto = null;

let aiAnalysisInProgress = false;
let aiAnalyzedPhotoKey = null;


/* =========================================================
   GEOLOCATION
========================================================= */

navigator.geolocation.getCurrentPosition(
    (position) => {

        window.currentAdLat = position.coords.latitude;
        window.currentAdLng = position.coords.longitude;

    },
    (error) => {

        console.error("Location error:", error);

    }
);


/* =========================================================
   COUNTRY DETECTION
========================================================= */

async function getUserCountry() {

    try {

        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        return data.country_name;

    } catch (e) {

        console.error("Country detection failed:", e);

        return "United States";

    }

}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(auth, (user) => {

    const loginLink =
        document.getElementById("loginLink");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const emailSpan =
        document.getElementById("emailSpan");


    if (user) {

        if (loginLink)
            loginLink.style.display = "none";

        if (logoutBtn)
            logoutBtn.style.display = "inline-block";

        if (emailSpan)
            emailSpan.innerText = user.email;

    } else {

        if (loginLink)
            loginLink.style.display = "inline-block";

        if (logoutBtn)
            logoutBtn.style.display = "none";

        if (emailSpan)
            emailSpan.innerText = "";

    }

});


/* =========================================================
   IMAGE COMPRESSION
========================================================= */

async function compressImage(
    file,
    maxWidth = 800,
    quality = 0.7
) {

    return new Promise((resolve, reject) => {

        const img = new Image();
        const reader = new FileReader();


        reader.onload = (e) => {

            img.src = e.target.result;

        };


        img.onload = () => {

            const canvas =
                document.createElement("canvas");

            const ctx =
                canvas.getContext("2d");


            let width = img.width;
            let height = img.height;


            if (width > maxWidth) {

                height *= maxWidth / width;
                width = maxWidth;

            }


            canvas.width = width;
            canvas.height = height;


            ctx.drawImage(
                img,
                0,
                0,
                width,
                height
            );


            canvas.toBlob(
                (blob) => {

                    if (!blob) {

                        reject(
                            new Error(
                                "Compression failed."
                            )
                        );

                        return;

                    }


                    /*
                       Always create JPEG.

                       This also prevents the original
                       .avif/.webp filename from causing
                       Storage problems.
                    */

                    const compressedFile =
                        new File(
                            [blob],
                            `kalmarket_${Date.now()}.jpg`,
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


        img.onerror = () => {

            reject(
                new Error(
                    "The selected image could not be loaded."
                )
            );

        };


        reader.onerror = () => {

            reject(
                new Error(
                    "The selected image could not be read."
                )
            );

        };


        reader.readAsDataURL(file);

    });

}


/* =========================================================
   AI STATUS
========================================================= */

function showAIStatus(message, type = "info") {

    let status =
        document.getElementById("aiStatus");


    /*
       Create the status box automatically
       if it does not exist in the HTML.
    */

    if (!status) {

        status =
            document.createElement("div");

        status.id = "aiStatus";

        status.style.marginTop = "10px";
        status.style.padding = "10px";
        status.style.borderRadius = "8px";
        status.style.fontSize = "14px";
        status.style.fontWeight = "500";


        const checkbox =
            document.getElementById("useAI");


        if (checkbox && checkbox.parentElement) {

            checkbox.parentElement.appendChild(status);

        } else {

            const photoInput =
                document.getElementById("photoInput");

            if (
                photoInput &&
                photoInput.parentElement
            ) {

                photoInput.parentElement.appendChild(status);

            }

        }

    }


    status.textContent = message;


    if (type === "success") {

        status.style.background = "#e8f5e9";
        status.style.color = "#2e7d32";

    } else if (type === "error") {

        status.style.background = "#ffebee";
        status.style.color = "#c62828";

    } else {

        status.style.background = "#e3f2fd";
        status.style.color = "#1565c0";

    }

}


/* =========================================================
   AI PHOTO KEY
========================================================= */

function getPhotoKey(file) {

    if (!file) return null;

    return [
        file.name,
        file.size,
        file.lastModified
    ].join("_");

}


/* =========================================================
   AI PHOTO ANALYSIS
========================================================= */

async function analyzeAdPhotoWithAI(file) {

    if (!file) {

        throw new Error(
            "No photo was selected."
        );

    }


    console.log(
        "KalMarket AI: starting analysis..."
    );


    /*
       Firebase AI structured JSON schema.

       We keep the fields as strings because
       the listing form expects text values.
    */

    const jsonSchema =
        Schema.object({

            properties: {

                category:
                    Schema.string(),

                title:
                    Schema.string(),

                description:
                    Schema.string(),

                condition:
                    Schema.string(),

                make:
                    Schema.string(),

                model:
                    Schema.string(),

                year:
                    Schema.string(),

                transmission:
                    Schema.string(),

                fuelType:
                    Schema.string()

            },

            optionalProperties: [
                "make",
                "model",
                "year",
                "transmission",
                "fuelType"
            ]

        });


    /*
       Current Firebase AI Logic Web SDK
       supports Gemini 3.7 Flash.
    */

    const model =
        getGenerativeModel(ai, {

            model: "gemini-3.7-flash",

            generationConfig: {

                responseMimeType:
                    "application/json",

                responseSchema:
                    jsonSchema

            }

        });


    /* =====================================================
       CONVERT PHOTO TO BASE64
    ===================================================== */

    const reader =
        new FileReader();


    const base64Data =
        await new Promise(
            (resolve, reject) => {

                reader.onload = () => {

                    const result =
                        reader.result;


                    if (
                        !result ||
                        typeof result !== "string"
                    ) {

                        reject(
                            new Error(
                                "Unable to read image."
                            )
                        );

                        return;

                    }


                    const parts =
                        result.split(",");


                    if (parts.length < 2) {

                        reject(
                            new Error(
                                "Invalid image data."
                            )
                        );

                        return;

                    }


                    resolve(parts[1]);

                };


                reader.onerror = () => {

                    reject(
                        new Error(
                            "Unable to read image."
                        )
                    );

                };


                reader.readAsDataURL(file);

            }
        );


    /* =====================================================
       AI PROMPT
    ===================================================== */

    const prompt = `
You are helping create a classified advertisement
for KalMarket.

Carefully analyze the uploaded photo.

Identify the item being sold and provide accurate
information that can reasonably be determined from
the image.

Available categories:

Real Estate
Cars & Trucks
Electronics
Auto Accessories
Furniture
Jobs
Fashion
Pets
Sports
Books
Appliances
Toys
Services
Garden
Health
Baby
Buy&Sale

IMPORTANT RULES:

- Never invent information.
- Do not guess the price.
- Do not guess mileage.
- Do not guess location.
- Do not invent an exact year unless it is visible
  or strongly identifiable.
- Do not invent transmission.
- Do not invent fuel type.
- If information cannot reasonably be determined,
  return an empty string.
- Use "New", "Used", or "Refurbished" for condition
  only when reasonably supported.
- Keep the title short and suitable for a classified
  advertisement.
- Write a useful, honest description based only on
  what can be observed.
- If this is a vehicle, identify make, model, and
  year only when reasonably possible.
- Do not invent information that is not visible.
- Return only JSON matching the requested schema.
`;


    /* =====================================================
       IMAGE PART
    ===================================================== */

    const imagePart = {

        inlineData: {

            data: base64Data,

            /*
               The compressed image is always JPEG.
            */

            mimeType: "image/jpeg"

        }

    };


    console.log(
        "KalMarket AI: sending image to Gemini..."
    );


    /* =====================================================
       SEND TO GEMINI
    ===================================================== */

    const result =
        await model.generateContent([
            prompt,
            imagePart
        ]);


    if (
        !result ||
        !result.response
    ) {

        throw new Error(
            "Firebase AI returned no response."
        );

    }


    const text =
        result.response.text();


    console.log(
        "KalMarket AI raw response:",
        text
    );


    if (!text) {

        throw new Error(
            "AI returned an empty response."
        );

    }


    let data;


    try {

        data =
            JSON.parse(text);

    } catch (jsonError) {

        console.error(
            "AI JSON parsing error:",
            jsonError
        );

        throw new Error(
            "AI returned an invalid response."
        );

    }


    console.log(
        "KalMarket AI detected:",
        data
    );


    return data;

}


/* =========================================================
   RUN AI ANALYSIS
========================================================= */

async function runAIAnalysis(file) {

    if (!file) {

        showAIStatus(
            "Please select a photo first.",
            "error"
        );

        return;

    }


    /*
       Prevent duplicate AI requests.
    */

    if (aiAnalysisInProgress) {

        console.log(
            "AI analysis already in progress."
        );

        return;

    }


    const photoKey =
        getPhotoKey(file);


    /*
       Do not analyze the exact same photo twice.
    */

    if (
        photoKey &&
        aiAnalyzedPhotoKey === photoKey
    ) {

        console.log(
            "This photo has already been analyzed."
        );

        return;

    }


    aiAnalysisInProgress = true;


    showAIStatus(
        "🤖 AI is analyzing your photo...",
        "info"
    );


    try {

        console.log(
            "AI analysis started for:",
            file.name
        );


        /*
           Compress the photo for AI if necessary.
        */

        let aiFile =
            lastCompressedPhoto;


        if (
            !aiFile ||
            getPhotoKey(file) !==
                getPhotoKey(lastSelectedPhoto)
        ) {

            aiFile =
                await compressImage(file);

        }


        const aiData =
            await analyzeAdPhotoWithAI(aiFile);


        console.log(
            "AI analysis completed:",
            aiData
        );


        applyAIAdData(aiData);


        aiAnalyzedPhotoKey =
            photoKey;


        showAIStatus(
            "✓ AI analysis complete. Please review the information.",
            "success"
        );


    } catch (error) {

        console.error(
            "AI analysis failed:",
            error
        );


        /*
           Show the actual Firebase error
           in the console and a cleaner message
           to the user.
        */

        let message =
            error?.message ||
            "Unknown AI error.";


        showAIStatus(
            "AI could not analyze this photo. Please check the message below.",
            "error"
        );


        alert(
            "AI PHOTO ANALYSIS FAILED\n\n" +
            message +
            "\n\n" +
            "Open the browser Console (F12) for more details."
        );


    } finally {

        aiAnalysisInProgress = false;

    }

}


/* =========================================================
   APPLY AI DATA TO FORM
========================================================= */

function applyAIAdData(data) {

    console.log(
        "Applying AI data to form:",
        data
    );


    if (!data) return;


    /* =====================================================
       CATEGORY
    ===================================================== */

    if (data.category) {

        const categorySelect =
            document.getElementById(
                "postCategory"
            );


        if (categorySelect) {

            const matchingOption =
                Array.from(
                    categorySelect.options
                ).find(
                    option =>
                        option.value ===
                        data.category
                );


            if (matchingOption) {

                categorySelect.value =
                    data.category;


                if (
                    typeof window.handleCategoryChange ===
                    "function"
                ) {

                    window.handleCategoryChange();

                }

            } else {

                console.warn(
                    "AI category does not match form:",
                    data.category
                );

            }

        }

    }


    /* =====================================================
       TITLE
    ===================================================== */

    if (data.title) {

        const title =
            document.getElementById(
                "adTitle"
            );


        if (
            title &&
            !title.value.trim()
        ) {

            title.value =
                data.title;

        }

    }


    /* =====================================================
       DESCRIPTION
    ===================================================== */

    if (data.description) {

        const description =
            document.getElementById(
                "adDesc"
            );


        if (
            description &&
            !description.value.trim()
        ) {

            description.value =
                data.description;

        }

    }


    /* =====================================================
       CONDITION
    ===================================================== */

    if (data.condition) {

        const conditionValue =
            data.condition
                .trim();


        const condition =
            document.querySelector(
                `input[name="condition"][value="${CSS.escape(conditionValue)}"]`
            );


        if (condition) {

            condition.checked = true;

        } else {

            console.warn(
                "AI condition not found:",
                conditionValue
            );

        }

    }


    /* =====================================================
       VEHICLE MAKE
    ===================================================== */

    if (data.make) {

        const make =
            document.getElementById(
                "carMake"
            );


        if (
            make &&
            !make.value.trim()
        ) {

            make.value =
                data.make;

        }

    }


    /* =====================================================
       VEHICLE MODEL
    ===================================================== */

    if (data.model) {

        const model =
            document.getElementById(
                "carModel"
            );


        if (
            model &&
            !model.value.trim()
        ) {

            model.value =
                data.model;

        }

    }


    /* =====================================================
       VEHICLE YEAR
    ===================================================== */

    if (data.year) {

        const year =
            document.getElementById(
                "carYear"
            );


        if (
            year &&
            !year.value
        ) {

            year.value =
                data.year;

        }

    }


    /* =====================================================
       TRANSMISSION
    ===================================================== */

    if (data.transmission) {

        const transmission =
            document.getElementById(
                "carTransmission"
            );


        if (transmission) {

            const wanted =
                data.transmission
                    .trim()
                    .toLowerCase();


            const option =
                Array.from(
                    transmission.options
                ).find(
                    option =>
                        option.textContent
                            .trim()
                            .toLowerCase() ===
                        wanted
                );


            if (option) {

                transmission.value =
                    option.value;

            }

        }

    }


    /* =====================================================
       FUEL TYPE
    ===================================================== */

    if (data.fuelType) {

        const fuel =
            document.getElementById(
                "carFuel"
            );


        if (fuel) {

            const wanted =
                data.fuelType
                    .trim()
                    .toLowerCase();


            const option =
                Array.from(
                    fuel.options
                ).find(
                    option =>
                        option.textContent
                            .trim()
                            .toLowerCase() ===
                        wanted
                );


            if (option) {

                fuel.value =
                    option.value;

            }

        }

    }


    /*
       Trigger input/change events so that
       other parts of the page notice the
       AI-filled values.
    */

    [
        "postCategory",
        "adTitle",
        "adDesc",
        "carMake",
        "carModel",
        "carYear",
        "carTransmission",
        "carFuel"
    ].forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.dispatchEvent(
                new Event(
                    "change",
                    {
                        bubbles: true
                    }
                )
            );


            element.dispatchEvent(
                new Event(
                    "input",
                    {
                        bubbles: true
                    }
                )
            );

        }

    });

}


/* =========================================================
   PHOTO UPLOAD HANDLER
========================================================= */

window.handlePhotoUpload =
    async function (event) {

        const files =
            Array.from(
                event.target.files || []
            );


        const preview =
            document.getElementById(
                "galleryPreview"
            );


        if (
            !preview ||
            !files.length
        ) {

            return;

        }


        /*
           Remember the first selected photo
           for AI.
        */

        if (!lastSelectedPhoto) {

            lastSelectedPhoto =
                files[0];

        }


        for (
            const file of files
        ) {

            pendingUploads++;


            const imageId =
                `${Date.now()}_${Math.random()
                    .toString(36)
                    .slice(2, 9)}`;


            /* =================================================
               CREATE PREVIEW
            ================================================= */

            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.style.position =
                "relative";

            wrapper.style.display =
                "inline-block";

            wrapper.style.margin =
                "8px";


            const img =
                document.createElement(
                    "img"
                );


            img.src =
                URL.createObjectURL(
                    file
                );


            img.style.width =
                "100px";

            img.style.height =
                "100px";

            img.style.objectFit =
                "cover";

            img.style.borderRadius =
                "8px";

            img.style.border =
                "1px solid #ccc";

            img.style.opacity =
                "0.5";


            const deleteBtn =
                document.createElement(
                    "button"
                );


            deleteBtn.type =
                "button";

            deleteBtn.innerHTML =
                "✕";


            deleteBtn.style.position =
                "absolute";

            deleteBtn.style.top =
                "4px";

            deleteBtn.style.right =
                "4px";

            deleteBtn.style.background =
                "red";

            deleteBtn.style.color =
                "white";

            deleteBtn.style.borderRadius =
                "50%";

            deleteBtn.style.cursor =
                "pointer";


            deleteBtn.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();


                    wrapper.remove();


                    uploadedImages =
                        uploadedImages.filter(
                            img =>
                                img.id !==
                                imageId
                        );


                }
            );


            wrapper.appendChild(img);
            wrapper.appendChild(deleteBtn);

            preview.appendChild(wrapper);


            /* =================================================
               COMPRESS + AI + UPLOAD
            ================================================= */

            try {

                const compressedFile =
                    await compressImage(
                        file
                    );


                /*
                   Remember compressed first photo.
                */

                if (
                    file ===
                    lastSelectedPhoto
                ) {

                    lastCompressedPhoto =
                        compressedFile;

                }


                /* =============================================
                   AI ANALYSIS

                   IMPORTANT:

                   We do NOT use uploadedImages.length
                   anymore.

                   AI is based on whether the checkbox
                   is checked and whether this is the
                   first selected photo.
                ============================================= */

                const useAI =
                    document.getElementById(
                        "useAI"
                    );


                if (
                    useAI &&
                    useAI.checked &&
                    !aiAnalyzedPhotoKey &&
                    file === lastSelectedPhoto
                ) {

                    await runAIAnalysis(
                        file
                    );

                }


                /* =============================================
                   UPLOAD PHOTO
                ============================================= */

                const uniqueName =
                    `ads/${Date.now()}_${Math.random()
                        .toString(36)
                        .slice(2, 8)}.jpg`;


                const fileRef =
                    storageRef(
                        storage,
                        uniqueName
                    );


                console.log(
                    "Uploading image:",
                    uniqueName
                );


                const snapshot =
                    await uploadBytes(
                        fileRef,
                        compressedFile,
                        {
                            contentType:
                                "image/jpeg"
                        }
                    );


                const url =
                    await getDownloadURL(
                        snapshot.ref
                    );


                uploadedImages.push({

                    id:
                        imageId,

                    url:
                        url

                });


                pendingUploads--;


                img.style.opacity =
                    "1";


                console.log(
                    "Image uploaded successfully:",
                    url
                );


            } catch (error) {

                console.error(
                    "Image upload failed:",
                    error
                );


                wrapper.remove();


                pendingUploads--;


                alert(
                    "Image failed:\n\n" +
                    (
                        error.message ||
                        "Unknown upload error."
                    )
                );

            }

        }


        /*
           Allow selecting the same image again.
        */

        event.target.value = "";

    };


/* =========================================================
   CATEGORY HANDLER
========================================================= */

window.handleCategoryChange =
    function () {

        const categorySelect =
            document.getElementById(
                "postCategory"
            );


        if (!categorySelect)
            return;


        const selectedValue =
            categorySelect.value.trim();


        document
            .querySelectorAll(
                ".category-details"
            )
            .forEach(section => {

                section.style.display =
                    "none";

            });


        const commonFields =
            document.getElementById(
                "commonFields"
            );


        if (commonFields)
            commonFields.style.display =
                "block";


        const categoryMap = {

            "Real Estate":
                "section-RealEstate",

            "Cars & Trucks":
                "section-Cars",

            "Electronics":
                "section-Electronics",

            "Auto Accessories":
                "section-Auto Accessories",

            "Furniture":
                "section-Furniture",

            "Jobs":
                "section-Jobs",

            "Fashion":
                "section-Fashion",

            "Pets":
                "section-Pets",

            "Sports":
                "section-Sports",

            "Books":
                "section-Books",

            "Appliances":
                "section-Appliances",

            "Toys":
                "section-Toys",

            "Services":
                "section-Services",

            "Garden":
                "section-Garden",

            "Health":
                "section-Health",

            "Baby":
                "section-Baby",

            "Buy&Sale":
                "section-Buy & Sale"

        };


        const targetSectionId =
            categoryMap[selectedValue];


        if (targetSectionId) {

            const targetSection =
                document.getElementById(
                    targetSectionId
                );


            if (targetSection) {

                targetSection.style.display =
                    "block";

            } else {

                console.warn(
                    "Missing section:",
                    targetSectionId
                );

            }

        }


        const conditionBox =
            document.getElementById(
                "conditionFields"
            );


        const hideConditionFor = [
            "Pets",
            "Jobs",
            "Real Estate",
            "Services"
        ];


        if (conditionBox) {

            conditionBox.style.display =
                hideConditionFor.includes(
                    selectedValue
                )
                    ? "none"
                    : "block";

        }

    };


/* =========================================================
   SAVE AD ENTRY POINT
========================================================= */

async function saveNewAd(event) {

    event.preventDefault();


    const user =
        auth.currentUser;


    if (!user) {

        alert(
            "Login required"
        );

        return;

    }


    if (pendingUploads > 0) {

        alert(
            "Please wait for photos to finish uploading..."
        );

        return;

    }


    /*
       If AI is still running, do not allow
       posting yet.
    */

    if (aiAnalysisInProgress) {

        alert(
            "Please wait for AI to finish analyzing the photo."
        );

        return;

    }


    const btn =
        document.getElementById(
            "postBtn"
        );


    if (btn) {

        btn.disabled = true;
        btn.innerText = "Posting...";

    }


    await finalizeAd();

}


/* =========================================================
   FINALIZE & FIRESTORE SAVE
========================================================= */

async function finalizeAd() {

    const user =
        auth.currentUser;


    if (!user) {

        alert(
            "Login required"
        );

        return;

    }


    const title =
        document
            .getElementById("adTitle")
            ?.value
            .trim();


    const currency =
        document.getElementById(
            "currency"
        )?.value ||
        "USD";


    if (!title) {

        alert(
            "Title is required"
        );


        const btn =
            document.getElementById(
                "postBtn"
            );


        if (btn) {

            btn.disabled =
                false;

            btn.innerText =
                "Post Ad";

        }


        return;

    }


    /* =====================================================
       FEATURED AD
    ===================================================== */

    const featuredDays =
        parseInt(
            localStorage.getItem(
                "featuredDays"
            )
        ) || 0;


    let featuredUntil =
        null;


    if (featuredDays > 0) {

        const date =
            new Date();


        date.setDate(
            date.getDate() +
            featuredDays
        );


        featuredUntil =
            Timestamp.fromDate(
                date
            );

    }


    /* =====================================================
       CONDITION
    ===================================================== */

    let selectedCondition =
        "N/A";


    try {

        const checkedRadio =
            document.querySelector(
                'input[name="condition"]:checked'
            );


        if (checkedRadio) {

            selectedCondition =
                checkedRadio.value;

        }

    } catch (radioError) {

        console.warn(
            "Could not read condition radio buttons:",
            radioError
        );

    }


    /* =====================================================
       IMAGES
    ===================================================== */

    let finalImages =
        [
            "https://placeholder.com"
        ];


    try {

        if (
            Array.isArray(
                uploadedImages
            ) &&
            uploadedImages.length > 0
        ) {

            finalImages =
                uploadedImages.map(
                    img =>
                        img
                            ? (
                                img.url ||
                                img
                            )
                            : "https://placeholder.com"
                );

        }

    } catch (imageError) {

        console.warn(
            "Uploaded images array error:",
            imageError
        );

    }


    /* =====================================================
       NEW AD
    ===================================================== */

    const newAd = {

        userId:
            user.uid,

        userEmail:
            user.email || "",


        category:
            document.getElementById(
                "postCategory"
            )?.value ||
            "Uncategorized",


        title:
            title,


        featured:
            featuredDays > 0,


        featuredDays:
            featuredDays,


        featuredUntil:
            featuredUntil,


        views:
            0,


        status:
            "active",


        location:
            document.getElementById(
                "adLocation"
            )?.value ||
            "",


        price:
            document.getElementById(
                "adPrice"
            )?.value ||
            "",


        currency:
            currency,


        description:
            document.getElementById(
                "adDesc"
            )?.value ||
            "",


        condition:
            selectedCondition,


        image:
            finalImages,


        createdAt:
            serverTimestamp(),


        updatedAt:
            serverTimestamp(),


        lat:
            window.currentAdLat ||
            null,


        lng:
            window.currentAdLng ||
            null

    };


    /* =====================================================
       SAVE FIRESTORE
    ===================================================== */

    try {

        const docRef =
            await addDoc(
                collection(
                    db,
                    "marketplace_ads"
                ),
                newAd
            );


        alert(
            "Ad saved successfully!\n\nID: " +
            docRef.id
        );


        /* =================================================
           CREATE NOTIFICATION
        ================================================= */

        const isArabic =
            localStorage.getItem(
                "language"
            ) === "ar";


        await addDoc(
            collection(
                db,
                "notifications"
            ),
            {

                userId:
                    user.uid,

                message:
                    isArabic
                        ? "تم نشر إعلانك بنجاح"
                        : "Your ad was posted successfully",

                createdAt:
                    serverTimestamp(),

                read:
                    false

            }
        );


        /* =================================================
           RESET
        ================================================= */

        uploadedImages =
            [];


        lastSelectedPhoto =
            null;


        lastCompressedPhoto =
            null;


        aiAnalyzedPhotoKey =
            null;


        localStorage.removeItem(
            "featuredAdPaid"
        );


        localStorage.removeItem(
            "featuredDays"
        );


        /* =================================================
           GO HOME
        ================================================= */

        window.location.href =
            "index.html";


    } catch (err) {

        console.error(
            "Firestore submission failed:",
            err
        );


        alert(
            "FIREBASE ERROR\n\n" +
            "Code: " +
            (
                err.code ||
                "Unknown"
            ) +
            "\n\nMessage:\n" +
            (
                err.message ||
                "No message"
            )
        );


        const btn =
            document.getElementById(
                "postBtn"
            );


        if (btn) {

            btn.disabled =
                false;

            btn.innerText =
                "Post Ad";

        }

    }

}


/* =========================================================
   PAGE INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /* =================================================
           COUNTRY / CURRENCY
        ================================================= */

        const country =
            await getUserCountry();


        const currencySelect =
            document.getElementById(
                "currency"
            );


        const countryCurrencyMap = {

            /* North America */

            "United States":
                { code: "USD" },

            "Canada":
                { code: "CAD" },

            "Mexico":
                { code: "MXN" },


            /* Europe */

            "United Kingdom":
                { code: "GBP" },

            "Germany":
                { code: "EUR" },

            "France":
                { code: "EUR" },

            "Italy":
                { code: "EUR" },

            "Spain":
                { code: "EUR" },

            "Netherlands":
                { code: "EUR" },

            "Belgium":
                { code: "EUR" },

            "Switzerland":
                { code: "CHF" },

            "Sweden":
                { code: "SEK" },

            "Norway":
                { code: "NOK" },

            "Denmark":
                { code: "DKK" },

            "Poland":
                { code: "PLN" },


            /* Middle East */

            "Saudi Arabia":
                { code: "SAR" },

            "United Arab Emirates":
                { code: "AED" },

            "Qatar":
                { code: "QAR" },

            "Kuwait":
                { code: "KWD" },

            "Bahrain":
                { code: "BHD" },

            "Oman":
                { code: "OMR" },

            "Iraq":
                { code: "IQD" },

            "Jordan":
                { code: "JOD" },

            "Lebanon":
                { code: "LBP" },

            "Egypt":
                { code: "EGP" },

            "Morocco":
                { code: "MAD" },

            "Tunisia":
                { code: "TND" },

            "Algeria":
                { code: "DZD" },


            /* Asia */

            "India":
                { code: "INR" },

            "Pakistan":
                { code: "PKR" },

            "Bangladesh":
                { code: "BDT" },

            "Sri Lanka":
                { code: "LKR" },

            "China":
                { code: "CNY" },

            "Japan":
                { code: "JPY" },

            "South Korea":
                { code: "KRW" },

            "Philippines":
                { code: "PHP" },

            "Indonesia":
                { code: "IDR" },

            "Malaysia":
                { code: "MYR" },

            "Singapore":
                { code: "SGD" },

            "Thailand":
                { code: "THB" },

            "Vietnam":
                { code: "VND" },


            /* Africa */

            "Nigeria":
                { code: "NGN" },

            "Ghana":
                { code: "GHS" },

            "Kenya":
                { code: "KES" },

            "South Africa":
                { code: "ZAR" },

            "Ethiopia":
                { code: "ETB" },

            "Tanzania":
                { code: "TZS" },


            /* South America */

            "Brazil":
                { code: "BRL" },

            "Argentina":
                { code: "ARS" },

            "Chile":
                { code: "CLP" },

            "Colombia":
                { code: "COP" },

            "Peru":
                { code: "PEN" },


            /* Oceania */

            "Australia":
                { code: "AUD" },

            "New Zealand":
                { code: "NZD" }

        };


        if (
            currencySelect &&
            country &&
            countryCurrencyMap[country]
        ) {

            const currencyCode =
                countryCurrencyMap[
                    country
                ].code;


            const optionExists =
                Array.from(
                    currencySelect.options
                ).some(
                    option =>
                        option.value ===
                        currencyCode
                );


            if (!optionExists) {

                const newOption =
                    document.createElement(
                        "option"
                    );


                newOption.value =
                    currencyCode;


                newOption.textContent =
                    currencyCode;


                currencySelect.appendChild(
                    newOption
                );

            }


            currencySelect.value =
                currencyCode;


            console.log(
                "Auto currency set:",
                currencyCode
            );

        }


        /* =================================================
           CATEGORY
        ================================================= */

        const postCategory =
            document.getElementById(
                "postCategory"
            );


        if (postCategory) {

            postCategory.addEventListener(
                "change",
                window.handleCategoryChange
            );


            window.handleCategoryChange();

        }


        /* =================================================
           PHOTO INPUT
        ================================================= */

        const photoInput =
            document.getElementById(
                "photoInput"
            );


        if (photoInput) {

            photoInput.addEventListener(
                "change",
                window.handlePhotoUpload
            );

        }


        /* =================================================
           AI CHECKBOX
        ================================================= */

      /* =========================
   AI LISTING OPTION
   TEMPORARILY DISABLED
========================= */

const useAICheckbox = document.getElementById("useAI");

if (useAICheckbox) {

    // AI temporarily disabled until billing is enabled
    useAICheckbox.checked = false;
    useAICheckbox.disabled = true;

    console.log(
        "KalMarket AI listing assistance is temporarily disabled."
    );
}
                        /*
                           IMPORTANT FIX:

                           If a photo was already selected
                           before the user checked AI,
                           analyze it now.
                        */

                        const input =
                            document.getElementById(
                                "photoInput"
                            );


                        const selectedFile =
                            input?.files?.[0] ||
                            lastSelectedPhoto;


                        if (selectedFile) {

                            await runAIAnalysis(
                                selectedFile
                            );

                        } else {

                            showAIStatus(
                                "✓ AI enabled. Select a photo to analyze it.",
                                "info"
                            );

                        }

                    } else {

                        console.log(
                            "KalMarket AI listing assistance disabled."
                        );


                        showAIStatus(
                            "AI listing assistance is disabled.",
                            "info"
                        );

                    }

                }
            );

        }


        /* =================================================
           POST FORM
        ================================================= */

        const postForm =
            document.getElementById(
                "postForm"
            );


        if (postForm) {

            postForm.addEventListener(
                "submit",
                saveNewAd
            );

        }


        /* =================================================
           PAYPAL
           
           EXISTING PAYPAL LOGIC PRESERVED
        ================================================= */

        const featureOptions =
            document.querySelectorAll(
                'input[name="feature_selection"]'
            );


        const paypalContainer =
            document.getElementById(
                "paypal-button-container"
            );


        featureOptions.forEach(
            option => {

                option.addEventListener(
                    "change",
                    () => {

                        if (!paypalContainer)
                            return;


                        if (
                            option.value ===
                            "5days"
                        ) {

                            paypalContainer.style.display =
                                "block";


                            initPayPal(
                                "4.99",
                                5
                            );


                        } else if (
                            option.value ===
                            "10days"
                        ) {

                            paypalContainer.style.display =
                                "block";


                            initPayPal(
                                "8.99",
                                10
                            );


                        } else {

                            paypalContainer.style.display =
                                "none";


                            paypalContainer.innerHTML =
                                "";


                            localStorage.removeItem(
                                "featuredAdPaid"
                            );


                            localStorage.removeItem(
                                "featuredDays"
                            );

                        }

                    }
                );

            }
        );

    }
);


/* =========================================================
   PAYPAL INIT
   DO NOT CHANGE
========================================================= */

function initPayPal(price, days) {

    const paypalContainer =
        document.getElementById(
            "paypal-button-container"
        );


    if (!paypalContainer) {

        console.error(
            "PayPal container not found"
        );

        return;

    }


    // Clear old button

    paypalContainer.innerHTML =
        "";


    // Check PayPal SDK

    if (
        typeof paypal ===
        "undefined"
    ) {

        console.error(
            "PayPal SDK not loaded"
        );


        alert(
            "Payment system is not ready. Please refresh the page."
        );


        return;

    }


    paypal.Buttons({

        style: {

            layout:
                "vertical",

            color:
                "gold",

            shape:
                "rect",

            label:
                "paypal"

        },


        createOrder:
            function (
                data,
                actions
            ) {

                return actions.order.create({

                    purchase_units: [

                        {

                            description:
                                `KalMarket Featured Ad - ${days} Days`,

                            amount: {

                                currency_code:
                                    "CAD",

                                value:
                                    price

                            }

                        }

                    ]

                });

            },


        onApprove:
            function (
                data,
                actions
            ) {

                return actions.order
                    .capture()
                    .then(
                        function (
                            details
                        ) {

                            console.log(
                                "Payment completed:",
                                details
                            );


                            alert(
                                `Payment successful! Your ad is featured for ${days} days.`
                            );


                            // Save payment status

                            localStorage.setItem(
                                "featuredAdPaid",
                                "true"
                            );


                            localStorage.setItem(
                                "featuredDays",
                                days
                            );


                            localStorage.setItem(
                                "paypalOrderID",
                                data.orderID
                            );


                            // Continue posting ad
                            // You can call your submit function here later

                        }
                    );

            },


        onCancel:
            function () {

                alert(
                    "Payment cancelled. Your ad was not featured."
                );


                localStorage.removeItem(
                    "featuredAdPaid"
                );

            },


        onError:
            function (err) {

                console.error(
                    "PayPal Error:",
                    err
                );


                alert(
                    "Payment failed. Please try again."
                );

            }

    }).render(
        "#paypal-button-container"
    );

}
  
