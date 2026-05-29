# ⚖️ AGI Legal Pro – Global Affidavit System

Generate legally compliant, multi‑language affidavits for global jurisdictions.
Built as a secure PWA (installable on Android/iOS) with Firebase backend and Razorpay payments.

---

## ✨ Features

- **Multi‑language** – English, हिन्दी, اردو, العربية
- **Global Jurisdictions** – India, UAE, USA, UK, Canada, Saudi Arabia, Qatar, Europe (Apostille)
- **Secure Authentication** – Google Sign‑In via Firebase Auth
- **Premium Subscription** – ₹299/month via Razorpay (server‑side verified, no client‑side bypass)
- **Digital Signature** – Draw or upload your signature
- **Photo Upload** – Automatic compression for small file sizes
- **Export Options** – Save as PDF (free), PNG (premium), or print directly
- **QR Verification** – Every finalized affidavit gets a unique, unguessable token for public validation (without exposing personal data)
- **Offline Support** – Service worker caches the app and works offline
- **PWA Compliant** – Install on your phone's home screen

---

## 🛠 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | HTML5, CSS3, vanilla JavaScript     |
| Backend     | Firebase (Auth, Firestore, Cloud Functions) |
| Payments    | Razorpay (orders, signature verification) |
| PWA         | Manifest, Service Worker, offline fallback |
| QR Code     | qrcodejs library                     |
| PDF/PNG     | html2pdf.js, html2canvas             |
| Signature   | signature_pad library                |

---

## 📁 Project Structure
