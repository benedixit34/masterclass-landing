const paymentForm = document.getElementById("paymentForm");

const ticketPrices = {
    "early-bird": 180000,
    "standard": 200000,
    "vip": 300000
};

paymentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const countryCode = document.getElementById("countryCode").value;
    const profile = document.getElementById("profile").value;
    const experience = document.getElementById("experience").value;
    const tools = JSON.parse(document.getElementById("tools").value || "[]");
    const masterclass = document.getElementById("masterclass").value;
    const session = document.getElementById("session").value;
    const ticket = document.getElementById("ticket").value;
    const learningGoal = document.getElementById("learningGoal").value.trim();

    if (!name) {
        alert("Please enter your full name.");
        return;
    }

    if (!email) {
        alert("Please enter your email address.");
        return;
    }

    if (!phone) {
        alert("Please enter your phone number.");
        return;
    }

    if (!profile) {
        alert("Please select what best describes you.");
        return;
    }

    if (!experience) {
        alert("Please select your experience level.");
        return;
    }

    if (!masterclass) {
        alert("Please select a masterclass.");
        return;
    }

    if (!session) {
        alert("Please select a session.");
        return;
    }

    if (!ticket) {
        alert("Please select a ticket type.");
        return;
    }

    const amount = ticketPrices[ticket];

    if (!amount) {
        alert("Invalid ticket type.");
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
        callback: (data) => {
             submitToWeb3Forms(booking, data.transaction_id);
        },
        onclose: function () {
            console.log("Flutterwave checkout closed.");
        }
    });
});

async function submitToWeb3Forms(booking, transactionId) {
    const formData = new FormData();

    formData.append("access_key", "YOUR_WEB3FORMS_ACCESS_KEY");
    formData.append("subject", `New Masterclass Booking - ${booking.name}`);
    formData.append("name", booking.name);
    formData.append("email", booking.email);
    formData.append("phone", booking.phone);
    formData.append("profile", booking.profile);
    formData.append("experience", booking.experience);
    formData.append("tools", booking.tools.join(", "));
    formData.append("masterclass", booking.masterclass);
    formData.append("session", booking.session);
    formData.append("ticket", booking.ticket);
    formData.append("amount", `₦${booking.amount.toLocaleString()}`);
    formData.append("learning_goal", booking.learningGoal);
    formData.append("transaction_id", transactionId);
    formData.append("payment_status", "Paid");

 try {
    const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
    });

    const result = await response.json();

    if (result.success) {
        console.log("Booking submitted successfully.");

        window.location.href =
            `./status.html?status=success&reference=${encodeURIComponent(transactionId)}`;

        return;
    }

    console.error("Booking submission failed:", result);

    window.location.href =
        `./status.html?status=failed&reference=${encodeURIComponent(transactionId)}`;
} catch (error) {
    console.error("Booking submission failed:", error);

    window.location.href =
        `./status.html?status=failed&reference=${encodeURIComponent(transactionId)}`;
}
}