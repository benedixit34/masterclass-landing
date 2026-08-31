const paymentForm = document.getElementById("paymentForm");

const ticketPrices = {
    "early-bird": 180000,
    standard: 200000,
    vip: 300000
};

const API_URL = "http://localhost:3000/api/bookings";

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(`${inputId}Error`);

    if (error) {
        error.textContent = message;
        error.classList.remove("hidden");
    }

    if (input) {
        input.classList.add("border-red-500");
    }
}

function clearError(inputId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(`${inputId}Error`);

    if (error) {
        error.textContent = "";
        error.classList.add("hidden");
    }

    if (input) {
        input.classList.remove("border-red-500");
    }
}

function validateBookingForm() {
    let isValid = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const profile = document.getElementById("profile").value;
    const experience = document.getElementById("experience").value;
    const masterclass = document.getElementById("masterclass").value;
    const session = document.getElementById("session").value;
    const ticket = document.getElementById("ticket").value;

    [
        "name",
        "email",
        "phone",
        "profile",
        "experience",
        "masterclass",
        "session",
        "ticket"
    ].forEach(clearError);

    if (!name) {
        showError("name", "Please enter your full name.");
        isValid = false;
    }

    if (!email) {
        showError("email", "Please enter your email address.");
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("email", "Please enter a valid email address.");
        isValid = false;
    }

    if (!phone) {
        showError("phone", "Please enter your phone number.");
        isValid = false;
    }

    if (!profile) {
        showError("profile", "Please select what best describes you.");
        isValid = false;
    }

    if (!experience) {
        showError("experience", "Please select your experience level.");
        isValid = false;
    }

    if (!masterclass) {
        showError("masterclass", "Please select a masterclass.");
        isValid = false;
    }

    if (!session) {
        showError("session", "Please select a session.");
        isValid = false;
    }

    if (!ticket) {
        showError("ticket", "Please select a ticket type.");
        isValid = false;
    }

    return isValid;
}

paymentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateBookingForm()) {
        return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const countryCode = document.getElementById("countryCode").value;
    const profile = document.getElementById("profile").value;
    const experience = document.getElementById("experience").value;

    let tools = [];

    try {
        tools = JSON.parse(document.getElementById("tools").value || "[]");
    } catch (error) {
        console.error("Invalid tools value:", error);
    }

    const masterclass = document.getElementById("masterclass").value;
    const session = document.getElementById("session").value;
    const ticket = document.getElementById("ticket").value;
    const learningGoal = document.getElementById("learningGoal").value.trim();
    const amount = ticketPrices[ticket];

    if (!amount) {
        showError("ticket", "Invalid ticket type.");
        return;
    }

    const fullPhoneNumber = `${countryCode}${phone.replace(/^0+/, "")}`;

    const booking = {
        name,
        email,
        phone: fullPhoneNumber,
        profile,
        experience,
        tools,
        masterclass,
        session,
        ticket,
        amount,
        learningGoal
    };

    FlutterwaveCheckout({
        public_key: "FLWPUBK_TEST-4ca42aac0399cba2e9f8507cb9eb1807-X",
        tx_ref: "masterclass-" + Date.now(),
        amount,
        currency: "NGN",
        payment_options: "card, banktransfer, ussd",
        customer: {
            email,
            name,
            phone_number: fullPhoneNumber
        },
        customizations: {
            title: "Orange VFX Masterclass Booking",
            description: "Masterclass registration",
            logo: "../assets/Orange Seed Initiative Approved Logo.png"
        },
        callback: async (data) => {
            if (data.status !== "successful" || !data.transaction_id) {
                window.location.href =
                    `./status.html?status=failed&reference=${encodeURIComponent(data.transaction_id || "")}`;
                return;
            }

            await submitBookingToAPI(booking, data.transaction_id);
        },
        onclose: function () {
            console.log("Flutterwave checkout closed.");
        }
    });
});

async function submitBookingToAPI(booking, transactionId) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                transactionId,
                name: booking.name,
                email: booking.email,
                phone: booking.phone,
                profile: booking.profile,
                experience: booking.experience,
                tools: booking.tools,
                masterclass: booking.masterclass,
                session: booking.session,
                ticket: booking.ticket,
                learningGoal: booking.learningGoal
            })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            console.error("Booking API failed:", result);

            window.location.href =
                `./status.html?status=failed&reference=${encodeURIComponent(transactionId)}`;

            return;
        }

        console.log("Booking created successfully:", result);

        window.location.href =
            `./status.html?status=success&reference=${encodeURIComponent(transactionId)}`;
    } catch (error) {
        console.error("Unable to submit booking:", error);

        window.location.href =
            `./status.html?status=failed&reference=${encodeURIComponent(transactionId)}`;
    }
}
