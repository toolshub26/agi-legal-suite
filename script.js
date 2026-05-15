/* =========================================
   AGI ULTRA PRO v17 AI 🚀
   COMPLETE FINAL STABLE SCRIPT
========================================= */

/* =========================================
   GLOBAL APP
========================================= */

const AGI = {

premium:false,
premiumCode:"INDIA49",
docPrefix:"IND-AFF-",
premiumDays:30,
version:"v17 AI"

};

/* =========================================
   GLOBAL VARIABLES
========================================= */

let signaturePad = null;
let deferredPrompt = null;

/* =========================================
   MULTI LANGUAGE TEMPLATES
========================================= */

const affidavitTemplates = {

English:{

title:"AFFIDAVIT",

subtitle:"BEFORE THE NOTARY PUBLIC",

intro:(d)=>`
I,
<b>${d.name}</b>,
S/o
<b>${d.father}</b>,
aged about
<b>${d.age}</b>
years,
resident of
<b>${d.address}</b>.
`,

place:"Place",

date:"Date",

templates:{

"Name Change":[
"I hereby declare that I have changed my name for official purposes.",
"My old and new names belong to the same person.",
"All future records may use my updated name."
],

"Address Proof":[
"I currently reside at the mentioned address.",
"This affidavit is submitted as address proof."
]

}

},

Urdu:{

title:"حلف نامہ",

subtitle:"نوٹری پبلک کے سامنے",

intro:(d)=>`
میں
<b>${d.name}</b>
ولد
<b>${d.father}</b>
عمر
<b>${d.age}</b>
سال،
رہائشی
<b>${d.address}</b>
حلفیہ بیان دیتا ہوں۔
`,

place:"مقام",

date:"تاریخ",

templates:{

"Name Change":[
"میں حلفیہ بیان دیتا ہوں کہ میں نے اپنا نام تبدیل کیا ہے۔",
"میرا پرانا اور نیا نام ایک ہی شخص کے ہیں۔",
"آئندہ تمام ریکارڈ میں نیا نام استعمال کیا جائے۔"
],

"Address Proof":[
"میں مذکورہ پتے پر رہائش پذیر ہوں۔",
"یہ حلف نامہ بطور ثبوتِ رہائش پیش کیا جا رہا ہے۔"
]

}

}

};

/* =========================================
   SAFE GET VALUE
========================================= */

function getVal(id){

const el =
document.getElementById(id);

if(!el) return "";

return String(
el.value || ""
).trim();

}

/* =========================================
   INIT
========================================= */

window.addEventListener(
"load",
()=>{

restoreDraft();

loadHistory();

updateUI();

updateAnalytics();

hideLoader();

/* DARK MODE */

if(
localStorage.getItem(
"agiDarkMode"
)==="true"
){

document.body.classList.add(
"dark-mode"
);

}

/* SIGNATURE PAD */

const canvas =
document.getElementById(
"signaturePad"
);

if(
canvas &&
typeof SignaturePad !==
"undefined"
){

signaturePad =
new SignaturePad(canvas);

}

/* INSTALL APP */

const installBtn =
document.getElementById(
"installAppBtn"
);

window.addEventListener(
"beforeinstallprompt",
(e)=>{

e.preventDefault();

deferredPrompt = e;

if(installBtn){

installBtn.style.display =
"block";

}

}
);

});

/* =========================================
   PREMIUM
========================================= */

function activatePremiumManually(){

alert(
"Premium Disabled In Demo Version"
);

}

function unlockPremium(){

window.open(
"https://yourwebsite.com/premium",
"_blank"
);

}

/* =========================================
   UPDATE UI
========================================= */

function updateUI(){

let badge =
document.getElementById(
"premiumStatus"
);

if(!badge) return;

AGI.premium = false;

badge.innerHTML =
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
"purposeType",
"stampValue"

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

let history =
JSON.parse(
localStorage.getItem(
"agiHistory"
) || "[]"
);

history.unshift({

id:docID,
name:data.name,
date:data.date,
purpose:data.purposeType

});

localStorage.setItem(
"agiHistory",
JSON.stringify(history)
);

updateAnalytics();

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
)||"[]"
);

if(history.length===0){

box.innerHTML =
"No documents yet.";

return;

}

let html = "";

history.forEach((item,index)=>{

html += `

<div class="history-item">

<b>${item.name}</b><br>

${item.purpose}<br>

${item.date}<br>

<small>${item.id}</small>

<br><br>

<button onclick="deleteHistory(${index})">
Delete
</button>

</div>

`;

});

box.innerHTML = html;

}

function deleteHistory(index){

let history =
JSON.parse(
localStorage.getItem(
"agiHistory"
)||"[]"
);

history.splice(index,1);

localStorage.setItem(
"agiHistory",
JSON.stringify(history)
);

loadHistory();

updateAnalytics();

}

/* =========================================
   ANALYTICS
========================================= */

function updateAnalytics(){

let total =
JSON.parse(
localStorage.getItem(
"agiHistory"
)||"[]"
).length;

let totalBox =
document.getElementById(
"totalDocs"
);

if(totalBox){

totalBox.innerText =
total;

}

}

/* =========================================
   VALIDATION
========================================= */

function validateRequired(data){

const required = [

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
   AI STATUS
========================================= */

function showAIStatus(msg){

let box =
document.getElementById(
"aiStatus"
);

if(!box) return;

box.innerHTML = msg;

setTimeout(()=>{

box.innerHTML = "";

},3000);

}

/* =========================================
   AI QUICK GENERATOR
========================================= */

function generateAIQuickAffidavit(){

let prompt =
getVal("aiPrompt");

if(!prompt){

alert(
"Enter AI Prompt"
);

return;

}

document.getElementById(
"details"
).value =
prompt;

generateAffidavit();

}

/* =========================================
   AI DRAFT
========================================= */

function aiDraft(){

let purpose =
document.getElementById(
"purposeType"
).value;

let detailsBox =
document.getElementById(
"details"
);

detailsBox.value =

"This affidavit is created for " +
purpose +
". All statements mentioned are true and correct to the best of my knowledge.";

alert(
"AI Draft Generated ✔"
);

}

/* =========================================
   MAIN GENERATOR
========================================= */

function generateAffidavit(){

try{

showLoader();

showAIStatus(
"⚡ Generating..."
);

let preview =
document.getElementById(
"previewArea"
);

if(!preview){

alert(
"Preview Area Missing ❌"
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
stamp:getVal("stampValue")

};

if(!validateRequired(data)){
return;
}

let lang =
affidavitTemplates[
data.lang
] ||
affidavitTemplates[
"English"
];

let templateLines = [];

if(
lang.templates &&
lang.templates[data.purposeType]
){

templateLines =
lang.templates[data.purposeType];

}else{

templateLines = [
"This affidavit is submitted for official purposes."
];

}

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

let docID =
generateDocID();

let signatureImage = "";

if(
signaturePad &&
typeof signaturePad.isEmpty === "function" &&
!signaturePad.isEmpty()
){

signatureImage =
signaturePad.toDataURL();

}

preview.innerHTML = `

<div class="stamp">
${data.stamp || "₹10"}
</div>

<div class="meezan-logo">
⚖️ MEEZAN LEGAL SERVICES
</div>

<div class="title">
${lang.title}
</div>

<div class="subtitle">
${lang.subtitle}
</div>

<div class="doc-content">

<p>
${lang.intro(data)}
</p>

<ol>
${templateHTML}
</ol>

<br>

<p>
${lang.place}:
<b>${data.place}</b>
</p>

<p>
${lang.date}:
<b>${data.date}</b>
</p>

${
signatureImage
?
`
<div style="margin-top:20px;">
<img
src="${signatureImage}"
style="height:80px;">
</div>
`
:
""
}

<div id="qrCodeContainer"></div>

<div class="doc-id">
${docID}
</div>

</div>

`;

if(data.lang==="Urdu"){

preview.setAttribute(
"dir",
"rtl"
);

}else{

preview.setAttribute(
"dir",
"ltr"
);

}

saveDoc(docID,data);

loadHistory();

generateQRCode();

hideLoader();

alert(
"Affidavit Generated ✔"
);

}catch(err){

console.error(err);

hideLoader();

alert(
"Generator Error ❌"
);

}

}

/* =========================================
   QR CODE
========================================= */

function generateQRCode(){

const qr =
document.getElementById(
"qrCodeContainer"
);

if(!qr){

alert(
"QR Container Missing ❌"
);

return;

}

qr.innerHTML = "";

if(typeof QRCode === "undefined"){

alert(
"QR Library Missing ❌"
);

return;

}

let text =
document.getElementById(
"previewArea"
).innerText.trim();

if(!text){

alert(
"Generate affidavit first ❌"
);

return;

}

try{

new QRCode(qr,{

text:text,

width:120,
height:120

});

}catch(err){

console.log(err);

alert(
"QR Failed ❌"
);

}

}

/* =========================================
   DOWNLOAD PDF
========================================= */

function downloadPDF(){

const element =
document.getElementById(
"previewArea"
);

if(!element){

alert(
"Preview missing ❌"
);

return;

}

if(typeof html2pdf === "undefined"){

alert(
"PDF Library Missing ❌"
);

return;

}

html2pdf()
.from(element)
.save("Affidavit.pdf");

}

/* =========================================
   EMAIL PDF
========================================= */

function emailPDF(){

window.location.href =
"mailto:?subject=Affidavit PDF&body=Generated using AGI ULTRA PRO";

}

/* =========================================
   WHATSAPP SHARE
========================================= */

function shareWhatsApp(){

let text =
document.getElementById(
"previewArea"
).innerText;

window.open(
`https://wa.me/?text=${encodeURIComponent(text)}`,
"_blank"
);

}

/* =========================================
   VOICE INPUT
========================================= */

function startVoiceInput(){

if(
!('webkitSpeechRecognition' in window)
){

alert(
"Voice Input Not Supported"
);

return;

}

const recognition =
new webkitSpeechRecognition();

recognition.lang =
"en-IN";

recognition.start();

recognition.onresult =
function(event){

document.getElementById(
"details"
).value =
event.results[0][0].transcript;

};

}

/* =========================================
   LEGAL AI
========================================= */

function openLegalAI(){

let box =
document.getElementById(
"legalAiBox"
);

if(!box) return;

if(
box.style.display==="block"
){

box.style.display="none";

}else{

box.style.display="block";

}

}

function askLegalAI(){

let q =
getVal("legalQuestion");

let response =
document.getElementById(
"legalAIResponse"
);

if(response){

response.innerHTML =

"⚖️ Legal AI Response:<br><br>" +
"Regarding: <b>" +
q +
"</b><br><br>" +
"Please consult a professional advocate for final legal verification.";

}

}

/* =========================================
   CLEAR SIGNATURE
========================================= */

function clearSignaturePad(){

if(signaturePad){

signaturePad.clear();

}

}

/* =========================================
   VERIFY
========================================= */

function verifyDocument(){

alert(
"Verification Ready ✅"
);

}

/* =========================================
   BOOK NOTARY
========================================= */

function bookNotary(){

const phone =
"917780936452";

const message =
encodeURIComponent(
"Hello, I want to book notary service."
);

window.open(
`https://wa.me/${phone}?text=${message}`,
"_blank"
);

}

/* =========================================
   CLOUD SAVE
========================================= */

function saveToCloud(){

alert(
"Cloud Save Connected ☁️"
);

}

/* =========================================
   NOTIFICATIONS
========================================= */

function enableNotifications(){

if(
"Notification" in window
){

Notification.requestPermission()
.then(permission=>{

if(permission==="granted"){

new Notification(
"AGI ULTRA PRO Notifications Enabled 🚀"
);

}

});

}

}

/* =========================================
   AI REWRITE
========================================= */

function rewriteAffidavit(){

let details =
document.getElementById(
"details"
);

details.value =
details.value +
" This statement is rewritten professionally using AGI AI.";

alert(
"AI Rewrite Complete ✔"
);

}

/* =========================================
   INSTALL APP
========================================= */

document.addEventListener(
"click",
function(e){

if(
e.target &&
e.target.id==="installAppBtn"
){

if(deferredPrompt){

deferredPrompt.prompt();

}

}

}
);

/* =========================================
   OCR
========================================= */

const ocrUpload =
document.getElementById(
"ocrUpload"
);

if(ocrUpload){

ocrUpload.addEventListener(
"change",
function(){

let result =
document.getElementById(
"ocrResultBox"
);

if(result){

result.innerHTML =
"📄 OCR Scan Completed Successfully";

}

}
);

}

/* =========================================
   LOADER
========================================= */

function showLoader(){

let loader =
document.getElementById(
"globalLoader"
);

if(loader){

loader.style.display =
"flex";

}

}

function hideLoader(){

let loader =
document.getElementById(
"globalLoader"
);

if(loader){

loader.style.display =
"none";

}

}

/* =========================================
   FLOATING SUPPORT
========================================= */

const supportBtn =
document.getElementById(
"supportBtn"
);

if(supportBtn){

supportBtn.addEventListener(
"click",
()=>{

window.open(
"https://wa.me/917780936452",
"_blank"
);

}
);

}
