function createDropdown({ buttonId, dropdownId, selectedId, inputId, options }) {
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

const profileOptions = [
    { value: "student", label: "Student" },
    { value: "freelancer", label: "Freelancer" },
    { value: "creative-professional", label: "Creative Professional" },
    { value: "business-owner", label: "Business Owner" },
    { value: "agency-studio", label: "Agency / Studio" },
    { value: "educator", label: "Educator / Trainer" },
    { value: "other", label: "Other" }
];

const experienceOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }
];


const masterclassOptions = [
  { value: "3d", label: "3D" },
  { value: "ai", label: "AI" },
  { value: "graphic-design", label: "Graphic Design" },
  { value: "motion-design", label: "Motion Design" },
  { value: "storytelling", label: "Storytelling" },
  { value: "video-editing", label: "Video Editing" },
  { value: "vfx", label: "VFX" }
];

const marketingOptions = [
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "tiktok", label: "TikTok" },
    { value: "youtube", label: "YouTube" },
    { value: "google-search", label: "Google Search" },
    { value: "friend-colleague", label: "Friend or Colleague" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "website", label: "Website" },
    { value: "other", label: "Other" }
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
            "DaVinci Resolve"
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
            "Adobe Lightroom"
        ]
    }
];

const ticketOptions = [
    { value: "early-bird", label: "Early Bird — ₦180,000" },
    { value: "standard", label: "Standard — ₦200,000" },
    { value: "vip", label: "VIP — ₦300,000" }
];

const sessionOptions = [
    { value: "2026-09-05", label: "September 5, 2026" },
    { value: "2026-11-07", label: "November 7, 2026" },
    { value: "2027-01-02", label: "January 2, 2027" },
    { value: "2027-03-06", label: "March 6, 2027" },
    { value: "2027-05-01", label: "May 1, 2027" },
    { value: "2027-07-03", label: "July 3, 2027" },
    { value: "2027-09-04", label: "September 4, 2027" },
    { value: "2027-11-06", label: "November 6, 2027" }
];




const preferredModeOptions = [
    { value: "Physical - Studio", label: "Physical - Studio" },
    { value: "Virtual - Livestream", label: "Virtual - Livestream" }
];

const toolsButton = document.getElementById("toolsButton");
const toolsDropdown = document.getElementById("toolsDropdown");
const selectedTools = document.getElementById("selectedTools");
const toolsInput = document.getElementById("tools");
const otherTool = document.getElementById("otherTool");
const addToolButton = document.getElementById("addToolButton");

let selectedToolValues = [];

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

createDropdown({
    buttonId: "masterclassButton",
    dropdownId: "masterclassDropdown",
    selectedId: "masterclassSelected",
    inputId: "masterclass",
    options: masterclassOptions
});


createDropdown({
    buttonId: "marketingButton",
    dropdownId: "marketingDropdown",
    selectedId: "marketingSelected",
    inputId: "marketing",
    options: marketingOptions
});


createDropdown({
    buttonId: "ticketButton",
    dropdownId: "ticketDropdown",
    selectedId: "ticketSelected",
    inputId: "ticket",
    options: ticketOptions
});

createDropdown({
    buttonId: "sessionButton",
    dropdownId: "sessionDropdown",
    selectedId: "sessionSelected",
    inputId: "session",
    options: sessionOptions
});


createDropdown({
    buttonId: "preferredModeButton",
    dropdownId: "preferredModeDropdown",
    selectedId: "preferredModeSelected",
    inputId: "preferredMode",
    options: preferredModeOptions
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
            const checkbox = document.createElement("span");
            const label = document.createElement("span");

            item.type = "button";
            item.className =
                "flex w-full items-center gap-3 border-b border-gray-100 px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50";

            checkbox.className =
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300";

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
        selectedTools.innerHTML =
            '<span class="text-gray-400">Select tools</span>';
    } else {
        selectedToolValues.forEach((tool) => {
            const chip = document.createElement("span");

            chip.className =
                "inline-flex items-center gap-1 rounded bg-orange-50 px-2 py-1 text-xs text-[#ff4c00]";

            chip.innerHTML = `
                ${tool}
                <span class="cursor-pointer font-bold" data-remove="${tool}">×</span>
            `;

            selectedTools.appendChild(chip);
        });
    }

    toolsInput.value = JSON.stringify(selectedToolValues);
}

selectedTools.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove]");

    if (!removeButton) {
        return;
    }

    const tool = removeButton.dataset.remove;

    selectedToolValues = selectedToolValues.filter(
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