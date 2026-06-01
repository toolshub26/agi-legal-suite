async function loadAffidavitTypes() {

  try {

    const response =
      await fetch("data/affidavit-types.json");

    const types =
      await response.json();

    const select =
      document.getElementById("purposeSelect");

    if (!select) return;

    types.forEach(type => {

      const option =
        document.createElement("option");

      option.value =
        type.id;

      option.textContent =
        type.name;

      select.appendChild(option);

    });

  } catch (error) {

    console.error(
      "Affidavit Types Error:",
      error
    );

  }

}
loadAffidavitTypes();
