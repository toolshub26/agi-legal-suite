export function escapeHTML(str = '') {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[m]));
}

export function validateImage(file) {
  const allowed = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (!allowed.includes(file.type)) {
    throw new Error('Invalid image type');
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error('Image too large');
  }

  return true;
}
