/* =========================================
   AGI – ULTRA PRO ENGINE v15 🚀
========================================= */

const AGI = {
    premium:false,
    premiumCode:"INDIA49",
    docPrefix:"IND-AFF-",
    premiumDays:30,
    domain:location.origin
};

/* =========================================
   SMART TEMPLATES
========================================= */

const affidavitTemplates = {

    "Name Change":[
        "I hereby declare that I have changed my name for official purposes.",
        "My old and new names belong to the same person.",
        "All future records may use my updated name."
    ],

    "Address Proof":[
        "I currently reside at the mentioned address.",
        "This affidavit is submitted as address proof.",
        "The information provided is true."
    ],

    "Birth Affidavit":[
        "This affidavit confirms birth details.",
        "All information is true and correct."
    ],

    "Income Proof":[
        "This affidavit declares income information.",
        "The stated information is accurate."
    ],

    "Marriage Affidavit":[
        "We are legally married.",
        "Marriage was conducted willingly.",
        "This affidavit is submitted as proof of marriage."
    ],

    "Single Status":[
        "I am currently unmarried.",
        "This declaration is true."
    ],

    "Nationality":[
        "I am a citizen of India.",
        "This affidavit is submitted for nationality verification."
    ],

    "Gap Certificate":[
        "There was an educational gap due to personal reasons.",
        "The gap period was lawful and genuine."
    ],

    "Property Declaration":[
        "The mentioned property belongs to me.",
        "This declaration is legally valid."
    ],

    "Bank Verification":[
        "This affidavit is submitted for bank verification.",
        "The information matches official records."
    ],

    "Lost Document":[
        "I have lost my original document.",
        "Despite careful search it could not be found.",
        "If found I will surrender it immediately."
    ],

    "Vehicle Ownership":[
        "The mentioned vehicle belongs to me.",
        "This affidavit confirms ownership declaration."
    ],

    "Custom Purpose":[
        "This affidavit is submitted for official purposes.",
        "All information provided is true."
    ]

};

/* =========================================
   SAFE GET
========================================= */

function getVal(id){

    let el =
    document.getElementById(id);

    if(!el) return "";

    return String(
        el.value || ""
    ).trim();

}

/* =========================================
   INIT
========================================= */

(function initAGI(){

    try{

        let p =
        localStorage.getItem(
            "agiPremium"
        );

        let exp =
        parseInt(
            localStorage.getItem(
                "agiExpiry"
            ) || "0"
        );

        AGI.premium =
        (
            p === "true" &&
            exp &&
            Date.now() < exp
        );

    }catch(err){

        console.log(err);

    }

    restoreDraft();
    updateUI();
    loadHistory();

    /* DARK MODE */

    if(
        localStorage.getItem(
            "agiDarkMode"
        ) === "true"
    ){

        document.body.classList.add(
            "dark-mode"
        );

    }

})();

/* =========================================
   PREMIUM
========================================= */

function unlockPremium(){

    window.open(
        "https://yourwebsite.com/premium",
        "_blank"
    );

}

function activatePremiumManually(){

    let code =
    prompt("Enter Premium Code:");

    if(!code) return;

    code = code.trim();

    if(code === AGI.premiumCode){

        let expiry =
        Date.now() +
        (AGI.premiumDays * 86400000);

        localStorage.setItem(
            "agiPremium",
            "true"
        );

        localStorage.setItem(
            "agiExpiry",
            expiry
        );

        AGI.premium = true;

        updateUI();

        alert(
            "Premium Activated ✔"
        );

    }else{

        alert(
            "Invalid Code ❌"
        );

    }

}

/* =========================================
   UI
========================================= */

function updateUI(){

    let badge =
    document.getElementById(
        "premiumStatus"
    );

    if(!badge) return;

    badge.innerHTML =
    AGI.premium
    ?
    "🟢 Premium Active"
    :
    "🔴 Free Version";

}

/* =========================================
   DARK MODE
========================================= */

function toggleDarkMode(){

    document.body.classList.toggle(
        "dark-mode"
    );

    localStorage.setItem(
        "agiDarkMode",
        document.body.classList.contains(
            "dark-mode"
        )
    );

}

/* =========================================
   AUTO SAVE
========================================= */

const fieldIDs = [

    "lang",
    "name",
    "father",
    "age",
    "address",
    "details",
    "place",
    "date",
    "purposeType"

];

function restoreDraft(){

    fieldIDs.forEach(id=>{

        let el =
        document.getElementById(id);

        if(!el) return;

        let val =
        localStorage.getItem(
            "agi_" + id
        );

        if(val){

            el.value = val;

        }

        el.addEventListener(
            "input",
            ()=>{

                localStorage.setItem(
                    "agi_" + id,
                    el.value
                );

            }

        );

    });

}

/* =========================================
   DOC ID
========================================= */

function generateDocID(){

    let d =
    new Date()
    .toISOString()
    .slice(0,10)
    .replace(/-/g,"");

    let r =
    Math.random()
    .toString(36)
    .substring(2,7)
    .toUpperCase();

    return `${AGI.docPrefix}${d}-${r}`;

}

/* =========================================
   HISTORY
========================================= */

function saveDoc(docID,data){

    localStorage.setItem(
        "doc_" + docID,
        JSON.stringify(data)
    );

    let history =
    JSON.parse(
        localStorage.getItem(
            "agiHistory"
        ) || "[]"
    );

    history.unshift({

        id:docID,
        name:data.name,
        date:data.date

    });

    if(!AGI.premium){

        history =
        history.slice(0,10);

    }

    localStorage.setItem(
        "agiHistory",
        JSON.stringify(history)
    );

}

function loadHistory(){

    let box =
    document.getElementById(
        "history"
    );

    if(!box) return;

    let history =
    JSON.parse(
        localStorage.getItem(
            "agiHistory"
        ) || "[]"
    );

    if(history.length===0){

        box.innerHTML =
        "No documents yet.";

        return;

    }

    let html = "";

    history.forEach(item=>{

        html += `

        <div class="history-item">

            <b>${item.name}</b><br>

            ${item.date}<br>

            <small>${item.id}</small>

        </div>

        `;

    });

    box.innerHTML = html;

}

/* =========================================
   VALIDATION
========================================= */

function validateRequired(data){

    let required = [

        "name",
        "father",
        "age",
        "address",
        "place",
        "date"

    ];

    for(let key of required){

        if(!data[key]){

            alert(
                "Fill all required fields ❗"
            );

            return false;

        }

    }

    return true;

}

/* =========================================
   AI DRAFT
========================================= */

function aiDraft(){

    if(!AGI.premium){

        alert(
            "AI Draft is Premium 🔒"
        );

        return;

    }

    let purpose =
    getVal("purposeType");

    let detailsBox =
    document.getElementById(
        "details"
    );

    const aiMap = {

        "Name Change":
        "This affidavit is submitted for official name correction purposes.",

        "Lost Document":
        "The original document has been lost despite careful search.",

        "Marriage Affidavit":
        "This affidavit confirms legal marital status."

    };

    detailsBox.value =
    aiMap[purpose]
    ||
    "Professional affidavit declaration.";

}

/* =========================================
   MAIN GENERATOR
========================================= */

function generateAffidavit(){

    let preview =
    document.getElementById(
        "previewArea"
    );

    if(!preview){

        alert(
            "Preview area missing ❌"
        );

        return;

    }

    let data = {

        lang:getVal("lang"),

        name:getVal("name"),

        father:getVal("father"),

        age:getVal("age"),

        address:getVal("address"),

        details:getVal("details"),

        purposeType:getVal("purposeType"),

        place:getVal("place"),

        date:getVal("date"),

        stamp:"10"

    };

    if(!validateRequired(data)){
        return;
    }

    let docID =
    generateDocID();

    /* TEMPLATE */

    let templateLines =
    affidavitTemplates[data.purposeType]
    ||
    affidavitTemplates["Custom Purpose"];

    let templateHTML = "";

    templateLines.forEach(line=>{

        templateHTML += `
        <li>${line}</li>
        `;

    });

    if(data.details){

        templateHTML += `
        <li>${data.details}</li>
        `;

    }

    /* SIGNATURE */

    let signatureInput =
    document.getElementById(
        "signatureUpload"
    );

    let signatureURL = "";

    if(
        signatureInput &&
        signatureInput.files[0]
    ){

        signatureURL =
        URL.createObjectURL(
            signatureInput.files[0]
        );

    }

    /* BUILD */

    let html = `

    <div class="stamp">
        ₹${data.stamp}
    </div>

    <div style="
        position:absolute;
        top:20px;
        left:20px;
        font-size:12px;
        color:#6b7280;
    ">
        ${docID}
    </div>

    <div class="doc-title">
        AFFIDAVIT
    </div>

    <div class="doc-sub">
        BEFORE THE NOTARY PUBLIC
    </div>

    <div class="doc-content">

        <p>

        I,
        <b>${data.name}</b>,

        S/o
        <b>${data.father}</b>,

        aged about
        <b>${data.age}</b>
        years,

        resident of
        <b>${data.address}</b>.

        </p>

        <ol>

            ${templateHTML}

        </ol>

        <br>

        <p>
        Place:
        <b>${data.place}</b>
        </p>

        <p>
        Date:
        <b>${data.date}</b>
        </p>

        ${
            signatureURL
            ?
            `
            <div style="margin-top:30px;">
            <img
            src="${signatureURL}"
            style="height:80px;">
            </div>
            `
            :
            ""
        }

        <div class="signatures">

            <div class="sign">
                <div class="sign-line">
                DEPONENT
                </div>
            </div>

            <div class="sign">
                <div class="sign-line">
                NOTARY PUBLIC
                </div>
            </div>

        </div>

        <div style="
            margin-top:40px;
            text-align:center;
            font-size:12px;
            color:#6b7280;
        ">

            ${
                !AGI.premium
                ?
                "Generated by AGI Legal Suite"
                :
                ""
            }

        </div>

    </div>

    `;

    preview.innerHTML = html;

    saveDoc(docID,data);

    loadHistory();

    alert(
        "Affidavit Generated ✔"
    );

}

/* =========================================
   QR CODE
========================================= */

function generateQRCode(){

    if(!AGI.premium){

        alert(
            "QR Verification is Premium 🔒"
        );

        return;

    }

    let qrBox =
    document.getElementById(
        "qrBox"
    );

    qrBox.innerHTML = "";

    new QRCode(qrBox,{

        text:
        document.getElementById(
            "previewArea"
        ).innerText,

        width:180,
        height:180

    });

}

/* =========================================
   WHATSAPP
========================================= */

function shareWhatsApp(){

    let text =
    document.getElementById(
        "previewArea"
    ).innerText;

    let url =
    `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(
        url,
        "_blank"
    );

}

/* =========================================
   PDF
========================================= */

function downloadPDF(){

    if(
        document.getElementById(
            "previewArea"
        ).innerText.includes(
            "preview will appear here"
        )
    ){

        alert(
            "Generate affidavit first ❗"
        );

        return;

    }

    window.print();

}
