// Portfolio Website JavaScript

// Navigation functionality
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupContactForm();
        this.setupSkillInteractions();
        this.setupProjectCards();
        this.setupScrollIndicator();
        this.updateActiveNavLink();
    }

    setupNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const nav = document.getElementById('nav');

        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                const icon = navToggle.querySelector('.material-icons');
                icon.textContent = navMenu.classList.contains('active') ? 'close' : 'menu';
            });
        }

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                
                // Close mobile menu
                navMenu.classList.remove('active');
                if (navToggle) {
                    const icon = navToggle.querySelector('.material-icons');
                    icon.textContent = 'menu';
                }
            });
        });

        // Add scroll effect to navigation
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navHeight = document.getElementById('nav').offsetHeight;
            const targetPosition = section.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Add animation classes to elements
        const animatedElements = document.querySelectorAll(
            '.stat-card, .skill-category, .project-card, .timeline-item, .contact-form'
        );

        animatedElements.forEach((el, index) => {
            // Add staggered animation delay
            el.style.transitionDelay = `${index * 0.05}s`;
            el.classList.add('fade-in');
            observer.observe(el);
        });

        // Special animations for about section
        const aboutText = document.querySelector('.about-text');
        const aboutStats = document.querySelector('.about-stats');
        
        if (aboutText) {
            aboutText.classList.add('slide-in-left');
            observer.observe(aboutText);
        }
        
        if (aboutStats) {
            aboutStats.classList.add('slide-in-right');
            observer.observe(aboutStats);
        }
    }

    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.classList.add('loading');
                submitBtn.innerHTML = '<span class="material-icons">hourglass_empty</span>Sending...';
                
                try {
                    // Simulate form submission (replace with actual endpoint)
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Show success message
                    this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                    
                } catch (error) {
                    console.error('Form submission error:', error);
                    this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
                } finally {
                    // Reset button state
                    submitBtn.classList.remove('loading');
                    submitBtn.innerHTML = originalText;
                }
            });
        }
    }

    setupSkillInteractions() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(skill => {
            skill.addEventListener('mouseenter', () => {
                const proficiency = skill.getAttribute('data-proficiency');
                skill.setAttribute('title', `Proficiency: ${proficiency}%`);
            });
            
            skill.addEventListener('click', () => {
                // Add a ripple effect
                this.createRipple(skill);
            });
        });
    }

    setupProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showProjectModal(index);
            });
            
            // Add hover effect to project links to prevent card click
            const projectLinks = card.querySelectorAll('.project-link');
            projectLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            });
        });
    }

    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                this.scrollToSection('about');
            });
            
            // Hide scroll indicator after first scroll
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                }
            }, { once: true });
        }
    }

    createRipple(element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2;
        const y = rect.height / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x - size / 2}px;
            top: ${y - size / 2}px;
            background: rgba(66, 133, 244, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        // Add CSS animation keyframes if not exists
        if (!document.querySelector('#ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'ripple-keyframes';
            style.textContent = `
                @keyframes ripple {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    showProjectModal(projectIndex) {
        const projects = [
            {
                name: "HoopBuddy",
                description: "Built computer vision models for basketball that track player and ball locations on the court and detect made baskets. The player’s location is visualized on a 2D basketball court by using homography.",
                tech_stack: ["Python", "Ultralytics YOLO", "NumPy", "Matplotlib", "Open CV"],
                github: "https://github.com/shelbey25/hoopbuddyRepo/tree/main",
                demo: "",
                paper: "file:///Users/shelbe/Downloads/HoopBuddy.Research.Paper%20(2).pdf",
                features: [
                    "Pose estimation of the key (for homography)",
                    "Custom ball tracking model",
                    "Custom hoop tracking model",
                    "Targeted model used for tracking players"
                ]
            },
            {
                name: "Real-Time Collaboration Platform",
                description: "Developed a Google Docs-like collaborative editor with live cursor tracking and conflict resolution for 100+ concurrent users. Built with modern web technologies and real-time synchronization.",
                tech_stack: ["React", "TypeScript", "WebSockets", "Node.js", "PostgreSQL"],
                github: "https://github.com/yourusername/collab-platform",
                demo: "https://collab-demo.netlify.app",
                paper: "",
                features: [
                    "Real-time collaborative editing",
                    "Live cursor tracking and user presence",
                    "Conflict resolution algorithms",
                    "Supports 100+ concurrent users"
                ]
            },
            {
                name: "Grocery Optimization",
                description: "This app is currently in development. It’s designed to help users optimize their grocery shopping by identifying the best deals on their chosen items while minimizing the number of store visits required.",
                tech_stack: ["Swift", "Express", "Railway", "Google Maps API"],
                github: "",
                demo: "",
                paper: "",
                features: [
                    "Live price comparison across multiple stores",
                    "Location based recommendations",
                    "No sign-in required",
                    "Intuitive user interface"
                ]
            },
            {
                name: "AI-Powered Code Reviewer",
                description: "Built an ML model that analyzes code quality and suggests improvements, processing 10K+ lines of code with 94% accuracy. This project showcases my expertise in machine learning, natural language processing, and full-stack development.",
                tech_stack: ["Python", "TensorFlow", "FastAPI", "React", "TypeScript"],
                github: "https://github.com/yourusername/ai-code-reviewer",
                demo: "https://ai-reviewer-demo.vercel.app",
                paper: "",
                features: [
                    "Real-time code analysis and suggestions",
                    "Support for 10+ programming languages",
                    "Integration with popular IDEs",
                    "94% accuracy in detecting code smells"
                ]
            },
            {
                name: "Note Taker",
                description: "Tired of split-screening your notes and the video? Constantly pausing and restarting the video? Note Taker automatically pauses and resumes videos for you—so you don’t have to. ",
                tech_stack: ["React", "TypeScript", "Tailwind", "React-Youtube", "Vercel"],
                github: "",
                demo: "https://projectswoop.com/noteTaker",
                paper: "",
                features: [
                    "Video and notes in one tab",
                    "Automatic start/stop video based on note taking",
                    "Typing detection",
                    "Supports any YouTube video"
                ]
            },
            {
                name: "Friends Bet",
                description: "This app lets friends create custom betting lines on events in their own lives. Who knows their friends best? Bet on where your friends will go to college, what they'll do on a first date, or anything else!",
                tech_stack: ["React", "ChatGPT API", "Railway", "Typescript", "Wasp Framework"],
                github: "https://github.com/shelbey25/friendsbet",
                demo: "https://friendsbet.up.railway.app/",
                features: [
                    "Custom league creation and management",
                    "Supports creation of custom lines",
                    "AI balanced lines",
                    "Tracks bets and leaderboards"
                ]
            }
        ];

        const project = projects[projectIndex];
        if (!project) return;

        // Create modal HTML
        const modalHTML = `
            <div class="modal-overlay" id="project-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${project.name}</h2>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                            <span class="material-icons">close</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>${project.description}</p>
                        <h4>Key Features:</h4>
                        <ul>
                            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        <h4>Tech Stack:</h4>
                        <div class="project-tech">
                            ${project.tech_stack.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                        </div>
                        <div class="modal-links">
                            ${project.github ? `<a href="${project.github}" target="_blank" class="btn btn-outline">
                                <span class="material-icons">code</span>
                                View Code
                            </a>` : ''}
                            ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn btn-primary">
                                <span class="material-icons">launch</span>
                                Live Demo
                            </a>` : ''}
                            ${project.paper ? `<a href="${project.paper}" target="_blank" class="btn btn-primary">
                                <span class="material-icons">launch</span>
                                Research Paper
                            </a>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles if not exists
        if (!document.querySelector('#modal-styles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'modal-styles';
            modalStyles.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    padding: 2rem;
                    animation: fadeIn 0.3s ease;
                }
                .modal-content {
                    background: white;
                    border-radius: 12px;
                    max-width: 600px;
                    width: 100%;
                    max-height: 100vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s ease;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #f0f0f0;
                }
                .modal-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background-color 0.2s;
                }
                .modal-close:hover {
                    background: #f5f5f5;
                }
                .modal-body {
                    padding: 1.5rem;
                }
                .modal-body h4 {
                    margin: 1.5rem 0 0.5rem 0;
                    color: #333;
                }
                .modal-body ul {
                    margin: 0 0 1.5rem 1rem;
                    padding: 0;
                }
                .modal-body li {
                    margin-bottom: 0.5rem;
                    color: #666;
                }
                .modal-links {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @media (max-width: 768px) {
                    .modal-overlay {
                        padding: 1rem;
                    }
                    .modal-links {
                        flex-direction: column;
                    }
                    .modal-links .btn {
                        width: 100%;
                    }
                }
            `;
            document.head.appendChild(modalStyles);
        }

        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Close modal when clicking overlay
        const modalOverlay = document.getElementById('project-modal');
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape' && modalOverlay) {
                modalOverlay.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="material-icons">${
                type === 'success' ? 'check_circle' : 
                type === 'error' ? 'error' : 
                'info'
            }</span>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" class="notification-close">
                <span class="material-icons">close</span>
            </button>
        `;

        // Add notification styles if not exists
        if (!document.querySelector('#notification-styles')) {
            const notificationStyles = document.createElement('style');
            notificationStyles.id = 'notification-styles';
            notificationStyles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 2rem;
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    z-index: 3000;
                    animation: slideInRight 0.3s ease;
                    max-width: 400px;
                    border-left: 4px solid var(--google-blue);
                }
                .notification-success {
                    border-left-color: var(--google-green);
                }
                .notification-success .material-icons:first-child {
                    color: var(--google-green);
                }
                .notification-error {
                    border-left-color: var(--google-red);
                }
                .notification-error .material-icons:first-child {
                    color: var(--google-red);
                }
                .notification-info .material-icons:first-child {
                    color: var(--google-blue);
                }
                .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #999;
                    padding: 0.2rem;
                    border-radius: 50%;
                    margin-left: auto;
                }
                .notification-close:hover {
                    background: #f5f5f5;
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @media (max-width: 768px) {
                    .notification {
                        left: 1rem;
                        right: 1rem;
                        top: 80px;
                    }
                }
            `;
            document.head.appendChild(notificationStyles);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Global functions for button clicks
function scrollToSection(sectionId) {
    if (window.portfolioApp) {
        window.portfolioApp.scrollToSection(sectionId);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
    console.log('Portfolio website loaded successfully! 🚀');
});

// Add some fun Easter eggs
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        document.body.style.animation = 'rainbow 2s ease-in-out';
        
        if (!document.querySelector('#easter-egg-styles')) {
            const easterEggStyles = document.createElement('style');
            easterEggStyles.id = 'easter-egg-styles';
            easterEggStyles.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(easterEggStyles);
        }
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
        
        if (window.portfolioApp) {
            window.portfolioApp.showNotification(
                'Konami Code activated! You found the Easter egg! 🎮',
                'success'
            );
        }
        
        konamiCode = [];
    }
});

// Console message for developers
console.log(`
%c🚀 Portfolio Website
%cBuilt with passion for Google internship!
%cFind any bugs? Let me know!
`,
'color: #4285f4; font-size: 20px; font-weight: bold;',
'color: #34a853; font-size: 14px;',
'color: #ea4335; font-size: 12px;'
);