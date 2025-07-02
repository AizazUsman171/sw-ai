document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Animate statistics counters
    animateCounters();
    
    // Initialize testimonial filtering
    initTestimonialFiltering();
    
    // Initialize rating bar animations
    initRatingBars();
    
    // Initialize floating review bubbles animation
    initFloatingReviews();
    
    // Initialize load more functionality
    initLoadMore();
});

// Animate statistics counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (target < 10) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Testimonial filtering functionality
function initTestimonialFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Add filter animation class
            document.querySelector('.testimonials-grid').classList.add('filtering');
            
            setTimeout(() => {
                filterTestimonials(filter, testimonialCards);
                document.querySelector('.testimonials-grid').classList.remove('filtering');
            }, 150);
        });
    });
}

function filterTestimonials(filter, cards) {
    cards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            // Stagger the animation
            setTimeout(() => {
                card.classList.add('show');
            }, index * 100);
        } else {
            card.classList.remove('show');
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Rating bars animation
function initRatingBars() {
    const ratingBars = document.querySelectorAll('.bar-fill');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 200);
                
                observer.unobserve(bar);
            }
        });
    }, observerOptions);
    
    ratingBars.forEach(bar => observer.observe(bar));
}

// Floating review bubbles animation
function initFloatingReviews() {
    const bubbles = document.querySelectorAll('.review-bubble');
    
    bubbles.forEach((bubble, index) => {
        // Set initial position
        const angle = (index * 90) + Math.random() * 30;
        const radius = 120 + Math.random() * 40;
        const x = Math.cos(angle * Math.PI / 180) * radius;
        const y = Math.sin(angle * Math.PI / 180) * radius;
        
        bubble.style.transform = `translate(${x}px, ${y}px)`;
        
        // Add floating animation
        animateFloatingBubble(bubble, x, y);
    });
}

function animateFloatingBubble(bubble, baseX, baseY) {
    let time = Math.random() * Math.PI * 2;
    
    function animate() {
        time += 0.02;
        const offsetX = Math.sin(time) * 10;
        const offsetY = Math.cos(time * 0.7) * 8;
        
        bubble.style.transform = `translate(${baseX + offsetX}px, ${baseY + offsetY}px)`;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Load more testimonials functionality
function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-testimonials');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            loadMoreBtn.disabled = true;
            
            // Simulate loading delay
            setTimeout(() => {
                addMoreTestimonials();
                loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Reviews';
                loadMoreBtn.disabled = false;
            }, 1500);
        });
    }
}

function addMoreTestimonials() {
    const grid = document.querySelector('.testimonials-grid');
    
    const additionalTestimonials = [
        {
            category: 'ai-development',
            avatar: 'R',
            color: '#EC4899',
            name: 'Robert Kim',
            title: 'Head of AI, TechFlow',
            rating: 5,
            text: 'The natural language processing solution exceeded our expectations. Document analysis accuracy improved by 80% and processing speed increased dramatically. LangChain implementation was masterful.',
            projectType: 'NLP Solutions',
            date: '1 week ago'
        },
        {
            category: 'chatbot',
            avatar: 'M',
            color: '#8B5CF6',
            name: 'Maria Gonzalez',
            title: 'Customer Experience Lead, TravelPro',
            rating: 5,
            text: 'Our multilingual travel chatbot handles complex booking queries in 12 languages. Customer satisfaction scores have increased by 40% since implementation. Outstanding work!',
            projectType: 'Travel Chatbot',
            date: '2 weeks ago'
        },
        {
            category: 'automation',
            avatar: 'T',
            color: '#06B6D4',
            name: 'Thomas Anderson',
            title: 'Operations Manager, SupplyChain Pro',
            rating: 5,
            text: 'Supply chain automation has transformed our logistics completely. Real-time tracking, automated reordering, and predictive analytics work seamlessly together.',
            projectType: 'Supply Chain Automation',
            date: '3 weeks ago'
        }
    ];
    
    additionalTestimonials.forEach((testimonial, index) => {
        const testimonialElement = createTestimonialElement(testimonial);
        testimonialElement.style.opacity = '0';
        testimonialElement.style.transform = 'translateY(30px)';
        grid.appendChild(testimonialElement);
        
        // Animate in
        setTimeout(() => {
            testimonialElement.style.transition = 'all 0.6s ease';
            testimonialElement.style.opacity = '1';
            testimonialElement.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function createTestimonialElement(testimonial) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.setAttribute('data-category', testimonial.category);
    
    const avatarSvg = `data:image/svg+xml;base64,${btoa(`
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="30" fill="${testimonial.color}"/>
            <text x="30" y="36" font-family="Inter" font-size="24" font-weight="600" fill="white" text-anchor="middle">${testimonial.avatar}</text>
        </svg>
    `)}`;
    
    const stars = '★'.repeat(testimonial.rating);
    
    card.innerHTML = `
        <div class="card-header">
            <div class="client-avatar">
                <img src="${avatarSvg}" alt="${testimonial.name}">
            </div>
            <div class="client-details">
                <h4>${testimonial.name}</h4>
                <p>${testimonial.title}</p>
                <div class="rating">
                    ${'<i class="fas fa-star"></i>'.repeat(testimonial.rating)}
                </div>
            </div>
        </div>
        <blockquote>
            ${testimonial.text}
        </blockquote>
        <div class="testimonial-footer">
            <span class="project-type">${testimonial.projectType}</span>
            <span class="review-date">${testimonial.date}</span>
        </div>
    `;
    
    return card;
}

// Testimonial card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const testimonialCards = document.querySelectorAll('.testimonial-card, .featured-testimonial');
    
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        });
    });
});

// Rating breakdown animation
document.addEventListener('DOMContentLoaded', function() {
    const metrics = document.querySelectorAll('.metric-value');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const metric = entry.target;
                const text = metric.textContent;
                const number = parseInt(text);
                
                if (!isNaN(number)) {
                    animateCounter(metric, number);
                }
                
                observer.unobserve(metric);
            }
        });
    }, observerOptions);
    
    metrics.forEach(metric => observer.observe(metric));
});

// Smooth scroll for internal links
document.addEventListener('DOMContentLoaded', function() {
    const smoothLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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
});

// Testimonial search functionality (bonus feature)
function initTestimonialSearch() {
    const searchInput = document.getElementById('testimonial-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.testimonial-card');
            
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const shouldShow = text.includes(searchTerm);
                
                card.style.display = shouldShow ? 'block' : 'none';
                card.classList.toggle('search-match', shouldShow);
            });
        });
    }
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    initTestimonialSearch();
    
    // Add loading states to interactive elements
    const interactiveElements = document.querySelectorAll('.filter-btn, .btn');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
}); 