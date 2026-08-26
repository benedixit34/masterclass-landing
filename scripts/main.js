const personalInfo = document.getElementById("personal-info");
const professionalInfo = document.getElementById("professional-info")
const masterclassInfo = document.getElementById("masterclass-info")
const personalInfoButton = document.getElementById("personal-info-button");
const professionalInfoButton = document.getElementById("professional-info-button")
const backToPersonalButton = document.getElementById("back-to-personal-button");
const backToProfessionalButton = document.getElementById("back-to-professional-button")


personalInfoButton.addEventListener("click", (event) => {
    event.stopPropagation();

    personalInfo.classList.add("hidden");
    professionalInfo.classList.remove("hidden")
});

backToPersonalButton.addEventListener("click", () => {

    professionalInfo.classList.add("hidden");

    personalInfo.classList.remove("hidden");

});

professionalInfoButton.addEventListener("click", () => {

    professionalInfo.classList.add("hidden");
    masterclassInfo.classList.remove("hidden")
})


backToProfessionalButton.addEventListener("click", () => {

    masterclassInfo.classList.add("hidden")

    professionalInfo.classList.remove("hidden");

});
