// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.getElementById('navMenu');
const currentYear = document.getElementById('currentYear');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    setCurrentYear();
    initSmoothScroll();
    updateActiveLink();
    initThemeToggle();
    initBackToTop();
});

// ================================
// Mobile Menu
// ================================
function initMobileMenu() {
    if (!mobileMenuToggle || !navMenu) return;

    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', isOpen);
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ================================
// Current Year
// ================================
function setCurrentYear() {
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

// ================================
// Smooth Scroll
// ================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ================================
// Active Navigation Link
// ================================
function updateActiveLink() {
    let current = '';
    
    sections.forEach(section => {
        if (pageYOffset >= (section.offsetTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveLink);
}, { passive: true });

// ================================
// Theme Toggle (Dark/Light)
// ================================
function initThemeToggle() {
    if (!themeToggle) return;

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a1a' : '#0066cc');
    }
}

// ================================
// Back to Top Button
// ================================
function initBackToTop() {
    if (!backToTop) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    // Scroll to top on click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}