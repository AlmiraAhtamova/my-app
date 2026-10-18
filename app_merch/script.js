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
    //добавить обработчика
    button.addEventListener("click", () => {
        // Убираем active у всех
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        
        // Фильтруем
        const category = button.dataset.filter;
        filterCards(category);
    });
});

// ========================================
// БУРГЕР-МЕНЮ
// ========================================

// 1. Находим элементы
const burgerBtn = document.querySelector("#burgerBtn");
const mobileNav = document.querySelector("#mobileNav");
const overlay = document.querySelector("#overlay");

// Функция открытия меню
function openMenu() {
    mobileNav.classList.add("open");
    burgerBtn.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";  // блокируем прокрутку
}

// Функция закрытия меню
function closeMenu() {
    mobileNav.classList.remove("open");
    burgerBtn.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";  // возвращаем прокрутку
}

// 2. Клик по бургеру
burgerBtn.addEventListener("click", () => {
    if (mobileNav.classList.contains("open")) {
        closeMenu();
    } else {
        openMenu();
    }
});

// 3. Клик по ссылке в меню
const mobileLinks = mobileNav.querySelectorAll("a");
mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

// 4. Клик по затемнению
overlay.addEventListener("click", closeMenu);

// 5. Закрытие по клавише Escape
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileNav.classList.contains("open")) {
        closeMenu();
    }
});


// Слайдер

const slider = document.querySelector('.slider');

if (slider) {
    const slides = [
        { img: 'elli.jpg', title: 'Стикерпак', text: '199 руб.' },
        { img: 'avery.jpg', title: 'Значок с Авери', text: '250 руб.' },
        { img: 'Mob.jpg', title: 'Брелок с Мобом', text: '300 руб.' },
        { img: 'holow.jpg', title: 'Ночник рыцарь', text: '250 руб.' },
        { img: 'gen.jpg', title: 'Брелки Genshin', text: '300 руб.' }
    ];
    let current = 0;

    const btnNext = document.querySelector('.slider_next');
    const btnPrev = document.querySelector('.slider_prev');
    const track = document.querySelector('.slider_track');
    const dotsBox = document.querySelector('.slider_dots');

    slides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide';
        slideDiv.innerHTML = `
            <div class="slide_inner">
                <img src="${slide.img}" alt="${slide.title}">
                <div class="slide_content">
                    <h3>${slide.title}</h3>
                    <p>${slide.text}</p>
                </div>
            </div>
        `;
        track.appendChild(slideDiv);

        const dot = document.createElement('button');
        dot.className = 'slider_dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsBox.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider_dot');

    function updateSlider() {
        track.style.transform = `translateX(-${current * 33.333}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });
    }

    function goToSlide(index) {
        current = (index + slides.length) % slides.length; // зацикливание
        updateSlider();
    }

    //nextSlide и prevSlide 
    function nextSlide() { goToSlide(current + 1); }
    function prevSlide() { goToSlide(current - 1); }

    //Обработчики кнопок
    btnNext.addEventListener('click', nextSlide);
    btnPrev.addEventListener('click', prevSlide);

    //Автопрокрутка
    let timer = setInterval(nextSlide, 3000);
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', () => {
        timer = setInterval(nextSlide, 3000);
    });

    //Свайп
    let startX = 0;
    slider.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    slider.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) dx < 0 ? nextSlide() : prevSlide();
    });
}

//Корзина

// Загрузка корзины из localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartClear = document.getElementById("cartClear");

// Если в корзине уже что-то есть при загрузке, показываем панель
if (cart.length > 0) {
    cartPanel.classList.add("active");
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(); // перерисовать блок корзины
}

// Отрисовка корзины
function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Корзина пуста</p>";
        cartPanel.classList.remove("active"); // Прячем панель, если пусто
    } else {
        cartPanel.classList.add("active"); // Показываем панель
        
        cart.forEach(item => {
            total += item.price * item.qty;

            const div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `
                <span>${item.name} (${item.qty} шт.)</span>
                <div class="cart-item-controls">
                    <button class="cart-minus" data-id="${item.id}">-</button>
                    <span>${item.qty}</span>
                    <button class="cart-plus" data-id="${item.id}">+</button>
                </div>
            `;
            cartItems.appendChild(div);
        });
    }

    cartTotal.textContent = total;

    // кнопки +/-
    document.querySelectorAll('.cart-plus').forEach(btn => {
        btn.addEventListener('click', () => changeQty(Number(btn.dataset.id), 1));
    });
    document.querySelectorAll('.cart-minus').forEach(btn => {
        btn.addEventListener('click', () => changeQty(Number(btn.dataset.id), -1));
    });
}

// Добавление товара
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const name = btn.dataset.name;
        const price = Number(btn.dataset.price);

        // Ищем, есть ли уже такой товар
        const item = cart.find(p => p.id === id);
        if (item) {
            item.qty += 1; // Если есть — увеличиваем количество
        } else {
            // Если нет — добавляем новый
            cart.push({ id: id, name: name, price: price, qty: 1 });
        }
        saveCart();
    });
});

// Изменение количества
function changeQty(id, delta) {
    const item = cart.find(p => p.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(p => p.id !== id);
    }
    saveCart();
}

// Очистка корзины
cartClear.addEventListener("click", () => {
    cart = [];
    localStorage.removeItem('cart');
    renderCart();
});

// Первый запуск отрисовки
renderCart();