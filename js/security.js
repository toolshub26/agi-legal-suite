// js/security.js - XSS protection, input validation, image handling
import DOMPurify from '../lib/dompurify.min.js';

const ALLOWED_TAGS = ['p','div','span','br','b','i','strong','em','u','h1','h2','h3','table','thead','tbody','tr','td','th','ul','ol','li','img'];
const FORBID_ATTR = ['onerror','onload','onclick','onmouseover'];

export function sanitizeHTML(dirty) {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    FORBID_ATTR,
    ALLOW_DATA_ATTR: false
  });
}

export function escapeText(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

export function validateImage(file) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    throw new Error('Invalid image type. Use JPEG, PNG or WebP.');
  }
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('Image too large. Max 2MB.');
  }
  return true;
}

export function resizeImage(file, maxWidth = 1024, maxHeight = 1024) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => { img.src = e.target.result; };
    reader.onerror = reject;
    reader.readAsDataURL(file);
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL(file.type));
    };
    img.onerror = reject;
  });
}
