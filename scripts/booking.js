const payNowBtn = document.getElementById("pay-now-btn");
const payLaterBtn = document.getElementById("pay-later-btn");

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


    [
        "name",
        "email",
        "phone",
        "profile",
        "experience",
        "preferredMode",
        "masterclass",
        "session",
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
    const learningGoal = document.getElementById("learningGoal").value.trim();
 
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
        learningGoal,
        futureInterest
    };
}

payLaterBtn.addEventListener("click", async function () {
    setButtonLoading(payLaterBtn, "Processing...");

    if (!validateBookingForm()) {
        return;
    }

    const booking = getBookingData();

    if (!booking) {
        return;
    }

    const reference = await saveBookingForLater(booking);

    if (!reference) {
        return;
    }

    window.location.href =
        `./status.html?status=pending&reference=${encodeURIComponent(reference)}`;
});


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
                learningGoal: booking.learningGoal,
                futureInterest: booking.futureInterest
            })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            console.error("Save booking failed:", result);
            window.location.href = "./status.html?status=failed";
            return null;
        }

        return result.data.reference;
    } catch (error) {
        console.error("Unable to save booking:", error);
        window.location.href = "./status.html?status=failed";
        return null;
    }
}
