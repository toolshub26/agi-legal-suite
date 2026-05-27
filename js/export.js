// js/export.js - PDF, PNG and clipboard export
import html2pdf from '../lib/html2pdf.bundle.min.js';
import html2canvas from '../lib/html2canvas.min.js';

export async function exportToPDF(element, filename, quality = 'high') {
  if (!element) return;
  const scale = quality === 'ultra' ? 4 : (quality === 'high' ? 3 : 2);
  await html2pdf().from(element).set({
    margin: 0.4,
    filename,
    html2canvas: { scale, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }).save();
}

export async function exportToPNG(element, filename) {
  if (!element) return;
  const canvas = await html2canvas(element, { scale: 3, backgroundColor: '#ffffff', useCORS: true });
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
}

export function copyText(text) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    // optional success
  }).catch(() => {
    // fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  });
}
