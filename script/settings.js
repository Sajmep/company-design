// countries and state dropdown field

function setupCombo(selectedId, boxId, searchId) {
  const selected = document.getElementById(selectedId);
  const optionsBox = document.getElementById(boxId);
  const searchBox = document.getElementById(searchId);
  const options = optionsBox.querySelectorAll(".option");

  // Toggle dropdown
  selected.addEventListener("click", () => {
    optionsBox.style.display = optionsBox.style.display === "block" ? "none" : "block";
    searchBox.value = "";
    filterOptions("");
  });

  // Pick option
  options.forEach(opt => {
    opt.addEventListener("click", () => {
      selected.value = opt.textContent;
      optionsBox.style.display = "none";
    });
  });

  // Search filter
  searchBox.addEventListener("keyup", () => {
    filterOptions(searchBox.value.toLowerCase());
  });

  function filterOptions(value) {
    options.forEach(opt => {
      opt.style.display = opt.textContent.toLowerCase().includes(value) ? "block" : "none";
    });
  }

  // Close if clicked outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(`#${boxId}`) && e.target !== selected) {
      optionsBox.style.display = "none";
    }
  });
}

// Setup for both dropdowns
setupCombo("countrySelected", "countryBox", "countrySearch");
setupCombo("stateSelected", "stateBox", "stateSearch");

