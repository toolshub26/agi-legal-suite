// render.js - builds affidavit HTML from data
import { sanitize, translations, getLang, translateGender, getCurrentTimestamp, getVerificationURL } from './app.js';

export function buildAffidavitHTML(data) {
  const {
    name, father, age, gender, address, state, district, country,
    idType, idNumber, purpose, statement, template, dateStr,
    timestamp, docID, uploadedPhoto, signatureURL, sealColor, lang
  } = data;
  const t = translations[lang];
  let content = `<div class="text-center"><h1>${t.title}</h1><p>${t.notary}</p></div>`;
  if (uploadedPhoto) {
    content += `<div class="absolute-top-right"><img src="${uploadedPhoto}" class="photo-upload-preview"></div>`;
  }
  if (template === 'court') content = `<div style="border:2px solid #333; padding:1rem;">${content}`;
  else if (template === 'modern') content = `<div style="background:#f9f3e7; padding:1rem;">${content}`;
  else if (template === 'compact') content = `<div style="font-size:0.9rem;">${content}`;

  content += `<p>${t.intro
    .replace('{name}', name).replace('{father}', father).replace('{age}', age).replace('{gender}', gender)
    .replace('{address}', address).replace('{state}', state).replace('{district}', district).replace('{country}', country)
    .replace('{idType}', idType).replace('{idNumber}', idNumber)}</p>`;
  content += `<p>${t.c1}</p><p>${t.c2.replace('{purpose}', purpose)}</p>`;
  content += `<p>${t.c3.replace('{statement}', statement)}</p><p>${t.c4}</p>`;
  content += `<p>${t.verified.replace('{country}', country)}</p>`;
  content += `<div style="margin-top:25px;"><h3 style="text-decoration:underline;">VERIFICATION</h3><p>I, ${name}, do hereby verify that the contents of this affidavit are true and correct to my personal knowledge and belief.</p></div>`;
  content += `<div style="margin-top:20px;"><h3 style="text-decoration:underline;">WITNESS</h3><p>1. ___________________________<br>2. ___________________________</p></div>`;
  content += `<div class="flex-between" style="margin:20px 0;"><span>${t.place}</span><span>${t.date.replace('{date}', dateStr)}</span></div>`;
  content += `<div class="signature-grid">
    <div class="signature-col"><div class="signature-line"></div><div>${t.leftSig}</div>${signatureURL ? `<img src="${signatureURL}" class="signature-preview">` : `<div style="height:30px;"></div>`}</div>
    <div class="signature-col"><div class="signature-line"></div><div>${t.rightSig}</div><div style="margin-top:8px; font-size:12px;">Reg. No: ____________</div><div style="font-size:12px;">Seal & Stamp</div></div>
  </div>`;
  content += `<div class="text-right" style="font-weight:bold; margin-top:15px;">Notary Reg: ${(docID || "AGI-0000").slice(-6)}</div>`;
  if (template !== 'standard') content += `</div>`;
  return content;
}
