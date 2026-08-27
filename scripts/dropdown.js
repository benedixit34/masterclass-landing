function createDropdown({
    buttonId,
    dropdownId,
    selectedId,
    inputId,
    options
}) {

    const button = document.getElementById(buttonId);
    const dropdown = document.getElementById(dropdownId);
    const selected = document.getElementById(selectedId);
    const input = document.getElementById(inputId);

    if (!button || !dropdown || !selected || !input) {
        console.error(`Dropdown setup failed for ${buttonId}`);
        return;
    }


    // Render options

    options.forEach((option, index) => {

        const item = document.createElement("button");

        item.type = "button";

        item.dataset.value = option.value;

        item.textContent = option.label;

        item.className = `
            w-full
            px-3
            py-2.5
            text-left
            text-sm
            text-gray-700
            hover:bg-gray-50
            ${
                index < options.length - 1
                    ? "border-b border-gray-100"
                    : ""
            }
        `;

        dropdown.appendChild(item);


        // Select

        item.addEventListener("click", () => {

            selected.textContent = option.label;

            input.value = option.value;

            dropdown.classList.add("hidden");

        });

    });


    // Open / close

    button.addEventListener("click", (event) => {

        event.stopPropagation();

        dropdown.classList.toggle("hidden");

    });


    // Close outside

    document.addEventListener("click", (event) => {

        if (
            !button.contains(event.target) &&
            !dropdown.contains(event.target)
        ) {

            dropdown.classList.add("hidden");

        }

    });

}


// ========================================
// PROFILE
// ========================================

const profileOptions = [
    {
        value: "student",
        label: "Student"
    },
    {
        value: "freelancer",
        label: "Freelancer"
    },
    {
        value: "creative-professional",
        label: "Creative Professional"
    },
    {
        value: "business-owner",
        label: "Business Owner"
    },
    {
        value: "agency-studio",
        label: "Agency / Studio"
    },
    {
        value: "educator",
        label: "Educator / Trainer"
    },
    {
        value: "other",
        label: "Other"
    }
];


// ========================================
// EXPERIENCE
// ========================================

const experienceOptions = [
    {
        value: "beginner",
        label: "Beginner"
    },
    {
        value: "intermediate",
        label: "Intermediate"
    },
    {
        value: "advanced",
        label: "Advanced"
    }
];





const creativeTools = [
    {
        category: "Graphic Design",
        tools: [
            "Adobe Photoshop",
            "Adobe Illustrator",
            "CorelDRAW",
            "Canva"
        ]
    },

    {
        category: "Motion & Video",
        tools: [
            "Adobe After Effects",
            "Adobe Premiere Pro",
            "DaVinci Resolve",
        ]
    },

    {
        category: "3D",
        tools: [
            "Blender",
            "Cinema 4D",
            "Autodesk Maya",
            "3ds Max",
            "ZBrush",
            "SketchUp"
        ]
    },

    {
        category: "Photography",
        tools: [
            "Adobe Lightroom",
        ]
    },

];



const toolsButton = document.getElementById("toolsButton");
const toolsDropdown = document.getElementById("toolsDropdown");
const selectedTools = document.getElementById("selectedTools");
const toolsInput = document.getElementById("tools");

const otherTool = document.getElementById("otherTool");
const addToolButton = document.getElementById("addToolButton");

let selectedToolValues = [];

// ========================================
// INITIALIZE
// ========================================

createDropdown({
    buttonId: "profileButton",
    dropdownId: "profileDropdown",
    selectedId: "profileSelected",
    inputId: "profile",
    options: profileOptions
});


createDropdown({
    buttonId: "experienceButton",
    dropdownId: "experienceDropdown",
    selectedId: "experienceSelected",
    inputId: "experience",
    options: experienceOptions
});


function renderTools() {

    toolsDropdown.innerHTML = "";

    creativeTools.forEach((category) => {

        const categoryContainer = document.createElement("div");

        const categoryTitle = document.createElement("div");

        categoryTitle.textContent = category.category;

        categoryTitle.className =
            "bg-gray-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500";

        categoryContainer.appendChild(categoryTitle);


        category.tools.forEach((tool) => {

            const item = document.createElement("button");

            item.type = "button";

            item.className =
                "flex w-full items-center gap-3 border-b border-gray-100 px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50";


            const checkbox = document.createElement("span");

            checkbox.className =
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300";


            const label = document.createElement("span");

            label.textContent = tool;


            item.appendChild(checkbox);
            item.appendChild(label);


            item.addEventListener("click", () => {

                toggleTool(tool);

            });


            categoryContainer.appendChild(item);

        });


        toolsDropdown.appendChild(categoryContainer);

    });

}

function toggleTool(tool) {

    const index = selectedToolValues.indexOf(tool);


    if (index === -1) {

        selectedToolValues.push(tool);

    } else {

        selectedToolValues.splice(index, 1);

    }


    updateSelectedTools();

}


function updateSelectedTools() {

    selectedTools.innerHTML = "";


    if (selectedToolValues.length === 0) {

        selectedTools.innerHTML = `
            <span class="text-gray-400">
                Select tools
            </span>
        `;

    } else {

        selectedToolValues.forEach((tool) => {

            const chip = document.createElement("span");

            chip.className =
                "inline-flex items-center gap-1 rounded bg-orange-50 px-2 py-1 text-xs text-[#ff4c00]";


            chip.innerHTML = `
                ${tool}

                <span
                    class="cursor-pointer font-bold"
                    data-remove="${tool}"
                >
                    ×
                </span>
            `;


            selectedTools.appendChild(chip);

        });

    }


    // Store selected tools

    toolsInput.value =
        JSON.stringify(selectedToolValues);

}

selectedTools.addEventListener("click", (event) => {

    const removeButton =
        event.target.closest("[data-remove]");


    if (!removeButton) {
        return;
    }


    const tool = removeButton.dataset.remove;

    selectedToolValues =
        selectedToolValues.filter(
            (item) => item !== tool
        );


    updateSelectedTools();

});

addToolButton.addEventListener("click", () => {

    const tool = otherTool.value.trim();


    if (!tool) {
        return;
    }


    if (!selectedToolValues.includes(tool)) {

        selectedToolValues.push(tool);

    }


    otherTool.value = "";

    updateSelectedTools();

});


otherTool.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        event.preventDefault();

        addToolButton.click();

    }

});


toolsButton.addEventListener("click", (event) => {

    event.stopPropagation();

    toolsDropdown.classList.toggle("hidden");

});

document.addEventListener("click", (event) => {

    if (
        !toolsButton.contains(event.target) &&
        !toolsDropdown.contains(event.target)
    ) {

        toolsDropdown.classList.add("hidden");

    }

});

renderTools();
updateSelectedTools();