// Responsive Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Handle hamburger menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }
    
    // Close menu when clicking outside (but not on dropdown toggles)
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active')) {
            // Check if click is outside menu AND not on hamburger AND not on dropdown links
            const isOutsideMenu = !navMenu.contains(e.target);
            const isNotHamburger = !hamburger.contains(e.target);
            const isNotDropdownToggle = !e.target.closest('.dropdown > .nav-link');
            
            if (isOutsideMenu && isNotHamburger && isNotDropdownToggle) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('nav-open');
                
                // Also close any open dropdowns
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
    });
    
    // Handle dropdowns on mobile - SINGLE EVENT HANDLER
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (link && menu) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault(); // Prevent navigation
                    
                    // Close other open dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            const otherMenu = otherDropdown.querySelector('.dropdown-menu');
                            if (otherMenu) {
                                otherMenu.style.display = 'none';
                                otherMenu.style.maxHeight = null;
                            }
                            otherDropdown.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    const isOpen = dropdown.classList.contains('active');
                    
                    if (isOpen) {
                        // Close dropdown
                        menu.style.display = 'none';
                        menu.style.maxHeight = null;
                        dropdown.classList.remove('active');
                    } else {
                        // Open dropdown
                        menu.style.display = 'block';
                        menu.style.maxHeight = menu.scrollHeight + "px";
                        dropdown.classList.add('active');
                    }
                }
            });
        }
    });
    
    // Handle dropdown menu item clicks
    document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Allow normal navigation for dropdown items
            // Close mobile menu after navigation
            if (window.innerWidth <= 992) {
                setTimeout(() => {
                    if (navMenu) navMenu.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }, 100);
            }
        });
    });
    
    // Handle resize events
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Reset mobile menu state
            if (window.innerWidth > 992) {
                if (navMenu) navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
                document.body.classList.remove('nav-open');
                
                // Reset dropdowns
                dropdowns.forEach(dropdown => {
                    const menu = dropdown.querySelector('.dropdown-menu');
                    if (menu) {
                        menu.style.display = '';
                        menu.style.maxHeight = null;
                    }
                    dropdown.classList.remove('active');
                });
            }
            
            // Update heights for dynamic content
            updateDynamicHeights();
        }, 250);
    });
});

// Handle dynamic content heights
function updateDynamicHeights() {
    // Update card heights to match
    const cards = document.querySelectorAll('.card, .expertise-card, .service-card, .portfolio-card, .blog-card, .testimonial-card');
    let maxHeight = 0;
    
    // Reset heights
    cards.forEach(card => card.style.height = 'auto');
    
    // Find max height
    cards.forEach(card => {
        maxHeight = Math.max(maxHeight, card.offsetHeight);
    });
    
    // Apply max height
    if (window.innerWidth > 768) {
        cards.forEach(card => card.style.height = maxHeight + 'px');
    }
}

// Handle lazy loading of images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(function(img) {
            lazyImageObserver.observe(img);
        });
    }
});

// Handle smooth scrolling
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
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
                    
                    // Close mobile menu if open
                    const navMenu = document.getElementById('nav-menu');
                    const hamburger = document.getElementById('hamburger');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        hamburger.classList.remove('active');
                        document.body.classList.remove('nav-open');
                    }
                }
            }
        });
    });
});