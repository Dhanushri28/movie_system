(function() {
  "use strict";

  // Form Submission Handling
  document.addEventListener('DOMContentLoaded', () => {
    // Registration form submission handling
    document.getElementById('contactForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission

      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries()); // Convert FormData to plain object

      console.log('Form data being sent:', data); // Log form data

      fetch('/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
        },
        body: JSON.stringify(data) // Convert object to JSON string
      })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Data saved successfully') {
          alert('Form submitted successfully');
          this.reset(); // Optionally reset the form
        } else {
          alert('Failed to submit form: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error submitting form');
      });
    });

    // Login form submission handling
    document.getElementById('loginForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission

      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries()); // Convert FormData to plain object

      console.log('Login data being sent:', data); // Log login data

      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
        },
        body: JSON.stringify(data) // Convert object to JSON string
      })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Login successful') {
          alert('Login successful');
          this.reset(); // Optionally reset the form
        } else {
          alert('Failed to login: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error logging in');
      });
    });
  });

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToggle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToggle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToggle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });
  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Booking alert
   */
  console.log('Script loaded');

function onLoaderFunc() {
    // Initialization or any setup needed on page load
}

function takeData() {
    console.log('takeData function called');
    const username = document.getElementById('Username').value;
    const numSeats = parseInt(document.getElementById('Numseats').value, 10);

    if (username === '' || isNaN(numSeats) || numSeats <= 0) {
        alert('Please enter a valid name and number of seats.');
        return;
    }

    // Enable seat checkboxes and provide instructions
    document.querySelectorAll('.seats').forEach(seat => {
        seat.disabled = false;
    });

    document.getElementById('notification').innerText = 'Please select your seats.';
}

function updateTextArea() {
    console.log('updateTextArea function called');
    const username = document.getElementById('Username').value;
    const numSeats = document.getElementById('Numseats').value;

    // Gather selected seats
    const selectedSeats = Array.from(document.querySelectorAll('.seats:checked'))
        .map(seat => seat.value)
        .join(', ');

    // Display the data
    document.getElementById('nameDisplay').value = username;
    document.getElementById('NumberDisplay').value = numSeats;
    document.getElementById('seatsDisplay').value = selectedSeats;

    // Disable further seat selection
    document.querySelectorAll('.seats').forEach(seat => {
        seat.disabled = true;
    });

    // Update notification
    document.getElementById('notification').innerText = 'Your seat selection is confirmed!';
}

function handleSeatChange(event) {
    console.log('handleSeatChange function called');
    const seat = event.target;

    if (seat.checked) {
        seat.parentElement.classList.add('selected');
    } else {
        seat.parentElement.classList.remove('selected');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');
    document.querySelector('button[onclick="takeData()"]').addEventListener('click', takeData);
    document.querySelector('button[onclick="updateTextArea()"]').addEventListener('click', updateTextArea);
    document.querySelectorAll('.seats').forEach(seat => {
        seat.addEventListener('change', handleSeatChange);
    });
});

  

  function showAlert() {
    alert("Booked successfully");
  }
})();
