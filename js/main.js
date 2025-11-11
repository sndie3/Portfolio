// All functionality functions
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenu = document.querySelector('.navbar-nav');
    const navToggle = document.querySelector('.nav-toggle');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    navToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', 
            mobileMenu.classList.contains('active') ? 'true' : 'false'
        );
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Scroll effects
function initializeScrollEffects() {
    const header = document.querySelector('.navbar');
    const scrollTopBtn = document.querySelector('.scroll-top');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        navLinks.forEach(link => {
            const section = document.querySelector(link.getAttribute('href'));
            if (section) {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });

        if (scrollTopBtn) {
            if (currentScroll > 500) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }

        lastScroll = currentScroll;
    });
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Typing effect for hero section
function initializeTypingEffect() {
    const text = "Student and Freelancer";
    const subtitle = document.querySelector('.subtitle');
    let i = 0;
    let isDeleting = false;
    let currentText = '';

    function type() {
        if (i <= text.length && !isDeleting) {
            currentText = text.substring(0, i);
            subtitle.textContent = currentText;
            i++;
            setTimeout(type, 100);
        } else if (isDeleting) {
            currentText = text.substring(0, i);
            subtitle.textContent = currentText;
            i--;
            if (i === 0) {
                isDeleting = false;
                setTimeout(type, 1000);
            } else {
                setTimeout(type, 50);
            }
        } else {
            isDeleting = true;
            setTimeout(type, 2000);
        }
    }

    type();
}

// Project filters
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}

// Contact form handling
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;

    emailjs.init("service_8qg4j6p");

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert('Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address');
            return;
        }

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            await emailjs.send("service_6zgn7ww", "template_ziwkefk", {
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message,
                to_email: "sandiegoles8@gmail.com"
            });

            alert('Message sent successfully!');
            form.reset();
        } catch (error) {
            alert('Failed to send message. Please try again later.');
        }

        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    });
}

// Certificate Modal functionality
function initializeCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.getElementById('modal-close');
    const certificateImgs = document.querySelectorAll('.certificate-img');

    certificateImgs.forEach(img => {
        img.addEventListener('click', () => {
            modal.style.display = 'flex';
            modalImg.src = img.src;
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    let scale = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;

    modalImg.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Only intercept wheel events when the modal is open
    window.addEventListener('wheel', (e) => {
        if (modal.style.display !== 'flex') {
            return; // allow normal page scrolling
        }
        e.preventDefault();
        const delta = e.deltaY;
        if (delta > 0) {
            scale = Math.max(0.5, scale - 0.1);
        } else {
            scale = Math.min(3, scale + 0.1);
        }
        modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }, { passive: false });

    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'Escape') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });
}

// Add animation to project cards
const projectCards = document.querySelectorAll('.project-card');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// Mouse Parallax Effect
const mouseParallax = document.querySelector('.mouse-parallax');
const shapes = document.querySelectorAll('.shape');
const parallaxElement = document.querySelector('.parallax-element');

if (mouseParallax) {
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            const x = (mouseX - 0.5) * speed * 100;
            const y = (mouseY - 0.5) * speed * 100;
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        const moveX = (mouseX - 0.5) * 20;
        const moveY = (mouseY - 0.5) * 20;
        parallaxElement.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    window.addEventListener('mouseleave', () => {
        shapes.forEach(shape => {
            shape.style.transform = 'translate(0, 0)';
        });
        parallaxElement.style.transform = 'translate(0, 0)';
    });
}
