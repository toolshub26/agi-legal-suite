<!-- =========================================
AGI ULTRA PRO v18 ENTERPRISE 🚀
FULL FINAL FIXED INDEX.HTML
PWA + STAMP + QR + LOGIN + HISTORY
========================================= -->

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0">

<title>
AGI ULTRA PRO v18 AI 🚀
</title>

<meta
name="theme-color"
content="#020617">

<link
rel="manifest"
href="./manifest.json">

<link
rel="icon"
href="./launchericon-192x192.png">

<link
rel="stylesheet"
href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@500;700&display=swap">

<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

<style>

/* =========================================
RESET
========================================= */

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{

background:
linear-gradient(
135deg,
#020617,
#0f172a
);

font-family:'Inter',sans-serif;

color:white;

overflow-x:hidden;

}

/* =========================================
TOPBAR
========================================= */

.topbar{

padding:18px;

display:flex;

justify-content:space-between;

align-items:center;

flex-wrap:wrap;

gap:16px;

background:
linear-gradient(
135deg,
#111827,
#1e293b
);

border-bottom:
1px solid rgba(255,255,255,.08);

position:sticky;

top:0;

z-index:9999;

}

.logo h1{

font-size:34px;
font-weight:800;

}

.logo p{

opacity:.8;
margin-top:6px;

}

.top-actions{

display:flex;
gap:10px;
flex-wrap:wrap;

}

button{

border:none;

padding:14px 18px;

border-radius:14px;

font-weight:700;

cursor:pointer;

transition:.25s;

color:white;

}

button:hover{

transform:translateY(-2px);

}

.primary{
background:#2563eb;
}

.green{
background:#059669;
}

.orange{
background:#ea580c;
}

.red{
background:#dc2626;
}

.purple{
background:#7c3aed;
}

/* =========================================
MAIN
========================================= */

.main{

max-width:1700px;

margin:auto;

padding:24px;

display:grid;

grid-template-columns:400px 1fr;

gap:30px;

}

/* =========================================
SIDEBAR
========================================= */

.sidebar{

background:#111827;

padding:25px;

border-radius:24px;

}

/* =========================================
INPUTS
========================================= */

.label{

display:block;

margin-top:16px;

margin-bottom:8px;

font-weight:700;

}

.input,
.select,
.textarea{

width:100%;

padding:14px;

border:none;

border-radius:14px;

background:#1f2937;

color:white;

font-size:14px;

outline:none;

}

.textarea{

min-height:120px;

resize:vertical;

}

/* =========================================
BUTTON GRID
========================================= */

.btn-grid{

display:grid;

grid-template-columns:1fr 1fr;

gap:12px;

margin-top:20px;

}

/* =========================================
SIGNATURE
========================================= */

#signaturePad{

width:100%;

height:220px;

background:white;

border-radius:16px;

margin-top:10px;

}

/* =========================================
ANALYTICS
========================================= */

.analytics{

display:grid;

grid-template-columns:
repeat(auto-fit,minmax(180px,1fr));

gap:20px;

margin-bottom:25px;

}

.stat{

background:#111827;

padding:20px;

border-radius:22px;

text-align:center;

}

.stat h3{

font-size:32px;

margin-top:10px;

}

/* =========================================
PREVIEW
========================================= */

.preview{

background:white;

color:#111827;

border-radius:24px;

padding:40px;

min-height:1100px;

position:relative;

overflow:hidden;

}

/* =========================================
WATERMARK
========================================= */

.watermark{

position:absolute;

top:50%;
left:50%;

transform:
translate(-50%,-50%)
rotate(-30deg);

font-size:90px;

font-weight:800;

color:rgba(0,0,0,.04);

pointer-events:none;

}

/* =========================================
STAMP
========================================= */

.stamp{

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

font-size:22px;
font-weight:800;

color:#dc2626;

transform:rotate(-15deg);

}

/* =========================================
DOC
========================================= */

.doc-title{

text-align:center;

font-size:48px;

font-family:
'Cormorant Garamond',
serif;

margin-top:20px;

}

.doc-sub{

text-align:center;

margin-top:10px;

margin-bottom:40px;

letter-spacing:2px;

}

.doc-content{

line-height:2;

font-size:18px;

}

/* =========================================
TOAST
========================================= */

.agi-toast{

position:fixed;

bottom:20px;
left:20px;

background:#111827;

padding:14px 18px;

border-radius:14px;

z-index:999999;

font-weight:700;

}

/* =========================================
SUPPORT
========================================= */

#supportBtn{

position:fixed;

bottom:20px;
right:20px;

z-index:999999;

background:#059669;

}

/* =========================================
RESPONSIVE
========================================= */

@media(max-width:1100px){

.main{

grid-template-columns:1fr;

}

}

@media(max-width:768px){

.main{

padding:14px;

}

.top-actions{

display:grid;

grid-template-columns:1fr 1fr;

width:100%;

}

.preview{

padding:18px;

}

.doc-title{

font-size:34px;

}

.watermark{

font-size:50px;

}

}

</style>

</head>

<body>

<!-- =========================================
TOPBAR
========================================= -->

<div class="topbar">

<div class="logo">

<h1>
⚖️ AGI ULTRA PRO v18 AI
</h1>

<p>
Enterprise Legal SaaS Platform
</p>

</div>

<div class="top-actions">

<button
class="green"
onclick="generateQRCode()">
QR
</button>

<button
class="purple"
onclick="shareWhatsApp()">
WhatsApp
</button>

<button
class="orange"
onclick="downloadPDF()">
PDF
</button>

<button
class="primary"
id="installAppBtn"
onclick="triggerInstallApp()">
📲 PWA
</button>

<button
class="green"
onclick="location.href='signup.html'">
Signup
</button>

<button
class="primary"
onclick="location.href='login.html'">
Login
</button>

<button
class="orange"
onclick="localStorage.clear();showToast('History Deleted ✔')">
Delete History
</button>

<button
class="red"
onclick="logout()">
Logout
</button>

<button
class="red"
onclick="location.href='premium.html'">
⭐ Premium
</button>

</div>

</div>

<!-- =========================================
MAIN
========================================= -->

<div class="main">

<!-- =========================================
FORM
========================================= -->

<div class="sidebar">

<h2>
Generate Affidavit
</h2>

<label class="label">
Purpose
</label>

<select
class="select"
id="purposeType">

<option>Name Change</option>
<option>Marriage Affidavit</option>
<option>Income Proof</option>
<option>Property Declaration</option>
<option>Business Declaration</option>
<option>Educational Affidavit</option>
<option>Custom Purpose</option>

</select>

<label class="label">
Full Name
</label>

<input
class="input"
id="name">

<label class="label">
Father Name
</label>

<input
class="input"
id="father">

<label class="label">
Age
</label>

<input
class="input"
id="age">

<label class="label">
Address
</label>

<textarea
class="textarea"
id="address"></textarea>

<label class="label">
Stamp Amount
</label>

<select
class="select"
id="stampAmount">

<option>₹10</option>
<option>₹20</option>
<option>₹50</option>
<option>₹100</option>
<option>₹200</option>

</select>

<label class="label">
Details
</label>

<textarea
class="textarea"
id="details"></textarea>

<label class="label">
Signature
</label>

<canvas id="signaturePad"></canvas>

<div class="btn-grid">

<button
class="orange"
onclick="clearSignaturePad()">
Clear Sign
</button>

<button
class="primary"
onclick="generateAffidavit()">
Generate
</button>

<button
class="green"
onclick="downloadPDF()">
PDF
</button>

<button
class="purple"
onclick="exportPNG()">
PNG
</button>

</div>

</div>

<!-- =========================================
PREVIEW
========================================= -->

<div>

<div class="analytics">

<div class="stat">
📄
<h3 id="totalDocs">
0
</h3>
<p>Total Docs</p>
</div>

<div class="stat">
⭐
<h3>
Premium
</h3>
<p>Enterprise</p>
</div>

<div class="stat">
🤖
<h3>
AI
</h3>
<p>Smart Engine</p>
</div>

</div>

<div class="preview">

<div class="watermark">
AGI ULTRA
</div>

<div id="previewArea">

<div class="stamp">
₹10
</div>

<div class="doc-title">
AFFIDAVIT
</div>

<div class="doc-sub">
BEFORE THE NOTARY PUBLIC
</div>

<div class="doc-content">

<p>
Your affidavit preview will appear here.
</p>

</div>

</div>

</div>

</div>

</div>

<!-- =========================================
SUPPORT
========================================= -->

<button
id="supportBtn">
Support
</button>

<script>

/* =========================================
GLOBAL
========================================= */

let signaturePad;
let deferredPrompt = null;

/* =========================================
SIGNATURE
========================================= */

function initializeSignaturePad(){

const canvas =
document.getElementById(
"signaturePad"
);

signaturePad =
new SignaturePad(canvas,{

backgroundColor:"white",
penColor:"black"

});

}

function clearSignaturePad(){

signaturePad.clear();

showToast(
"Signature Cleared ✔"
);

}

/* =========================================
TOAST
========================================= */

function showToast(msg){

const toast =
document.createElement("div");

toast.className =
"agi-toast";

toast.innerText = msg;

document.body.appendChild(toast);

setTimeout(()=>{

toast.remove();

},3000);

}

/* =========================================
GENERATE
========================================= */

function generateAffidavit(){

const name =
document.getElementById("name").value;

const father =
document.getElementById("father").value;

const age =
document.getElementById("age").value;

const address =
document.getElementById("address").value;

const details =
document.getElementById("details").value;

const purpose =
document.getElementById("purposeType").value;

const stamp =
document.getElementById("stampAmount").value;

if(!name || !father || !age){

showToast(
"Fill required fields ❌"
);

return;

}

let sign = "";

if(!signaturePad.isEmpty()){

sign =
`<img
src="${signaturePad.toDataURL()}"
style="height:90px;">`;

}

document.getElementById(
"previewArea"
).innerHTML = `

<div class="stamp">
${stamp}
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
<b>${name}</b>,
S/o
<b>${father}</b>,
aged about
<b>${age}</b>
years,
resident of
<b>${address}</b>.
</p>

<p>
Purpose:
<b>${purpose}</b>
</p>

<p>
${details}
</p>

<br><br>

${sign}

<div id="qrCodeContainer"
style="
margin-top:30px;
display:flex;
justify-content:center;
">
</div>

</div>

`;

generateQRCode();

let total =
Number(
localStorage.getItem(
"totalDocs"
) || 0
);

total++;

localStorage.setItem(
"totalDocs",
total
);

document.getElementById(
"totalDocs"
).innerText =
total;

showToast(
"Affidavit Generated ✔"
);

}

/* =========================================
QR
========================================= */

function generateQRCode(){

const qr =
document.getElementById(
"qrCodeContainer"
);

if(!qr) return;

qr.innerHTML = "";

new QRCode(qr,{

text:location.href,

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
PNG
========================================= */

function exportPNG(){

html2canvas(
document.getElementById(
"previewArea"
)
).then(canvas=>{

const link =
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

const text =
document.getElementById(
"previewArea"
).innerText;

window.open(
`https://wa.me/?text=${encodeURIComponent(text)}`,
"_blank"
);

}

/* =========================================
LOGOUT
========================================= */

function logout(){

showToast(
"Logged out ✔"
);

setTimeout(()=>{

location.href =
"login.html";

},1000);

}

/* =========================================
SUPPORT
========================================= */

document.getElementById(
"supportBtn"
).onclick = ()=>{

window.open(
"https://wa.me/917780936452",
"_blank"
);

};

/* =========================================
PWA
========================================= */

window.addEventListener(
"beforeinstallprompt",
(e)=>{

e.preventDefault();

deferredPrompt = e;

showToast(
"PWA Ready 🚀"
);

});

async function triggerInstallApp(){

if(!deferredPrompt){

showToast(
"Use Chrome → Add to Home Screen"
);

return;

}

deferredPrompt.prompt();

}

/* =========================================
LOAD
========================================= */

window.onload = ()=>{

initializeSignaturePad();

document.getElementById(
"totalDocs"
).innerText =
localStorage.getItem(
"totalDocs"
) || 0;

showToast(
"AGI ULTRA Ready 🚀"
);

};

/* =========================================
SERVICE WORKER
========================================= */

if("serviceWorker" in navigator){

navigator.serviceWorker.register(
"./sw.js"
);

}

</script>

</body>
</html>
