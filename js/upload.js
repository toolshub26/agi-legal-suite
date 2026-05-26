import { validateImage } from './security.js';

export async function processImageUpload(fileInput, callback) {

  const file = fileInput.files[0];

  if (!file) {
    callback('');
    return;
  }

  try {

    validateImage(file);

    const reader = new FileReader();

    reader.onload = (e) => {
      callback(e.target.result);
    };

    reader.onerror = () => {
      alert('Image read failed');
    };

    reader.readAsDataURL(file);

  } catch (err) {

    alert(err.message);
    fileInput.value = '';

  }
}
