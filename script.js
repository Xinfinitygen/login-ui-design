const form = document.querySelector("form");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const genderSelect = document.querySelector("#gender");
const dob = document.querySelector("#dob");
const weightInput = document.querySelector("#weight");
const heightInput = document.querySelector("#height");
const activitySelect = document.querySelector("#activity");
const passwordInput = document.querySelector("#password");
const btn = document.querySelector("#register-btn");

// Initialize Flatpickr and save the instance to a variable
const fp = flatpickr("#dob", {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "d/m/Y",
    disableMobile: true,
    maxDate: "today"
});

// ==========================================
// 1. LIVE VALIDATION LISTENERS (As user types)
// ==========================================

// --- First Name Validation ---
const firstNameError = firstName.nextElementSibling;
firstName.addEventListener("input", () => {
    if (firstName.value.trim() === "") {
        firstNameError.textContent = "First name is required.";
    } else if (firstName.value.trim().length < 3) {
        firstNameError.textContent = "First Name must be at least 3 characters long.";
    } else {
        firstNameError.textContent = "";
    }
});

// --- Last Name Validation ---
const lastNameError = lastName.nextElementSibling;
lastName.addEventListener("input", () => {
    if (lastName.value.trim() === "") {
        lastNameError.textContent = "Last name is required";
    } else if (lastName.value.trim().length < 3) {
        lastNameError.textContent = "Last name must be at least 3 characters long.";
    } else {
        lastNameError.textContent = "";
    }
});

// --- Gender Validation ---
const genderError = genderSelect.nextElementSibling; 
genderSelect.addEventListener("change", () => {
    if (genderSelect.value.trim() === "") {
        genderError.textContent = "Please select your gender.";
    } else {
        genderError.textContent = "";
    }
});

// --- Validate Date of Birth ---
const dobError = dob.nextElementSibling;
// Flatpickr needs the onChange config option to track live changes correctly
fp.set("onChange", function (selectedDates) {
    if (selectedDates.length === 0) {
        dobError.textContent = "Date of birth is required.";
        return;
    }

    const selectedDate = selectedDates[0]; // Accurate Date object from Flatpickr
    const today = new Date();
    let age = today.getFullYear() - selectedDate.getFullYear();
    const monthDifference = today.getMonth() - selectedDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < selectedDate.getDate())) {
        age--;
    }

    if (age < 18) {
        dobError.textContent = "You must be at least 18 years old to register.";
    } else if (selectedDate > today) {
        dobError.textContent = "Date of birth cannot be in the future.";
    } else {
        dobError.textContent = "";
    }
});

// --- Validate Weight ---
const weightError = weightInput.nextElementSibling;
weightInput.addEventListener("input", () => {
    const currentWeightValue = weightInput.value.trim(); // Fixed: Read fresh live value
    const weightNum = parseFloat(currentWeightValue);

    if (currentWeightValue === "") {
        weightError.textContent = "Weight is required.";
    } else if (isNaN(weightNum) || weightNum <= 0) {
        weightError.textContent = "Please enter a valid weight greater than 0.";
    } else if (weightNum > 600) {
        weightError.textContent = "Please enter a realistic weight.";
    } else {
        weightError.textContent = "";
    }
});

// --- Validate Height ---
const heightError = heightInput.nextElementSibling;
heightInput.addEventListener("input", () => {
    const currentHeightValue = heightInput.value.trim(); // Fixed: Read fresh live value
    const heightNum = parseFloat(currentHeightValue);

    if (currentHeightValue === "") {
        heightError.textContent = "Height is required.";
    } else if (isNaN(heightNum) || heightNum <= 0) {
        heightError.textContent = "Please enter a valid height greater than 0.";
    } else if (heightNum < 30 || heightNum > 250) {
        heightError.textContent = "Please enter a realistic height between 30 and 250 cm.";
    } else {
        heightError.textContent = "";
    }
});

// --- Validate Activity Level ---
const activityError = activitySelect.nextElementSibling;
activitySelect.addEventListener("change", () => {
    if (activitySelect.value.trim() === "") {
        activityError.textContent = "Please select your daily activity level.";
    } else {
        activityError.textContent = "";
    }
});

// --- Validate Password ---
const passwordError = passwordInput.nextElementSibling;
passwordInput.addEventListener("input", () => {
    const passwordValue = passwordInput.value;
    const hasUppercase = /[A-Z]/.test(passwordValue);
    const hasLowercase = /[a-z]/.test(passwordValue);
    const hasNumber = /[0-9]/.test(passwordValue);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);

    if (passwordValue === "") {
        passwordError.textContent = "Password is required.";
    } else if (passwordValue.length < 8) {
        passwordError.textContent = "Password must be at least 8 characters long.";
    } else if (!hasUppercase || !hasLowercase) {
        passwordError.textContent = "Password must include both uppercase and lowercase letters.";
    } else if (!hasNumber) {
        passwordError.textContent = "Password must include at least one number.";
    } else if (!hasSpecialChar) {
        passwordError.textContent = "Password must include at least one special character (e.g., !, @, #, $).";
    } else {
        passwordError.textContent = "";
    }
});


// ==========================================
// 2. FORM SUBMISSION VALIDATION BLOCK
// ==========================================
form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents page reload 

    // Trigger all input and change events manually to force errors onto empty fields
    firstName.dispatchEvent(new Event('input'));
    lastName.dispatchEvent(new Event('input'));
    genderSelect.dispatchEvent(new Event('change'));
    activitySelect.dispatchEvent(new Event('change'));
    weightInput.dispatchEvent(new Event('input'));
    heightInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    // Manually trigger the flatpickr check
    if (fp.selectedDates.length === 0) {
        dobError.textContent = "Date of birth is required.";
    }

    // Check if ANY error messages are present on screen
    const totalErrors = document.querySelectorAll('.error-class-name-here'); // Tip: Replace with your actual error CSS class name if applicable

    // Fallback error validation scanner
    const hasErrors = firstNameError.textContent !== "" ||
        lastNameError.textContent !== "" ||
        genderError.textContent !== "" ||
        dobError.textContent !== "" ||
        weightError.textContent !== "" ||
        heightError.textContent !== "" ||
        activityError.textContent !== "" ||
        passwordError.textContent !== "";

    if (hasErrors) {
        alert("Please fix the errors in the form before submitting.");
    } else {
        alert("Registration Successful!");
        // form.submit(); 
    }
});