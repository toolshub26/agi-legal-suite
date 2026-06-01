function generateVerificationToken() {

  return "AFF-" +
    Date.now() +
    "-" +
    Math.floor(
      Math.random() * 100000
    );

}

function verifyAffidavit(token) {

  if (!token) {

    return false;

  }

  console.log(
    "Verifying:",
    token
  );

  return token.startsWith(
    "AFF-"
  );

}
