async function loadLanguages() {
  try {
    const response = await fetch("data/languages.json");
    const languages = await response.json();

    const select = document.getElementById("languageSelect");

    languages.forEach(language => {
      const option = document.createElement("option");
      option.value = language.code;
      option.textContent = language.name;
      select.appendChild(option);
    });

  } catch (error) {
    console.error(error);
  }
}
