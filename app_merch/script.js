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
        track.appendChild(slideDiv);// готовая карточка в ленту

        const dot = document.createElement('button');
        dot.className = 'slider_dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsBox.appendChild(dot);// положи в контейнкр
    });

    const dots = document.querySelectorAll('.slider_dot');

    function updateSlider() {
        // Проверяем ширину экрана: если меньше 600px — сдвигаем на 100% (1 карточка), иначе на 33.333% (3 карточки)
        const width = window.innerWidth;
        const offset = width <= 600 ? 100 : 33.333;
        
        track.style.transform = `translateX(-${current * offset}%)`;
        
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
    cartItems.innerHTML = "";//очист товары
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

const payBtn = document.getElementById("payBtn");

payBtn.addEventListener("click", () => {
    if (cart.length === 0) return;
    alert("Оплата прошла успешно! Спасибо за покупку.");//всплыв окно
    cart = [];
    localStorage.removeItem('cart');
    renderCart();
});

// Очистка корзины
cartClear.addEventListener("click", () => {
    cart = [];
    localStorage.removeItem('cart');
    renderCart();
});

// Первый запуск отрисовки
renderCart();

// ========================================
// Пагинация
// ========================================

const data = [
    { id: 1, title: 'Плюш с теной', price: 599, img: 'tena.jpg', category: 'game' },
    { id: 2, title: 'Рыцарь ночник', price: 250, img: 'holow.jpg', category: 'popul' },
    { id: 3, title: 'Брелки с Лорой и Розой', price: 300, img: 'rusty.jpg', category: 'game' },
    { id: 4, title: 'Значки с Рыцарем', price: 599, img: 'holow1.jpg', category: 'game' },
    { id: 5, title: 'Носки с Папирусом и Сансом', price: 250, img: 'sans.jpg', category: 'popul' },
    { id: 6, title: 'Брелки с Крисом и Сьюзи', price: 300, img: 'delt.jpg', category: 'popul' },
    { id: 7, title: 'Стикерпак с Эллиотом', price: 199, img: 'elli.jpg', category: 'new' },
    { id: 8, title: 'Значок с Авери', price: 250, img: 'avery.jpg', category: 'new' },
    { id: 9, title: 'Брелок с Мобом', price: 300, img: 'Mob.jpg', category: 'new' },
    { id: 10, title: 'Браслет Genshin', price: 300, img: 'gen.jpg', category: 'game' },
    { id: 11, title: 'Брелки с Флауи и Псом', price: 250, img: 'under1.jpg', category: 'game' }
];

const PER_PAGE = 6; //6 карт
let currentPage = 1;
let filtered = data; //массив 

const listEl = document.getElementById('list');
const paginationBox = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const filterCount = document.getElementById('filterCount');

//отрисовки одной карточки 
function renderItem(item) {
    const article = document.createElement('article');
    article.className = 'card1'; // Используем ваш класс для красоты
    article.innerHTML = `
        <img src="${item.img}" alt="${item.title}" width="300" height="390">
        <h3>${item.title}</h3> 
        <p class="price">${item.price} руб.</p> 
        <label class="fav">
            <input type="checkbox">
            <span>В избранное</span>
        </label>
        <button class="btn add-to-cart" 
                data-id="${item.id}" 
                data-name="${item.title}" 
                data-price="${item.price}">
            В корзину
        </button>
    `;
    return article;
}

//Функция отрисовки списка (из методички)
function renderPage(items, renderItem) {
    listEl.innerHTML = '';
    items.forEach(item => listEl.appendChild(renderItem(item)));
}

//Получение элементов текущей страницы
function getPageItems() {
    const start = (currentPage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
}

//Отрисовка кнопок пагинации
function renderPagination() {
    const pages = Math.ceil(filtered.length / PER_PAGE) || 1;
    paginationBox.innerHTML = '';

    // Кнопка "Назад"
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '<';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            window.scrollTo({ top: document.getElementById('cont1').offsetTop, behavior: 'smooth' });
        }
    });
    paginationBox.appendChild(prevBtn);

    // Кнопки с номерами
    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentPage = i;
            updatePagination();
            window.scrollTo({ top: document.getElementById('cont1').offsetTop, behavior: 'smooth' });
        });
        paginationBox.appendChild(btn);
    }

    // Кнопка "Вперёд"
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '>';
    nextBtn.disabled = currentPage === pages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < pages) {
            currentPage++;
            updatePagination();
            window.scrollTo({ top: document.getElementById('cont1').offsetTop, behavior: 'smooth' });
        }
    });
    paginationBox.appendChild(nextBtn);
}

//Общая функция обновления
function updatePagination() {
    renderPage(getPageItems(), renderItem);
    renderPagination();
    if (filterCount) filterCount.textContent = filtered.length;
    
    // Перевешиваем обработчики на новые кнопки "В корзину"
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            const name = btn.dataset.name;
            const price = Number(btn.dataset.price);
            const item = cart.find(p => p.id === id);
            if (item) item.qty += 1;
            else cart.push({ id, name, price, qty: 1 });
            saveCart();
        });
    });
}

//Фильтр по названию (из методички)
searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    filtered = data.filter(d => d.title.toLowerCase().includes(q));
    currentPage = 1;
    updatePagination();
});

//Фильтр по категориям (кнопки)
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const category = button.dataset.filter;
        if (category === 'all') {
            filtered = data;
        } else {
            filtered = data.filter(d => d.category === category);
        }
        
        // Если есть поиск, применяем оба фильтра (опционально)
        const q = searchInput.value.toLowerCase();
        if (q) {
            filtered = filtered.filter(d => d.title.toLowerCase().includes(q));
        }
        
        currentPage = 1;
        updatePagination();
    });
});

//Первый запуск
updatePagination();

/////////////
//Подписка
////////////
const subForm = document.querySelector(".sub-form");
if (subForm) {
    subForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Отменяем перезагрузку
        alert("Спасибо за подписку!");
        subForm.reset();
    });
}