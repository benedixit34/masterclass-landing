const locationInput = document.getElementById("location");
const locationDropdown = document.getElementById("locationDropdown");
const locationError = document.getElementById("locationError");
const selectedLocationInput = document.getElementById("selectedLocation");

const LOCATION_URL =
  "https://cdn.jsdelivr.net/gh/Yerikmiller/Countries-States-Cities-JSON@latest/all.json";

let locationData = [];
let selectedLocation = null;

async function loadLocations() {
  try {
    const response = await fetch(LOCATION_URL);

    if (!response.ok) {
      throw new Error("Failed to load location data.");
    }

    locationData = await response.json();
  } catch (error) {
    console.error("Location loading error:", error);
  }
}

locationInput.addEventListener("input", () => {
  selectedLocation = null;
  selectedLocationInput.value = "";

  locationError.classList.add("hidden");
  locationInput.classList.remove("border-red-500");

  const search = locationInput.value.trim().toLowerCase();

  locationDropdown.innerHTML = "";

  if (!search || !locationData.length) {
    locationDropdown.classList.add("hidden");
    return;
  }

  const results = [];

  locationData.forEach((country) => {
    const countryName = country.name;
    const isNigeria = countryName.toLowerCase() === "nigeria";
    const priority = isNigeria ? 0 : 2;

    if (countryName.toLowerCase().includes(search)) {
      results.push({
        type: "country",
        city: "",
        state: "",
        country: countryName,
        label: countryName,
        priority,
      });
    }

    if (!Array.isArray(country.states)) return;

    country.states.forEach((state) => {
      const stateName = state.name;
      const stateLocation = `${stateName}, ${countryName}`;

      if (
        stateName.toLowerCase().includes(search) ||
        stateLocation.toLowerCase().includes(search)
      ) {
        results.push({
          type: "state",
          city: "",
          state: stateName,
          country: countryName,
          label: stateLocation,
          priority,
        });
      }

      if (!Array.isArray(state.cities)) return;

      state.cities.forEach((cityName) => {
        const fullLocation =
          `${cityName}, ${stateName}, ${countryName}`;

        const cityCountryLocation =
          `${cityName}, ${countryName}`;

        if (
          cityName.toLowerCase().includes(search) ||
          fullLocation.toLowerCase().includes(search) ||
          cityCountryLocation.toLowerCase().includes(search)
        ) {
          results.push({
            type: "city",
            city: cityName,
            state: stateName,
            country: countryName,
            label: fullLocation,
            priority,
          });
        }
      });
    });
  });

  const uniqueResults = Array.from(
    new Map(results.map((item) => [item.label, item])).values()
  );

  uniqueResults.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    const aStartsWith = a.label.toLowerCase().startsWith(search);
    const bStartsWith = b.label.toLowerCase().startsWith(search);

    if (aStartsWith !== bStartsWith) {
      return bStartsWith - aStartsWith;
    }

    return a.label.localeCompare(b.label);
  });

  const locations = uniqueResults.slice(0, 10);

  if (!locations.length) {
    locationDropdown.innerHTML = `
      <div class="px-4 py-3 text-sm text-gray-500">
        No locations found
      </div>
    `;

    locationDropdown.classList.remove("hidden");
    return;
  }

  locations.forEach((location) => {
    const option = document.createElement("button");

    option.type = "button";
    option.className =
      "block w-full border-b border-gray-100 px-4 py-3 text-left last:border-0 hover:bg-gray-50";

    let title;
    let subtitle;

    if (location.type === "city") {
      title = location.city;
      subtitle = `${location.state}, ${location.country}`;
    } else if (location.type === "state") {
      title = location.state;
      subtitle = location.country;
    } else {
      title = location.country;
      subtitle = "Country";
    }

    option.innerHTML = `
      <div class="font-medium text-gray-800">${title}</div>
      <div class="mt-0.5 text-xs text-gray-500">${subtitle}</div>
    `;

    option.addEventListener("click", () => {
      locationInput.value = location.label;
      selectedLocation = location;
      selectedLocationInput.value = location.label;

      locationDropdown.classList.add("hidden");
      locationError.classList.add("hidden");
      locationInput.classList.remove("border-red-500");
    });

    locationDropdown.appendChild(option);
  });

  locationDropdown.classList.remove("hidden");
});

locationInput.addEventListener("blur", () => {
  setTimeout(() => {
    if (
      !selectedLocation ||
      locationInput.value !== selectedLocationInput.value
    ) {
      locationInput.value = "";
      selectedLocationInput.value = "";
      selectedLocation = null;
    }

    locationDropdown.classList.add("hidden");
  }, 200);
});

document.addEventListener("click", (event) => {
  if (
    !locationInput.contains(event.target) &&
    !locationDropdown.contains(event.target)
  ) {
    locationDropdown.classList.add("hidden");
  }
});

function validateLocation() {
  if (
    !selectedLocation ||
    !selectedLocationInput.value ||
    locationInput.value !== selectedLocationInput.value
  ) {
    locationError.textContent =
      "Please select a location from the dropdown.";
    locationError.classList.remove("hidden");
    locationInput.classList.add("border-red-500");

    return false;
  }

  locationError.textContent = "";
  locationError.classList.add("hidden");
  locationInput.classList.remove("border-red-500");

  return true;
}

loadLocations();