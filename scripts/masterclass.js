let masterclassData = [];
let ticketData = [];

const masterclassButton = document.getElementById("masterclassButton");
const masterclassDropdown = document.getElementById("masterclassDropdown");
const masterclassSelected = document.getElementById("masterclassSelected");
const masterclassInput = document.getElementById("masterclass");

const sessionButton = document.getElementById("sessionButton");
const sessionDropdown = document.getElementById("sessionDropdown");
const sessionSelected = document.getElementById("sessionSelected");
const sessionInput = document.getElementById("session");

const ticketButton = document.getElementById("ticketButton");
const ticketDropdown = document.getElementById("ticketDropdown");
const ticketSelected = document.getElementById("ticketSelected");
const ticketInput = document.getElementById("ticket");

async function loadMasterclassData() {
    try {
        const response = await fetch("../assets/masterclass.json");

        if (!response.ok) {
            throw new Error("Could not load masterclass.json");
        }

        const data = await response.json();

        masterclassData = data.masterclasses || [];
        ticketData = data.tickets || [];

        renderMasterclasses();
        renderTickets();
    } catch (error) {
        console.error("Failed to load masterclass data:", error);
    }
}

function renderMasterclasses() {
    masterclassDropdown.innerHTML = "";

    if (masterclassData.length === 0) {
        masterclassDropdown.innerHTML = `
            <div class="px-3 py-2.5 text-sm text-gray-500">
                No masterclasses available
            </div>
        `;
        return;
    }

    masterclassData.forEach((masterclass, index) => {
        const item = document.createElement("button");

        item.type = "button";
        item.textContent = masterclass.name;
        item.className = `w-full px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 ${
            index < masterclassData.length - 1
                ? "border-b border-gray-100"
                : ""
        }`;

        item.addEventListener("click", () => {
            selectMasterclass(masterclass);
        });

        masterclassDropdown.appendChild(item);
    });
}

function selectMasterclass(masterclass) {
    masterclassSelected.textContent = masterclass.name;
    masterclassInput.value = masterclass.id;
    masterclassDropdown.classList.add("hidden");

    sessionSelected.textContent = "Select a cohort/start date";
    sessionInput.value = "";

    renderSessions(masterclass.sessions || []);
}

function renderSessions(sessions = []) {
    sessionDropdown.innerHTML = "";

    if (sessions.length === 0) {
        sessionButton.disabled = true;
        sessionSelected.textContent = "No cohorts available";
        sessionInput.value = "";
        return;
    }

    sessionButton.disabled = false;
    sessionSelected.textContent = "Select a cohort/start date";

    sessions.forEach((session, index) => {
        const item = document.createElement("button");

        item.type = "button";
        item.textContent = session.label;
        item.className = `w-full px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 ${
            index < sessions.length - 1
                ? "border-b border-gray-100"
                : ""
        }`;

        item.addEventListener("click", () => {
            sessionSelected.textContent = session.label;
            sessionInput.value = session.id;
            sessionDropdown.classList.add("hidden");
        });

        sessionDropdown.appendChild(item);
    });
}

function renderTickets() {
    if (!ticketDropdown) {
        return;
    }

    ticketDropdown.innerHTML = "";

    const availableTickets = ticketData.filter(
        (ticket) => ticket.available !== false
    );

    if (availableTickets.length === 0) {
        ticketDropdown.innerHTML = `
            <div class="px-3 py-2.5 text-sm text-gray-500">
                No tickets available
            </div>
        `;
        return;
    }

    availableTickets.forEach((ticket, index) => {
        const item = document.createElement("button");

        item.type = "button";
        item.className = `w-full px-3 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 ${
            index < availableTickets.length - 1
                ? "border-b border-gray-100"
                : ""
        }`;

        item.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${ticket.name}</span>
                <span class="font-medium">${formatPrice(ticket.price)}</span>
            </div>
        `;

        item.addEventListener("click", () => {
            ticketSelected.textContent =
                `${ticket.name} — ${formatPrice(ticket.price)}`;

            ticketInput.value = ticket.id;
            ticketDropdown.classList.add("hidden");
        });

        ticketDropdown.appendChild(item);
    });
}

function formatPrice(price) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(price);
}

masterclassButton.addEventListener("click", (event) => {
    event.stopPropagation();

    masterclassDropdown.classList.toggle("hidden");
    sessionDropdown.classList.add("hidden");

    if (ticketDropdown) {
        ticketDropdown.classList.add("hidden");
    }
});

sessionButton.addEventListener("click", (event) => {
    event.stopPropagation();

    if (sessionButton.disabled) {
        return;
    }

    sessionDropdown.classList.toggle("hidden");
    masterclassDropdown.classList.add("hidden");

    if (ticketDropdown) {
        ticketDropdown.classList.add("hidden");
    }
});

if (ticketButton) {
    ticketButton.addEventListener("click", (event) => {
        event.stopPropagation();

        ticketDropdown.classList.toggle("hidden");
        masterclassDropdown.classList.add("hidden");
        sessionDropdown.classList.add("hidden");
    });
}

document.addEventListener("click", (event) => {
    if (
        !masterclassButton.contains(event.target) &&
        !masterclassDropdown.contains(event.target)
    ) {
        masterclassDropdown.classList.add("hidden");
    }

    if (
        !sessionButton.contains(event.target) &&
        !sessionDropdown.contains(event.target)
    ) {
        sessionDropdown.classList.add("hidden");
    }

    if (
        ticketButton &&
        ticketDropdown &&
        !ticketButton.contains(event.target) &&
        !ticketDropdown.contains(event.target)
    ) {
        ticketDropdown.classList.add("hidden");
    }
});

sessionButton.disabled = true;

loadMasterclassData();

