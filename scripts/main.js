const personalInfo = document.getElementById("personal-info");
const professionalInfo = document.getElementById("professional-info");
const masterclassInfo = document.getElementById("masterclass-info");
const personalInfoButton = document.getElementById("personal-info-button");
const professionalInfoButton = document.getElementById(
  "professional-info-button",
);
const backToPersonalButton = document.getElementById("back-to-personal-button");
const backToProfessionalButton = document.getElementById(
  "back-to-professional-button",
);
const masterclassInfoButton = document.getElementById(
  "masterclass-info-button",
);
const backToMasterclassButton = document.getElementById(
  "back-to-masterclass-button",
);

const paymentInfo = document.getElementById("payment-info");

const payLaterButton = document.getElementById("pay-later-btn");

const steps = {
  personal: {
    section: "personal-info",
    step: 1,
  },
  masterclass: {
    section: "masterclass-info",
    step: 2,
  },
  professional: {
    section: "professional-info",
    step: 3,
  },
  payment: {
    section: "payment-info",
    step: 4,
  },
};

function updateProgress(currentStep) {
  for (let i = 1; i <= 4; i++) {
    const circle = document.getElementById(`step${i}`);
    const label = document.getElementById(`step${i}Label`);

    if (!circle || !label) continue;

    if (i <= currentStep) {
      circle.classList.remove("bg-gray-200", "text-gray-500");

      circle.classList.add("bg-[#ff4c00]", "text-white");

      label.classList.remove("text-gray-400");

      label.classList.add("text-[#ff4c00]");
    } else {
      circle.classList.remove("bg-[#ff4c00]", "text-white");

      circle.classList.add("bg-gray-200", "text-gray-500");

      label.classList.remove("text-[#ff4c00]");

      label.classList.add("text-gray-400");
    }
  }

  for (let i = 1; i <= 3; i++) {
    const line = document.getElementById(`line${i}`);

    if (!line) continue;

    if (i < currentStep) {
      line.classList.remove("bg-gray-200");
      line.classList.add("bg-[#ff4c00]");
    } else {
      line.classList.remove("bg-[#ff4c00]");
      line.classList.add("bg-gray-200");
    }
  }
}

personalInfoButton.addEventListener("click", (event) => {
  event.stopPropagation();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const location = document.getElementById("location");

  const nameError = document.getElementById("nameError");
  nameError.textContent = "";
  nameError.classList.add("hidden");
  name.classList.remove("border-red-500");

  if (!name.value.trim()) {
    nameError.textContent = "Please enter your full name.";
    nameError.classList.remove("hidden");
    name.classList.add("border-red-500");
  }

  const emailError = document.getElementById("emailError");
  emailError.textContent = "";
  emailError.classList.add("hidden");
  email.classList.remove("border-red-500");

  if (!email.value.trim()) {
    emailError.textContent = "Please enter your email address.";
    emailError.classList.remove("hidden");
    email.classList.add("border-red-500");
  } else if (!email.checkValidity()) {
    emailError.textContent = "Please enter a valid email address.";
    emailError.classList.remove("hidden");
    email.classList.add("border-red-500");
  }

  const phoneError = document.getElementById("phoneError");

  phoneError.textContent = "";
  phoneError.classList.add("hidden");
  phone.classList.remove("border-red-500");

  const phoneRegex = /^[0-9]{7,15}$/;
  const phoneNumber = phone.value.trim();

  if (!phoneNumber) {
    phoneError.textContent = "Please enter your phone number.";
    phoneError.classList.remove("hidden");
    phone.classList.add("border-red-500");
  } else if (!phoneRegex.test(phoneNumber)) {
    phoneError.textContent =
      "Please enter a valid phone number using numbers only.";
    phoneError.classList.remove("hidden");
    phone.classList.add("border-red-500");
  }

  if (!location.value.trim()) {
    const locationError = document.getElementById("locationError");
    locationError.textContent = "Please select a location from the dropdown.";
    locationError.classList.remove("hidden");
    location.classList.add("border-red-500");
  }

  if (!name.reportValidity()) return;
  if (!email.reportValidity()) return;
  if (!phone.reportValidity()) return;
  if (!location.reportValidity()) return;


  personalInfo.classList.add("hidden");
  masterclassInfo.classList.remove("hidden");
  updateProgress(2);
});

backToPersonalButton.addEventListener("click", () => {
  masterclassInfo.classList.add("hidden");

  personalInfo.classList.remove("hidden");
  updateProgress(1);
});

masterclassInfoButton.addEventListener("click", () => {

  const masterclass = document.getElementById("masterclass"); 
  const masterclassError = document.getElementById("masterclassError");
  masterclassError.textContent = "";
  masterclassError.classList.add("hidden");
  masterclass.classList.remove("border-red-500");


  const preferredMode = document.getElementById("preferredMode");
  const preferredModeError = document.getElementById("preferredModeError");
  preferredModeError.textContent = "";
  preferredModeError.classList.add("hidden");
  preferredMode.classList.remove("border-red-500");
  let valid = true; 

  if (!masterclass.value) {
    masterclassError.textContent = "Please select a masterclass.";
    masterclassError.classList.remove("hidden");
    masterclass.classList.add("border-red-500");
    valid = false;
  }

  if (!preferredMode.value) {
    preferredModeError.textContent = "Please select a preferred mode.";
    preferredModeError.classList.remove("hidden");
    preferredMode.classList.add("border-red-500");
    valid = false;
  }


  if (!valid) {
    return;
  }

  if (!masterclass.reportValidity()) return;

  masterclassInfo.classList.add("hidden");
  professionalInfo.classList.remove("hidden");
  updateProgress(3);
});

backToMasterclassButton.addEventListener("click", () => {
  professionalInfo.classList.add("hidden");
  masterclassInfo.classList.remove("hidden");

  updateProgress(2);
});

professionalInfoButton.addEventListener("click", () => {
  const profile = document.getElementById("profile");
  const experience = document.getElementById("experience");
  const profileError = document.getElementById("profileError");
  const experienceError = document.getElementById("experienceError");
  let valid = true;

  profileError.classList.add("hidden");
  experienceError.classList.add("hidden");

  if (!profile.value) {
    profileError.textContent = "Please select an option.";
    profileError.classList.remove("hidden");
    valid = false;
  }

  if (!experience.value) {
    experienceError.textContent = "Please select your experience level.";
    experienceError.classList.remove("hidden");
    valid = false;
  }

  if (!valid) {
    return;
  }

  professionalInfo.classList.add("hidden");
  paymentInfo.classList.remove("hidden");
  updateProgress(4);
});

backToProfessionalButton.addEventListener("click", () => {
  paymentInfo.classList.add("hidden");

  professionalInfo.classList.remove("hidden");
});