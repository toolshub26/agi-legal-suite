function loginUser() {

  localStorage.setItem(
    "loggedIn",
    "true"
  );

  console.log(
    "User Logged In"
  );

}

function logoutUser() {

  localStorage.removeItem(
    "loggedIn"
  );

  console.log(
    "User Logged Out"
  );

}

function isLoggedIn() {

  return localStorage.getItem(
    "loggedIn"
  ) === "true";

}
