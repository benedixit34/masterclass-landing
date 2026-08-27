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

personalInfoButton.addEventListener("click", (event) => {
  event.stopPropagation();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");

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
  const phoneNumber = phone.value.replace(/\D/g, "");

  if (!phone.value.trim()) {
    phoneError.textContent = "Please enter your phone number.";
    phoneError.classList.remove("hidden");
    phone.classList.add("border-red-500");
  } else if (!phoneRegex.test(phoneNumber)) {
    phoneError.textContent = "Please enter a valid phone number.";
    phoneError.classList.remove("hidden");
    phone.classList.add("border-red-500");
  }

  if (!name.reportValidity()) return;
  if (!email.reportValidity()) return;
  if (!phone.reportValidity()) return;

  personalInfo.classList.add("hidden");
  professionalInfo.classList.remove("hidden");
});

backToPersonalButton.addEventListener("click", () => {
  professionalInfo.classList.add("hidden");

  personalInfo.classList.remove("hidden");
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
  masterclassInfo.classList.remove("hidden");
});

backToProfessionalButton.addEventListener("click", () => {
  masterclassInfo.classList.add("hidden");

  professionalInfo.classList.remove("hidden");
});
