// Preloader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.page-loader').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.page-loader').style.display = 'none';
        }, 500);
    }, 1000);
});

// Theme Switcher
const themeToggle = document.getElementById('themeToggle');
let currentTheme = localStorage.getItem('theme') || 'dark';
let currentLang = 'ru';

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
}

if (window.matchMedia('(prefers-color-scheme: light)').matches && !localStorage.getItem('theme')) {
    currentTheme = 'light';
}
applyTheme(currentTheme);

themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});

// Particles Animation
const initParticles = () => {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width + 20 || this.x < -20 || 
                this.y > canvas.height + 20 || this.y < -20) this.reset();
        }
        draw() {
            ctx.fillStyle = `rgba(${getComputedStyle(document.documentElement)
                .getPropertyValue('--accent-1').trim()}, 0.5)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const particles = Array(100).fill().map(() => new Particle());
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
};

// Language System
const translations = {
    ru: {logo: "Артём Гришкевич",
        home: "Главная",
        services: "Услуги",
        skills: "Навыки",
        experience: "Опыт",
        contact: "Контакты",
        heroTitle: "Профессиональный веб-разработчик",
        heroSub: "Создаю современные решения для цифрового мира",
        heroBtn: "Обсудить проект",
        servicesTitle: "Услуги",
        service1Title: "🚀 Разработка сайтов",
        service1List: ["Полный цикл разработки", "Индивидуальный дизайн", "Адаптивная верстка"],
        service2Title: "🎨 Веб-дизайн",
        service2List: ["UI/UX проектирование", "Анимации и интерактив", "Оптимизация скорости"],
        skillsTitle: "Навыки",
        experienceTitle: "Опыт работы",
        years: "Большой опыт работы",
        expertise: "Основные технологии:",
        contactTitle: "Контакты",
        formName: "Ваше имя",
        formEmail: "Ваш email",
        formMessage: "Сообщение",
        formButton: "Отправить",
        footerText: "© 2023 Артём Гришкевич. Все права защищены."
    },
    en: {logo: "Artem Grishkevich",
        home: "Home",
        services: "Services",
        skills: "Skills",
        experience: "Experience",
        contact: "Contact",
        heroTitle: "Professional Web Developer",
        heroSub: "Creating modern digital solutions",
        heroBtn: "Discuss Project",
        servicesTitle: "Services",
        service1Title: "🚀 Web Development",
        service1List: ["Full-cycle development", "Custom design", "Responsive layout"],
        service2Title: "🎨 Web Design",
        service2List: ["UI/UX Design", "Animations & Interactions", "Speed Optimization"],
        skillsTitle: "Skills",
        experienceTitle: "Work Experience",
        years: "Extensive work experience",
        expertise: "Core Technologies:",
        contactTitle: "Contact",
        formName: "Your Name",
        formEmail: "Your Email",
        formMessage: "Message",
        formButton: "Send",
        footerText: "© 2023 Artem Grishkevich. All rights reserved."
    }
};

// Исправленный переводчик
function translatePage(lang) {
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.dataset.key;
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = '';
                el.placeholder = translations[lang][key];
            } 
            else if (el.classList.contains('input-label')) {
                el.textContent = '';
                el.textContent = translations[lang][key];
                el.style.transform = 'none'; // Сбрасываем трансформацию
            }
            else {
                el.textContent = translations[lang][key];
            }
        }
    });
    
    // Принудительное обновление позиции лейблов
    document.querySelectorAll('.input-field').forEach(field => {
        if(field.value || field === document.activeElement) {
            field.nextElementSibling.style.transform = 'translateY(-130%) scale(0.9)';
        }
    });
}

// Language Switcher
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentLang = btn.dataset.lang;
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        translatePage(currentLang);
    });
});

// Form Handling
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = translations[currentLang]?.formButton ? 
        translations[currentLang].formButton + '...' : 'Sending...';

    emailjs.sendForm('service_xwk4jzr', 'template_soglh2w', this)
        .then(() => {
            alert(currentLang === 'ru' ? 'Сообщение отправлено!' : 'Message sent!');
            this.reset();
            translatePage(currentLang); // Принудительное обновление
        })
        .catch((error) => {
            alert((currentLang === 'ru' ? 'Ошибка: ' : 'Error: ') + error.text);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = translations[currentLang]?.formButton || 'Send';
        });
});
// Mobile Menu
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle?.addEventListener('click', () => navLinks.classList.toggle('active'));

// Custom Cursor
const initCursor = () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    document.querySelectorAll('a, button, input, .skill-tag').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-active'));
    });
};

// Initialize Components
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCursor();
    translatePage(currentLang);
    
    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Close Mobile Menu
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && !e.target.closest('.menu-toggle')) {
            navLinks?.classList.remove('active');
        }
    });
});

// Window Resize Handler
window.addEventListener('resize', () => {
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
