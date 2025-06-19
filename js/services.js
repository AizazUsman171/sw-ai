document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Initialize services functionality
    initServiceComparison();
    initPricingCalculator();
    initServiceFiltering();
    initCtaAnimations();
    initTechnologyShowcase();
});

// Service comparison functionality
function initServiceComparison() {
    const compareButtons = document.querySelectorAll('.compare-service');
    const comparisonPanel = document.getElementById('comparison-panel');
    let selectedServices = [];
    
    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceCard = this.closest('.service-card');
            const serviceId = serviceCard.getAttribute('data-service-id');
            const serviceName = serviceCard.querySelector('h3').textContent;
            
            if (this.classList.contains('selected')) {
                // Remove from comparison
                this.classList.remove('selected');
                this.innerHTML = '<i class="fas fa-plus"></i> Compare';
                selectedServices = selectedServices.filter(s => s.id !== serviceId);
            } else if (selectedServices.length < 3) {
                // Add to comparison
                this.classList.add('selected');
                this.innerHTML = '<i class="fas fa-check"></i> Selected';
                selectedServices.push({
                    id: serviceId,
                    name: serviceName,
                    card: serviceCard
                });
            } else {
                showNotification('You can compare up to 3 services at once');
                return;
            }
            
            updateComparisonPanel();
        });
    });
}

function updateComparisonPanel() {
    const panel = document.getElementById('comparison-panel');
    const selectedServices = document.querySelectorAll('.compare-service.selected');
    
    if (selectedServices.length > 0) {
        panel.style.display = 'block';
        panel.innerHTML = `
            <div class="comparison-header">
                <h4>Compare Services (${selectedServices.length}/3)</h4>
                <button class="clear-comparison">Clear All</button>
            </div>
            <div class="comparison-services">
                ${Array.from(selectedServices).map(btn => {
                    const card = btn.closest('.service-card');
                    const name = card.querySelector('h3').textContent;
                    return `<span class="comparison-service">${name}</span>`;
                }).join('')}
            </div>
            <button class="btn btn-primary compare-now">
                <i class="fas fa-balance-scale"></i>
                Compare Now
            </button>
        `;
        
        // Add event listeners
        panel.querySelector('.clear-comparison').addEventListener('click', clearComparison);
        panel.querySelector('.compare-now').addEventListener('click', showComparison);
    } else {
        panel.style.display = 'none';
    }
}

function clearComparison() {
    document.querySelectorAll('.compare-service.selected').forEach(button => {
        button.classList.remove('selected');
        button.innerHTML = '<i class="fas fa-plus"></i> Compare';
    });
    updateComparisonPanel();
}

function showComparison() {
    const modal = createComparisonModal();
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 100);
}

function createComparisonModal() {
    const modal = document.createElement('div');
    modal.className = 'comparison-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Service Comparison</h3>
                <button class="close-modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="comparison-table">
                <table>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>AI Automation</th>
                            <th>Chatbot Development</th>
                            <th>Custom AI Solutions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Implementation Time</td>
                            <td>2-4 weeks</td>
                            <td>1-3 weeks</td>
                            <td>4-12 weeks</td>
                        </tr>
                        <tr>
                            <td>Complexity Level</td>
                            <td>Medium</td>
                            <td>Low-Medium</td>
                            <td>High</td>
                        </tr>
                        <tr>
                            <td>Ongoing Support</td>
                            <td>✓ Included</td>
                            <td>✓ Included</td>
                            <td>✓ Included</td>
                        </tr>
                        <tr>
                            <td>ROI Timeline</td>
                            <td>1-3 months</td>
                            <td>2-4 weeks</td>
                            <td>3-6 months</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
    
    return modal;
}

// Pricing calculator
function initPricingCalculator() {
    const calculator = document.getElementById('pricing-calculator');
    
    if (calculator) {
        const complexity = calculator.querySelector('#complexity');
        const timeline = calculator.querySelector('#timeline');
        const features = calculator.querySelectorAll('input[name="features"]');
        const calculateBtn = calculator.querySelector('#calculate-price');
        
        calculateBtn.addEventListener('click', calculateEstimate);
        
        // Real-time calculation
        [complexity, timeline, ...features].forEach(input => {
            input.addEventListener('change', calculateEstimate);
        });
    }
}

function calculateEstimate() {
    const complexity = document.getElementById('complexity').value;
    const timeline = document.getElementById('timeline').value;
    const selectedFeatures = document.querySelectorAll('input[name="features"]:checked');
    
    let basePrice = 0;
    
    // Base price by complexity
    switch(complexity) {
        case 'simple': basePrice = 2000; break;
        case 'medium': basePrice = 5000; break;
        case 'complex': basePrice = 10000; break;
        case 'enterprise': basePrice = 25000; break;
    }
    
    // Timeline multiplier
    const timelineMultiplier = {
        'rush': 1.5,
        'standard': 1.0,
        'flexible': 0.8
    };
    
    basePrice *= timelineMultiplier[timeline] || 1.0;
    
    // Feature additions
    const featurePrices = {
        'ai-integration': 2000,
        'real-time': 1500,
        'multi-language': 1000,
        'analytics': 800,
        'mobile-app': 3000
    };
    
    selectedFeatures.forEach(feature => {
        basePrice += featurePrices[feature.value] || 0;
    });
    
    displayEstimate(basePrice);
}

function displayEstimate(price) {
    const estimateDiv = document.getElementById('price-estimate');
    
    if (estimateDiv) {
        estimateDiv.innerHTML = `
            <div class="estimate-result">
                <h4>Estimated Investment</h4>
                <div class="price-range">
                    <span class="price-low">$${Math.round(price * 0.8).toLocaleString()}</span>
                    <span class="price-divider">-</span>
                    <span class="price-high">$${Math.round(price * 1.2).toLocaleString()}</span>
                </div>
                <p class="estimate-note">
                    This is a preliminary estimate. Contact us for a detailed quote.
                </p>
                <a href="contact.html" class="btn btn-primary">
                    Get Detailed Quote
                </a>
            </div>
        `;
        
        estimateDiv.style.display = 'block';
        estimateDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Service filtering
function initServiceFiltering() {
    const filterButtons = document.querySelectorAll('.service-filter');
    const serviceCards = document.querySelectorAll('.service-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            filterServices(filter, serviceCards);
        });
    });
}

function filterServices(filter, cards) {
    cards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        } else {
            card.classList.remove('visible');
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// CTA animations
function initCtaAnimations() {
    const ctaButtons = document.querySelectorAll('.service-cta');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(42, 115, 255, 0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Technology showcase
function initTechnologyShowcase() {
    const techItems = document.querySelectorAll('.tech-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    techItems.forEach(item => observer.observe(item));
}

// Service details modal
function initServiceModals() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const detailsBtn = card.querySelector('.view-details');
        
        if (detailsBtn) {
            detailsBtn.addEventListener('click', () => {
                const serviceId = card.getAttribute('data-service-id');
                showServiceModal(serviceId);
            });
        }
    });
}

function showServiceModal(serviceId) {
    const serviceData = {
        'ai-automation': {
            title: 'AI Automation Solutions',
            description: 'Streamline your business processes with intelligent automation',
            features: [
                'Workflow Automation with N8N',
                'Zapier Integration',
                'Make.com Automations',
                'Custom API Integrations',
                'Real-time Monitoring'
            ],
            technologies: ['N8N', 'Zapier', 'Make.com', 'Python', 'REST APIs'],
            timeline: '2-4 weeks',
            investment: '$3,000 - $15,000'
        },
        // Add more service data as needed
    };
    
    const data = serviceData[serviceId];
    if (!data) return;
    
    const modal = createServiceModal(data);
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 100);
}

function createServiceModal(data) {
    const modal = document.createElement('div');
    modal.className = 'service-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${data.title}</h3>
                <button class="close-modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <p>${data.description}</p>
                
                <div class="service-details-grid">
                    <div class="detail-section">
                        <h4>Key Features</h4>
                        <ul>
                            ${data.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Technologies</h4>
                        <div class="tech-tags">
                            ${data.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Timeline</h4>
                        <p class="timeline">${data.timeline}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Investment Range</h4>
                        <p class="investment">${data.investment}</p>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <a href="contact.html" class="btn btn-primary">
                        Get Started
                    </a>
                    <a href="portfolio.html" class="btn btn-secondary">
                        View Examples
                    </a>
                </div>
            </div>
        </div>
    `;
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
    
    return modal;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Initialize all functionality on load
document.addEventListener('DOMContentLoaded', function() {
    initServiceModals();
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}); 