/* ==========================================
   PREMIUM AI ENGINEER PORTFOLIO - LOGIC
   Vinay P - REVA University (AIML)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Theme Toggle Logic (Light / Dark Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Load theme preference
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    body.setAttribute('data-theme', savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        
        // Re-initialize particles to adapt to new colors
        initParticles();
    });

    // 3. Mobile Navigation Menu Toggle
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggleBtn.querySelector('i');
        
        if (navMenu.classList.contains('active')) {
            mobileToggleBtn.innerHTML = '<i data-lucide="x"></i>';
        } else {
            mobileToggleBtn.innerHTML = '<i data-lucide="menu"></i>';
        }
        lucide.createIcons();
    });

    // Close mobile menu when nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggleBtn.innerHTML = '<i data-lucide="menu"></i>';
                lucide.createIcons();
            }
        });
    });

    // 4. Typewriter Animation for Hero Section
    const typedTextSpan = document.getElementById('typed-text');
    const textArray = [
        "Future AI & ML Engineer",
        "REVA University AIML Student",
        "Data Analyst & Python Developer",
        "Machine Learning Enthusiast"
    ];
    const typingSpeed = 100;
    const erasingSpeed = 60;
    const newTextDelay = 2000; // Delay between word rotations
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed + 500);
        }
    }

    // Start typewriter loop
    if (typedTextSpan) {
        setTimeout(type, 1000);
    }

    // 5. Lightweight Canvas Particles System (AI Network background)
    const canvas = document.getElementById('hero-canvas');
    let ctx;
    let particles = [];
    let animationId;
    let mouse = { x: null, y: null, radius: 150 };

    function initParticles() {
        if (!canvas) return;
        
        ctx = canvas.getContext('2d');
        resizeCanvas();

        window.removeEventListener('resize', resizeCanvas);
        window.addEventListener('resize', resizeCanvas);

        window.removeEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseout', handleMouseOut);
        window.addEventListener('mouseout', handleMouseOut);

        // Generate particles based on screen size
        const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        if (animationId) cancelAnimationFrame(animationId);
        animateParticles();
    }

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }

    function handleMouseOut() {
        mouse.x = null;
        mouse.y = null;
    }

    // Get matching connection colors based on current theme
    function getConnectionColor() {
        const theme = body.getAttribute('data-theme');
        return theme === 'dark' ? 'rgba(59, 130, 246, ' : 'rgba(37, 99, 235, ';
    }

    function getParticleColor() {
        const theme = body.getAttribute('data-theme');
        return theme === 'dark' ? 'rgba(34, 211, 238, 0.45)' : 'rgba(6, 182, 212, 0.35)';
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1.5;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.speedY = Math.random() * 0.6 - 0.3;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Collision boundary check
            if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
            if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

            // Interactive mouse push
            if (mouse.x !== null && mouse.y !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    this.x += directionX * force * 1.5;
                    this.y += directionY * force * 1.5;
                }
            }
        }

        draw() {
            ctx.fillStyle = getParticleColor();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update & Draw Particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        // Draw connections
        const connectionColor = getConnectionColor();
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // If particles are close, draw a connecting line
                if (distance < 120) {
                    let alpha = (1 - (distance / 120)) * 0.15;
                    ctx.strokeStyle = connectionColor + alpha + ')';
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        animationId = requestAnimationFrame(animateParticles);
    }

    initParticles();

    // 6. Intersection Observer for Scroll Animations & Skills Bars
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const skillProgressBars = document.querySelectorAll('.skill-progress');

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => animateOnScroll.observe(el));

    // Observer specifically to trigger skill progress bars when section is visible
    const skillSection = document.getElementById('skills');
    if (skillSection) {
        const skillObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillProgressBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-percent');
                        bar.style.width = targetWidth;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        skillObserver.observe(skillSection);
    }

    // 7. ScrollSpy Navigation Menu Highlight
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSection = 'home';
        const scrollPosition = window.scrollY + 100; // Offset for header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
        
        // Sticky Header scroll styling (adds shadow when scrolled)
        const header = document.querySelector('.header-nav');
        if (window.scrollY > 20) {
            header.style.boxShadow = 'var(--shadow-md)';
            header.style.padding = '0.2rem 0';
        } else {
            header.style.boxShadow = 'none';
            header.style.padding = '0';
        }
    });

    // 8. Projects Category Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active filter button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Set transition style
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, grid-area 0.4s ease';
                
                if (filterValue === 'all') {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else if (filterValue === 'ai-ml' && category === 'ai-ml') {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else if (filterValue === 'data-analysis' && category === 'data-analysis') {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else if (filterValue === 'software' && category === 'software') {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350); // Match transition speed
                }
            });
        });
    });

    // 9. Contact Form Submission Handling
    const contactForm = document.getElementById('portfolio-contact-form');
    const successToast = document.getElementById('contact-success');
    const errorToast = document.getElementById('contact-error');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;

            // Form Validation Simple Check
            if (name && email && subject && message) {
                // Simulate form submit delay
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const submitBtnText = submitBtn.querySelector('span');
                const submitBtnIcon = submitBtn.querySelector('i');
                
                submitBtn.disabled = true;
                submitBtnText.textContent = 'Sending...';
                submitBtnIcon.setAttribute('data-lucide', 'loader-2');
                lucide.createIcons();
                
                // Simulate API call
                setTimeout(() => {
                    successToast.style.display = 'flex';
                    errorToast.style.display = 'none';
                    contactForm.reset();
                    
                    submitBtn.disabled = false;
                    submitBtnText.textContent = 'Send Message';
                    submitBtnIcon.setAttribute('data-lucide', 'send');
                    lucide.createIcons();

                    // Hide success toast after 5 seconds
                    setTimeout(() => {
                        successToast.style.display = 'none';
                    }, 5000);
                }, 1500);
            } else {
                errorToast.style.display = 'flex';
                successToast.style.display = 'none';
            }
        });
    }

    // 10. Share Modal Logic
    const shareBtn = document.getElementById('share-btn');
    const modalOverlay = document.getElementById('share-modal-overlay');
    const closeBtn = document.getElementById('modal-close-btn');
    const copyLinkBtn = document.getElementById('modal-copy-btn');
    const shareUrlText = document.getElementById('share-url-text');
    const copyToast = document.getElementById('copy-toast');
    
    // Set URL placeholder to active browser URL if possible, otherwise use default
    const portfolioUrl = window.location.href;
    if (shareUrlText) {
        shareUrlText.textContent = portfolioUrl;
    }

    function openModal() {
        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeModal() {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = 'auto'; // Unlock background scroll
    }

    if (shareBtn) shareBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking on dark overlay backdrop
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Copy link logic
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(portfolioUrl).then(() => {
                // Show copied success notification
                copyToast.classList.add('show');
                copyLinkBtn.textContent = 'Copied!';
                copyLinkBtn.style.background = '#10b981';
                
                setTimeout(() => {
                    copyToast.classList.remove('show');
                    copyLinkBtn.textContent = 'Copy';
                    copyLinkBtn.style.background = 'var(--accent-blue)';
                }, 2500);
            }).catch(err => {
                console.error('Could not copy link: ', err);
            });
        });
    }

    // Social Sharing click handlers
    const shareTwitterBtn = document.getElementById('share-twitter-btn');
    const shareLinkedinBtn = document.getElementById('share-linkedin-btn');

    if (shareTwitterBtn) {
        shareTwitterBtn.addEventListener('click', () => {
            const tweetText = `Check out Vinay P's premium AI & ML engineer portfolio! ${portfolioUrl}`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
        });
    }

    if (shareLinkedinBtn) {
        shareLinkedinBtn.addEventListener('click', () => {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`, '_blank');
        });
    }

    // 11. Download Resume Behavior (Generating clean Resume Text File dynamically)
    const downloadResumeBtn = document.getElementById('download-resume-btn');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', () => {
            // Generate clean printable layout or trigger a text summary download for demonstration
            const resumeContent = `VINAY P - FUTURE AI & ML ENGINEER
REVA University - B.Tech in Artificial Intelligence & Machine Learning (1st Year)
Email: vinay.p@reva.edu.in
LinkedIn: linkedin.com/in/vinay-p
GitHub: github.com/vinay-p

EDUCATION:
- B.Tech in Artificial Intelligence and Machine Learning (2025 - Present)
  REVA University, Bengaluru | 1st Year

TECHNICAL SKILLS:
- Programming Languages: Python, Java, C, C++, HTML
- Tools & Libraries: Pandas, NumPy, Matplotlib, Tkinter, VS Code, GitHub, Git

PROJECTS:
1. IPL Data Analysis Application
   - Language/Libraries: Python, Pandas, Matplotlib
   - Summary: Evaluated and plotted IPL match database reports.

2. Crop Disease Detector
   - Focus: Machine Learning, Image Processing, Python
   - Summary: Evaluated plant leaf visuals to classify crop plant health markers.

3. Quiz Application
   - Technology: Python, Tkinter GUI
   - Summary: Interactive desktop quiz framework with randomized questions.

ACHIEVEMENTS:
- AI & ML researcher and academic learner at REVA University.
- Completed 3 full programming projects in first year.
- Designed cricket statistics data charts and tables.
`;
            
            const blob = new Blob([resumeContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Vinay_P_Resume.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Show toast success
            copyToast.querySelector('span').textContent = 'Resume downloaded successfully!';
            copyToast.classList.add('show');
            setTimeout(() => {
                copyToast.classList.remove('show');
                copyToast.querySelector('span').textContent = 'Link copied to clipboard!';
            }, 3000);
        });
    }
});
