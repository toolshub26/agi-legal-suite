/* =========================================
   AGI – ULTRA PRO ENGINE v11 🚀
   FINAL STABLE BUILD
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

        let p =
        localStorage.getItem("agiPremium");

        let exp =
        parseInt(
            localStorage.getItem("agiExpiry")
            || "0"
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

})();

/* =========================================
   PREMIUM
========================================= */

function unlockPremium(){

    /* CHANGE THIS URL */

    let paymentURL =
    "https://yourwebsite.com/premium";

    window.open(
        paymentURL,
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

    if(AGI.premium){

        badge.innerHTML =
        "🟢 Premium Active";
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
    document.getElementById(
        "history"
    );

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

    /* REQUIRED CHECK */

    if(!validateRequired(data)){
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
            font-size:42px;
        ">
            AFFIDAVIT
        </h1>

        <p style="
            text-align:center;
            margin-bottom:40px;
            letter-spacing:2px;
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

            <ol>

                <li>
                This affidavit is submitted for
                <b>${data.purposeType}</b>.
                </li>

                ${
                    data.details
                    ?
                    `
                    <li>
                    ${data.details}
                    </li>
                    `
                    :
                    ""
                }

                <li>
                The above information is true
                and correct.
                </li>

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

            <br><br>

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

    /* RENDER FIX */

    preview.innerHTML = "";

    setTimeout(()=>{

        preview.innerHTML = html;

    },100);

    /* SAVE */

    saveDoc(docID,data);

    loadHistory();

    alert(
        "Affidavit Generated ✔"
    );

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
