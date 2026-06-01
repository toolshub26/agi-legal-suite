async function loadCountries() {
  try {
    const response = await fetch("data/countries.json");
    const countries = await response.json();

    const select = document.getElementById("countrySelect");

    countries.forEach(country => {
      const option = document.createElement("option");
      option.value = country.code;
      option.textContent = country.name;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Countries Load Error", error);
  }
}
loadCountries();
