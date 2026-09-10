import { createDropdown } from "./components/createDropdown.js";
import { setButtonLoading } from "./components/setButtonLoading.js";

const ticketOptions = [
    { value: "early-bird", label: "Early Bird — ₦180,000" },
    { value: "standard", label: "Standard — ₦200,000" },
    { value: "vip", label: "VIP — ₦300,000" }
];

createDropdown({
    buttonId: "ticketButton",
    dropdownId: "ticketDropdown",
    selectedId: "ticketSelected",
    inputId: "ticket",
    options: ticketOptions
});


const params = new URLSearchParams(window.location.search);

const statusCode = params.get("status");
const reference = params.get("reference");

const statusIcon = document.getElementById("statusIcon");
const statusTitle = document.getElementById("statusTitle");
const statusMessage = document.getElementById("statusMessage");
const paymentStatus = document.getElementById("paymentStatus");
const additionalMessage = document.getElementById("additionalMessage");
const primaryPaymentButton = document.getElementById("primaryPaymentButton");
const referenceContainer = document.getElementById("referenceContainer");
const paymentReference = document.getElementById("paymentReference");
const primaryInfo = document.getElementById("payment-info")

const ticketPrices = {
    "early-bird": 180000,
    standard: 200000,
    vip: 300000
};


console.log(ticketPrices["early-bird"])
if (reference) {
  paymentReference.textContent = reference;
  referenceContainer.classList.remove("hidden");
  referenceContainer.classList.add("flex");
}

const BASE_URL = "https://orange-payment-api.vercel.app/api/bookings";


async function getPendingBooking() {
  if (!reference) {
    throw new Error("Booking reference is missing.");
  }

  const response = await fetch(`${BASE_URL}/pending/${encodeURIComponent(reference)}`);

  const result = await response.json();

  if (!response.ok || !result.success) {
    window.location.href = "./status.html?status=failed";
  }

  return result.data;
}


async function confirmPayment(transactionId, reference) {
    try {
        const response = await fetch(`${BASE_URL}/confirm`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                transactionId,
                reference
            })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Payment confirmation failed."
            );
        }

        return result;
    } catch (error) {
        console.error("Payment confirmation failed:", error);
        return null;
    }
}

if (statusCode === "success") {
  
  statusIcon.className =
    "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50";

  statusIcon.innerHTML = `
          <svg
            class="h-10 w-10 text-green-500"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        `;

  statusTitle.textContent = "Booking Confirmed";

  statusMessage.textContent =
    "Your payment has been received and your masterclass booking has been confirmed.";

  paymentStatus.textContent = "Confirmed";
  paymentStatus.className = "text-sm font-medium text-green-600";

  additionalMessage.textContent =
    "A confirmation and further details will be sent to your email address.";

  primaryPaymentButton.textContent = "Check Other Courses";
} else if (statusCode === "pending") {
  primaryInfo.classList.remove("hidden")
  
  statusIcon.className =
    "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-50";

  statusIcon.innerHTML = `
          <svg
            class="h-10 w-10 text-yellow-500"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v6l4 2"
            />
            <circle
              cx="12"
              cy="12"
              r="9"
            />
          </svg>
        `;

  statusTitle.textContent = "Booking Received";

  statusMessage.textContent =
    "Your masterclass booking has been received. Payment has not been made yet.";

  paymentStatus.textContent = "Payment Pending";
  paymentStatus.className = "text-sm font-medium text-yellow-600";

  additionalMessage.textContent =
    "Our team will contact you with payment instructions and the next steps.";

  primaryPaymentButton.textContent = "Pay Now";

  primaryPaymentButton.addEventListener("click", async () => {
    const ticket = document.getElementById("ticket").value;
    const ticketError = document.getElementById("ticketError")

    if (!ticket) {
      ticketError.classList.remove("hidden")
       ticketError.textContent = "Please select a ticket type.";
        return;
    }

    const amount = ticketPrices[ticket];

    if (!amount) {
         ticketError.textContent = "Invalid ticket type selected.";
        return;
    }

    setButtonLoading(primaryPaymentButton, "Processing...")
    try {
      const booking = await getPendingBooking();

      FlutterwaveCheckout({
        public_key: "FLWPUBK_TEST-4ca42aac0399cba2e9f8507cb9eb1807-X",
        tx_ref: `masterclass-${Date.now()}`,
        amount: ticketPrices[ticket],
        currency: "NGN",
        payment_options: "card, banktransfer, ussd",

        customer: {
          name: booking.name,
          email: booking.email,
          phone_number: booking.phone,
        },

        customizations: {
          title: "Orange VFX Masterclass Booking",
          description: "Masterclass registration",
          logo: "../assets/Orange Seed Initiative Approved Logo.png",
        },

        callback: async (data) => {
          if (data.status !== "successful" || !data.transaction_id) {
            window.location.href = `./status.html?status=pending&reference=${encodeURIComponent(reference)}`;
            return;
          }
            const result = await confirmPayment(
                data.transaction_id,
                reference
            );

            if (!result) {
                window.location.href =
                    `./status.html?status=pending&transaction_id=${encodeURIComponent(data.transaction_id)}&reference=${encodeURIComponent(reference)}`;
                return;
            }

          window.location.href = `./status.html?status=success&reference=${encodeURIComponent(data.transaction_id)}`;
        },

        onclose: () => {
          console.log("Flutterwave checkout closed.");
        },
      });
    } catch (error) {
      console.error("Unable to start payment:", error);
      alert("Unable to retrieve your booking. Please try again.");
    }
  });
} else {
  statusIcon.className ="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50";

  statusIcon.innerHTML = `
          <svg
            class="h-10 w-10 text-red-500"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        `;

  statusTitle.textContent = "Booking Failed";

  statusMessage.textContent =
    "We couldn't complete your booking. Please try again.";

  paymentStatus.textContent = "Failed";
  paymentStatus.className = "text-sm font-medium text-red-500";

  additionalMessage.textContent =
    "If money was deducted from your account, please contact us with your payment reference.";

  primaryPaymentButton.textContent = "Try Again";
}
