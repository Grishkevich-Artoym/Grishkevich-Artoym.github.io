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
                this.y > canvas.height + 20 || this.y < -20) {
                this.reset();
            }
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
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// Scroll Progress
const initScrollProgress = () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (!scrollProgress) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
}

// Language System
const translations = {
    ru: {
        logo: "Артём Гришкевич",
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
        years: "лет опыта",
        expertise: "Основные технологии:",
        contactTitle: "Контакты",
        formName: "Ваше имя",
        formEmail: "Ваш email",
        formMessage: "Сообщение",
        formButton: "Отправить",
        footerText: "© 2023 Артём Гришкевич. Все права защищены."
    },
    en: {
        logo: "Artem Grishkevich",
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
        years: "years experience",
        expertise: "Core Technologies:",
        contactTitle: "Contact",
        formName: "Your Name",
        formEmail: "Your Email",
        formMessage: "Message",
        formButton: "Send",
        footerText: "© 2023 Artem Grishkevich. All rights reserved."
    }
};

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        translatePage(lang);
    });
});

function translatePage(lang) {
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.dataset.key;
        if (translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

// Mobile Menu
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Custom Cursor
const initCursor = () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    document.querySelectorAll('a, button, input, .skill-tag').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-active');
        });
    });
}

// Form Handling
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    emailjs.sendForm('service_xwk4jzr', 'template_soglh2w', this)
        .then(() => {
            alert('Сообщение успешно отправлено!');
            this.reset();
        })
        .catch((error) => {
            alert('Ошибка: ' + error.text);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = translations[currentLang]?.formButton || 'Отправить';
        });
});

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollProgress();
    initCursor();
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Close mobile menu on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && !e.target.closest('.menu-toggle')) {
            navLinks?.classList.remove('active');
        }
    });
});

// Window resize handler
window.addEventListener('resize', () => {
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
