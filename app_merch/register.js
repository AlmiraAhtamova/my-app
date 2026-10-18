// ========================================
// 1. НАХОДИМ ВСЕ ЭЛЕМЕНТЫ ФОРМЫ
// ========================================

const form = document.querySelector("#registerForm");

const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirm = document.querySelector("#confirm");
const terms = document.querySelector("#terms");

const usernameError = document.querySelector("#usernameError");
const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");
const confirmError = document.querySelector("#confirmError");
const termsError = document.querySelector("#termsError");

const submitBtn = document.querySelector("#submitBtn");

let touched = {
    username: false,
    email: false,
    password: false,
    confirm: false
};


const validateUsername = (value) => {
    // Убираем пробелы по краям
    const trimmed = value.trim();
    
    // Правило 1: не пусто
    if (trimmed === "") {
        return { valid: false, message: "Введите имя" };
    }
    
    // Правило 2: минимум 3 символа
    if (trimmed.length < 3) {
        return { valid: false, message: "Минимум 3 символа" };
    }
    
    // Правило 3: максимум 20 символов
    if (trimmed.length > 20) {
        return { valid: false, message: "Максимум 20 символов" };
    }
    
    // Правило 4: только латиница, цифры и _
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
        return { valid: false, message: "Только буквы, цифры и _" };
    }
    
    // Всё прошло
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


const validatePassword = (value) => {
    if (value === "") {
        return { valid: false, message: "Введите пароль" };
    }
    
    if (value.length < 8) {
        return { valid: false, message: "Минимум 8 символов" };
    }
    
    // Есть ли буква?
    if (!/[a-zA-Z]/.test(value)) {
        return { valid: false, message: "Добавьте букву" };
    }
    
    // Есть ли цифра?
    if (!/\d/.test(value)) {
        return { valid: false, message: "Добавьте цифру" };
    }
    
    return { valid: true, message: "" };
};


const validateConfirm = (value) => {
    if (value === "") {
        return { valid: false, message: "Повторите пароль" };
    }
    
    // Сравниваем с основным паролем
    if (value !== password.value) {
        return { valid: false, message: "Пароли не совпадают" };
    }
    
    return { valid: true, message: "" };
};

const validateTerms = () => {
    if (!terms.checked) {
        return { valid: false, message: "Отметьте согласие" };
    }
    return { valid: true, message: "" };
};

// Показать ошибку
const showError = (input, errorElement, message) => {
    input.classList.add("error");          // Красная рамка
    input.classList.remove("success");      // Убрать зелёную
    errorElement.textContent = message;     // Показать текст ошибки
};

// Показать успех
const showSuccess = (input, errorElement) => {
    input.classList.remove("error");        // Убрать красную
    input.classList.add("success");         // Зелёная рамка
    errorElement.textContent = "";          // Очистить текст
};



//Пользователь начал печатать «И» в имени — сразу красная 
//ошибка «Минимум 3 символа». Это раздражает

const validateSingleField = (input, errorElement, validator) => {
    const result = validator(input.value);
    if (result.valid) {
        showSuccess(input, errorElement);
    } else {
        showError(input, errorElement, result.message);
    }
};

//активная или неактивная кнопка
const updateSubmitState = () => {
    const allValid =
        validateUsername(username.value).valid &&
        validateEmail(email.value).valid &&
        validatePassword(password.value).valid &&
        validateConfirm(confirm.value).valid &&
        validateTerms().valid;

    submitBtn.disabled = !allValid;
};

//функция сохранения
const saveDraft = () => {
    const draft = {
        username: username.value,
        email: email.value
        // Пароль НЕ сохраняем из соображений безопасности!
    };

    try {
        localStorage.setItem("registerDraft", JSON.stringify(draft));
    } catch (e) {
        // localStorage может быть недоступен в приватном режиме
    }
};
//JSON.stringify: превращает объект в строку, чтобы сохранить в localStorage.

//функция загрузки
const loadDraft = () => {
    try {
        const saved = localStorage.getItem("registerDraft");
        if (!saved) return;

        const draft = JSON.parse(saved);
        username.value = draft.username || "";
        email.value = draft.email || "";
    } catch (e) {
        // если что-то не так — просто ничего не делаем
    }
};

// Для каждого поля
//Пользоват
// При вводе сохраняем черновик
username.addEventListener("input", () => {
    if (touched.username) {
        validateSingleField(username, usernameError, validateUsername);
    }
    updateSubmitState();
    saveDraft();
});

username.addEventListener("blur", () => {
    touched.username = true;
    validateSingleField(username, usernameError, validateUsername);
    updateSubmitState();
    saveDraft();
});

//почта
// При вводе сохраняем черновик
email.addEventListener("input", () => {
    if (touched.email) {
        validateSingleField(email, emailError, validateEmail);
    }
    updateSubmitState();
    saveDraft();
});

email.addEventListener("blur", () => {
    touched.email = true;
    validateSingleField(email, emailError, validateEmail);
    updateSubmitState();
    saveDraft();
});

//пароль

password.addEventListener("input", () => {
    if (touched.password) {
        validateSingleField(password, passwordError, validatePassword);
    }
    updateSubmitState();
});
password.addEventListener("blur", () => {
    touched.password = true;
    validateSingleField(password, passwordError, validatePassword);
    updateSubmitState();
});

//окно для успешного результ
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

//Повтор пароля

confirm.addEventListener("input", () => {
    if (touched.confirm) {
        validateSingleField(confirm, confirmError, validateConfirm);
    }
    updateSubmitState();
});

confirm.addEventListener("blur", () => {
    touched.confirm = true;
    validateSingleField(confirm, confirmError, validateConfirm);
    updateSubmitState();
});


//след шаг

const validateForm = () => {
    // Проверяем каждое поле
    const r1 = validateUsername(username.value);
    const r2 = validateEmail(email.value);
    const r3 = validatePassword(password.value);
    const r4 = validateConfirm(confirm.value);
    const r5 = validateTerms();
    
    // Показываем результат для каждого поля
    if (r1.valid) showSuccess(username, usernameError);
    else showError(username, usernameError, r1.message);
    
    if (r2.valid) showSuccess(email, emailError);
    else showError(email, emailError, r2.message);
    
    if (r3.valid) showSuccess(password, passwordError);
    else showError(password, passwordError, r3.message);
    
    if (r4.valid) showSuccess(confirm, confirmError);
    else showError(confirm, confirmError, r4.message);
    
    if (r5.valid) {
    termsError.textContent = "";
    } else {
    termsError.textContent = r5.message;
    }


    // Проверяем: ВСЕ ли поля валидны
    const allValid = r1.valid && r2.valid && r3.valid && r4.valid && r5.valid;
    
    // Включаем кнопку только если всё верно
    submitBtn.disabled = !allValid;
    
    return allValid;
};


//Без галочки кнопка серая. Поставили галочку (при валидных полях) — кнопка стала активной.
terms.addEventListener("change", validateForm);


//JSON.parse: превращает строку обратно в объект

//привязка
// При вводе сохраняем черновик
// При загрузке восстанавливаем
loadDraft();


//CИЛА
//функция подсчёта очков ДЛЯ СИЛЫ
const checkStrength = (value) => {
    let strength = 0;

    if (value.length >= 8) strength++;                       // +1 за длину
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;  // +1 за регистр
    if (/\d/.test(value)) strength++;                        // +1 за цифру
    if (/[^a-zA-Z0-9]/.test(value)) strength++;              // +1 за спецсимвол

    return strength;  // от 0 до 4
};


// массив уровней. массив из 5 объектов — по одному на каждое количество очков (0, 1, 2, 3, 4).
const levels = [
    { width: "0%",   color: "#eee",    text: "Введите пароль" },
    { width: "25%",  color: "#e74c3c", text: "Очень слабый" },
    { width: "50%",  color: "#f39c12", text: "Слабый" },
    { width: "75%",  color: "#3498db", text: "Средний" },
    { width: "100%", color: "#27ae60", text: "Сильный" }
];


//функция обновления
const updateStrength = (value) => {
    const strength = checkStrength(value);
    const level = levels[strength];

    strengthFill.style.width = level.width;
    strengthFill.style.background = level.color;
    strengthText.textContent = level.text;
    strengthText.style.color = level.color;
};


//привязка события

password.addEventListener("input", (event) => {
    updateStrength(event.target.value);
});
//event.target.value — то же, что password.value, но получено через объект события

//загрузка кнопки
const setLoading = (isLoading) => {
    if (isLoading) {
        submitBtn.classList.add("loading");
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
    }
};


// Отправка формы
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Имитация запроса на сервер (2 секунды)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    showModal();
    form.reset();
});



const togglePassword = document.querySelector("#togglePassword");

togglePassword.addEventListener("click", () => {
    if (password.type === "password") {
        password.type = "text";
        togglePassword.textContent = "🙈";
    } else {
        password.type = "password";
        togglePassword.textContent = "👁️";
    }
});


 //ТЕМА
console.log("Сайт подключён к JavaScript!");

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
