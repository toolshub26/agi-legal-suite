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
getDoc,
deleteDoc
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
"AIzaSyC_1bKbNGAoGviGt1-a1f27h9VDj4hr3oA",

authDomain:
"affidavittool.firebaseapp.com",

projectId:
"affidavittool",

storageBucket:
"affidavittool.firebasestorage.app",

messagingSenderId:
"108525725649",

appId:
"1:108525725649:web:2c3cab440860c81e6de2f0",

measurementId:
"G-1T5FQG5SDL"

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
createdAt:new Date().toISOString()
}
);

showToast(
"Signup Successful ✅"
);

location.href =
"dashboard.html";

}catch(error){

console.error(error);

showToast(error.message);

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

showToast(error.message);

}

}

/* =========================================
   GOOGLE LOGIN
========================================= */

async function loginWithGoogle(){

try{

const result =
await signInWithPopup(
auth,
provider
);

const user =
result.user;

await setDoc(
doc(db,"users",user.uid),
{
name:user.displayName,
email:user.email,
premium:false,
createdAt:new Date().toISOString()
},
{merge:true}
);

showToast(
"Google Login Successful 🚀"
);

location.href =
"dashboard.html";

}catch(error){

console.error(error);

showToast(error.message);

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

if(!auth.currentUser){

showToast(
"Login Required"
);

return;

}

await addDoc(
collection(db,"affidavits"),
{
...data,
uid:auth.currentUser.uid,
createdAt:new Date().toISOString()
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
collection(db,"affidavits")
);

querySnapshot.forEach(doc=>{

console.log(
doc.id,
doc.data()
);

});

}

/* =========================================
   DELETE AFFIDAVIT
========================================= */

async function deleteAffidavit(id){

try{

await deleteDoc(
doc(db,"affidavits",id)
);

showToast(
"Deleted Successfully 🗑️"
);

}catch(error){

console.error(error);

}

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
   CLEAR HISTORY
========================================= */

function clearHistory(){

localStorage.clear();

showToast(
"History Cleared 🗑️"
);

}

/* =========================================
   TOAST
========================================= */

function showToast(msg){

const toast =
document.createElement("div");

toast.innerText = msg;

toast.style.position = "fixed";
toast.style.bottom = "20px";
toast.style.right = "20px";
toast.style.background = "#111827";
toast.style.color = "white";
toast.style.padding = "14px 18px";
toast.style.borderRadius = "14px";
toast.style.zIndex = "999999";

document.body.appendChild(toast);

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

window.deleteAffidavit =
deleteAffidavit;

window.uploadFile =
uploadFile;

window.checkPremium =
checkPremium;

window.clearHistory =
clearHistory;

/* =========================================
   END
========================================= */

console.log(
"AGI ULTRA FIREBASE READY 🚀"
);
