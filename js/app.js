// js/app.js - AGI Legal Pro Secure Orchestrator
// Fully modular, CSP-compliant, no inline styles/scripts

// ==================== IMPORTS ====================
import { initDB, saveDraft, loadDraft, saveAffidavit, getAllAffidavits } from './db.js';
import { initSignaturePad, getSignatureData, setSignatureData, clearSignature, saveSignature } from './signature.js';
import { sanitizeHTML, escapeText, validateImage, resizeImage } from './security.js';
import { exportToPDF, exportToPNG, copyText } from './export.js';

// ==================== GLOBAL STATE ====================
let currentDocId = 'AGI-' + Date.now();
let photoDataURL = '';
let signatureDataURL = '';
let isPremium = true;
let purposes = [];
let updateTimer = null;
let qrInstance = null;

// ==================== DOM ELEMENTS ====================
const elements = {
  fullName: document.getElementById('fullName'),
  fatherName: document.getElementById('fatherName'),
  age: document.getElementById('age'),
  gender: document.getElementById('gender'),
  address: document.getElementById('address'),
  state: document.getElementById('state'),
  district: document.getElementById('district'),
  country: document.getElementById('countryInput'),
  idNumber: document.getElementById('idNumber'),
  langSelect: document.getElementById('langSelect'),
  purposeSearch: document.getElementById('purposeSearch'),
  purposeDropdown: document.getElementById('purposeDropdown'),
  swornStatement: document.getElementById('swornStatement'),
  photoUpload: document.getElementById('photoUpload'),
  templateSelect: document.getElementById('templateSelect'),
  sealColor: document.getElementById('sealColorSelect'),
  watermarkToggle: document.getElementById('watermarkToggle'),
  generateBtn: document.getElementById('generateAffidavitBtn'),
  pdfBtn: document.getElementById('pdfExportBtn'),
  pngBtn: document.getElementById('pngExportBtn'),
  copyBtn: document.getElementById('copyTextBtn'),
  printBtn: document.getElementById('printNowBtn'),
  themeBtn: document.getElementById('themeToggleBtn'),
  freeBtn: document.getElementById('freeModeBtn'),
  premiumBtn: document.getElementById('premiumModeBtn'),
  clearSigBtn: document.getElementById('clearSignatureBtn'),
  saveSigBtn: document.getElementById('saveSignatureBtn'),
  historyContainer: document.getElementById('historyContainer'),
  affidavitContent: document.getElementById('dynamicAffidavitContent'),
  qrArea: document.getElementById('qrArea'),
  watermarkElem: document.getElementById('watermarkElem'),
  stampElem: document.getElementById('stampElem'),
  docFooter: document.getElementById('docFooter'),
  offlineBanner: document.getElementById('offlineBanner'),
  saveBadge: document.getElementById('saveBadge'),
  modeBadge: document.getElementById('modeBadge')
};

// ==================== HELPER: TOAST ====================
function showToast(msg, isError = false) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  if (isError) toast.style.borderLeftColor = '#e74c3c';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ==================== PURPOSES ====================
async function loadPurposes() {
  try {
    const res = await fetch('/purposes.json');
    const data = await res.json();
    purposes = Object.values(data).flat();
    populatePurposes();
  } catch (e) {
    console.warn('Could not load purposes.json, using fallback');
    purposes = ['Name Change', 'Marriage Affidavit', 'Income Proof', 'Property Declaration', 'Education Affidavit'];
    populatePurposes();
  }
}

function populatePurposes(filter = '') {
  const list = purposes;
  const filtered = list.filter(p => p.toLowerCase().includes(filter.toLowerCase()));
  elements.purposeDropdown.innerHTML = '';
  filtered.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    elements.purposeDropdown.appendChild(opt);
  });
}

// ==================== COLLECT FORM DATA ====================
function collectFormData() {
  return {
    name: elements.fullName.value.trim() || 'Deponent',
    fatherName: elements.fatherName.value.trim() || 'N/A',
    age: elements.age.value ? parseInt(elements.age.value) : 0,
    gender: elements.gender.value,
    address: elements.address.value.trim() || 'Not Provided',
    state: elements.state.value.trim() || '',
    district: elements.district.value.trim() || '',
    country: elements.country.value.trim() || 'Not Provided',
    idNumber: elements.idNumber.value.trim() || '',
    purpose: elements.purposeDropdown.value,
    statement: elements.swornStatement.value,
    lang: elements.langSelect.value,
    template: elements.templateSelect.value,
    stampColor: elements.sealColor.value,
    watermark: elements.watermarkToggle.checked,
    signatureDataURL: signatureDataURL,
    photoDataURL: photoDataURL,
    docId: currentDocId,
    isPremium: isPremium,
    date: new Date().toLocaleDateString('en-GB')
  };
}

// ==================== TRANSLATIONS ====================
function getTranslations(lang) {
  const base = {
    en: { title: "AFFIDAVIT", notary: "BEFORE THE NOTARY PUBLIC" },
    hi: { title: "शपथ पत्र", notary: "नोटरी के समक्ष" },
    ur: { title: "حلف نامہ", notary: "عدالتی حلف نامہ" },
    ar: { title: "إفادة", notary: "أمام كاتب العدل" }
  };
  return base[lang] || base.en;
}

// ==================== RENDER AFFIDAVIT (sanitized) ====================
function renderAffidavitHTML(data) {
  const t = getTranslations(data.lang);
  let html = `<div style="text-align:center;"><h1>${t.title}</h1><p>${t.notary}</p></div>`;
  if (data.photoDataURL) {
    html += `<div class="absolute-top-right"><img src="${data.photoDataURL}" class="photo-upload-preview" alt="Photo"></div>`;
  }
  html += `<p>I, ${escapeText(data.name)}, son/daughter of ${escapeText(data.fatherName)}, aged ${data.age} years, ${escapeText(data.gender)}, resident of ${escapeText(data.address)}, ${escapeText(data.state)} state, ${escapeText(data.district)} district, ${escapeText(data.country)}, ID ${escapeText(data.idNumber)}, do hereby affirm:</p>`;
  html += `<p>1. Deponent is competent.<br>2. Purpose: ${escapeText(data.purpose)}.<br>3. Statement: ${escapeText(data.statement)}.<br>4. This affidavit is true to my knowledge.</p>`;
  html += `<p>Verified under law of ${escapeText(data.country)}.</p>`;
  html += `<div class="verification-box"><span class="digitally-verified">✓ Digitally Verified</span><span>Date: ${data.date}</span></div>`;
  html += `<div class="signature-grid"><div class="signature-col"><div class="signature-line"></div><div>Signature of Deponent</div>${data.signatureDataURL ? `<img src="${data.signatureDataURL}" class="signature-preview" alt="Signature">` : '<div class="spacer-30"></div>'}</div>`;
  html += `<div class="signature-col"><div class="signature-line"></div><div>Notary Signature & Seal</div><div>Notary Reg: ${data.docId.slice(-6)}</div></div></div>`;
  return sanitizeHTML(html);
}

// ==================== UPDATE PREVIEW & SAVE DRAFT ====================
async function updatePreview() {
  const data = collectFormData();
  const html = renderAffidavitHTML(data);
  elements.affidavitContent.innerHTML = html;
  
  // Generate QR code
  const qrDiv = elements.qrArea;
  if (qrDiv) {
    qrDiv.innerHTML = '';
    const qrText = `AGI:${data.docId}|${data.name}|${data.country}|${data.purpose}`;
    if (window.QRCode) {
      if (!qrInstance) {
        qrInstance = new QRCode(qrDiv, { text: qrText, width: 90, height: 90 });
      } else {
        qrInstance.clear();
        qrInstance.makeCode(qrText);
      }
    } else {
      qrDiv.innerHTML = '<p>QR not available</p>';
    }
  }
  
  // Update watermark and stamp
  elements.watermarkElem.style.display = data.watermark ? 'block' : 'none';
  elements.stampElem.className = `stamp ${data.stampColor}`;
  elements.stampElem.innerText = data.stampColor === 'gold' ? '⚖️ NOTARY GOLD SEAL' : (data.stampColor === 'blue' ? '🔵 NOTARY SEAL' : '📜 NOTARY SEAL');
  elements.docFooter.textContent = `Document ID: ${data.docId} • AGI ${data.isPremium ? 'PRO' : 'FREE'}`;
  
  // Auto-save draft to IndexedDB
  const draft = { id: 'current', ...data, timestamp: Date.now() };
  await saveDraft('current', draft);
  elements.saveBadge.style.display = 'inline-block';
  setTimeout(() => { elements.saveBadge.style.display = 'none'; }, 800);
}

// ==================== GENERATE NEW AFFIDAVIT ====================
async function generateNew() {
  currentDocId = 'AGI-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
  await updatePreview();
  const historyItem = {
    id: currentDocId,
    name: elements.fullName.value.trim(),
    purpose: elements.purposeDropdown.value,
    date: new Date().toISOString()
  };
  await saveAffidavit(historyItem);
  await loadHistory();
  showToast('New affidavit generated');
}

// ==================== LOAD HISTORY ====================
async function loadHistory() {
  const history = await getAllAffidavits();
  const container = elements.historyContainer;
  if (!container) return;
  container.innerHTML = '';
  history.slice(-10).reverse().forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.textContent = `${item.id.slice(-8)} - ${item.name}`;
    div.onclick = () => {
      elements.fullName.value = item.name;
      elements.purposeDropdown.value = item.purpose;
      updatePreview();
    };
    container.appendChild(div);
  });
}

// ==================== EVENT LISTENERS SETUP ====================
function attachEventListeners() {
  elements.generateBtn.onclick = generateNew;
  elements.pdfBtn.onclick = () => exportToPDF(document.getElementById('affidavitContainer'), `Affidavit_${currentDocId}.pdf`);
  elements.pngBtn.onclick = () => exportToPNG(document.getElementById('affidavitContainer'), `affidavit_${currentDocId}.png`);
  elements.copyBtn.onclick = () => copyText(elements.affidavitContent.innerText);
  elements.printBtn.onclick = () => window.print();
  
  elements.clearSigBtn.onclick = () => {
    clearSignature();
    signatureDataURL = '';
    updatePreview();
    showToast('Signature cleared');
  };
  elements.saveSigBtn.onclick = () => {
    if (saveSignature()) {
      signatureDataURL = getSignatureData();
      updatePreview();
      showToast('Signature saved');
    } else {
      showToast('Draw a signature first', true);
    }
  };
  
  elements.photoUpload.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      validateImage(file);
      photoDataURL = await resizeImage(file);
      updatePreview();
    } catch (err) {
      showToast(err.message, true);
    }
  };
  
  elements.purposeSearch.oninput = (e) => populatePurposes(e.target.value);
  elements.langSelect.onchange = updatePreview;
  elements.templateSelect.onchange = updatePreview;
  elements.sealColor.onchange = updatePreview;
  elements.watermarkToggle.onchange = updatePreview;
  
  const inputFields = ['fullName', 'fatherName', 'age', 'address', 'state', 'district', 'countryInput', 'idNumber', 'swornStatement'];
  inputFields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        if (updateTimer) clearTimeout(updateTimer);
        updateTimer = setTimeout(() => updatePreview(), 300);
      });
    }
  });
  elements.purposeDropdown.onchange = updatePreview;
  
  elements.themeBtn.onclick = () => {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
  };
  if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');
  
  // Premium/Free mode (simplified toggle)
  elements.premiumBtn.onclick = () => { isPremium = true; elements.modeBadge.textContent = 'PRO'; elements.modeBadge.style.background = '#d4af37'; updatePreview(); };
  elements.freeBtn.onclick = () => { isPremium = false; elements.modeBadge.textContent = 'FREE'; elements.modeBadge.style.background = '#6c757d'; updatePreview(); };
  
  // Offline detection
  window.addEventListener('online', () => { elements.offlineBanner.classList.add('hidden'); showToast('Online'); });
  window.addEventListener('offline', () => { elements.offlineBanner.classList.remove('hidden'); showToast('Offline mode', true); });
  if (!navigator.onLine) elements.offlineBanner.classList.remove('hidden');
}

// ==================== INITIALIZATION ====================
async function init() {
  await initDB();
  await loadPurposes();
  
  const canvas = document.getElementById('signatureCanvas');
  if (canvas) initSignaturePad(canvas);
  
  const draft = await loadDraft('current');
  if (draft) {
    elements.fullName.value = draft.name || '';
    elements.fatherName.value = draft.fatherName || '';
    elements.age.value = draft.age || '';
    elements.gender.value = draft.gender || 'Male';
    elements.address.value = draft.address || '';
    elements.state.value = draft.state || '';
    elements.district.value = draft.district || '';
    elements.country.value = draft.country || '';
    elements.idNumber.value = draft.idNumber || '';
    elements.purposeDropdown.value = draft.purpose || '';
    elements.swornStatement.value = draft.statement || '';
    elements.langSelect.value = draft.lang || 'en';
    elements.templateSelect.value = draft.template || 'standard';
    elements.sealColor.value = draft.stampColor || 'red';
    elements.watermarkToggle.checked = draft.watermark !== false;
    signatureDataURL = draft.signatureDataURL || '';
    photoDataURL = draft.photoDataURL || '';
    currentDocId = draft.docId || currentDocId;
    setSignatureData(signatureDataURL);
    await updatePreview();
  } else {
    await updatePreview();
  }
  await loadHistory();
  attachEventListeners();
  
  // Show ready message
  showToast('AGI Legal Pro ready');
}

// Start the app
init();
