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
    console.log("Location data loaded:", locationData.length);
  } catch (error) {
    console.error("Location loading error:", error);
  }
}

loadLocations();

locationInput.addEventListener("input", () => {
  const search = locationInput.value.trim().toLowerCase();

  selectedLocation = null;
  selectedLocationInput.value = "";

  locationInput.classList.remove("border-red-500");
  locationError.classList.add("hidden");
  locationError.textContent = "";

  locationDropdown.innerHTML = "";

  if (!search || !locationData.length) {
    locationDropdown.classList.add("hidden");
    return;
  }

  const results = [];

  locationData.forEach((country) => {
    const countryName = country.name;
    const isNigeria = countryName.toLowerCase() === "nigeria";

    if (countryName.toLowerCase().includes(search)) {
      results.push({
        type: "country",
        city: "",
        state: "",
        country: countryName,
        label: countryName,
        priority: isNigeria ? 0 : 2,
      });
    }

    if (Array.isArray(country.states)) {
      country.states.forEach((state) => {
        const stateName = state.name;

        if (
          stateName.toLowerCase().includes(search) ||
          `${stateName}, ${countryName}`.toLowerCase().includes(search)
        ) {
          results.push({
            type: "state",
            city: "",
            state: stateName,
            country: countryName,
            label: `${stateName}, ${countryName}`,
            priority: isNigeria ? 0 : 2,
          });
        }

        if (Array.isArray(state.cities)) {
          state.cities.forEach((cityName) => {
            const fullLocation =
              `${cityName}, ${stateName}, ${countryName}`.toLowerCase();

            const cityCountryLocation =
              `${cityName}, ${countryName}`.toLowerCase();

            if (
              cityName.toLowerCase().includes(search) ||
              fullLocation.includes(search) ||
              cityCountryLocation.includes(search)
            ) {
              results.push({
                type: "city",
                city: cityName,
                state: stateName,
                country: countryName,
                label: `${cityName}, ${stateName}, ${countryName}`,
                priority: isNigeria ? 0 : 2,
              });
            }
          });
        }
      });
    }
  });

  const uniqueResults = Array.from(
    new Map(results.map((item) => [item.label, item])).values()
  );

  const sortedResults = uniqueResults.sort((a, b) => {
    const aSearch = a.label.toLowerCase();
    const bSearch = b.label.toLowerCase();

    const aStartsWith = aSearch.startsWith(search);
    const bStartsWith = bSearch.startsWith(search);

    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    if (aStartsWith !== bStartsWith) {
      return bStartsWith - aStartsWith;
    }

    return a.label.localeCompare(b.label);
  });

  const limitedResults = sortedResults.slice(0, 10);

  if (!limitedResults.length) {
    locationDropdown.innerHTML = `
      <div class="px-4 py-3 text-sm text-gray-500">
        No locations found
      </div>
    `;

    locationDropdown.classList.remove("hidden");
    return;
  }

  limitedResults.forEach((location) => {
    const option = document.createElement("button");

    option.type = "button";
    option.className =
      "block w-full border-b border-gray-100 px-4 py-3 text-left last:border-0 hover:bg-gray-50";

    let title = "";
    let subtitle = "";

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
      <div class="font-medium text-gray-800">
        ${title}
      </div>
      <div class="mt-0.5 text-xs text-gray-500">
        ${subtitle}
      </div>
    `;

    option.addEventListener("click", () => {
      locationInput.value = location.label;
      selectedLocation = location;
      selectedLocationInput.value = location.label;

      locationDropdown.classList.add("hidden");
      locationInput.classList.remove("border-red-500");
      locationError.classList.add("hidden");
      locationError.textContent = "";
    });

    locationDropdown.appendChild(option);
  });

  locationDropdown.classList.remove("hidden");
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
  locationError.textContent = "";
  locationError.classList.add("hidden");
  locationInput.classList.remove("border-red-500");

  if (!locationInput.value.trim()) {
    locationError.textContent = "Please enter your location.";
    locationError.classList.remove("hidden");
    locationInput.classList.add("border-red-500");
    return false;
  }

  if (!selectedLocation) {
    locationError.textContent =
      "Please select a location from the suggestions.";
    locationError.classList.remove("hidden");
    locationInput.classList.add("border-red-500");
    return false;
  }

  return true;
}