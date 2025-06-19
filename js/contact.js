// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
    initContactFormEnhancements();
});

// FAQ Accordion functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Enhanced contact form functionality
function initContactFormEnhancements() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Add floating label effect
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Real-time validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', validateEmail);
    }
    
    // Project type change handler
    const projectTypeSelect = document.getElementById('projectType');
    if (projectTypeSelect) {
        projectTypeSelect.addEventListener('change', handleProjectTypeChange);
    }
}

// Email validation
function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(emailInput.value);
    
    emailInput.classList.toggle('invalid', emailInput.value && !isValid);
    emailInput.classList.toggle('valid', isValid);
}

// Handle project type changes
function handleProjectTypeChange() {
    const projectType = document.getElementById('projectType').value;
    const messageTextarea = document.getElementById('message');
    
    let placeholder = "Please describe your project requirements, goals, and any specific technologies you'd like to discuss...";
    
    switch(projectType) {
        case 'ai-automation':
            placeholder = "Describe your current workflows and which processes you'd like to automate. What tools are you currently using?";
            break;
        case 'chatbot-development':
            placeholder = "What type of chatbot do you need? Customer service, lead generation, or something else? What platforms should it integrate with?";
            break;
        case 'ai-development':
            placeholder = "What specific AI functionality do you need? Please describe your use case and any technical requirements.";
            break;
        case 'crypto-trading':
            placeholder = "What trading strategies are you interested in? Do you have specific risk management requirements or performance targets?";
            break;
        case 'recommendation-systems':
            placeholder = "What type of recommendations do you need? Product recommendations, content suggestions, or something else? What data do you have available?";
            break;
        case 'consultation':
            placeholder = "What AI opportunities are you exploring? What challenges are you facing that AI might help solve?";
            break;
    }
    
    messageTextarea.placeholder = placeholder;
}

// Calendly integration
function openCalendly() {
    // In a real implementation, you would integrate with Calendly's API
    // For now, we'll simulate opening a calendar booking
    
    const calendlyUrl = 'https://calendly.com/your-calendar-link'; // Replace with actual Calendly URL
    
    // Check if we're on mobile
    if (window.innerWidth <= 768) {
        window.open(calendlyUrl, '_blank');
    } else {
        // Create modal for desktop
        createCalendlyModal(calendlyUrl);
    }
}

// Create Calendly modal for desktop
function createCalendlyModal(url) {
    const modal = document.createElement('div');
    modal.className = 'calendly-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeCalendlyModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Schedule Your Free Consultation</h3>
                <button onclick="closeCalendlyModal()" class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>Click the button below to open the calendar in a new tab:</p>
                <a href="${url}" target="_blank" class="btn btn-primary btn-large">
                    <i class="fas fa-external-link-alt"></i>
                    Open Calendar
                </a>
                <p class="modal-note">
                    <i class="fas fa-info-circle"></i>
                    The calendar will open in a new tab. Select a time that works best for you.
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add styles for modal
    addModalStyles();
}

// Close Calendly modal
function closeCalendlyModal() {
    const modal = document.querySelector('.calendly-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Add modal styles
function addModalStyles() {
    if (document.getElementById('calendly-modal-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'calendly-modal-styles';
    styles.textContent = `
        .calendly-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-in-out;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        }
        
        .modal-content {
            background: white;
            border-radius: 1rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            max-width: 500px;
            width: 90%;
            position: relative;
            animation: slideUp 0.3s ease-in-out;
        }
        
        .modal-header {
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid #E5E7EB;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #111827;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #6B7280;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
        }
        
        .modal-close:hover {
            background: #F3F4F6;
            color: #374151;
        }
        
        .modal-body {
            padding: 2rem;
            text-align: center;
        }
        
        .modal-note {
            margin-top: 1rem;
            font-size: 0.875rem;
            color: #6B7280;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            justify-content: center;
        }
        
        @keyframes slideUp {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(styles);
}

// Form progress indicator
function updateFormProgress() {
    const form = document.getElementById('contact-form');
    const requiredFields = form.querySelectorAll('[required]');
    const filledFields = Array.from(requiredFields).filter(field => field.value.trim() !== '');
    const progress = (filledFields.length / requiredFields.length) * 100;
    
    const progressBar = document.querySelector('.form-progress-bar');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

// Add form progress tracking
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    if (form) {
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('input', updateFormProgress);
        });
    }
});

// Form validation feedback
function showFieldError(field, message) {
    const errorElement = field.parentElement.querySelector('.field-error') || 
                        document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    if (!field.parentElement.querySelector('.field-error')) {
        field.parentElement.appendChild(errorElement);
    }
    
    field.classList.add('error');
}

function clearFieldError(field) {
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.classList.remove('error');
}

// Enhanced form validation
function validateForm() {
    const form = document.getElementById('contact-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        clearFieldError(field);
        
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && !validateEmailFormat(field.value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    return isValid;
}

function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Make functions globally available
window.openCalendly = openCalendly;
window.closeCalendlyModal = closeCalendlyModal; 