// Prevent scroll restoration and ensure page starts at top
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Force scroll to top on page load
window.addEventListener('load', function() {
  window.scrollTo(0, 0);
});

// Also handle beforeunload to prevent scroll restoration
window.addEventListener('beforeunload', function() {
  window.scrollTo(0, 0);
});

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

AOS.init({
  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 200, // offset (in px) from the original trigger point - increased for earlier animation
  delay: 50, // values from 0 to 3000, with step 50ms
  duration: 800, // values from 0 to 3000, with step 50ms
  easing: "ease-in-out", // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: "top-bottom", // defines which position of the element regarding to window
});
$(function () {
  // Animation initialization

  $("#mobileMenuButton").on("click", function () {
    $("#mobileMenu").slideToggle(200);
    $("#menuIcon").toggleClass("fa-bars fa-times");
  });

  // Optional: Close menu on nav click
  $("#mobileMenu a").on("click", function () {
    $("#mobileMenu").slideUp(200);
    $("#menuIcon").removeClass("fa-times").addClass("fa-bars");
  });

  $(window).on("resize", function () {
    $("#mobileMenu").slideUp(200);
    $("#menuIcon").removeClass("fa-times").addClass("fa-bars");
  });

  $("#copyright_year").text(new Date().getFullYear());
  // Newsletter Form
  $("#chkConfirm").on("click", function () {
    if (!$(this).prop("checked")) {
      $(this).closest("label").addClass("is-invalid");
    } else {
      $(this).closest("label").removeClass("is-invalid");
    }
  });

  $("#inputEmail").on("keyup", function () {
    if (!$(this).val() || !isValidEmail($(this).val())) {
      $(this).addClass("is-invalid");
    } else {
      $(this).removeClass("is-invalid");
    }
  });

  $("#btnSubmit").on("click", function (event) {
    event.preventDefault();
    const $subscribeAlert = $("#subscribeAlert");
    const $this = $(this);
    const email = $("#inputEmail").val();
    const confirm = $("#chkConfirm").prop("checked");
    const $icon = $this.find("i");
    const currentClasses = $icon.attr("class");
    if (!confirm) {
      $("#chkConfirm").closest("label").addClass("is-invalid");
    } else {
      $("#chkConfirm").closest("label").removeClass("is-invalid");
    }

    if (!email || !isValidEmail(email)) {
      $("#inputEmail").addClass("is-invalid");
    } else {
      $("#inputEmail").removeClass("is-invalid");
    }

    if (email && confirm) {
      $subscribeAlert.find("span").html("");
      $subscribeAlert.addClass("hidden");
      $.ajax({
        url: window.BASE_API_URL + "/subscribe",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ email }),
        beforeSend: function () {
          $icon.attr("class", "fas fa-spinner fa-spin");
          $this.prop("disabled", true);
        },
        success: function (res) {
          $subscribeAlert
            .find("span")
            .html(
              "Thank you for signing up to be among the first to explore SourceMedX"
            );
          $("#inputEmail").val("");
          $("#chkConfirm").prop("checked", false);
        },
        error: function (xhr) {
          $subscribeAlert.html(xhr.responseText);
        },
        complete: function () {
          $subscribeAlert.removeClass("hidden");
          $icon.attr("class", currentClasses);
          $this.prop("disabled", false);
        },
      });
    }
  });
});

// Video Modal
const openBtn = document.getElementById("openVideo");
const modal = document.getElementById("videoModal");
const closeBtn = document.getElementById("closeModal");
const iframe = document.getElementById("youtubeFrame");

const YOUTUBE_URL = "https://www.youtube.com/embed/gASl9o_0-TE"; // Replace with your video

if (openBtn) {
  openBtn.addEventListener("click", () => {
    iframe.src = YOUTUBE_URL + "?autoplay=1";
    modal.classList.remove("hidden");
  });
}
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    iframe.src = ""; // Stop video
    modal.classList.add("hidden");
  });
}
// Optional: Close modal when clicking outside the box
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      iframe.src = "";
      modal.classList.add("hidden");
    }
  });
}
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", function () {
    const answer = this.nextElementSibling;
    const icon = this.querySelector(".faq-icon");
    const isOpen = !answer.classList.contains("hidden");
    // Close all
    document
      .querySelectorAll(".faq-answer")
      .forEach((a) => a.classList.add("hidden"));
    document
      .querySelectorAll(".faq-icon")
      .forEach((i) => (i.style.transform = "rotate(0deg)"));
    // Open this one if it was closed
    if (!isOpen) {
      answer.classList.remove("hidden");
      icon.style.transform = "rotate(180deg)";
    }
  });
});

// Responsive Testimonials Carousel with Dot Navigation

const carousel = document.getElementById("testimonialCarousel");
if (carousel) {
  const cards = carousel.querySelectorAll(".testimonial-card");
  const dotsContainer = document.getElementById("testimonialDots");
  let visibleCount = 3;
  let current = 0;

  function updateVisibleCount() {
    if (window.innerWidth < 640) visibleCount = 1;
    else if (window.innerWidth < 768) visibleCount = 2;
    else visibleCount = 3;
  }

  function createDots() {
    updateVisibleCount();
    const totalSlides = Math.ceil(cards.length / visibleCount);
    dotsContainer.innerHTML = "";

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("button");
      dot.className =
        "w-3 h-3 rounded-full transition-all duration-500 ease-in-out focus:outline-none opacity-50 hover:opacity-75";
      dot.setAttribute("data-slide", i);
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll("button");
    const activeDotIndex = Math.floor(current / visibleCount);

    dots.forEach((dot, index) => {
      if (index === activeDotIndex) {
        dot.classList.add("bg-[#005C98]", "opacity-100");
        dot.classList.remove("bg-gray-300", "opacity-50");
      } else {
        dot.classList.add("bg-gray-300", "opacity-50");
        dot.classList.remove("bg-[#005C98]", "opacity-100");
      }
    });
  }

  function goToSlide(idx) {
    updateVisibleCount();
    if (idx < 0) idx = 0;
    const maxSlides = Math.ceil(cards.length / visibleCount);
    if (idx >= maxSlides) idx = maxSlides - 1;

    current = idx * visibleCount;

    // Hide all cards first
    cards.forEach((card, index) => {
      card.classList.add("hidden");
      card.style.transform = "scale(0.95)";
    });

    // Show only the visible cards with fade effect
    setTimeout(() => {
      cards.forEach((card, index) => {
        if (index >= current && index < current + visibleCount) {
          card.classList.remove("hidden");
          card.style.transform = "scale(1)";
        } else {
          card.classList.add("hidden");
          card.style.transform = "scale(0.95)";
        }
      });
    }, 250);

    updateDots();
  }

  function showSlide(idx) {
    updateVisibleCount();
    if (idx < 0) idx = 0;
    if (idx > cards.length - visibleCount) idx = cards.length - visibleCount;
    current = idx;

    // Hide all cards first
    cards.forEach((card, index) => {
      card.classList.add("hidden");
      card.style.transform = "scale(0.95)";
    });

    // Show only the visible cards with fade effect
    setTimeout(() => {
      cards.forEach((card, index) => {
        if (index >= current && index < current + visibleCount) {
          card.classList.remove("hidden");
          card.style.transform = "scale(1)";
        } else {
          card.classList.add("hidden");
          card.style.transform = "scale(0.95)";
        }
      });
    }, 250);

    updateDots();
  }

  window.addEventListener("resize", () => {
    createDots();
    showSlide(current);
  });

  // Initialize
  createDots();
  showSlide(0);
}
