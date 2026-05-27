// js/signature.js - SignaturePad wrapper
import SignaturePad from '../lib/signature_pad.umd.min.js';

let signaturePad = null;
let currentSignatureDataURL = '';

export function initSignaturePad(canvasElement) {
  if (!canvasElement) return;
  const rect = canvasElement.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvasElement.width = rect.width * ratio;
  canvasElement.height = rect.height * ratio;
  const ctx = canvasElement.getContext('2d');
  ctx.scale(ratio, ratio);
  
  if (signaturePad) signaturePad.clear();
  signaturePad = new SignaturePad(canvasElement, {
    minDistance: 1,
    throttle: 16,
    backgroundColor: 'white',
    penColor: 'black'
  });
  
  if (currentSignatureDataURL) {
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
    img.src = currentSignatureDataURL;
  }
}

export function getSignatureData() {
  return currentSignatureDataURL;
}

export function setSignatureData(dataURL) {
  currentSignatureDataURL = dataURL;
}

export function clearSignature() {
  if (signaturePad) {
    signaturePad.clear();
    currentSignatureDataURL = '';
  }
}

export function saveSignature() {
  if (signaturePad && !signaturePad.isEmpty()) {
    currentSignatureDataURL = signaturePad.toDataURL();
    return true;
  }
  return false;
}
