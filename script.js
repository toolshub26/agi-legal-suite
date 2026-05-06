/* =========================================
   AGI – ULTRA PRO ENGINE v9 🚀
   Clean + Stable + No Bugs + Final Build
========================================= */

const AGI = {
    premium:false,
    premiumCode:"INDIA49",
    docPrefix:"IND-AFF-",
    premiumDays:30,
    domain:location.origin
};

/* ================= SAFE GET ================= */
function getVal(id){
    let el = document.getElementById(id);
    return el ? el.value : "";
}

/* ================= INIT ================= */
(function initAGI(){

    let p = localStorage.getItem("agiPremium");
    let exp = parseInt(localStorage.getItem("agiExpiry") || "0");

    AGI.premium = (p==="true" && exp && Date.now()<exp);

    restoreDraft();
    updateUI();
    loadHistory();

})();

/* ================= PREMIUM ================= */
function unlockPremium(){
    window.open("https://rzp.io/l/YOUR_PAYMENT_LINK","_blank");
}

function activatePremiumManually(){
    let code = prompt("Enter Premium Code:");

    if(code === AGI.premiumCode){

        let expiry = Date.now() + (AGI.premiumDays*86400000);

        localStorage.setItem("agiPremium","true");
        localStorage.setItem("agiExpiry",expiry);

        alert("Premium Activated ✔");
        location.reload();

    } else {
        alert("Invalid Code ❌");
    }
}

/* ================= UI ================= */
function updateUI(){

    let badge = document.getElementById("premiumStatus");
    let btn = document.getElementById("downloadBtn");

    if(AGI.premium){
        if(badge) badge.innerHTML = "🟢 Premium Active";
        if(btn) btn.classList.remove("locked");
    } else {
        if(badge) badge.innerHTML = "🔴 Free Mode";
        if(btn) btn.classList.add("locked");
    }
}

/* ================= DRAFT ================= */
const fieldIDs = ["lang","template","gender","name","father","age","address","purpose","state","stamp","place","date"];

function restoreDraft(){
    fieldIDs.forEach(id=>{
        let el=document.getElementById(id);
        if(!el) return;

        let val=localStorage.getItem("agi_"+id);
        if(val) el.value=val;

        el.oninput = ()=> {
            localStorage.setItem("agi_"+id,el.value);
        };
    });
}

/* ================= DOC ID ================= */
function generateDocID(){
    let d=new Date().toISOString().slice(0,10).replace(/-/g,"");
    let r=Math.random().toString(36).substring(2,6).toUpperCase();
    return `${AGI.docPrefix}${d}-${r}`;
}

/* ================= QR ================= */
function generateQR(docID){

    if(!AGI.premium) return;

    let box=document.getElementById("qrCodeContainer");
    if(!box) return;

    box.innerHTML="";

    if(typeof QRCode === "undefined"){
        console.warn("QR lib missing");
        return;
    }

    new QRCode(box,{
        text:`${AGI.domain}/verify.html?id=${docID}`,
        width:120,
        height:120
    });
}

/* ================= SAVE ================= */
function saveDoc(docID,data){

    localStorage.setItem("doc_"+docID, JSON.stringify(data));

    let history = JSON.parse(localStorage.getItem("agiHistory")||"[]");

    history.unshift({
        id:docID,
        name:data.name || "Unknown",
        date:data.date || "-"
    });

    // limit history (performance fix)
    history = history.slice(0,20);

    localStorage.setItem("agiHistory", JSON.stringify(history));
}

/* ================= HISTORY ================= */
function loadHistory(){

    let box = document.getElementById("history");
    if(!box) return;

    let history = JSON.parse(localStorage.getItem("agiHistory")||"[]");

    if(history.length===0){
        box.innerHTML="No History";
        return;
    }

    let html="";

    history.slice(0,5).forEach(item=>{
        html+=`
        <div>
        ${item.name} (${item.date})<br>
        ID: ${item.id}
        </div><hr>`;
    });

    box.innerHTML=html;
}

/* ================= VALIDATION ================= */
function validateRequired(data){

    let req=["name","father","age","address","purpose","place","date"];

    for(let k of req){
        if(!data[k] || String(data[k]).trim()===""){
            alert("Fill all required fields ❗");
            return false;
        }
    }
    return true;
}

/* ================= MAIN ================= */
function generateAffidavit(){

    let preview=document.getElementById("previewArea");
    if(!preview) return;

    let data={
        lang:getVal("lang"),
        template:getVal("template"),
        gender:getVal("gender"),
        name:getVal("name"),
        father:getVal("father"),
        age:getVal("age"),
        address:getVal("address"),
        purpose:getVal("purpose"),
        state:getVal("state"),
        stamp:getVal("stamp"),
        place:getVal("place"),
        date:getVal("date")
    };

    if(!validateRequired(data)) return;

    if(!AGI.premium && data.template!=="general"){
        alert("Premium Template ❌");
        return;
    }

    let docID=generateDocID();

    let content = AGI.premium ? "" : `<div style="color:red">FREE VERSION</div>`;

    content+=`
    <h2>AFFIDAVIT</h2>
    <p>I ${data.name}, S/o ${data.father}, age ${data.age}, resident ${data.address}</p>
    <p>Purpose: ${data.purpose}</p>
    <p>Place: ${data.place}</p>
    <p>Date: ${data.date}</p>
    `;

    if(AGI.premium){
        content+=`
        <p><b>ID:</b> ${docID}</p>
        <div id="qrCodeContainer"></div>
        <button onclick="copyID('${docID}')">Copy ID</button>
        `;
    }

    preview.innerHTML=content;

    if(AGI.premium){
        setTimeout(()=>generateQR(docID),100); // fix render bug
    }

    saveDoc(docID,data);
    loadHistory();
}

/* ================= COPY ================= */
function copyID(id){
    navigator.clipboard.writeText(id || "");
    alert("Copied ✔");
}

/* ================= PRINT ================= */
function downloadPDF(){

    let area = document.getElementById("previewArea");

    if(!area || area.innerHTML.trim()===""){
        alert("Generate affidavit first ❗");
        return;
    }

    let win = window.open("", "", "width=900,height=700");

    win.document.write(`
    <html>
    <head>
    <title>Affidavit</title>

    <style>
    body{
        font-family:Arial;
        padding:40px;
        line-height:1.8;
    }

    h2{
        text-align:center;
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
        window.print();
    }
    <\/script>

    </body>
    </html>
    `);

    win.document.close();
}
