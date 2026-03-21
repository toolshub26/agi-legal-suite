/* =========================================
   AGI – ULTRA PRO ENGINE v5.0 🚀
   Premium + Expiry + QR Verify + History + Security
========================================= */

const AGI = {
    premium:false,
    premiumCode:"INDIA49",
    docPrefix:"IND-AFF-",
    premiumDays:30,
    domain:location.origin
};

/* ================= INIT ================= */
(function initAGI(){

    let p = localStorage.getItem("agiPremium");
    let exp = localStorage.getItem("agiExpiry");

    if(p==="true" && exp && Date.now()<exp){
        AGI.premium = true;
    } else {
        AGI.premium = false;
        localStorage.removeItem("agiPremium");
    }

    restoreDraft();
    updateUI();

})();

/* ================= PREMIUM ================= */
function unlockPremium(){
    window.open("https://rzp.io/l/YOUR_PAYMENT_LINK","_blank");
    alert("Complete payment. Premium activate after confirmation.");
}

function activatePremiumManually(){

    let code = prompt("Enter Premium Code:");

    if(code === AGI.premiumCode){

        let expiry = Date.now() + (AGI.premiumDays*86400000);

        AGI.premium = true;
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
    let witness = document.getElementById("addWitness");

    if(AGI.premium){
        if(badge) badge.innerHTML = `<div class="premium-active">Premium ✔</div>`;
        if(btn) btn.classList.remove("locked");
    } else {
        if(badge) badge.innerHTML = `<div class="premium-off">Free Mode</div>`;
        if(btn) btn.classList.add("locked");
        if(witness) witness.checked=false;
    }
}

/* ================= DRAFT ================= */
const fieldIDs = ["lang","template","gender","name","father","age","address","purpose","state","stamp","place","date","customParagraph"];

function restoreDraft(){
    fieldIDs.forEach(id=>{
        let el=document.getElementById(id);
        if(!el) return;

        let val=localStorage.getItem("agi_"+id);
        if(val) el.value=val;

        el.addEventListener("input",()=>{
            localStorage.setItem("agi_"+id,el.value);
        });
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

    let url = `${AGI.domain}/verify.html?id=${docID}`;

    let box=document.getElementById("qrCodeContainer");
    if(!box) return;

    box.innerHTML="";

    new QRCode(box,{
        text:url,
        width:100,
        height:100
    });
}

/* ================= SAVE DOC ================= */
function saveDoc(docID,data){

    localStorage.setItem("doc_"+docID, JSON.stringify({
        name:data.name,
        date:data.date
    }));

    let history = JSON.parse(localStorage.getItem("agiHistory")||"[]");

    history.unshift({
        id:docID,
        name:data.name,
        date:data.date
    });

    localStorage.setItem("agiHistory", JSON.stringify(history));
}

/* ================= VALIDATION ================= */
function validateRequired(data){

    let req=["name","father","age","address","purpose","place","date"];

    for(let k of req){
        if(!data[k] || data[k].trim()===""){
            alert("Fill all required fields ❗");
            return false;
        }
    }
    return true;
}

/* ================= MAIN ================= */
function generateAffidavit(){

    let preview=document.getElementById("previewArea");

    let data={
        lang:lang.value,
        template:template.value,
        gender:gender.value,
        name:name.value,
        father:father.value,
        age:age.value,
        address:address.value,
        purpose:purpose.value,
        state:state.value,
        stamp:stamp.value,
        place:place.value,
        date:date.value
    };

    if(!validateRequired(data)) return;

    if(!AGI.premium && data.template!=="general"){
        alert("Premium Template ❌");
        return;
    }

    let docID=generateDocID();

    let content = AGI.premium ? "" : `<div class="watermark">FREE VERSION</div>`;

    content+=`
    <h2>AFFIDAVIT</h2>
    <p>I ${data.name}, S/o ${data.father}, age ${data.age}, resident ${data.address}</p>
    <p>Purpose: ${data.purpose}</p>
    <p>Place: ${data.place}</p>
    <p>Date: ${data.date}</p>
    `;

    if(AGI.premium){
        content+=`
        <p>ID: ${docID}</p>
        <div id="qrCodeContainer"></div>
        <button onclick="copyID('${docID}')">Copy ID</button>
        `;
    }

    preview.innerHTML=content;

    if(AGI.premium){
        generateQR(docID);
    }

    saveDoc(docID,data);
}

/* ================= COPY ================= */
function copyID(id){
    navigator.clipboard.writeText(id);
    alert("Copied ✔");
}

/* ================= PRINT ================= */
function printAffidavit(){
    window.print();
}

/* ================= DOWNLOAD ================= */
function downloadPDF(){
    if(!AGI.premium){
        alert("Premium Required ❌");
        return;
    }
    window.print();
}
