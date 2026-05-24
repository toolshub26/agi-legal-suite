(function() {
  // ---------------------------- GLOBALS ----------------------------
  let currentSignatureDataURL = "", currentDocID = "";
  let totalDocs = 0, totalExports = 0;
  let history = [];
  let qrInstance = null;
  let db = null;
  let lockPIN = localStorage.getItem("appPIN") || null;
  let isUnlocked = false;
  let debounceTimer = null, saveTimer = null;
  let signaturePad = null, sigBackup = null;
  const canvas = document.getElementById('signatureCanvas');
  const translations = {
    en: { title:"AFFIDAVIT", notary:"BEFORE THE NOTARY PUBLIC", intro:"I, {name}, son/daughter of {father}, resident of {address}, do hereby solemnly affirm:", c1:"1. That the deponent is competent to swear this affidavit.", c2:"2. Purpose of affidavit: {purpose}.", c3:"3. Sworn statement: {statement}.", c4:"4. I declare under penalty of perjury that above is true.", verified:"Verified under law of {country}.", place:"Place: ___________", date:"Date: {date}", leftSig:"Signature of Deponent", rightSig:"Signature & Seal of Notary", footer:"Document ID: " },
    ur: { title:"حلف نامہ", notary:"عدالتی حلف نامہ", intro:"میں {name} ولد {father} ساکن {address} حلفیہ بیان دیتا ہوں:", c1:"1۔ حلف نامہ دینے والا قانونی اہل ہے۔", c2:"2۔ مقصد: {purpose}", c3:"3۔ حلفیہ بیان: {statement}", c4:"4۔ بیان درست ہے۔", verified:"قانون {country} کے تحت توثیق شدہ", place:"مقام: ___________", date:"تاریخ: {date}", leftSig:"حلف نامہ دہندہ کے دستخط", rightSig:"نوٹری عوامی دستخط و مہر", footer:"دستاویز نمبر: " },
    hi: { title:"शपथ पत्र", notary:"नोटरी पब्लिक के समक्ष", intro:"मैं {name}, पुत्र/पुत्री {father}, निवासी {address}, सत्यनिष्ठा से शपथ लेता/लेती हूँ:", c1:"1. शपथकर्ता साक्ष्य देने योग्य है।", c2:"2. प्रयोजन: {purpose}", c3:"3. शपथ वक्तव्य: {statement}", c4:"4. सभी तथ्य सही हैं।", verified:"{country} के अधिनियम के अधीन सत्यापित", place:"स्थान: ___________", date:"तिथि: {date}", leftSig:"शपथकर्ता के हस्ताक्षर", rightSig:"नोटरी के हस्ताक्षर एवं मुहर", footer:"दस्तावेज़ आईडी: " },
    ar: { title:"إفادة خطية", notary:"أمام كاتب العدل", intro:"أنا {name} ابن {father} المقيم في {address} أشهد بأن:", c1:"١. المقر قانوني ومختص.", c2:"٢. الغرض: {purpose}.", c3:"٣. البيان: {statement}.", c4:"٤. كل ما ورد صحيح.", verified:"موثق بموجب قانون {country}.", place:"المكان: ___________", date:"التاريخ: {date}", leftSig:"توقيع المقر", rightSig:"توقيع وختم كاتب العدل", footer:"معرف المستند: " },
    bn: { title:"শপথপত্র", notary:"নোটারি পাবলিকের সম্মুখে", intro:"আমি {name}, {father}-এর পুত্র/কন্যা, {address} -এর বাসিন্দা, গম্ভীরভাবে শপথ করে বলছি:", c1:"১. শপথকারী এই affidavit দিতে যোগ্য।", c2:"২. affidavit-এর উদ্দেশ্য: {purpose}।", c3:"৩. শপথবাক্য: {statement}।", c4:"৪. উপরিউক্ত তথ্য সত্য।", verified:"{country} আইনের অধীনে সত্যায়িত।", place:"স্থান: ___________", date:"তারিখ: {date}", leftSig:"শপথকারীর স্বাক্ষর", rightSig:"নোটারির স্বাক্ষর ও সিল", footer:"নথি নম্বর: " },
    fr: { title:"ATTESTATION", notary:"DEVANT LE NOTAIRE PUBLIC", intro:"Je, {name}, fils/fille de {father}, résidant à {address}, déclare solennellement :", c1:"1. Le déclarant est compétent pour prêter serment.", c2:"2. But de l'attestation : {purpose}.", c3:"3. Déclaration : {statement}.", c4:"4. Les faits sont vrais.", verified:"Vérifié selon la loi de {country}.", place:"Lieu : ___________", date:"Date : {date}", leftSig:"Signature du déclarant", rightSig:"Signature et sceau du notaire", footer:"ID document : " },
    tr: { title:"YEMİN BEYANI", notary:"NOTER HAKİMİ ÖNÜNDE", intro:"Ben {name}, {father}'in oğlu/kızı, {address} ikametgâhında, ciddiyetle beyan ederim:", c1:"1. Beyan sahibi yemin etmeye yetkilidir.", c2:"2. Amaç: {purpose}.", c3:"3. Beyan: {statement}.", c4:"4. Yukarıdakiler doğrudur.", verified:"{country} yasalarına göre onaylanmıştır.", place:"Yer: ___________", date:"Tarih: {date}", leftSig:"Beyan sahibinin imzası", rightSig:"Noterin imzası ve mührü", footer:"Belge No: " },
    fa: { title:"اقدامنامه", notary:"در حضور سردفتر اسناد رسمی", intro:"من {name} پسر/دختر {father} ساکن {address} رسماً سوگند یاد می‌کنم:", c1:"۱. اقدام‌کننده صلاحیت سوگند دارد.", c2:"۲. هدف اقدامنامه: {purpose}.", c3:"۳. اظهارات: {statement}.", c4:"۴. همه موارد صحیح است.", verified:"طبق قانون {country} تأیید شد.", place:"مکان: ___________", date:"تاریخ: {date}", leftSig:"امضاء اقدام‌کننده", rightSig:"امضاء و مهر سردفتر", footer:"شناسه سند: " }
  };

  // ---------------------------- UTILITIES ----------------------------
  function sanitize(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[m] || m)); }
  function getLang() { return document.getElementById('langSelect').value; }
  function showToast(msg, isError=false) {
    const toast = document.createElement('div'); toast.className = 'toast'; toast.innerText = msg; if(isError) toast.style.borderLeftColor = '#e74c3c';
    document.getElementById('toastContainer').appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }
  function updateAnalytics() {
    document.getElementById('totalDocsCount').innerText = totalDocs;
    document.getElementById('totalExportsCount').innerText = totalExports;
    if(history.length) {
      const purposes = history.map(h => h.purpose);
      const freq = purposes.reduce((acc, p) => { acc[p] = (acc[p]||0)+1; return acc; }, {});
      const top = Object.keys(freq).reduce((a,b) => freq[a] > freq[b] ? a : b, '');
      document.getElementById('topPurpose').innerText = top || '-';
    }
  }

  // ---------------------------- INDEXEDDB ----------------------------
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open("AGI_AffidavitDB", 2);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("history")) db.createObjectStore("history", { keyPath: "id" });
        if (!db.objectStoreNames.contains("drafts")) db.createObjectStore("drafts", { keyPath: "docID" });
        if (!db.objectStoreNames.contains("signatures")) db.createObjectStore("signatures", { keyPath: "name" });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  async function saveHistoryToDB() {
    if(!db) return;
    const tx = db.transaction('history', 'readwrite');
    const store = tx.objectStore('history');
    store.clear();
    history.forEach(h => store.put(h));
  }
  async function loadHistoryFromDB() {
    if(!db) return [];
    const tx = db.transaction('history', 'readonly');
    const store = tx.objectStore('history');
    return new Promise(resolve => { const req = store.getAll(); req.onsuccess = () => resolve(req.result); });
  }
  async function saveDraft(draft) {
    if(!db) return;
    const tx = db.transaction('drafts', 'readwrite');
    tx.objectStore('drafts').put(draft);
  }
  async function loadDraft() {
    if(!db) return null;
    const tx = db.transaction('drafts', 'readonly');
    return new Promise(resolve => { const req = tx.objectStore('drafts').get('currentDraft'); req.onsuccess = () => resolve(req.result || null); });
  }

  // ---------------------------- APP LOCK ----------------------------
  function checkLock() {
    if (lockPIN && !isUnlocked) {
      document.getElementById('appLockScreen').style.display = 'flex';
      document.getElementById('appContent').style.display = 'none';
    } else {
      document.getElementById('appLockScreen').style.display = 'none';
      document.getElementById('appContent').style.display = 'block';
    }
  }
  function unlockApp(pin) {
    if (pin === lockPIN) { isUnlocked = true; checkLock(); showToast("Unlocked"); }
    else showToast("Wrong PIN", true);
  }
  function setNewPIN(pin) { if(pin.length>=4) { localStorage.setItem("appPIN", pin); lockPIN = pin; showToast("PIN set"); } else showToast("PIN too short", true); }
  document.getElementById('unlockBtn').addEventListener('click', () => unlockApp(document.getElementById('lockPin').value));
  document.getElementById('setPinBtn').addEventListener('click', () => setNewPIN(document.getElementById('lockPin').value));

  // ---------------------------- SIGNATURE PAD ----------------------------
  function initSignaturePad() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(2, window.devicePixelRatio || 1);
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    if(signaturePad) { signaturePad.clear(); if(sigBackup) signaturePad.fromData(sigBackup); }
    else signaturePad = new SignaturePad(canvas, { minDistance: 1, dotSize: 1.5, throttle: 16 });
  }
  function backupSignature() { if(signaturePad && !signaturePad.isEmpty()) { sigBackup = signaturePad.toData(); currentSignatureDataURL = signaturePad.toDataURL(); } else { sigBackup = null; currentSignatureDataURL = ""; } }
  window.addEventListener('resize', () => { backupSignature(); initSignaturePad(); renderAffidavit(); });
  window.addEventListener('orientationchange', () => { setTimeout(() => { backupSignature(); initSignaturePad(); renderAffidavit(); }, 100); });
  initSignaturePad();
  document.getElementById('clearSignatureBtn').onclick = () => { signaturePad.clear(); sigBackup = null; currentSignatureDataURL = ""; renderAffidavit(); showToast("Signature cleared"); };
  document.getElementById('saveSignatureBtn').onclick = () => { if(signaturePad.isEmpty()) { showToast("Please draw signature first", true); return; } backupSignature(); renderAffidavit(); showToast("Signature saved"); };

  // ---------------------------- PURPOSE LIST ----------------------------
  const allPurposes = [
    "Name Change","Marriage","Income Proof","Passport Verification","Court Submission","Property Transfer",
    "Bank Loan","Education Loan","Visa Application","Aadhaar Correction","GST Registration","Police Verification",
    "Trademark Filing","Copyright Claim","Research Ethics","Startup Funding","Business Agreement","NGO Registration",
    "University Degree","Employment Contract","Residential Proof","Affidavit of Heirship","Lost Document",
    "Affidavit of Support","Guardianship","Medical Consent","Name Correction","Date of Birth Affidavit",
    "Single Status","Divorce Decree","No Objection Certificate","Affidavit of Residence","Business License",
    "Tax Residency","Vehicle Ownership","Insurance Claim","Intellectual Property","Export License","Customs Declaration",
    "Legal Heir","Succession Certificate","Indemnity Bond","Will Registration","Partnership Deed","Merger Filing",
    "Non-Criminal Record","Police Clearance","Character Certificate","Student Visa","Work Permit","Family Visa",
    "Sponsorship Affidavit","Real Estate Transfer","Mortgage Affidavit","Rental Agreement","Tenancy Dispute",
    "Labor Dispute","Arbitration","Mediation","Contract Review","Trademark Opposition","Patent Filing",
    "Utility Model","Industrial Design","Geographical Indication","Startup India","MSME Registration","IEC Code",
    "GST Cancellation","Income Tax Appeal","Customs Appeal","Bank Guarantee","Affidavit of Truth","Witness Statement",
    "Police Complaint","FIR Affidavit","Bail Affidavit","Anticipatory Bail","Interim Relief","Probate",
    "Letters of Administration","Legal Notice","Cease and Desist","Tender Document","Government Tender",
    "RTI Affidavit","Election Affidavit","NOC from Landlord","Construction Permit","Environmental Clearance",
    "Factory License","Trade License","FSSAI License","Drug License","Medical Practice","Nursing Registration",
    "Engineering Council","Architect Certification"
  ];
  for(let i=0;i<30;i++) allPurposes.push(`Legal Purpose ${i+100}`);
  function populatePurposes(filter='') {
    const select = document.getElementById('purposeDropdown');
    const current = select.value;
    select.innerHTML = '';
    const filtered = allPurposes.filter(p => p.toLowerCase().includes(filter.toLowerCase()));
    filtered.forEach(p => { const opt = document.createElement('option'); opt.value = p; opt.textContent = p; select.appendChild(opt); });
    if(filtered.includes(current)) select.value = current;
    else if(filtered.length) select.value = filtered[0];
  }
  document.getElementById('purposeSearch').addEventListener('input', e => populatePurposes(e.target.value));
  document.getElementById('langSelect').addEventListener('change', () => { populatePurposes(document.getElementById('purposeSearch').value); renderAffidavit(); });

  // ---------------------------- RENDER AFFIDAVIT ----------------------------
  function getToday() { return new Date().toLocaleDateString('en-GB'); }
  function validateFields() { let valid = true; ['fullName','fatherName','address'].forEach(id => { const el = document.getElementById(id); if(!el.value.trim()) { el.classList.add('error'); valid=false; } else el.classList.remove('error'); }); if(!valid) showToast("Please fill required fields", true); return valid; }
  function enhanceStatement(text, country) {
    if(!document.getElementById('aiEnhanceToggle').checked) return text;
    let enhanced = text.replace(/declare/gi, 'solemnly declare under oath').replace(/true/gi, 'true and correct');
    if(country === 'UAE') enhanced += " according to UAE Federal Law No. 5/1985.";
    else if(country === 'India') enhanced += " under the Indian Evidence Act, 1872.";
    return enhanced;
  }
  function renderAffidavit() {
    if(!validateFields()) return;
    const lang = getLang(); const t = translations[lang];
    let name = sanitize(document.getElementById('fullName').value.trim()); if(!name) name = "Deponent";
    let father = sanitize(document.getElementById('fatherName').value.trim()); if(!father) father = "N/A";
    let address = sanitize(document.getElementById('address').value.trim()); if(!address) address = "Not Provided";
    let statement = enhanceStatement(sanitize(document.getElementById('swornStatement').value), document.getElementById('countrySelect').value);
    const purpose = sanitize(document.getElementById('purposeDropdown').value);
    const country = sanitize(document.getElementById('countrySelect').value);
    const template = document.getElementById('templateSelect').value;
    const dateStr = getToday();
    let content = `<div style="text-align:center;"><h1>${t.title}</h1><p>${t.notary}</p></div>`;
    if(template==='court') content = `<div style="border:2px solid #333; padding:1rem;">${content}`;
    else if(template==='modern') content = `<div style="background:#f9f3e7; padding:1rem;">${content}`;
    else if(template==='compact') content = `<div style="font-size:0.9rem;">${content}`;
    content += `<p>${t.intro.replace('{name}',name).replace('{father}',father).replace('{address}',address)}</p>`;
    content += `<p>${t.c1}</p><p>${t.c2.replace('{purpose}',purpose)}</p><p>${t.c3.replace('{statement}',statement)}</p><p>${t.c4}</p>`;
    content += `<p>${t.verified.replace('{country}',country)}</p>`;
    content += `<div style="display:flex; justify-content:space-between; margin:20px 0;"><span>${t.place}</span><span>${t.date.replace('{date}',dateStr)}</span></div>`;
    content += `<div class="signature-grid"><div class="signature-col"><div class="signature-line"></div><div>${t.leftSig}</div>${currentSignatureDataURL ? `<img src="${currentSignatureDataURL}" style="max-width:100%; margin-top:5px;">` : `<div style="height:30px;"></div>`}</div>`;
    content += `<div class="signature-col"><div class="signature-line"></div><div>${t.rightSig}</div></div></div>`;
    content += `<div class="notary-head" style="font-weight:bold; text-align:right; margin-top:15px;">Notary Reg: ${((currentDocID || "AGI-0000").slice(-6))}</div>`;
    if(template!=='standard') content += `</div>`;
    document.getElementById('dynamicAffidavitContent').innerHTML = content;
    document.getElementById('affidavitContainer').setAttribute('dir', lang==='ar' ? 'rtl' : 'ltr');
    document.getElementById('docFooter').innerHTML = `${t.footer} ${currentDocID} • AGI PRO`;
    // QR
    const qrDiv = document.getElementById('qrArea');
    const qrText = `AGI:${currentDocID}|${name}|${country}`;
    if (!qrInstance) { while(qrDiv.firstChild) qrDiv.removeChild(qrDiv.firstChild); qrInstance = new QRCode(qrDiv, { text: qrText, width: 90, height: 90, correctLevel: QRCode.CorrectLevel.H }); }
    else { qrInstance.clear(); qrInstance.makeCode(qrText); }
    // watermark & seal
    document.getElementById('watermarkElem').style.display = document.getElementById('watermarkToggle').checked ? 'block' : 'none';
    const seal = document.getElementById('sealColorSelect').value;
    const stampDiv = document.getElementById('stampElem'); stampDiv.className = `stamp ${seal}`;
    stampDiv.innerText = seal==='gold' ? '⚖️ NOTARY GOLD SEAL' : (seal==='blue' ? '🔵 NOTARY SEAL' : '📜 NOTARY SEAL');
    // autosave draft
    if(saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { const draft = { name, father, address, country, purpose, statement, docID: currentDocID, signature: currentSignatureDataURL, template, sealColor: seal, watermark: document.getElementById('watermarkToggle').checked }; saveDraft(draft); const badge = document.getElementById('saveBadge'); badge.style.display = 'inline-block'; setTimeout(() => badge.style.display = 'none', 800); }, 500);
  }

  // ---------------------------- HISTORY & GENERATE ----------------------------
  async function addToHistory() {
    const entry = { id: currentDocID, name: sanitize(document.getElementById('fullName').value), date: new Date().toISOString(), purpose: document.getElementById('purposeDropdown').value };
    history.unshift(entry);
    if(history.length>10) history.pop();
    await saveHistoryToDB();
    renderHistory();
    updateAnalytics();
  }
  function renderHistory() {
    const container = document.getElementById('historyContainer');
    container.innerHTML = '';
    history.forEach(h => {
      const div = document.createElement('div'); div.className = 'history-item';
      div.innerText = `${h.id.slice(-8)} - ${h.name}`;
      div.onclick = () => { document.getElementById('fullName').value = h.name; document.getElementById('purposeDropdown').value = h.purpose; renderAffidavit(); showToast("Restored from history"); };
      container.appendChild(div);
    });
  }
  function generateNewID() { if(!validateFields()) return; currentDocID = "AGI-"+Date.now()+"-"+Math.floor(Math.random()*10000); renderAffidavit(); totalDocs++; localStorage.setItem("totalAffidavits", totalDocs); addToHistory(); showToast("New ID created"); }
  async function recoverDraft() {
    const draft = await loadDraft();
    if(draft) {
      document.getElementById('fullName').value = draft.name; document.getElementById('fatherName').value = draft.father;
      document.getElementById('address').value = draft.address; document.getElementById('countrySelect').value = draft.country;
      if(draft.purpose) document.getElementById('purposeDropdown').value = draft.purpose;
      document.getElementById('swornStatement').value = draft.statement;
      currentDocID = draft.docID || ("AGI-"+Date.now()+"-"+Math.floor(Math.random()*10000));
      currentSignatureDataURL = draft.signature || "";
      if(draft.template) document.getElementById('templateSelect').value = draft.template;
      if(draft.sealColor) document.getElementById('sealColorSelect').value = draft.sealColor;
      document.getElementById('watermarkToggle').checked = draft.watermark !== false;
      renderAffidavit();
      showToast("Draft restored");
    } else { currentDocID = "AGI-"+Date.now()+"-"+Math.floor(Math.random()*10000); renderAffidavit(); }
  }

  // ---------------------------- EXPORT (PDF, PNG, progress) ----------------------------
  function showProgressModal() { document.getElementById('progressModal').style.display = 'flex'; }
  function updateProgress(percent) { document.getElementById('exportProgress').style.width = percent+'%'; document.getElementById('progressText').innerText = percent+'%'; }
  function hideProgressModal() { document.getElementById('progressModal').style.display = 'none'; }
  async function withProgress(fn) {
    showProgressModal(); updateProgress(0);
    try { await fn(); totalExports++; localStorage.setItem("totalExports", totalExports); updateAnalytics(); showToast("Export completed"); }
    catch(e) { showToast("Export failed", true); console.error(e); }
    finally { hideProgressModal(); }
  }
  document.getElementById('pdfExportBtn').addEventListener('click', () => withProgress(async () => {
    const quality = document.getElementById('qualitySelect').value;
    const scale = quality==='ultra'?4:(quality==='high'?3:2);
    const element = document.getElementById('affidavitContainer');
    await html2pdf().from(element).set({ margin: 0.4, filename: `Affidavit_${currentDocID}.pdf`, html2canvas: { scale, useCORS: true, letterRendering: true }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } }).save();
    updateProgress(100);
  }));
  document.getElementById('pngExportBtn').addEventListener('click', () => withProgress(async () => {
    const quality = document.getElementById('qualitySelect').value;
    const scale = quality==='ultra'?4:(quality==='high'?3:2);
    const canvasImg = await html2canvas(document.getElementById('affidavitContainer'), { scale, backgroundColor: '#ffffff', useCORS: true, letterRendering: true });
    const link = document.createElement('a'); link.download = `affidavit_${currentDocID}.png`; link.href = canvasImg.toDataURL(); link.click();
    updateProgress(100);
  }));
  document.getElementById('copyTextBtn').addEventListener('click', () => { const text = document.getElementById('dynamicAffidavitContent').innerText; navigator.clipboard.writeText(text); showToast("Copied"); });
  document.getElementById('printNowBtn').addEventListener('click', () => window.print());

  // ---------------------------- VOICE INPUT & OCR (Tesseract) ----------------------------
  document.getElementById('voiceInputBtn').addEventListener('click', () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = getLang() === 'ar' ? 'ar-AE' : 'en-US';
    recognition.onresult = (e) => { document.getElementById('swornStatement').value = e.results[0][0].transcript; renderAffidavit(); };
    recognition.start();
  });
  document.getElementById('ocrUploadBtn').addEventListener('click', () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*,application/pdf';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if(!file) return;
      showToast("OCR processing...");
      try {
        const { data: { text } } = await Tesseract.recognize(file, 'eng+ara');
        document.getElementById('swornStatement').value = text.substring(0, 500);
        renderAffidavit();
        showToast("OCR completed");
      } catch(err) { showToast("OCR failed", true); }
    };
    input.click();
  });

  // ---------------------------- DIGITAL STAMP GENERATOR ----------------------------
  document.getElementById('generateDigitalStampBtn').addEventListener('click', () => {
    const stampCanvas = document.createElement('canvas'); stampCanvas.width = 300; stampCanvas.height = 300;
    const ctx = stampCanvas.getContext('2d');
    ctx.beginPath(); ctx.arc(150,150,130,0,2*Math.PI); ctx.strokeStyle = '#b22222'; ctx.lineWidth = 8; ctx.stroke();
    ctx.font = 'bold 20px "Times New Roman"'; ctx.fillStyle = '#b22222'; ctx.fillText('NOTARY PUBLIC', 70, 160);
    ctx.font = '16px serif'; ctx.fillText('SEAL', 130, 200);
    const stampURL = stampCanvas.toDataURL();
    const stampImg = document.createElement('img'); stampImg.src = stampURL; stampImg.style.position = 'absolute'; stampImg.style.bottom = '100px'; stampImg.style.right = '50px'; stampImg.style.width = '100px';
    document.getElementById('affidavitContainer').appendChild(stampImg);
    showToast("Digital stamp added");
  });

  // ---------------------------- BACKUP / RESTORE JSON ----------------------------
  document.getElementById('backupBtn').addEventListener('click', () => {
    const data = { history, totalDocs, totalExports, settings: { theme: document.body.classList.contains('light') ? 'light' : 'dark', pin: lockPIN } };
    const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'agi_backup.json'; a.click(); URL.revokeObjectURL(url);
  });
  document.getElementById('restoreBtn').addEventListener('click', () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = e.target.files[0]; const text = await file.text(); const data = JSON.parse(text);
      history = data.history || []; totalDocs = data.totalDocs || 0; totalExports = data.totalExports || 0;
      localStorage.setItem("totalAffidavits", totalDocs); localStorage.setItem("totalExports", totalExports);
      if(data.settings?.pin) localStorage.setItem("appPIN", data.settings.pin);
      await saveHistoryToDB(); renderHistory(); updateAnalytics(); renderAffidavit(); showToast("Restored from backup");
    };
    input.click();
  });

  // ---------------------------- THEME, INSTALL, NAVIGATION ----------------------------
  document.getElementById('themeToggleBtn').addEventListener('click', () => { document.body.classList.toggle('light'); localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark'); });
  if(localStorage.getItem('theme') === 'light') document.body.classList.add('light');
  let deferredPrompt; window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; document.getElementById('installAppBtn').style.display = 'inline-block'; });
  document.getElementById('installAppBtn').addEventListener('click', () => { if(deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.then(() => deferredPrompt = null); } else showToast("Install not available", true); });
  document.getElementById('freeVersionBtn').onclick = () => window.location.href='index.html';
  document.getElementById('premiumVersionBtn').onclick = () => window.location.href='premium.html';
  document.getElementById('logoutBtn').onclick = () => { localStorage.clear(); alert("Logged out"); location.reload(); };
  document.getElementById('generateAffidavitBtn').onclick = generateNewID;
  document.getElementById('mobileGenerateBtn').onclick = generateNewID;
  document.getElementById('watermarkToggle').addEventListener('change', () => renderAffidavit());
  document.getElementById('sealColorSelect').addEventListener('change', () => renderAffidavit());
  document.getElementById('templateSelect').addEventListener('change', () => renderAffidavit());
  ['fullName','fatherName','address','countrySelect','swornStatement'].forEach(id => document.getElementById(id).addEventListener('input', () => { if(debounceTimer) clearTimeout(debounceTimer); debounceTimer = setTimeout(() => renderAffidavit(), 300); }));
  document.getElementById('purposeDropdown').addEventListener('change', () => renderAffidavit());

  // ---------------------------- OFFLINE DETECTION, RESIZE OBSERVER ---------------------------
  window.addEventListener('online', () => { document.getElementById('offlineBanner').style.display = 'none'; showToast("Online"); });
  window.addEventListener('offline', () => { document.getElementById('offlineBanner').style.display = 'block'; showToast("Offline", true); });
  new ResizeObserver(() => { const paper = document.getElementById('affidavitContainer'); if(paper && paper.scrollHeight > paper.clientHeight+80) paper.style.fontSize = '0.9rem'; else if(paper) paper.style.fontSize = ''; }).observe(document.getElementById('affidavitContainer'));

  // ---------------------------- INITIALIZATION ----------------------------
  async function init() {
    db = await openDB();
    history = await loadHistoryFromDB();
    totalDocs = parseInt(localStorage.getItem("totalAffidavits") || "0");
    totalExports = parseInt(localStorage.getItem("totalExports") || "0");
    updateAnalytics();
    renderHistory();
    populatePurposes('');
    await recoverDraft();
    checkLock();
  }
  init();
})();
