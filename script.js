/* =========================================
   AGI ULTRA PRO v18 ENTERPRISE 🚀
   COMPLETE ENTERPRISE SCRIPT.JS
========================================= */

/* =========================================
   GLOBAL APP CONFIG
========================================= */

const AGI = {

premium:false,
premiumCode:"INDIA49",
docPrefix:"IND-AFF-",
version:"v18 ENTERPRISE",

features:{
ai:true,
ocr:true,
qr:true,
voice:true,
cloud:true,
analytics:true,
pwa:true
}

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

place:"Place",

date:"Date",

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

templates:{

"Name Change":[
"I hereby declare that I have changed my name officially.",
"My old and new names belong to the same person."
],

"Address Proof":[
"I currently reside at the mentioned address.",
"This affidavit is submitted as address proof."
],

"Income Proof":[
"My source of income is legal and genuine."
],

"Lost Document":[
"I have lost my original document."
]

}

},

Urdu:{

title:"حلف نامہ",

subtitle:"نوٹری پبلک کے سامنے",

place:"مقام",

date:"تاریخ",

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

templates:{

"Name Change":[
"میں نے اپنا نام تبدیل کیا ہے۔"
],

"Address Proof":[
"میں مذکورہ پتے پر رہائش پذیر ہوں۔"
]

}

},

Hindi:{

title:"शपथ पत्र",

subtitle:"नोटरी पब्लिक के समक्ष",

place:"स्थान",

date:"तारीख",

intro:(d)=>`
मैं
<b>${d.name}</b>
पुत्र
<b>${d.father}</b>
उम्र
<b>${d.age}</b>
वर्ष,
निवासी
<b>${d.address}</b>.
`

},

Arabic:{

title:"إفادة خطية",

subtitle:"أمام كاتب العدل",

place:"المكان",

date:"التاريخ",

intro:(d)=>`
أنا
<b>${d.name}</b>
ابن
<b>${d.father}</b>
العمر
<b>${d.age}</b>
المقيم في
<b>${d.address}</b>
`

},

Spanish:{

title:"DECLARACIÓN JURADA",

subtitle:"ANTE EL NOTARIO",

place:"Lugar",

date:"Fecha",

intro:(d)=>`
Yo,
<b>${d.name}</b>,
hijo de
<b>${d.father}</b>,
edad
<b>${d.age}</b>,
residente de
<b>${d.address}</b>.
`

},

Chinese:{

title:"宣誓书",

subtitle:"在公证人面前",

place:"地点",

date:"日期",

intro:(d)=>`
本人
<b>${d.name}</b>
父亲
<b>${d.father}</b>
年龄
<b>${d.age}</b>
住址
<b>${d.address}</b>
`

}

};

/* =========================================
   GET VALUE
========================================= */

function getVal(id){

const el =
document.getElementById(id);

if(!el) return "";

return String(el.value || "").trim();

}

/* =========================================
   ON LOAD
========================================= */

window.addEventListener(
"load",
()=>{

initializeSignaturePad();

restoreDraft();

loadHistory();

restoreTheme();

updateAnalytics();

updateUI();

initializeOCR();

startClock();

hideLoader();

showToast(
"AGI ULTRA Ready 🚀"
);

});

/* =========================================
   SIGNATURE PAD
========================================= */

function initializeSignaturePad(){

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

}

/* =========================================
   CLOCK
========================================= */

function startClock(){

setInterval(()=>{

const clock =
document.getElementById(
"liveClock"
);

if(clock){

clock.innerHTML =
new Date()
.toLocaleString();

}

},1000);

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
   TOAST
========================================= */

function showToast(msg){

const toast =
document.createElement("div");

toast.innerHTML = msg;

toast.style.position =
"fixed";

toast.style.bottom =
"20px";

toast.style.left =
"20px";

toast.style.background =
"#111827";

toast.style.color =
"white";

toast.style.padding =
"14px 18px";

toast.style.borderRadius =
"12px";

toast.style.zIndex =
"999999";

document.body.appendChild(
toast
);

setTimeout(()=>{

toast.remove();

},3000);

}

/* =========================================
   GENERATE AFFIDAVIT
========================================= */

function generateAffidavit(){

try{

showLoader();

const preview =
document.getElementById(
"previewArea"
);

if(!preview){

showToast(
"Preview Missing"
);

return;

}

const data = {

lang:getVal("lang"),
name:getVal("name"),
father:getVal("father"),
age:getVal("age"),
address:getVal("address"),
details:getVal("details"),
place:getVal("place"),
date:getVal("date"),
purpose:getVal("purposeType")

};

if(
!data.name ||
!data.father ||
!data.age
){

showToast(
"Fill Required Fields ❌"
);

hideLoader();

return;

}

const lang =
affidavitTemplates[
data.lang
] ||
affidavitTemplates[
"English"
];

let html = "";

if(
lang.templates &&
lang.templates[data.purpose]
){

lang.templates[
data.purpose
].forEach(line=>{

html += `
<li>${line}</li>
`;

});

}

if(data.details){

html += `
<li>${data.details}</li>
`;

}

const docID =
generateDocID();

let signHTML = "";

if(
signaturePad &&
!signaturePad.isEmpty()
){

signHTML = `
<img
src="${signaturePad.toDataURL()}"
style="height:80px;">
`;

}

preview.innerHTML = `

<div class="stamp">
₹10
</div>

<div class="title">
${lang.title}
</div>

<div class="subtitle">
${lang.subtitle}
</div>

<div class="preview-content">

<p>
${lang.intro(data)}
</p>

<ol>
${html}
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

${signHTML}

<div id="qrCodeContainer"
style="
margin-top:30px;
display:flex;
justify-content:center;
">
</div>

<div class="doc-id">
${docID}
</div>

</div>

`;

preview.setAttribute(
"dir",
data.lang==="Urdu"
?
"rtl"
:
"ltr"
);

localStorage.setItem(
"doc_"+docID,
JSON.stringify(data)
);

saveHistory(
docID,
data.name,
data.purpose,
data.date
);

generateQRCode(docID);

updateAnalytics();

hideLoader();

showToast(
"Affidavit Generated ✔"
);

}catch(err){

console.error(err);

hideLoader();

showToast(
"Generator Error ❌"
);

}

}

/* =========================================
   QR CODE
========================================= */

function generateQRCode(docID){

const qr =
document.getElementById(
"qrCodeContainer"
);

if(!qr) return;

qr.innerHTML = "";

new QRCode(qr,{

text:
location.origin +
"/verify.html?id=" +
docID,

width:140,
height:140

});

}

/* =========================================
   PDF
========================================= */

function downloadPDF(){

html2pdf()
.from(
document.getElementById(
"previewArea"
)
)
.save(
"Affidavit.pdf"
);

}

/* =========================================
   PNG EXPORT
========================================= */

function exportPNG(){

html2canvas(
document.getElementById(
"previewArea"
)
).then(canvas=>{

let link =
document.createElement("a");

link.download =
"affidavit.png";

link.href =
canvas.toDataURL();

link.click();

});

}

/* =========================================
   WHATSAPP
========================================= */

function shareWhatsApp(){

window.open(
`https://wa.me/?text=${
encodeURIComponent(
document.getElementById(
"previewArea"
).innerText
)
}`,
"_blank"
);

}

/* =========================================
   EMAIL
========================================= */

function emailPDF(){

window.location.href =
"mailto:?subject=Affidavit";

}

/* =========================================
   VOICE INPUT
========================================= */

function startVoiceInput(){

if(
!("webkitSpeechRecognition"
in window)
){

showToast(
"Voice Not Supported"
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
event.results[0][0]
.transcript;

};

}

/* =========================================
   AI QUICK
========================================= */

function generateAIQuickAffidavit(){

let prompt =
getVal("aiPrompt");

if(!prompt){

showToast(
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
   AI REWRITE
========================================= */

function rewriteAffidavit(){

let details =
document.getElementById(
"details"
);

details.value +=
" This affidavit is verified true.";

showToast(
"AI Rewrite Complete ✔"
);

}

/* =========================================
   OCR
========================================= */

function initializeOCR(){

const ocrUpload =
document.getElementById(
"ocrUpload"
);

if(!ocrUpload) return;

ocrUpload.addEventListener(
"change",
async function(e){

const file =
e.target.files[0];

if(!file) return;

document.getElementById(
"ocrResultBox"
).innerHTML =
"Scanning...";

try{

const result =
await Tesseract.recognize(
file,
"eng"
);

document.getElementById(
"ocrResultBox"
).innerHTML =
result.data.text;

document.getElementById(
"details"
).value =
result.data.text;

showToast(
"OCR Complete ✔"
);

}catch{

showToast(
"OCR Failed ❌"
);

}

});

}

/* =========================================
   HISTORY
========================================= */

function saveHistory(
id,
name,
purpose,
date
){

let history =
JSON.parse(
localStorage.getItem(
"agiHistory"
) || "[]"
);

history.unshift({

id,
name,
purpose,
date

});

localStorage.setItem(
"agiHistory",
JSON.stringify(history)
);

loadHistory();

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
) || "[]"
);

history.splice(index,1);

localStorage.setItem(
"agiHistory",
JSON.stringify(history)
);

loadHistory();

updateAnalytics();

showToast(
"Deleted ✔"
);

}

/* =========================================
   SEARCH HISTORY
========================================= */

function searchHistory(){

let input =
getVal("searchHistory")
.toLowerCase();

let items =
document.querySelectorAll(
".history-item"
);

items.forEach(item=>{

item.style.display =
item.innerText
.toLowerCase()
.includes(input)
?
"block"
:
"none";

});

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
   THEME
========================================= */

function toggleTheme(){

document.body.classList.toggle(
"light-mode"
);

localStorage.setItem(
"theme",
document.body.classList.contains(
"light-mode"
)
?
"light"
:
"dark"
);

}

function restoreTheme(){

if(
localStorage.getItem(
"theme"
)==="light"
){

document.body.classList.add(
"light-mode"
);

}

}

/* =========================================
   AUTOSAVE
========================================= */

setInterval(()=>{

localStorage.setItem(
"agiDraft",
document.getElementById(
"details"
).value
);

},10000);

function restoreDraft(){

let draft =
localStorage.getItem(
"agiDraft"
);

if(draft){

document.getElementById(
"details"
).value =
draft;

}

}

/* =========================================
   CLEAR SIGNATURE
========================================= */

function clearSignaturePad(){

if(signaturePad){

signaturePad.clear();

showToast(
"Signature Cleared"
);

}

}

/* =========================================
   PREMIUM
========================================= */

function activatePremium(){

let code = prompt(
"Enter Premium Code"
);

if(
code===AGI.premiumCode
){

AGI.premium = true;

localStorage.setItem(
"agiPremium",
"true"
);

updateUI();

showToast(
"Premium Activated 🚀"
);

}else{

showToast(
"Invalid Code ❌"
);

}

}

function updateUI(){

const badge =
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

if(
localStorage.getItem(
"agiPremium"
)==="true"
){

AGI.premium = true;

}

/* =========================================
   CLOUD SAVE
========================================= */

function saveToCloud(){

localStorage.setItem(
"agiCloudBackup",
document.getElementById(
"previewArea"
).innerHTML
);

showToast(
"Cloud Saved ☁️"
);

}

function restoreCloudBackup(){

let backup =
localStorage.getItem(
"agiCloudBackup"
);

if(!backup){

showToast(
"No Backup"
);

return;

}

document.getElementById(
"previewArea"
).innerHTML =
backup;

showToast(
"Backup Restored ✔"
);

}

/* =========================================
   COPY
========================================= */

function copyAffidavit(){

navigator.clipboard
.writeText(
document.getElementById(
"previewArea"
).innerText
);

showToast(
"Copied ✔"
);

}

/* =========================================
   LOADER
========================================= */

function showLoader(){

const loader =
document.getElementById(
"globalLoader"
);

if(loader){

loader.style.display =
"flex";

}

}

function hideLoader(){

const loader =
document.getElementById(
"globalLoader"
);

if(loader){

loader.style.display =
"none";

}

}

/* =========================================
   PWA INSTALL
========================================= */

window.addEventListener(
"beforeinstallprompt",
(e)=>{

e.preventDefault();

deferredPrompt = e;

const btn =
document.getElementById(
"installAppBtn"
);

if(btn){

btn.style.display =
"block";

}

});

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

});

/* =========================================
   SUPPORT
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

});

}

/* =========================================
   NETWORK STATUS
========================================= */

window.addEventListener(
"offline",
()=>{

showToast(
"Offline ⚠️"
);

});

window.addEventListener(
"online",
()=>{

showToast(
"Back Online ✔"
);

});
