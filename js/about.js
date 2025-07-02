// About Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initSkillBars();
    initTimelineAnimations();
});

// Skill bar animations
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = width + '%';
                }, 200);
                
                skillObserver.unobserve(progressBar);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Timeline animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.3
    });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

// Parallax effect for floating badges
function initBadgeParallax() {
    const badges = document.querySelectorAll('.badge');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.2;
        
        badges.forEach((badge, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            badge.style.transform = `translateY(${rate * direction}px)`;
        });
    });
}

// Initialize badge parallax
if (window.innerWidth > 768) {
    initBadgeParallax();
} 