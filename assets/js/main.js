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
    
    // Καθυστερούμε την αρχικοποίηση των animations για 300ms
    setTimeout(() => {
        initScrollAnimations();
    }, 300);
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
 * Initialize Scroll Animations (Intersection Observer)
 * ΔΙΟΡΘΩΣΗ: rootMargin θετικό για να ενεργοποιείται μόνο όταν έρχεται από κάτω
 */
function initScrollAnimations() {
    console.log('Initializing Scroll Animations...');
    
    if (!('IntersectionObserver' in window)) {
        console.error('❌ IntersectionObserver not supported!');
        document.querySelectorAll('.about, .services, .hours, .reviews, .contact').forEach(section => {
            section.classList.add('visible');
        });
        return;
    }

    console.log('✅ IntersectionObserver supported');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px 100px 0px', // ΔΙΟΡΘΩΣΗ: Θετικό value - ενεργοποιείται όταν το section είναι 100px πάνω από το κάτω μέρος της οθόνης
        threshold: 0.01
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log(`✨ Section ${entry.target.id} is now visible`);
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sectionsToObserve = document.querySelectorAll('.about, .services, .hours, .reviews, .contact');
    console.log(`👀 Observing ${sectionsToObserve.length} sections`);
    
    sectionsToObserve.forEach(section => {
        observer.observe(section);
        console.log(`   - Watching: ${section.id}`);
    });
}

// Event Listener για το scroll
window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveLink);
});