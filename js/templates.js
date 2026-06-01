async function loadTemplates() {
  try {
    const response = await fetch("data/affidavit-types.json");
    const templates = await response.json();

    console.log("Templates Loaded:", templates.length);

  } catch (error) {
    console.error(error);
  }
}
