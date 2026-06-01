async function loadTemplates() {
  try {
    const response = await fetch("data/affidavit-types.json");
    const templates = await response.json();

    const select = document.getElementById("purposeSelect");

    templates.forEach(template => {
      const option = document.createElement("option");
      option.value = template.id;
      option.textContent = template.name;
      select.appendChild(option);
    });

    console.log("Templates Loaded:", templates.length);

  } catch (error) {
    console.error("Templates Load Error", error);
  }
}

loadTemplates();
