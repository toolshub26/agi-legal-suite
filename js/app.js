// AGI Legal Pro
// Global Affidavit Generator

document.addEventListener("DOMContentLoaded", async () => {

  await loadCountries();
  await loadLanguages();
  await loadAffidavitTypes();

  const generateBtn = document.getElementById("generateBtn");

  if (generateBtn) {
    generateBtn.addEventListener("click", generateAffidavit);
  }

});

/* -------------------------
   Load Countries
------------------------- */

async function loadCountries() {

  try {

    const response = await fetch("data/countries.json");
    const countries = await response.json();

    const select = document.getElementById("countrySelect");

    if (!select) return;

    countries.forEach(country => {

      const option = document.createElement("option");

      option.value = country.code;
      option.textContent = country.name;

      select.appendChild(option);

    });

  } catch (error) {

    console.error("Countries Load Error:", error);

  }

}

/* -------------------------
   Load Languages
------------------------- */

async function loadLanguages() {

  try {

    const response = await fetch("data/languages.json");
    const languages = await response.json();

    const select = document.getElementById("languageSelect");

    if (!select) return;

    languages.forEach(language => {

      const option = document.createElement("option");

      option.value = language.code;
      option.textContent = language.name;

      select.appendChild(option);

    });

  } catch (error) {

    console.error("Languages Load Error:", error);

  }

}

/* -------------------------
   Load Affidavit Types
------------------------- */

async function loadAffidavitTypes() {

  try {

    const response = await fetch("data/affidavit-types.json");
    const types = await response.json();

    const select = document.getElementById("purposeSelect");

    if (!select) return;

    types.forEach(type => {

      const option = document.createElement("option");

      option.value = type.id;
      option.textContent = type.name;

      select.appendChild(option);

    });

  } catch (error) {

    console.error("Affidavit Types Error:", error);

  }

}

/* -------------------------
   Generate Affidavit
------------------------- */

function generateAffidavit() {
const verificationToken =
  generateVerificationToken();
  const name =
    document.getElementById("name")?.value || "";

  const father =
    document.getElementById("father")?.value || "";

  const age =
    document.getElementById("age")?.value || "";

  const address =
    document.getElementById("address")?.value || "";

  const statement =
    document.getElementById("statement")?.value || "";

  const country =
    document.getElementById("countrySelect")?.selectedOptions[0]?.text || "";

  const language =
    document.getElementById("languageSelect")?.selectedOptions[0]?.text || "";

  const purpose =
    document.getElementById("purposeSelect")?.selectedOptions[0]?.text || "";

  const preview =
    document.getElementById("previewArea");

  if (!preview) return;

  preview.innerHTML = `

<div class="affidavit-document">

  <div class="affidavit-title">
    AFFIDAVIT
  </div>

  <div class="affidavit-content">

    <p><strong>VERIFICATION ID:</strong> ${verificationToken}</p>

    <p>
      I, <strong>${name}</strong>,
      son/daughter of <strong>${father}</strong>,
      aged about <strong>${age}</strong> years,
      resident of <strong>${address}</strong>,
      do hereby solemnly affirm and declare as under:
    </p>

    <ol>
      <li>
        That I am the deponent of this affidavit.
      </li>

      <li>
        That this affidavit is being submitted for
        <strong>${purpose}</strong>.
      </li>

      <li>
        That the contents stated herein are true
        and correct to the best of my knowledge
        and belief.
      </li>

      <li>
        That I have not concealed any material fact.
      </li>
    </ol>

    <p>
      <strong>Statement:</strong><br>
      ${statement}
    </p>

    <p>
      <strong>Country:</strong> ${country}<br>
      <strong>Language:</strong> ${language}
    </p>

    <br><br>

    <div class="signature-section">

      <div class="signature-box">
        ______________________
        <br>
        DEPONENT
      </div>

      <div class="signature-box">
        ______________________
        <br>
        NOTARY / OATH COMMISSIONER
      </div>

    </div>

  </div>

</div>

`;
localStorage.setItem(
  "lastVerificationToken",
  verificationToken
);
  console.log("Affidavit Generated");

}
