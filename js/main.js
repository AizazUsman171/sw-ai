// Main JavaScript for AI Developer Portfolio

// Global variables
let currentTestimonial = 0;
let testimonials = [];
let dots = [];
let resizeTimer;

// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize testimonials and dots after DOM is loaded
    testimonials = document.querySelectorAll('.testimonial-slide');
    dots = document.querySelectorAll('.dot');
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Initialize all components
    initLoader();
    initNavigation();
    initStats();
    initPortfolioFilter();
    initTestimonialsCarousel();
    initScrollIndicator();
    initHamburgerMenu();
    initParallax();
    initFloatingElements();
    initContactForm();
    initRevealAnimations();
    initKeyboardNavigation();
    initLazyLoading();
    initThemeHandling();
    handleResponsiveImages();
    handleTextOverflow();
});

// Loading Screen
function initLoader() {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (loadingScreen) {
        // Simulate loading time
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 2000);
    }
}

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navbar) return;
    
    // Handle scroll effect on navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        // Handle anchor links
        if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                // Update active nav link
                updateActiveNavLink(this);
                
                // Close mobile menu if open
                closeMobileMenu();
            });
        }
    });
    
    // Update active nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavOnScroll);
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function closeMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    if (navMenu && hamburger) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('nav-open');
        
        // Close any open dropdowns
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.display = 'none';
                menu.style.maxHeight = null;
            }
            dropdown.classList.remove('active');
        });
    }
}

// Animated statistics counter
function initStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.getAttribute('data-count'));
                if (!isNaN(count)) {
                    animateCount(target, count);
                }
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCount(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, stepTime);
}

// Portfolio filtering
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length === 0 || portfolioItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Testimonials carousel
function initTestimonialsCarousel() {
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    
    if (testimonials.length === 0) return;
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            navigateTestimonial('prev');
        });
        
        nextBtn.addEventListener('click', () => {
            navigateTestimonial('next');
        });
    }
    
    // Initialize dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToTestimonial(index);
        });
    });
    
    // Auto-play testimonials
    if (testimonials.length > 1) {
        setInterval(() => {
            navigateTestimonial('next');
        }, 5000);
    }
}

function navigateTestimonial(direction) {
    if (testimonials.length === 0) return;
    
    if (direction === 'next') {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    } else {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    }
    
    updateTestimonialDisplay();
}

function goToTestimonial(index) {
    if (testimonials.length === 0) return;
    
    currentTestimonial = index;
    updateTestimonialDisplay();
}

function updateTestimonialDisplay() {
    // Update slides
    testimonials.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentTestimonial);
    });
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
    });
}

// Scroll indicator
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const expertiseSection = document.querySelector('.expertise');
            if (expertiseSection) {
                expertiseSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        // Hide indicator when user scrolls
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
}

// Hamburger menu for mobile - FIXED VERSION
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    if (!hamburger || !navMenu) return;
    
    // Set initial state
    if (window.innerWidth <= 992) {
        hamburger.style.display = 'flex';
    }

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });
    
    // Close menu when clicking outside (but not on dropdown toggles)
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            const isOutsideMenu = !navMenu.contains(e.target);
            const isNotHamburger = !hamburger.contains(e.target);
            const isNotDropdownToggle = !e.target.closest('.dropdown > .nav-link');
            
            if (isOutsideMenu && isNotHamburger && isNotDropdownToggle) {
                closeMobileMenu();
            }
        }
    });

    // Handle dropdown menus - FIXED VERSION
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (link && menu) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    dropdowns.forEach(other => {
                        if (other !== dropdown) {
                            other.classList.remove('active');
                            const otherMenu = other.querySelector('.dropdown-menu');
                            if (otherMenu) {
                                otherMenu.style.display = 'none';
                                otherMenu.style.maxHeight = null;
                            }
                        }
                    });
                    
                    // Toggle current dropdown
                    const isOpen = dropdown.classList.contains('active');
                    
                    if (isOpen) {
                        // Close dropdown
                        dropdown.classList.remove('active');
                        menu.style.display = 'none';
                        menu.style.maxHeight = null;
                    } else {
                        // Open dropdown
                        dropdown.classList.add('active');
                        menu.style.display = 'block';
                        menu.style.maxHeight = menu.scrollHeight + 'px';
                    }
                }
            });
            
            // Handle dropdown item clicks
            const subLinks = menu.querySelectorAll('a');
            subLinks.forEach(sub => {
                sub.addEventListener('click', (e) => {
                    if (window.innerWidth <= 992) {
                        // Allow normal navigation for dropdown items
                        // Close mobile menu after navigation
                        setTimeout(() => {
                            closeMobileMenu();
                        }, 100);
                    }
                });
            });
        }
    });

    // Handle resize events
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth <= 992) {
                hamburger.style.display = 'flex';
            } else {
                hamburger.style.display = 'none';
                closeMobileMenu();
            }
        }, 250);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Parallax effect for hero background
function initParallax() {
    const heroSection = document.querySelector('.hero');
    const neuralNetworkBg = document.querySelector('.neural-network-bg');
    
    if (heroSection && neuralNetworkBg) {
        window.addEventListener('scroll', debounce(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            neuralNetworkBg.style.transform = `translateY(${rate}px)`;
        }, 10));
    }
}

// Floating animation for AI elements
function initFloatingElements() {
    const elements = document.querySelectorAll('.element');
    
    elements.forEach((element, index) => {
        // Add slight random delays and durations for more natural movement
        const delay = Math.random() * 2;
        const duration = 4 + Math.random() * 2;
        
        element.style.animationDelay = `${delay}s`;
        element.style.animationDuration = `${duration}s`;
    });
}

// Form handling (if contact form exists)
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Simulate form submission
            showFormStatus('Sending message...', 'info');
            
            setTimeout(() => {
                showFormStatus('Thank you! Your message has been sent successfully.', 'success');
                this.reset();
            }, 2000);
        });
    }
}

function showFormStatus(message, type) {
    const statusElement = document.getElementById('form-status') || createStatusElement();
    statusElement.textContent = message;
    statusElement.className = `form-status ${type}`;
    statusElement.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }
}

function createStatusElement() {
    const statusElement = document.createElement('div');
    statusElement.id = 'form-status';
    statusElement.className = 'form-status';
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.appendChild(statusElement);
    }
    
    return statusElement;
}

// Smooth reveal animations for elements
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.expertise-card, .portfolio-item, .testimonial-content');
    
    if (revealElements.length === 0) return;
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Keyboard navigation support
function initKeyboardNavigation() {
    // Navigate testimonials with arrow keys
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            navigateTestimonial('prev');
        } else if (e.key === 'ArrowRight') {
            navigateTestimonial('next');
        }
    });
    
    // Focus management for mobile menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hamburger.click();
            }
        });
    }
}

// Performance optimization - lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Theme detection and handling
function initThemeHandling() {
    // Detect system theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Listen for theme changes
    prefersDark.addEventListener('change', (e) => {
        if (e.matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    });
    
    // Set initial theme
    if (prefersDark.matches) {
        document.body.classList.add('dark-theme');
    }
}

// Handle Responsive Images
function handleResponsiveImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
    });
}

// Handle Text Overflow
function handleTextOverflow() {
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
    textElements.forEach(el => {
        el.style.overflowWrap = 'break-word';
        el.style.wordWrap = 'break-word';
        el.style.hyphens = 'auto';
    });
}

// Handle dynamic content heights
function updateDynamicHeights() {
    const cards = document.querySelectorAll('.card, .expertise-card, .service-card, .portfolio-card, .blog-card, .testimonial-card');
    let maxHeight = 0;
    
    cards.forEach(card => card.style.height = 'auto');
    cards.forEach(card => {
        maxHeight = Math.max(maxHeight, card.offsetHeight);
    });
    
    if (window.innerWidth > 768) {
        cards.forEach(card => card.style.height = maxHeight + 'px');
    }
}

// Handle smooth scrolling for all internal links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;

                    window.scrollTo({
                        top: targetPosition - navHeight,
                        behavior: 'smooth'
                    });

                    closeMobileMenu();
                }
            }
        });
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Service Worker Registration
if ('serviceWorker' in navigator && 
    (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
        const swUrl = window.location.origin + '/sw.js';
        navigator.serviceWorker.register(swUrl)
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        handleResponsiveImages();
        handleTextOverflow();
        updateDynamicHeights();
    }, 250);
});

// Initialize smooth scrolling on DOM content loaded
document.addEventListener('DOMContentLoaded', initSmoothScrolling);

// Export functions for potential external use
window.PortfolioApp = {
    navigateTestimonial,
    goToTestimonial,
    updateActiveNavLink,
    showFormStatus,
    closeMobileMenu,
    updateDynamicHeights
};