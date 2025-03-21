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
    ru: {
        // ... (ru translations)
    },
    en: {
        // ... (en translations)
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

// ... (остальной код без изменений)
