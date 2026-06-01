function getPlan() {

  return localStorage.getItem(
    "plan"
  ) || "free";

}

function setPlan(plan) {

  localStorage.setItem(
    "plan",
    plan
  );

}

function isPremiumUser() {

  return getPlan() === "premium";

}

function isProUser() {

  return getPlan() === "pro";

}
