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


// ========================================
// ЭЛЕМЕНТ 2: КНОПКА "НАВЕРХ"
// ========================================

const scrollTopBtn = document.querySelector("#scrollTopBtn");

// Показываем/скрываем кнопку при прокрутке
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add("visible");
    } else {
        scrollTopBtn.classList.remove("visible");
    }
});

// Плавная прокрутка наверх
scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ========================================
// ЭЛЕМЕНТ 3: ФИЛЬТР КАРТОЧЕК
// ========================================

const filterButtons = document.querySelectorAll(".filter-btn");
const cards1 = document.querySelectorAll(".card1");
const filterCount = document.querySelector("#filterCount");

// Функция фильтрации
function filterCards(category) {
    let visibleCount = 0;
    
    cards1.forEach((card1) => {
        if (category === "all" || card1.dataset.category === category) {
            card1.classList.remove("hidden");
            visibleCount++;
        } else {
            card1.classList.add("hidden");
        }
    });
    
    // Обновляем счётчик
    if (filterCount) {
        filterCount.textContent = visibleCount;
    }
}

// Инициализация при загрузке
filterCards("all");

// Слушаем клики по кнопкам
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Убираем active у всех
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        
        // Фильтруем
        const category = button.dataset.filter;
        filterCards(category);
    });
});
