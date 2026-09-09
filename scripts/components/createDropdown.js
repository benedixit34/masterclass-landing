export function createDropdown({ buttonId, dropdownId, selectedId, inputId, options }) {
    const button = document.getElementById(buttonId);
    const dropdown = document.getElementById(dropdownId);
    const selected = document.getElementById(selectedId);
    const input = document.getElementById(inputId);

    if (!button || !dropdown || !selected || !input) {
        console.error(`Dropdown setup failed for ${buttonId}`);
        return;
    }

    options.forEach((option, index) => {
        const item = document.createElement("button");

        item.type = "button";
        item.dataset.value = option.value;
        item.textContent = option.label;
        item.className = `w-full px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 ${
            index < options.length - 1 ? "border-b border-gray-100" : ""
        }`;

        dropdown.appendChild(item);

        item.addEventListener("click", () => {
            selected.textContent = option.label;
            input.value = option.value;
            dropdown.classList.add("hidden");
        });
    });

    button.addEventListener("click", (event) => {
        event.stopPropagation();
        dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
        if (!button.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.add("hidden");
        }
    });
}