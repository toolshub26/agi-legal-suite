/* =========================================
   AGI – ULTRA PRO ENGINE v10 🚀
   Stable + Mobile Fix + PDF Fix + Final
========================================= */

const AGI = {
    premium:false,
    premiumCode:"INDIA49",
    docPrefix:"IND-AFF-",
    premiumDays:30,
    domain:location.origin
};

/* =========================================
   SAFE GET
========================================= */

function getVal(id){

    let el = document.getElementById(id);

    if(!el) return "";

    return String(el.value || "").trim();
}

/* =========================================
   INIT
========================================= */

(function initAGI(){

    try{

        let p = localStorage.getItem("agiPremium");
        let exp = parseInt(
            localStorage.getItem("agiExpiry") || "0"
        );

        AGI.premium = (
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

})();

/* =========================================
   PREMIUM
========================================= */

function unlockPremium(){

    /* CHANGE THIS LINK */
    let paymentURL =
    "https://yourwebsite.com/premium";

    window.open(paymentURL,"_blank");

}

function activatePremiumManually(){

    let code = prompt(
        "Enter Premium Code:"
    );

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

        alert("Premium Activated ✔");

    }else{

        alert("Invalid Code ❌");

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

    if(AGI.premium){

        badge.innerHTML =
        "🟢 Premium Active";

    }else{

        badge.innerHTML =
        "🔴 Free Version";

    }

}

/* =========================================
   AUTO SAVE
========================================= */

const fieldIDs = [
    "lang",
    "template",
    "gender",
    "name",
    "father",
    "age",
    "address",
    "purpose",
    "state",
    "stamp",
    "place",
    "date"
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
   QR
========================================= */

function generateQR(docID){

    if(!AGI.premium) return;

    if(typeof QRCode === "undefined"){
        console.warn("QR library missing");
        return;
    }

    let box =
    document.getElementById(
        "qrCodeContainer"
    );

    if(!box) return;

    box.innerHTML = "";

    new QRCode(box,{
        text:
        `${AGI.domain}/verify.html?id=${docID}`,
        width:110,
        height:110
    });

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
        localStorage.getItem("agiHistory")
        || "[]"
    );

    history.unshift({
        id:docID,
        name:data.name,
        date:data.date
    });

    history = history.slice(0,10);

    localStorage.setItem(
        "agiHistory",
        JSON.stringify(history)
    );

}

function loadHistory(){

    let box =
    document.getElementById("history");

    if(!box) return;

    let history =
    JSON.parse(
        localStorage.getItem("agiHistory")
        || "[]"
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
            ${item.id}
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
        "purpose",
        "place",
        "date"
    ];

    for(let key of required){

        if(
            !data[key] ||
            String(data[key]).trim()===""
        ){

            alert(
                "Fill all required fields ❗"
            );

            return false;
        }

    }

    return true;
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
        alert("Preview area missing");
        return;
    }

    let data = {

        lang:getVal("lang"),
        template:getVal("template") || "general",
        gender:getVal("gender"),
        name:getVal("name"),
        father:getVal("father"),
        age:getVal("age"),
        address:getVal("address"),
        purpose:getVal("purpose"),
        state:getVal("state"),
        stamp:getVal("stamp") || "10",
        place:getVal("place"),
        date:getVal("date")

    };

    /* VALIDATION */

    if(!validateRequired(data)){
        return;
    }

    /* FREE TEMPLATE BLOCK */

    if(
        !AGI.premium &&
        data.template !== "general"
    ){

        alert(
            "Premium Template ❌"
        );

        return;
    }

    let docID =
    generateDocID();

    /* BUILD HTML */

    let html = `
    <div style="
        border:2px solid #d1d5db;
        padding:50px;
        min-height:1000px;
        position:relative;
        background:white;
        font-family:Arial;
    ">

        <div style="
            position:absolute;
            top:25px;
            right:25px;
            width:90px;
            height:90px;
            border:3px solid #dc2626;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#dc2626;
            font-weight:bold;
            transform:rotate(-15deg);
        ">
            ₹${data.stamp}
        </div>

        <h1 style="
            text-align:center;
            margin-top:40px;
            letter-spacing:3px;
        ">
            AFFIDAVIT
        </h1>

        <p style="
            text-align:center;
            margin-bottom:40px;
        ">
            BEFORE THE NOTARY PUBLIC
        </p>

        ${
            !AGI.premium
            ?
            `
            <div style="
                color:red;
                font-weight:bold;
                margin-bottom:20px;
            ">
                FREE VERSION
            </div>
            `
            :
            ""
        }

        <div style="
            line-height:2;
            font-size:18px;
        ">

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

            <p>
            This affidavit is submitted for:
            <b>${data.purpose}</b>.
            </p>

            <p>
            The statements above are true
            and correct to the best of my knowledge.
            </p>

            <br><br>

            <p>
            Place:
            <b>${data.place}</b>
            </p>

            <p>
            Date:
            <b>${data.date}</b>
            </p>

            ${
                AGI.premium
                ?
                `
                <br>

                <p>
                <b>ID:</b> ${docID}
                </p>

                <div id="qrCodeContainer"></div>

                <br>

                <button
                onclick="copyID('${docID}')"
                style="
                    padding:10px 18px;
                    border:none;
                    background:black;
                    color:white;
                    border-radius:8px;
                    cursor:pointer;
                ">
                    Copy ID
                </button>
                `
                :
                ""
            }

            <div style="
                margin-top:120px;
                display:flex;
                justify-content:space-between;
            ">

                <div>
                    ___________________<br>
                    DEPONENT
                </div>

                <div>
                    ___________________<br>
                    NOTARY PUBLIC
                </div>

            </div>

        </div>

    </div>
    `;

    preview.innerHTML = html;

    /* QR FIX */

    if(AGI.premium){

        setTimeout(()=>{
            generateQR(docID);
        },300);

    }

    saveDoc(docID,data);

    loadHistory();

    /* SUCCESS */

    alert("Affidavit Generated ✔");

}

/* =========================================
   COPY ID
========================================= */

function copyID(id){

    navigator.clipboard.writeText(id);

    alert("Copied ✔");

}

/* =========================================
   PDF / PRINT FIX
========================================= */

function downloadPDF(){

    let area =
    document.getElementById(
        "previewArea"
    );

    if(
        !area ||
        area.innerHTML.includes(
            "Your professional affidavit preview"
        )
    ){

        alert(
            "Generate affidavit first ❗"
        );

        return;
    }

    let printWindow =
    window.open(
        "",
        "_blank",
        "width=1000,height=900"
    );

    if(!printWindow){

        alert(
            "Popup blocked ❌"
        );

        return;
    }

    printWindow.document.write(`

    <html>

    <head>

    <title>Affidavit PDF</title>

    <style>

    body{
        margin:0;
        padding:25px;
        background:white;
        font-family:Arial;
    }

    button{
        display:none;
    }

    @media print{

        body{
            margin:0;
            padding:0;
        }

    }

    </style>

    </head>

    <body>

    ${area.innerHTML}

    <script>

    window.onload=function(){

        setTimeout(function(){

            window.print();

        },500);

    }

    <\/script>

    </body>

    </html>

    `);

    printWindow.document.close();

}
