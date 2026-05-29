// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.getElementById('navMenu');
const currentYear = document.getElementById('currentYear');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    setCurrentYear();
    initSmoothScroll();
    updateActiveLink();
    initScrollAnimations();
});

/**
 * Initialize Mobile Menu Toggle
 */
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

/**
 * Set Current Year in Footer
 */
function setCurrentYear() {
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

/**
 * Initialize Smooth Scrolling for Anchor Links
 */
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

/**
 * Update Active Link based on Scroll Position
 */
function updateActiveLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
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

/**
 * Initialize Scroll Animations (Intersection Observer)
 * Χωρίς fallback: Αν δεν υποστηρίζεται, τα sections μένουν κρυφά (σπάνιο σε σύγχρονους browsers).
 */
function initScrollAnimations() {
    // Αν ο browser δεν υποστηρίζει IntersectionObserver, σταματάμε εδώ
    // (Σε σύγχρονους browsers αυτό δεν θα συμβεί)
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver not supported. Animations disabled.');
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Ενεργοποιείται όταν το 15% της ενότητας είναι ορατό
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Σταματάμε μετά την πρώτη φορά
            }
        });
    }, observerOptions);

    // Παρατηρούμε όλα τα sections εκτός από το Hero
    document.querySelectorAll('section:not(.hero)').forEach(section => {
        observer.observe(section);
    });
}

// Event Listener για το scroll
window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveLink);
});