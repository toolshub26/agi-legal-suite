/* =========================================
   AGI ULTRA PRO v16 AI 🚀
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
version:"v16 AI"

};

/* =========================================
   GLOBAL SIGNATURE PAD
========================================= */

let signaturePad = null;

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

/* PREMIUM */

let expiry =
localStorage.getItem(
"agiPremiumExpiry"
);

if(
expiry &&
Date.now() > Number(expiry)
){

localStorage.removeItem(
"agiPremium"
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

});

/* =========================================
   PREMIUM
========================================= */

function activatePremiumManually(){

let code =
prompt(
"Enter Premium Code"
);

if(!code) return;

if(
code.trim() ===
AGI.premiumCode
){

localStorage.setItem(
"agiPremium",
"true"
);

let expiry =
Date.now() +
(30*24*60*60*1000);

localStorage.setItem(
"agiPremiumExpiry",
expiry
);

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

AGI.premium =
localStorage.getItem(
"agiPremium"
)==="true";

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
   MAIN GENERATOR
========================================= */

function generateAffidavit(){

try{

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

/* SAFE TEMPLATE */

let templateLines = [];

if(
lang.templates &&
lang.templates[data.purposeType]
){

templateLines =
lang.templates[data.purposeType];

}else if(
lang.templates &&
lang.templates["Name Change"]
){

templateLines =
lang.templates["Name Change"];

}else{

templateLines = [
"This affidavit is submitted for official purposes."
];

}

/* TEMPLATE HTML */

let templateHTML = "";

(templateLines || []).forEach(line=>{

templateHTML += `
<li>${line}</li>
`;

});

/* ADDITIONAL DETAILS */

if(data.details){

templateHTML += `
<li>${data.details}</li>
`;

}

/* DOC ID */

let docID =
generateDocID();

/* SIGNATURE */

let signatureImage = "";

if(
signaturePad &&
typeof signaturePad.isEmpty === "function" &&
!signaturePad.isEmpty()
){

signatureImage =
signaturePad.toDataURL();

}

/* FINAL HTML */

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

/* RTL */

if(
data.lang==="Urdu"
){

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

/* SAVE */

saveDoc(docID,data);

loadHistory();

generateQRCode();

alert(
"Affidavit Generated ✔"
);

}catch(err){

console.error(err);

alert(
"Generator Error ❌"
);

}

}

/* =========================================
   QR CODE
========================================= */

function generateQRCode(){

let qrBox =
document.getElementById(
"qrCodeContainer"
);

if(!qrBox) return;

qrBox.innerHTML = "";

if(
typeof QRCode !== "undefined"
){

try{

new QRCode(qrBox,{

text:
document.getElementById(
"previewArea"
).innerText,

width:120,
height:120

});

}catch(err){

console.log(err);

qrBox.innerHTML =
"<p>QR Failed</p>";

}

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
   WHATSAPP
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

if(box){

box.style.display =
"block";

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
"AI Response:<br><br>" +
q;

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

window.open(
"https://wa.me/911234567890",
"_blank"
);

}
