// Jai Jwala Contracts - Enhanced Interactions
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');
  if(navToggle && menu){
    navToggle.addEventListener('click', ()=>{
      const open = menu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Enhanced Intersection Observer for animations
  const io = (!prefersReduced && 'IntersectionObserver' in window) ? new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        
        // Stagger animation for multiple elements
        const staggerElements = e.target.querySelectorAll('.fade-up');
        staggerElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('in-view');
          }, index * 100);
        });
        
        io.unobserve(e.target);
      }
    })
  },{threshold:0.1, rootMargin: '0px 0px -50px 0px'}) : null;

  document.querySelectorAll('.fade-up, .service-card, .project-card').forEach(el=>{
    if(io){io.observe(el)} else {el.classList.add('in-view')}
  });

  // Parallax effect for hero section
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroSlides = document.querySelectorAll('.hero-slideshow .slide');
    
    if(hero && scrolled < window.innerHeight) {
      const speed = 0.5;
      heroSlides.forEach(slide => {
        slide.style.transform = `translateY(${scrolled * speed}px) scale(${1 + scrolled * 0.0005})`;
      });
    }
  }

  if(!prefersReduced) {
    window.addEventListener('scroll', updateParallax, { passive: true });
  }

  // Enhanced counters with progress bars
  function animateCounter(el){
    const target = parseInt(el.getAttribute('target')||'0',10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = Date.now();
    const from = 0;
    
    // Add progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'counter-progress';
    progressBar.style.cssText = `
      height: 3px;
      background: linear-gradient(90deg, var(--accent), var(--blue));
      border-radius: 2px;
      margin-top: 8px;
      transform-origin: left;
      transform: scaleX(0);
      transition: transform ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    el.parentNode.appendChild(progressBar);
    
    function tick(){
      const p = Math.min(1, (Date.now()-start)/duration);
      const eased = 1 - Math.pow(1-p, 3);
      const val = Math.floor(from + (target-from)*eased);
      el.textContent = val.toString() + suffix;
      
      // Update progress bar
      if(progressBar) {
        progressBar.style.transform = `scaleX(${eased})`;
      }
      
      if(p<1) requestAnimationFrame(tick);
    }
    tick();
  }

  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach(el=>{
    if(io){
      const obs = new IntersectionObserver(es=>{
        es.forEach(x=>{ 
          if(x.isIntersecting){ 
            animateCounter(el); 
            obs.disconnect(); 
          } 
        });
      },{threshold:0.8});
      obs.observe(el);
    } else {
      animateCounter(el);
    }
  });

  // Enhanced project filters with smooth transitions
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filterButtons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.getAttribute('data-filter');
      
      cards.forEach((c, index) => {
        const show = f==='all' || c.getAttribute('data-category')===f;
        
        if(show) {
          setTimeout(() => {
            c.style.display = '';
            c.style.opacity = '0';
            c.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
              c.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
              c.style.opacity = '1';
              c.style.transform = 'translateY(0)';
            });
          }, index * 50);
        } else {
          c.style.transition = 'all 0.3s ease';
          c.style.opacity = '0';
          c.style.transform = 'translateY(-20px)';
          
          setTimeout(() => {
            c.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Enhanced sticky header with smooth transitions
  const header = document.querySelector('.site-header');
  let last = 0;
  
  window.addEventListener('scroll',()=>{
    const y = window.scrollY || window.pageYOffset;
    
    if(header){ 
      if(y > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'saturate(180%) blur(12px)';
        header.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
      } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'saturate(180%) blur(8px)';
        header.style.boxShadow = y>8 ? '0 6px 18px rgba(0,0,0,.06)' : 'none';
      }
    }
    last = y;
  },{passive:true});

  // Smooth scrolling for anchor links with easing
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) {
        const offset = 80; // Account for sticky header
        const targetPosition = target.offsetTop - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Enhanced hero slideshow with Ken Burns effect
  const slides = document.querySelectorAll('.hero-slideshow .slide');
  if(slides.length > 1){
    let currentSlide = 0;
    
    function nextSlide(){
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
      
      // Add subtle zoom effect to active slide
      slides[currentSlide].style.transform = 'scale(1.05)';
      setTimeout(() => {
        slides[currentSlide].style.transform = 'scale(1)';
      }, 4000);
    }
    
    setInterval(nextSlide, 5000);
  }

  // Scroll to top button
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '↑';
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--blue));
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  `;
  
  document.body.appendChild(scrollToTopBtn);
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      scrollToTopBtn.style.opacity = '1';
      scrollToTopBtn.style.visibility = 'visible';
      scrollToTopBtn.style.transform = 'translateY(0)';
    } else {
      scrollToTopBtn.style.opacity = '0';
      scrollToTopBtn.style.visibility = 'hidden';
      scrollToTopBtn.style.transform = 'translateY(20px)';
    }
  });
  
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Enhanced contact form with real-time validation
  const contactForm = document.querySelector('.contact-form');
  if(contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    // Real-time validation
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateField(input);
      });
      
      input.addEventListener('input', () => {
        if(input.classList.contains('error')) {
          validateField(input);
        }
      });
    });
    
    function validateField(field) {
      const value = field.value.trim();
      let isValid = true;
      let errorMessage = '';
      
      // Remove existing error styling
      field.classList.remove('error');
      const existingError = field.parentNode.querySelector('.error-message');
      if(existingError) existingError.remove();
      
      if(field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(value && !emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
      } else if(field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
      }
      
      if(!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.cssText = `
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
        `;
        field.parentNode.appendChild(errorDiv);
      }
      
      return isValid;
    }
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate all fields
      let isFormValid = true;
      inputs.forEach(input => {
        if(!validateField(input)) {
          isFormValid = false;
        }
      });
      
      if(!isFormValid) {
        const formNote = document.querySelector('.form-note');
        formNote.textContent = '⚠️ Please correct the errors above.';
        formNote.style.color = '#dc3545';
        formNote.style.fontWeight = '600';
        return;
      }
      
      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      const formData = new FormData(this);
      
      fetch('https://formspree.io/f/mzzoddlb', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        const formNote = document.querySelector('.form-note');
        if (response.ok) {
          formNote.textContent = '✅ Message sent successfully! We\'ll respond within 24 hours.';
          formNote.style.color = '#28a745';
          formNote.style.fontWeight = '600';
          this.reset();
        } else {
          formNote.textContent = '❌ Something went wrong. Please try again.';
          formNote.style.color = '#dc3545';
        }
      })
      .catch(error => {
        const formNote = document.querySelector('.form-note');
        formNote.textContent = '❌ Network error. Please try again.';
        formNote.style.color = '#dc3545';
      })
      .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  }

  // Add interactive hover effects to service cards
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Add ripple effect to buttons
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
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
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add CSS for ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .error {
      border-color: #dc3545 !important;
      box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2) !important;
    }
    
    .counter-progress {
      transform-origin: left;
    }
  `;
  document.head.appendChild(style);

  // Lightbox functionality for project cards
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  
  // Open lightbox when clicking on project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function() {
      const media = this.querySelector('.project-media');
      const title = this.querySelector('h3').textContent;
      const description = this.querySelector('p').textContent;
      const imageUrl = media.style.backgroundImage.slice(5, -2); // Extract URL from background-image
      
      lightboxImage.src = imageUrl;
      lightboxImage.alt = title;
      lightboxCaption.querySelector('h3').textContent = title;
      lightboxCaption.querySelector('p').textContent = description;
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
  });
  
  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  lightboxClose.addEventListener('click', closeLightbox);
  
  // Close lightbox when clicking outside the content
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Close lightbox with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

})();
