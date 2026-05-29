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
    updateActiveLink(); // Τρέχει αρχικά για να φωτιστεί η πρώτη ενότητα
    initScrollAnimations(); // Τρέχει αρχικά για να εμφανιστούν οι ενότητες
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

    // Close menu when a link is clicked
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
 * Με fallback: Αν ο browser δεν υποστηρίζει IntersectionObserver,
 * όλες οι ενότητες εμφανίζονται αμέσως.
 */
function initScrollAnimations() {
    // Fallback: Αν δεν υπάρχει IntersectionObserver, εμφανίζουμε όλα τα sections
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('visible');
        });
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Η ενότητα πρέπει να είναι 15% ορατή για να ενεργοποιηθεί
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Σταματάμε να παρατηρούμε μετά την πρώτη εμφάνιση (performance)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section:not(.hero)').forEach(section => {
        observer.observe(section);
    });
}

// Event Listener για το scroll (για το active nav link)
window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveLink);
});