document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Initialize portfolio functionality
    initPortfolioFiltering();
    initProjectLightbox();
    initProjectHover();
    initCaseStudyModals();
    initTechnologyFilter();
    initLoadMoreProjects();
});

// Portfolio filtering
function initPortfolioFiltering() {
    const filterButtons = document.querySelectorAll('.portfolio-filter');
    const projectCards = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            filterProjects(filter, projectCards);
            
            // Update URL hash
            window.location.hash = filter;
        });
    });
    
    // Filter based on URL hash on load
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        const filterButton = document.querySelector(`[data-filter="${hash}"]`);
        if (filterButton) {
            filterButton.click();
        }
    }
}

function filterProjects(filter, cards) {
    const container = document.querySelector('.portfolio-grid');
    container.classList.add('filtering');
    
    setTimeout(() => {
        cards.forEach((card, index) => {
            const categories = card.getAttribute('data-category').split(' ');
            
            if (filter === 'all' || categories.includes(filter)) {
                card.style.display = 'block';
                card.classList.add('visible');
                
                // Stagger animation
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 100);
            } else {
                card.classList.remove('visible', 'animate-in');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        container.classList.remove('filtering');
        updateProjectCount(filter);
    }, 150);
}

function updateProjectCount(filter) {
    const visibleItems = document.querySelectorAll('.portfolio-item.visible');
    const countElement = document.getElementById('project-count');
    
    if (countElement) {
        const count = visibleItems.length;
        const categoryName = filter === 'all' ? 'All Projects' : 
                           filter.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        countElement.textContent = `${categoryName} (${count})`;
    }
}

// Project lightbox
function initProjectLightbox() {
    const projectImages = document.querySelectorAll('.portfolio-item img');
    
    projectImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(img);
        });
    });
}

function openLightbox(img) {
    const lightbox = createLightbox(img);
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 10);
}

function createLightbox(img) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    const projectCard = img.closest('.portfolio-item');
    const title = projectCard.querySelector('h3').textContent;
    const description = projectCard.querySelector('.project-excerpt').textContent;
    const technologies = Array.from(projectCard.querySelectorAll('.tech-tag')).map(tag => tag.textContent);
    
    lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
            <button class="lightbox-close">
                <i class="fas fa-times"></i>
            </button>
            <div class="lightbox-image">
                <img src="${img.src}" alt="${img.alt}">
            </div>
            <div class="lightbox-info">
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="lightbox-technologies">
                    ${technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="lightbox-actions">
                    <button class="btn btn-primary view-case-study" data-project="${projectCard.getAttribute('data-project')}">
                        <i class="fas fa-book-open"></i>
                        View Case Study
                    </button>
                    <button class="btn btn-secondary live-demo" data-demo="${projectCard.getAttribute('data-demo')}">
                        <i class="fas fa-external-link-alt"></i>
                        Live Demo
                    </button>
                </div>
            </div>
        </div>
        <div class="lightbox-navigation">
            <button class="nav-prev">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="nav-next">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    // Event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
    
    // Navigation
    lightbox.querySelector('.nav-prev').addEventListener('click', () => navigateLightbox('prev'));
    lightbox.querySelector('.nav-next').addEventListener('click', () => navigateLightbox('next'));
    
    // Case study button
    const caseStudyBtn = lightbox.querySelector('.view-case-study');
    if (caseStudyBtn) {
        caseStudyBtn.addEventListener('click', () => {
            const projectId = caseStudyBtn.getAttribute('data-project');
            closeLightbox();
            setTimeout(() => showCaseStudy(projectId), 300);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleLightboxKeydown);
    
    return lightbox;
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleLightboxKeydown);
        
        setTimeout(() => {
            lightbox.remove();
        }, 300);
    }
}

function handleLightboxKeydown(e) {
    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            navigateLightbox('prev');
            break;
        case 'ArrowRight':
            navigateLightbox('next');
            break;
    }
}

function navigateLightbox(direction) {
    const currentLightbox = document.querySelector('.lightbox');
    const currentImg = currentLightbox.querySelector('.lightbox-image img');
    const allImages = Array.from(document.querySelectorAll('.portfolio-item.visible img'));
    const currentIndex = allImages.findIndex(img => img.src === currentImg.src);
    
    let nextIndex;
    if (direction === 'next') {
        nextIndex = (currentIndex + 1) % allImages.length;
    } else {
        nextIndex = currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
    }
    
    closeLightbox();
    setTimeout(() => {
        openLightbox(allImages[nextIndex]);
    }, 300);
}

// Project hover effects
function initProjectHover() {
    const projectCards = document.querySelectorAll('.portfolio-item');
    
    projectCards.forEach(card => {
        const overlay = card.querySelector('.project-overlay');
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            
            if (overlay) {
                overlay.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    });
}

// Case study modals
function initCaseStudyModals() {
    const caseStudyButtons = document.querySelectorAll('.view-case-study');
    
    caseStudyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.getAttribute('data-project');
            showCaseStudy(projectId);
        });
    });
}

function showCaseStudy(projectId) {
    const caseStudyData = getCaseStudyData(projectId);
    const modal = createCaseStudyModal(caseStudyData);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 100);
}

function getCaseStudyData(projectId) {
    const caseStudies = {
        'ai-customer-service': {
            title: 'AI-Powered Customer Service Automation',
            client: 'TechStart Solutions',
            duration: '6 weeks',
            team: 'AI Developer + UX Designer',
            challenge: 'The client was struggling with high customer service volumes, leading to long response times and decreased customer satisfaction.',
            solution: 'Implemented a sophisticated chatbot using OpenAI GPT-4 with RAG (Retrieval-Augmented Generation) for accurate, context-aware responses.',
            technologies: ['OpenAI GPT-4', 'LangChain', 'Pinecone', 'React', 'Node.js', 'MongoDB'],
            results: [
                '70% reduction in response time',
                '85% customer satisfaction rate',
                '60% decrease in support ticket volume',
                '24/7 availability with multilingual support'
            ],
            images: [
                'chatbot-interface.jpg',
                'admin-dashboard.jpg',
                'analytics-view.jpg'
            ],
            testimonial: {
                text: "The AI chatbot has transformed our customer service completely. Response times are instant and customer satisfaction has never been higher.",
                author: "Mark Thompson, CEO"
            }
        },
        'crypto-trading-bot': {
            title: 'Automated Crypto Trading System',
            client: 'CryptoVentures',
            duration: '12 weeks',
            team: 'AI Developer + Quantitative Analyst',
            challenge: 'Manual trading was time-consuming and emotionally driven, leading to inconsistent returns and missed opportunities.',
            solution: 'Developed a reinforcement learning-based trading algorithm with sophisticated risk management and real-time market analysis.',
            technologies: ['Python', 'TensorFlow', 'Stable Baselines3', 'CCXT', 'Redis', 'PostgreSQL'],
            results: [
                '23% average monthly returns',
                '89% win rate on trades',
                'Maximum drawdown of 5.2%',
                'Fully automated 24/7 trading'
            ],
            images: [
                'trading-dashboard.jpg',
                'performance-charts.jpg',
                'risk-management.jpg'
            ],
            testimonial: {
                text: "The trading bot has exceeded all our expectations. Consistent returns with minimal risk - exactly what we needed.",
                author: "David Rodriguez, Founder"
            }
        }
        // Add more case studies...
    };
    
    return caseStudies[projectId] || {
        title: 'Project Case Study',
        client: 'Client Name',
        challenge: 'Project challenge description...',
        solution: 'Solution implementation details...',
        results: ['Result 1', 'Result 2', 'Result 3']
    };
}

function createCaseStudyModal(data) {
    const modal = document.createElement('div');
    modal.className = 'case-study-modal';
    
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${data.title}</h2>
                <button class="close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="case-study-content">
                <div class="project-meta">
                    <div class="meta-item">
                        <span class="meta-label">Client:</span>
                        <span class="meta-value">${data.client}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Duration:</span>
                        <span class="meta-value">${data.duration}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Team:</span>
                        <span class="meta-value">${data.team}</span>
                    </div>
                </div>
                
                <div class="case-study-section">
                    <h3>Challenge</h3>
                    <p>${data.challenge}</p>
                </div>
                
                <div class="case-study-section">
                    <h3>Solution</h3>
                    <p>${data.solution}</p>
                </div>
                
                <div class="case-study-section">
                    <h3>Technologies Used</h3>
                    <div class="tech-stack">
                        ${data.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                
                <div class="case-study-section">
                    <h3>Results</h3>
                    <ul class="results-list">
                        ${data.results.map(result => `<li><i class="fas fa-check"></i> ${result}</li>`).join('')}
                    </ul>
                </div>
                
                ${data.testimonial ? `
                    <div class="case-study-testimonial">
                        <blockquote>
                            "${data.testimonial.text}"
                        </blockquote>
                        <cite>— ${data.testimonial.author}</cite>
                    </div>
                ` : ''}
                
                <div class="case-study-cta">
                    <a href="contact.html" class="btn btn-primary btn-large">
                        <i class="fas fa-rocket"></i>
                        Start Your Project
                    </a>
                    <a href="portfolio.html" class="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i>
                        Back to Portfolio
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => modal.remove(), 300);
    });
    
    return modal;
}

// Technology filter
function initTechnologyFilter() {
    const techTags = document.querySelectorAll('.tech-tag');
    const uniqueTechs = new Set();
    
    techTags.forEach(tag => {
        uniqueTechs.add(tag.textContent.trim());
    });
    
    // Create technology filter if container exists
    const techFilterContainer = document.getElementById('tech-filters');
    if (techFilterContainer) {
        const techArray = Array.from(uniqueTechs).sort();
        
        techFilterContainer.innerHTML = `
            <button class="tech-filter active" data-tech="all">All Technologies</button>
            ${techArray.map(tech => 
                `<button class="tech-filter" data-tech="${tech}">${tech}</button>`
            ).join('')}
        `;
        
        // Add event listeners
        techFilterContainer.querySelectorAll('.tech-filter').forEach(button => {
            button.addEventListener('click', () => {
                techFilterContainer.querySelectorAll('.tech-filter').forEach(btn => 
                    btn.classList.remove('active')
                );
                button.classList.add('active');
                
                const tech = button.getAttribute('data-tech');
                filterByTechnology(tech);
            });
        });
    }
}

function filterByTechnology(tech) {
    const projectCards = document.querySelectorAll('.portfolio-item');
    
    projectCards.forEach(card => {
        const techTags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => 
            tag.textContent.trim()
        );
        
        if (tech === 'all' || techTags.includes(tech)) {
            card.style.display = 'block';
            card.classList.add('visible');
        } else {
            card.classList.remove('visible');
            card.style.display = 'none';
        }
    });
}

// Load more projects
function initLoadMoreProjects() {
    const loadMoreBtn = document.getElementById('load-more-projects');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            loadMoreBtn.disabled = true;
            
            setTimeout(() => {
                addMoreProjects();
                loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Projects';
                loadMoreBtn.disabled = false;
            }, 1500);
        });
    }
}

function addMoreProjects() {
    const grid = document.querySelector('.portfolio-grid');
    
    const additionalProjects = [
        {
            category: 'ai-development automation',
            title: 'Intelligent Document Processing System',
            excerpt: 'AI-powered system for automated document analysis and data extraction.',
            image: generateProjectImage('Document AI', '#8B5CF6'),
            technologies: ['OpenAI', 'LangChain', 'OCR', 'Python'],
            projectId: 'document-ai'
        },
        {
            category: 'chatbot ai-development',
            title: 'Multilingual Support Bot',
            excerpt: 'Advanced chatbot supporting 12 languages with real-time translation.',
            image: generateProjectImage('MultiBot', '#EC4899'),
            technologies: ['GPT-4', 'Google Translate', 'React', 'WebSocket'],
            projectId: 'multibot'
        }
    ];
    
    additionalProjects.forEach((project, index) => {
        const projectElement = createProjectElement(project);
        projectElement.style.opacity = '0';
        projectElement.style.transform = 'translateY(30px)';
        grid.appendChild(projectElement);
        
        setTimeout(() => {
            projectElement.style.transition = 'all 0.6s ease';
            projectElement.style.opacity = '1';
            projectElement.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Reinitialize hover effects for new projects
    initProjectHover();
}

function createProjectElement(project) {
    const article = document.createElement('article');
    article.className = 'portfolio-item';
    article.setAttribute('data-category', project.category);
    article.setAttribute('data-project', project.projectId);
    
    const techTags = project.technologies.map(tech => 
        `<span class="tech-tag">${tech}</span>`
    ).join('');
    
    article.innerHTML = `
        <div class="project-image">
            <img src="${project.image}" alt="${project.title}">
            <div class="project-overlay">
                <div class="project-actions">
                    <button class="project-action view-details" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="project-action view-case-study" data-project="${project.projectId}" title="Case Study">
                        <i class="fas fa-book-open"></i>
                    </button>
                    <button class="project-action external-link" title="Live Demo">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="project-content">
            <h3>${project.title}</h3>
            <p class="project-excerpt">${project.excerpt}</p>
            <div class="project-technologies">
                ${techTags}
            </div>
        </div>
    `;
    
    return article;
}

function generateProjectImage(text, color) {
    return `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="${color}"/>
            <rect x="0" y="0" width="400" height="300" fill="url(#gradient)" opacity="0.7"/>
            <text x="200" y="160" font-family="Inter" font-size="28" font-weight="700" fill="white" text-anchor="middle">${text}</text>
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:rgba(255,255,255,0.1);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:rgba(0,0,0,0.3);stop-opacity:1" />
                </linearGradient>
            </defs>
        </svg>
    `)}`;
}

// Add required CSS for new functionality
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .portfolio-grid.filtering {
            opacity: 0.7;
            pointer-events: none;
        }
        
        .portfolio-item.animate-in {
            animation: slideInUp 0.6s ease forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}); 