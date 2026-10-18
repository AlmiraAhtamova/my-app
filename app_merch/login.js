const form = document.querySelector("#loginForm");

const email = document.querySelector("#email");
const password = document.querySelector("#password");

const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");

const submitBtn = document.querySelector("#submitBtn");

const validatePassword = (value) => {
    if (value === "") {
        return { valid: false, message: "Введите пароль" };
    }

    return { valid: true, message: "" };
};

const validateEmail = (value) => {
    const trimmed = value.trim();
    
    if (trimmed === "") {
        return { valid: false, message: "Введите email" };
    }
    
    // Шаблон: символы@символы.символы
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return { valid: false, message: "Неверный email" };
    }
    
    return { valid: true, message: "" };
};
//
const showError = (input, errorElement, message) => {
    input.classList.add("error");
    input.classList.remove("success");
    errorElement.textContent = message;
};

const showSuccess = (input, errorElement) => {
    input.classList.remove("error");
    input.classList.add("success");
    errorElement.textContent = "";
};

//

const validateForm = () => {
    const r1 = validateEmail(email.value);
    const r2 = validatePassword(password.value);

    if (r1.valid) showSuccess(email, emailError);
    else showError(email, emailError, r1.message);

    if (r2.valid) showSuccess(password, passwordError);
    else showError(password, passwordError, r2.message);

    const allValid = r1.valid && r2.valid;
    submitBtn.disabled = !allValid;
    return allValid;
};

[email, password].forEach((input) => {
    input.addEventListener("input", validateForm);
});

const successModal = document.querySelector("#successModal");
const modalClose = document.querySelector("#modalClose");

const showModal = () => {
    successModal.classList.add("active");
};

const hideModal = () => {
    successModal.classList.remove("active");
};

modalClose.addEventListener("click", hideModal);

successModal.addEventListener("click", (event) => {
    // если кликнули по самому оверлею (а не по дочерним элементам) — закрываем. 
    if (event.target === successModal) {
        hideModal();
    }
});

// ОТПРАВКА ФОРЬЫ
form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (validateForm()) {
        showModal();                          // ← вместо alert
        form.reset();
        submitBtn.disabled = true;
        [email, password].forEach((input) => {
            input.classList.remove("success");
        });
    }
});
//
const themeBtn = document.querySelector("#themeBtn");

// Безопасная работа с localStorage
function getSavedTheme() {
    try {
        return localStorage.getItem("theme");
    } catch (e) {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem("theme", theme);
    } catch (e) {
        // localStorage недоступен — просто игнорируем
    }
}

// Применяем сохранённую тему при загрузке
if (getSavedTheme() === "dark") {
    document.body.classList.add("dark");
}

// Переключение темы по клику
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    saveTheme(isDark ? "dark" : "light");
});
