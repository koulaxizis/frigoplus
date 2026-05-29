// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.getElementById('navMenu');
const currentYear = document.getElementById('currentYear');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

console.log('🚀 Frigoplus JS Loaded');

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    initMobileMenu();
    setCurrentYear();
    initSmoothScroll();
    updateActiveLink();
    
    // Περιμένουμε λίγο για να βεβαιωθούμε ότι το CSS έχει φορτώσει
    setTimeout(() => {
        initScrollAnimations();
    }, 500);
});

/**
 * Initialize Mobile Menu Toggle
 */
function initMobileMenu() {
    if (!mobileMenuToggle || !navMenu) {
        console.warn('Mobile menu elements not found');
        return;
    }

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
 * Initialize Scroll Animations (Scroll Event Listener)
 * Χωρίς IntersectionObserver - ελέγχει τη θέση κάθε section
 */
function initScrollAnimations() {
    console.log('Initializing Scroll Animations (Scroll Event)...');
    
    // FORCE REFLOW
    const dummy = document.body.offsetHeight; 
    void dummy;

    // Ελέγχουμε κάθε section
    function checkSections() {
        const sectionsToCheck = document.querySelectorAll('.about, .services, .hours, .reviews, .contact');
        
        sectionsToCheck.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.clientHeight;
            const triggerPoint = window.innerHeight * 0.85; // Ενεργοποιείται όταν το 15% του section είναι ορατό

            // Αν το section είναι μέσα στην οθόνη
            if (sectionTop < triggerPoint && sectionTop > -sectionHeight) {
                if (!section.classList.contains('visible')) {
                    console.log(`✨ Section ${section.id} is now visible`);
                    section.classList.add('visible');
                }
            }
        });
    }

    // Τρέχουμε αρχικά
    checkSections();

    // Τρέχουμε σε κάθε scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(checkSections);
    });
}

// Event Listener για το scroll (για το active nav link)
window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveLink);
});