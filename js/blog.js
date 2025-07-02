document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Initialize blog functionality
    initBlogSearch();
    initCategoryFiltering();
    initLoadMorePosts();
    initShareButtons();
    initReadingTime();
    initBlogFilter();
    initLoadMore();
    initNewsletterForm();
});

// Blog search functionality
function initBlogSearch() {
    const searchInput = document.getElementById('blog-search');
    const searchButton = document.getElementById('search-button');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
        
        if (searchButton) {
            searchButton.addEventListener('click', performSearch);
        }
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function performSearch() {
    const searchTerm = document.getElementById('blog-search').value.toLowerCase();
    const articles = document.querySelectorAll('.blog-card');
    let visibleCount = 0;
    
    articles.forEach(article => {
        const title = article.querySelector('h3').textContent.toLowerCase();
        const excerpt = article.querySelector('.blog-excerpt').textContent.toLowerCase();
        const tags = Array.from(article.querySelectorAll('.blog-tag')).map(tag => tag.textContent.toLowerCase());
        
        const matches = title.includes(searchTerm) || 
                       excerpt.includes(searchTerm) || 
                       tags.some(tag => tag.includes(searchTerm));
        
        if (matches || searchTerm === '') {
            article.style.display = 'block';
            article.classList.add('search-result');
            visibleCount++;
        } else {
            article.style.display = 'none';
            article.classList.remove('search-result');
        }
    });
    
    updateSearchResults(visibleCount, searchTerm);
}

function updateSearchResults(count, term) {
    const resultsDiv = document.getElementById('search-results');
    
    if (resultsDiv) {
        if (term) {
            resultsDiv.innerHTML = `Found ${count} article${count !== 1 ? 's' : ''} for "${term}"`;
            resultsDiv.style.display = 'block';
        } else {
            resultsDiv.style.display = 'none';
        }
    }
}

// Category filtering
function initCategoryFiltering() {
    const categoryButtons = document.querySelectorAll('.category-filter');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            filterByCategory(category);
        });
    });
}

function filterByCategory(category) {
    const articles = document.querySelectorAll('.blog-card');
    
    articles.forEach(article => {
        const articleCategory = article.getAttribute('data-category');
        
        if (category === 'all' || articleCategory === category) {
            article.style.display = 'block';
            article.classList.add('category-match');
        } else {
            article.style.display = 'none';
            article.classList.remove('category-match');
        }
    });
}

// Load more posts
function initLoadMorePosts() {
    const loadMoreBtn = document.getElementById('load-more-posts');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            loadMoreBtn.disabled = true;
            
            // Simulate loading delay
            setTimeout(() => {
                addMorePosts();
                loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Articles';
                loadMoreBtn.disabled = false;
            }, 1000);
        });
    }
}

function addMorePosts() {
    const grid = document.querySelector('.blog-grid');
    
    const additionalPosts = [
        {
            category: 'ai-development',
            title: 'Advanced RAG Techniques for Enterprise Applications',
            excerpt: 'Explore sophisticated Retrieval-Augmented Generation methods that improve accuracy and reduce hallucinations in large-scale AI systems.',
            image: generateBlogImage('RAG', '#8B5CF6'),
            tags: ['RAG', 'LangChain', 'Enterprise AI'],
            readTime: '12 min read',
            date: '3 days ago',
            link: '#'
        },
        {
            category: 'automation',
            title: 'Multi-Agent Systems with CrewAI',
            excerpt: 'Building collaborative AI agents that work together to solve complex business problems using CrewAI framework.',
            image: generateBlogImage('CrewAI', '#EC4899'),
            tags: ['CrewAI', 'Multi-Agent', 'Automation'],
            readTime: '15 min read',
            date: '1 week ago',
            link: '#'
        }
    ];
    
    additionalPosts.forEach((post, index) => {
        const postElement = createBlogPostElement(post);
        postElement.style.opacity = '0';
        postElement.style.transform = 'translateY(30px)';
        grid.appendChild(postElement);
        
        // Animate in
        setTimeout(() => {
            postElement.style.transition = 'all 0.6s ease';
            postElement.style.opacity = '1';
            postElement.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function createBlogPostElement(post) {
    const article = document.createElement('article');
    article.className = 'blog-card';
    article.setAttribute('data-category', post.category);
    
    const tagsHtml = post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('');
    
    article.innerHTML = `
        <div class="blog-image">
            <img src="${post.image}" alt="${post.title}">
            <div class="blog-category">${post.category.replace('-', ' ')}</div>
        </div>
        <div class="blog-content">
            <div class="blog-meta">
                <span class="blog-date">
                    <i class="fas fa-calendar"></i>
                    ${post.date}
                </span>
                <span class="blog-read-time">
                    <i class="fas fa-clock"></i>
                    ${post.readTime}
                </span>
            </div>
            <h3><a href="${post.link}">${post.title}</a></h3>
            <p class="blog-excerpt">${post.excerpt}</p>
            <div class="blog-tags">
                ${tagsHtml}
            </div>
            <div class="blog-footer">
                <a href="${post.link}" class="read-more">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
                <div class="blog-share">
                    <button class="share-btn" title="Share">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return article;
}

// Share functionality
function initShareButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.share-btn')) {
            const button = e.target.closest('.share-btn');
            const article = button.closest('.blog-card');
            const title = article.querySelector('h3 a').textContent;
            const url = window.location.href;
            
            shareArticle(title, url);
        }
    });
}

function shareArticle(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        });
    } else {
        // Fallback to copying URL
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!');
        });
    }
}

// Reading time calculation
function initReadingTime() {
    const articles = document.querySelectorAll('.blog-card, .featured-post-card');
    
    articles.forEach(article => {
        const content = article.querySelector('.blog-excerpt, .featured-excerpt');
        const readTimeElement = article.querySelector('.read-time');
        
        if (content && readTimeElement) {
            const wordCount = content.textContent.trim().split(/\s+/).length;
            const readTime = Math.ceil(wordCount / 200); // 200 words per minute
            readTimeElement.innerHTML = `<i class="fas fa-clock"></i> ${readTime} min read`;
        }
    });
}

// Generate blog images
function generateBlogImage(text, color) {
    return `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="250" fill="${color}"/>
            <rect x="0" y="0" width="400" height="250" fill="url(#gradient)" opacity="0.8"/>
            <text x="200" y="130" font-family="Inter" font-size="36" font-weight="700" fill="white" text-anchor="middle">${text}</text>
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:rgba(255,255,255,0.1);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:rgba(0,0,0,0.2);stop-opacity:1" />
                </linearGradient>
            </defs>
        </svg>
    `)}`;
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Debounce utility
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

// Blog card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        });
    });
}); 