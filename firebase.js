/* =========================================
   AGI ULTRA PRO v18 AI 🚀
   FINAL FIREBASE ENTERPRISE CONFIG
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
deleteDoc,
serverTimestamp
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
"YOUR_SENDER_ID",

appId:
"YOUR_APP_ID"

};

/* =========================================
   INITIALIZE
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
toast.style.fontWeight = "700";

document.body.appendChild(toast);

setTimeout(()=>{

toast.remove();

},3000);

}

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
createdAt:serverTimestamp()
}
);

localStorage.setItem(
"loggedUser",
email
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

localStorage.setItem(
"loggedUser",
email
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
name:user.displayName || "User",
email:user.email,
premium:false,
createdAt:serverTimestamp()
},
{merge:true}
);

localStorage.setItem(
"loggedUser",
user.email
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

localStorage.removeItem(
"loggedUser"
);

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
   AUTH STATE
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
"Login Required ❌"
);

return;
}

const docRef =
await addDoc(
collection(db,"affidavits"),
{
...data,
uid:auth.currentUser.uid,
createdAt:serverTimestamp()
}
);

showToast(
"Saved To Cloud ☁️"
);

return docRef.id;

}catch(error){

console.error(error);

showToast(
"Cloud Save Failed ❌"
);

}

}

/* =========================================
   GET AFFIDAVITS
========================================= */

async function getAffidavits(){

try{

const querySnapshot =
await getDocs(
collection(db,"affidavits")
);

const list = [];

querySnapshot.forEach(doc=>{

list.push({
id:doc.id,
...doc.data()
});

});

return list;

}catch(error){

console.error(error);

return [];

}

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
"uploads/" + Date.now() + "_" + file.name
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

showToast(
"Upload Failed ❌"
);

}

}

/* =========================================
   PREMIUM CHECK
========================================= */

async function checkPremium(uid){

try{

const userRef =
doc(db,"users",uid);

const snap =
await getDoc(userRef);

if(snap.exists()){

return snap.data().premium;

}

return false;

}catch(error){

console.error(error);

return false;

}

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
   EXPORTS
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
   READY
========================================= */

console.log(
"AGI ULTRA FIREBASE READY 🚀"
);
