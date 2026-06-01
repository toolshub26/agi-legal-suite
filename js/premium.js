function isPremiumUser() {
  return localStorage.getItem("premium") === "true";
}

function activatePremium() {
  localStorage.setItem("premium", "true");
}
