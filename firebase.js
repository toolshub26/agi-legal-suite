
/* =========================================
   AGI ULTRA PRO v18 AI 🚀
   FIREBASE ENTERPRISE CONFIG
========================================= */

/* =========================================
   FIREBASE SDK
========================================= */

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getAuth,
GoogleAuthProvider,
signInWithPopup,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
doc,
setDoc,
getDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
getStorage,
ref,
uploadBytes,
getDownloadURL
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

/* =========================================
   FIREBASE CONFIG
========================================= */

const firebaseConfig = {

apiKey:
"YOUR_API_KEY",

authDomain:
"YOUR_PROJECT.firebaseapp.com",

projectId:
"YOUR_PROJECT_ID",

storageBucket:
"YOUR_PROJECT.appspot.com",

messagingSenderId:
"123456789",

appId:
"1:123456:web:abcdef",

measurementId:
"G-XXXXXXX"

};

/* =========================================
   INITIALIZE FIREBASE
========================================= */

const app =
initializeApp(firebaseConfig);

const auth =
getAuth(app);

const db =
getFirestore(app);

const storage =
getStorage(app);

const provider =
new GoogleAuthProvider();

/* =========================================
   GLOBAL EXPORTS
========================================= */

window.auth = auth;
window.db = db;
window.storage = storage;

/* =========================================
   SIGNUP
========================================= */

async function signupUser(

email,
password,
name

){

try{

const userCredential =

await createUserWithEmailAndPassword(
auth,
email,
password
);

const user =
userCredential.user;

await setDoc(

doc(db,"users",user.uid),

{

name:name,
email:email,

premium:false,

createdAt:
new Date()
.toISOString()

}

);

showToast(
"Signup Successful ✅"
);

location.href =
"dashboard.html";

}catch(error){

console.error(error);

showToast(
error.message
);

}

}

/* =========================================
   LOGIN
========================================= */

async function loginUser(

email,
password

){

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

showToast(
"Login Successful ✅"
);

location.href =
"dashboard.html";

}catch(error){

console.error(error);

showToast(
error.message
);

}

}

/* =========================================
   GOOGLE LOGIN
========================================= */

async function loginWithGoogle(){

try{

await signInWithPopup(
auth,
provider
);

showToast(
"Google Login Successful 🚀"
);

location.href =
"dashboard.html";

}catch(error){

console.error(error);

showToast(
error.message
);

}

}

/* =========================================
   LOGOUT
========================================= */

async function logoutUser(){

try{

await signOut(auth);

showToast(
"Logged Out ✅"
);

location.href =
"login.html";

}catch(error){

console.error(error);

}

}

/* =========================================
   AUTH CHECK
========================================= */

onAuthStateChanged(
auth,
(user)=>{

if(user){

console.log(
"Logged In:",
user.email
);

}else{

console.log(
"No Active User"
);

}

}
);

/* =========================================
   SAVE AFFIDAVIT
========================================= */

async function saveAffidavitToCloud(data){

try{

await addDoc(

collection(
db,
"affidavits"
),

{

...data,

createdAt:
new Date()
.toISOString()

}

);

showToast(
"Saved To Cloud ☁️"
);

}catch(error){

console.error(error);

}

}

/* =========================================
   GET AFFIDAVITS
========================================= */

async function getAffidavits(){

const querySnapshot =
await getDocs(
collection(
db,
"affidavits"
)
);

querySnapshot.forEach(doc=>{

console.log(
doc.id,
doc.data()
);

});

}

/* =========================================
   FILE UPLOAD
========================================= */

async function uploadFile(file){

try{

const storageRef =
ref(
storage,
"uploads/" + file.name
);

await uploadBytes(
storageRef,
file
);

const url =
await getDownloadURL(
storageRef
);

showToast(
"File Uploaded ✅"
);

return url;

}catch(error){

console.error(error);

}

}

/* =========================================
   PREMIUM CHECK
========================================= */

async function checkPremium(uid){

const userRef =
doc(db,"users",uid);

const snap =
await getDoc(userRef);

if(snap.exists()){

return snap.data().premium;

}

return false;

}

/* =========================================
   TOAST
========================================= */

function showToast(msg){

const toast =
document.createElement(
"div"
);

toast.innerText = msg;

toast.style.position =
"fixed";

toast.style.bottom =
"20px";

toast.style.right =
"20px";

toast.style.background =
"#111827";

toast.style.color =
"white";

toast.style.padding =
"14px 18px";

toast.style.borderRadius =
"14px";

toast.style.zIndex =
"999999";

document.body.appendChild(
toast
);

setTimeout(()=>{

toast.remove();

},3000);

}

/* =========================================
   EXPORT FUNCTIONS
========================================= */

window.signupUser =
signupUser;

window.loginUser =
loginUser;

window.loginWithGoogle =
loginWithGoogle;

window.logoutUser =
logoutUser;

window.saveAffidavitToCloud =
saveAffidavitToCloud;

window.getAffidavits =
getAffidavits;

window.uploadFile =
uploadFile;

window.checkPremium =
checkPremium;

/* =========================================
   END
========================================= */

console.log(
"AGI ULTRA FIREBASE READY 🚀"
);
