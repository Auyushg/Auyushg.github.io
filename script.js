// ===== Reveal-on-scroll =====
const initReveal = () => {
  const revealEls = document.querySelectorAll('.reveal, .gauge');

  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -8% 0px'
  });

  revealEls.forEach(el => io.observe(el));
};


// ===== Contact form =====
const initContactForm = () => {
  const form = document.getElementById('uplinkForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitBtn) submitBtn.disabled = true;

    if (status) {
      status.style.color = 'var(--accent-signal)';
      status.textContent = 'SENDING…';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        if (status) {
          status.textContent =
            'EMAIL SUCCESSFULLY SENT — I\'ll get back to you soon.';
        }
        form.reset();
      } else {
        if (status) {
          status.style.color = 'var(--accent-thrust)';
          status.textContent =
            'EMAIL UNSUCCESSFUL — please try again or email me directly.';
        }
      }
    } catch (err) {
      if (status) {
        status.style.color = 'var(--accent-thrust)';
        status.textContent =
          'EMAIL UNSUCCESSFUL — check your connection and try again.';
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
};


// ===== Photo flipper carousel =====
// Rewritten to be self-healing: it no longer trusts that every <img> was
// hand-tagged correctly or that the number of dots matches the number of
// photos. It normalizes the markup in JS, then drives everything off that
// normalized state. This is what prevents "all photos showing at once" —
// even a copy-paste mistake in the HTML can't break it anymore.
const initPhotoFlippers = () => {
  document.querySelectorAll('.photo-flipper').forEach((flipper) => {

    const track = flipper.querySelector('.flipper-track');
    if (!track) return;

    // 1. Normalize slides: every <img> inside the track counts as a slide,
    //    whether or not someone remembered to add class="flipper-slide".
    const slides = Array.from(track.querySelectorAll('img'));
    if (!slides.length) return;

    slides.forEach(slide => slide.classList.add('flipper-slide'));

    // 2. Figure out which one should start active. If more than one (or
    //    none) is marked active in the HTML, that's exactly the bug you
    //    saw — so we always collapse it down to a single source of truth.
    let current = slides.findIndex(slide => slide.classList.contains('active'));
    if (current < 0) current = 0;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
    });

    // 3. Rebuild the dots to always match the slide count exactly, instead
    //    of trusting hand-written dot buttons to stay in sync with photos
    //    as they're added or removed.
    let dotsContainer = flipper.querySelector('.flipper-dots');
    if (!dotsContainer) {
      dotsContainer = document.createElement('div');
      dotsContainer.className = 'flipper-dots';
      flipper.appendChild(dotsContainer);
    }
    dotsContainer.innerHTML = '';

    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'flipper-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Show photo ${i + 1}`);
      dotsContainer.appendChild(dot);
      return dot;
    });

    let timer = null;

    function showSlide(index) {
      if (slides.length <= 1) return;

      const nextIndex = (index + slides.length) % slides.length;

      slides[current].classList.remove('active');
      dots[current].classList.remove('active');

      current = nextIndex;

      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function next() {
      showSlide(current + 1);
    }

    function stop() {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      stop();
      if (slides.length > 1) {
        timer = setInterval(next, 4000);
      }
    }

    // Manual navigation
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        start();
      });
    });

    // Pause while hovering over the gallery
    flipper.addEventListener('mouseenter', stop);
    flipper.addEventListener('mouseleave', start);

    // Start automatic rotation
    start();
  });
};


// ===== Initialize everything after HTML loads =====
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initContactForm();
  initPhotoFlippers();
});


/* =========================
   PROJECT CATEGORY TABS
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const projectTabs = document.querySelectorAll(".project-tab");
  const projectCategories = document.querySelectorAll(".project-category");

  projectTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selectedCategory = tab.dataset.category;

      // Update active button
      projectTabs.forEach((button) => {
        button.classList.remove("active");
      });

      tab.classList.add("active");

      // Hide all categories
      projectCategories.forEach((category) => {
        category.classList.remove("active");
      });

      // Show selected category
      const selectedProjects = document.querySelector(
        `[data-project-category="${selectedCategory}"]`
      );

      if (selectedProjects) {
        selectedProjects.classList.add("active");
      }
    });
  });
});

/* ==================================================
   PROJECT SIDE NAV ACTIVE SECTION
   ================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const sections = document.querySelectorAll(
    ".case-section[id]"
  );

  const navLinks = document.querySelectorAll(
    '.project-side-nav a[href^="#"]'
  );


  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {
          link.classList.remove("active");
        });


        const activeLink = document.querySelector(
          `.project-side-nav a[href="#${entry.target.id}"]`
        );

        if (activeLink) {
          activeLink.classList.add("active");
        }

      });

    },
    {
      rootMargin: "-25% 0px -60% 0px"
    }
  );


  sections.forEach((section) => {
    observer.observe(section);
  });

});
