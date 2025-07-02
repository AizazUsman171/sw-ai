document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with enhanced settings
    if (typeof AOS !== 'undefined') {
    AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
        once: true,
            offset: 50,
            delay: 100
    });
    }

    // Initialize portfolio functionality
    initPortfolioFiltering();
    initProjectHover();
    initScrollAnimations();
    initParallaxEffect();
    updateStats(); // Add stats formatting
});

// Enhanced portfolio filtering with smooth transitions
function initPortfolioFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.portfolio-card');
    const grid = document.querySelector('.portfolio-grid');
    
    // Set initial state with staggered animation
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Smooth button transition
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.transform = 'scale(1)';
            });
            button.classList.add('active');
            button.style.transform = 'scale(1.05)';
            
            const filter = button.getAttribute('data-filter');
            filterProjects(filter, projectCards, grid);
        });

        // Add hover effect
        button.addEventListener('mouseenter', () => {
            if (!button.classList.contains('active')) {
                button.style.transform = 'scale(1.05)';
            }
        });

        button.addEventListener('mouseleave', () => {
            if (!button.classList.contains('active')) {
                button.style.transform = 'scale(1)';
            }
        });
    });
}

function filterProjects(filter, cards, grid) {
    // First, hide all cards with a smooth fade
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
    });

    // After hiding animation, update visibility
    setTimeout(() => {
        cards.forEach(card => {
            const categories = card.getAttribute('data-category');
            card.style.display = (filter === 'all' || (categories && categories.includes(filter))) ? 'block' : 'none';
        });

        // Force grid reflow
        grid.offsetHeight;

        // Show visible cards with staggered animation
        let delay = 0;
        cards.forEach(card => {
            if (card.style.display === 'block') {
        setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, delay);
                delay += 100;
            }
        });
    }, 300);
}

// Enhanced project hover effects
function initProjectHover() {
    const projectCards = document.querySelectorAll('.portfolio-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (card.style.display !== 'none') {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                
                // Animate child elements
                const icon = card.querySelector('.project-icon i');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                }
                
                const metrics = card.querySelectorAll('.visual-metrics .metric');
                metrics.forEach((metric, index) => {
                    metric.style.transform = 'translateY(-5px)';
                    metric.style.transition = `transform 0.3s ${index * 0.1}s ease`;
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.style.display !== 'none') {
                card.style.transform = 'translateY(0) scale(1)';
                
                // Reset child elements
                const icon = card.querySelector('.project-icon i');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
                
                const metrics = card.querySelectorAll('.visual-metrics .metric');
                metrics.forEach(metric => {
                    metric.style.transform = 'translateY(0)';
                });
            }
        });
    });
}

// Enhanced scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add custom animations based on element type
                if (entry.target.classList.contains('portfolio-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                } else if (entry.target.classList.contains('metric-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '50px'
    });

    // Observe elements with staggered delay
    document.querySelectorAll('.portfolio-card, .metric-card').forEach((element, index) => {
        element.style.transitionDelay = `${index * 100}ms`;
        observer.observe(element);
    });
}

// New parallax effect for enhanced visual appeal
function initParallaxEffect() {
    const cards = document.querySelectorAll('.portfolio-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) {  // Only on desktop
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                card.style.transform = `perspective(1000px) rotateY(${deltaX * 5}deg) rotateX(${-deltaY * 5}deg) translateZ(10px)`;
                
                // Add highlight effect
                const highlight = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)`;
                card.style.backgroundImage = highlight;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
            card.style.backgroundImage = 'none';
        });
    });
}

// Smooth scroll for navigation
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
        });
    }
}
});

// Format numbers properly to prevent NaN
function formatNumber(value) {
    if (typeof value === 'number') {
        return value.toString();
    }
    if (value.includes('+')) {
        return value; // Keep the plus sign for values like "15+"
    }
    if (value.includes('%')) {
        return value; // Keep the percentage
    }
    return value || '0'; // Default to '0' if value is undefined/null
}

// Update stats display
function updateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const value = stat.textContent;
        stat.textContent = formatNumber(value);
    });
} 