const payNowBtn = document.getElementById("pay-now-btn");
const payLaterBtn = document.getElementById("pay-later-btn");

const ticketPrices = {
    "early-bird": 180000,
    standard: 200000,
    vip: 300000
};

const PAYMENT_URL = "https://orange-payment-api.vercel.app/api/bookings";
const SAVE_BOOKING_URL = "https://orange-payment-api.vercel.app/api/bookings/save";


function setButtonLoading(button, loadingText) {
  button.disabled = true;

  button.innerHTML = `
    <span class="flex items-center justify-center gap-2">
      <span class="spinner"></span>
      <span>${loadingText}</span>
    </span>
  `;
}

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
    const preferredMode = document.getElementById("preferredMode").value;
    const masterclass = document.getElementById("masterclass").value;
    const session = document.getElementById("session").value;
    const ticket = document.getElementById("ticket").value;

    [
        "name",
        "email",
        "phone",
        "profile",
        "experience",
        "preferredMode",
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

    if (!preferredMode) {
        showError("preferredMode", "Please select your preferred mode.");
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

function getBookingData() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const countryCode = document.getElementById("countryCode").value;
    const profile = document.getElementById("profile").value;
    const experience = document.getElementById("experience").value;
    const preferredMode = document.getElementById("preferredMode").value;
    const futureInterest = document.getElementById("futureInterest").value;

    let tools = [];

    try {
        tools = JSON.parse(
            document.getElementById("tools").value || "[]"
        );
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
        return null;
    }

    const fullPhoneNumber = `${countryCode}${phone.replace(/^0+/, "")}`;

    return {
        name,
        email,
        phone: fullPhoneNumber,
        profile,
        experience,
        preferredMode,
        tools,
        masterclass,
        session,
        ticket,
        amount,
        learningGoal,
        futureInterest
    };
}

payNowBtn.addEventListener("click", function () {
    setButtonLoading(payNowBtn, "Processing...");
    if (!validateBookingForm()) {
        return;
    }

    const booking = getBookingData();

    if (!booking) {
        return;
    }

    const txRef = "masterclass-" + Date.now();

    FlutterwaveCheckout({
        public_key: "FLWPUBK_TEST-4ca42aac0399cba2e9f8507cb9eb1807-X",
        tx_ref: txRef,
        amount: booking.amount,
        currency: "NGN",
        payment_options: "card, banktransfer, ussd",
        customer: {
            email: booking.email,
            name: booking.name,
            phone_number: booking.phone
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

            await submitBookingToAPI(
                booking,
                data.transaction_id
            );
        },
        onclose: function () {
            console.log("Flutterwave checkout closed.");
        }
    });
});

payLaterBtn.addEventListener("click", async function () {
    setButtonLoading(payLaterBtn, "Processing...");
    if (!validateBookingForm()) {
        return;
    }

    const booking = getBookingData();

    if (!booking) {
        return;
    }

    await saveBookingForLater(booking);
});

async function submitBookingToAPI(booking, transactionId) {
    try {
        const response = await fetch(PAYMENT_URL, {
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
                preferredMode: booking.preferredMode,
                tools: booking.tools,
                masterclass: booking.masterclass,
                session: booking.session,
                ticket: booking.ticket,
                amount: booking.amount,
                learningGoal: booking.learningGoal,
                futureInterest: booking.futureInterest
            })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            console.error("Booking API failed:", result);

            window.location.href =
                `./status.html?status=failed&reference=${encodeURIComponent(transactionId)}`;

            return;
        }

        window.location.href =
            `./status.html?status=success&reference=${encodeURIComponent(transactionId)}`;
    } catch (error) {
        console.error("Unable to submit booking:", error);

        window.location.href =
            `./status.html?status=failed&reference=${encodeURIComponent(transactionId)}`;
    }
}

async function saveBookingForLater(booking) {
    try {
        const response = await fetch(SAVE_BOOKING_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: booking.name,
                email: booking.email,
                phone: booking.phone,
                profile: booking.profile,
                experience: booking.experience,
                preferredMode: booking.preferredMode,
                tools: booking.tools,
                masterclass: booking.masterclass,
                session: booking.session,
                ticket: booking.ticket,
                amount: booking.amount,
                learningGoal: booking.learningGoal,
                futureInterest: booking.futureInterest
            })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            console.error("Save booking failed:", result);

            window.location.href =
                "./status.html?status=failed";

            return;
        }

        window.location.href =
            "./status.html?status=pending";
    } catch (error) {
        console.error("Unable to save booking:", error);

        window.location.href =
            "./status.html?status=failed";
    }
}

