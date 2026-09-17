// Jai Jwala Contracts - Interactions
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

  // Intersection Observer for fade-up elements
  const io = (!prefersReduced && 'IntersectionObserver' in window) ? new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    })
  },{threshold:0.15}) : null;

  document.querySelectorAll('.fade-up').forEach(el=>{
    if(io){io.observe(el)} else {el.classList.add('in-view')}
  });

  // Counters
  function animateCounter(el){
    const target = parseInt(el.getAttribute('target')||'0',10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    const start = Date.now();
    const from = 0;
    // Reset to 0 before animation
    el.textContent = '0' + suffix;
    function tick(){
      const p = Math.min(1, (Date.now()-start)/duration);
      const eased = 1 - Math.pow(1-p, 3);
      const val = Math.floor(from + (target-from)*eased);
      el.textContent = val.toString() + suffix;
      if(p<1) requestAnimationFrame(tick);
    }
    tick();
  }

  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach(el=>{
    if(io){
      io.observe(el);
      // run on view only
      const obs = new IntersectionObserver(es=>{
        es.forEach(x=>{ if(x.isIntersecting){ animateCounter(el); obs.disconnect(); } });
      },{threshold:0.6});
      obs.observe(el);
    } else {
      animateCounter(el);
    }
  });

  // Project filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  filterButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filterButtons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.getAttribute('data-filter');
      cards.forEach(c=>{
        const show = f==='all' || c.getAttribute('data-category')===f;
        c.style.display = show ? '' : 'none';
      })
    })
  });

  // Sticky header shadow on scroll
  const header = document.querySelector('.site-header');
  let last = 0;
  window.addEventListener('scroll',()=>{
    const y = window.scrollY || window.pageYOffset;
    if(header){ header.style.boxShadow = y>8 ? '0 6px 18px rgba(0,0,0,.06)' : 'none'; }
    last = y;
  },{passive:true});

  // Smooth scrolling for anchor links (if any remain on page)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Hero slideshow
  const slides = document.querySelectorAll('.hero-slideshow .slide');
  if(slides.length > 1){
    let currentSlide = 0;
    function nextSlide(){
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }
    setInterval(nextSlide, 4000); // Change slide every 4 seconds
  }

  // Contact form submission
  const contactForm = document.querySelector('.contact-form');
  if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      
      if(!name || !email || !message) {
        const formNote = document.querySelector('.form-note');
        formNote.textContent = '❌ Please fill in all required fields.';
        formNote.style.color = '#dc3545';
        formNote.style.fontWeight = '600';
        return;
      }
      
      // Show confirmation message
      const formNote = document.querySelector('.form-note');
      formNote.textContent = '✅ Message sent successfully! We\'ll respond within 24 hours.';
      formNote.style.color = '#28a745';
      formNote.style.fontWeight = '600';
      
      // Get form data
      const formData = new FormData(this);
      
      // Submit to Formspree using fetch
      fetch('https://formspree.io/f/mzzoddlb', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // Success - keep confirmation message
          this.reset();
        } else {
          // Error - show error message
          formNote.textContent = '❌ Something went wrong. Please try again.';
          formNote.style.color = '#dc3545';
        }
      })
      .catch(error => {
        // Network error
        formNote.textContent = '❌ Network error. Please try again.';
        formNote.style.color = '#dc3545';
      });
    });
  }
})();
