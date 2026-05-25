// export.js - PDF/PNG export with device‑aware quality
export async function exportPDF(element, docID, qualitySetting) {
  let scale = 1.5;
  if (qualitySetting === 'high') scale = 2;
  else if (qualitySetting === 'ultra') scale = Math.min(window.devicePixelRatio || 1, 3);
  const elementCopy = element.cloneNode(true);
  elementCopy.style.transform = 'translateZ(0)';
  await html2pdf().from(elementCopy).set({
    margin: 0.4,
    filename: `Affidavit_${docID}.pdf`,
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    html2canvas: {
      scale, useCORS: true, letterRendering: true, foreignObjectRendering: true,
      removeContainer: true, scrollY: -window.scrollY,
      windowWidth: element.scrollWidth, windowHeight: element.scrollHeight
    },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }).save();
}

export async function exportPNG(element, docID, qualitySetting) {
  let scale = 1.5;
  if (qualitySetting === 'high') scale = 2;
  else if (qualitySetting === 'ultra') scale = Math.min(window.devicePixelRatio || 1, 3);
  element.style.transform = 'translateZ(0)';
  const canvas = await html2canvas(element, {
    scale, backgroundColor: '#ffffff', useCORS: true,
    letterRendering: true, foreignObjectRendering: true,
    removeContainer: true, scrollY: -window.scrollY,
    windowWidth: element.scrollWidth, windowHeight: element.scrollHeight
  });
  const link = document.createElement('a');
  link.download = `affidavit_${docID}.png`;
  link.href = canvas.toDataURL();
  link.click();
  link.remove();
  canvas.width = 0; canvas.height = 0;
  element.style.transform = '';
}
