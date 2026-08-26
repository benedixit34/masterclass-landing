const countryButton = document.getElementById("countryButton");
const countryDropdown = document.getElementById("countryDropdown");
const selectedFlag = document.getElementById("selectedFlag");
const selectedDialCode = document.getElementById("selectedDialCode");
const countryCode = document.getElementById("countryCode");

let countries = [];

fetch("../assets/countries.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Failed to load countries.json: ${response.status}`);
        }

        return response.json();
    })
    .then((data) => {
        countries = data;
        renderCountries();

        const nigeria = countries.find(
            (country) => country.code.toLowerCase() === "ng"
        );

        if (nigeria) {
            selectCountry(nigeria);
        }
    })
    .catch((error) => {
        console.error("Failed to load countries:", error);
    });

function renderCountries() {
    countryDropdown.innerHTML = "";

    countries.forEach((country) => {
        const item = document.createElement("button");

        item.type = "button";
        item.className =
            "flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100";

        item.innerHTML = `
            <span class="fi fi-${country.code.toLowerCase()}"></span>
            <span class="flex-1 text-gray-700">${country.name}</span>
            <span class="text-gray-500">${country.dial_code}</span>
        `;

        item.addEventListener("click", () => {
            selectCountry(country);
        });

        countryDropdown.appendChild(item);
    });
}

function selectCountry(country) {
    selectedFlag.className = `fi fi-${country.code.toLowerCase()}`;
    selectedDialCode.textContent = country.dial_code;
    countryCode.value = country.dial_code;
    countryDropdown.classList.add("hidden");
}

countryButton.addEventListener("click", (event) => {
    event.stopPropagation();
    countryDropdown.classList.toggle("hidden");
});

document.addEventListener("click", (event) => {
    if (
        !countryButton.contains(event.target) &&
        !countryDropdown.contains(event.target)
    ) {
        countryDropdown.classList.add("hidden");
    }
});