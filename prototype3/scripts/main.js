// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle?.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navLinks = document.getElementById('nav-links');

mobileMenuToggle?.addEventListener('click', () => {
  navLinks?.classList.toggle('mobile-open');
});

// Navbar Scroll Effect
const navHeader = document.getElementById('nav-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    navHeader?.classList.add('scrolled');
  } else {
    navHeader?.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      const navHeight = navHeader?.offsetHeight || 80;
      const targetPosition = target.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Artwork Detail Page - Image Gallery
const mainImage = document.getElementById('main-image');
const mainArtworkImage = document.getElementById('main-artwork-image');
const thumbnails = document.querySelectorAll('.artwork-thumbnail');

// Thumbnail Click Handler
thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener('click', () => {
    // Remove active class from all thumbnails
    thumbnails.forEach(t => t.classList.remove('active'));

    // Add active class to clicked thumbnail
    thumbnail.classList.add('active');

    // Update main image
    const img = thumbnail.querySelector('img');
    const fullImageSrc = img.getAttribute('data-full');

    if (mainArtworkImage && fullImageSrc) {
      mainArtworkImage.src = fullImageSrc;
      mainArtworkImage.alt = img.alt;
    }
  });
});

// Image Zoom Functionality
let isZoomed = false;

mainImage?.addEventListener('click', (e) => {
  if (!isZoomed) {
    // Zoom in
    isZoomed = true;
    mainImage.classList.add('zoomed');
    mainArtworkImage.style.transform = 'scale(2)';
    mainArtworkImage.style.cursor = 'zoom-out';

    // Calculate mouse position for zoom origin
    const rect = mainImage.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    mainArtworkImage.style.transformOrigin = `${x}% ${y}%`;
  } else {
    // Zoom out
    isZoomed = false;
    mainImage.classList.remove('zoomed');
    mainArtworkImage.style.transform = 'scale(1)';
    mainArtworkImage.style.cursor = 'zoom-in';
  }
});

// Size Selector
const sizeOptions = document.querySelectorAll('.size-option');

sizeOptions.forEach(option => {
  option.addEventListener('click', () => {
    // Remove selected class from all options
    sizeOptions.forEach(opt => opt.classList.remove('selected'));

    // Add selected class to clicked option
    option.classList.add('selected');

    // Check the radio button
    const radio = option.querySelector('input[type="radio"]');
    if (radio) {
      radio.checked = true;
    }
  });
});

// Add to Cart Button
const addToCartBtn = document.querySelector('.btn-add-to-cart');

addToCartBtn?.addEventListener('click', () => {
  // Get selected size
  const selectedSize = document.querySelector('.size-option.selected .size-option-name')?.textContent;
  const selectedPrice = document.querySelector('.size-option.selected .size-option-price')?.textContent;

  // Show confirmation (in production, this would add to cart)
  const originalText = addToCartBtn.textContent;
  addToCartBtn.textContent = '✓ Added to Cart';
  addToCartBtn.style.backgroundColor = 'var(--color-gold)';

  setTimeout(() => {
    addToCartBtn.textContent = originalText;
    addToCartBtn.style.backgroundColor = '';
  }, 2000);

  console.log(`Added to cart: ${selectedSize} - ${selectedPrice}`);
});

// Intersection Observer for Fade-in Animations
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

// Observe all artwork cards
document.querySelectorAll('.artwork-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
  observer.observe(card);
});

// Lazy Loading Images
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading supported
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.src;
  });
} else {
  // Fallback for browsers that don't support native lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// Filtering and Sorting Logic
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-select');
const collectionGrid = document.getElementById('collection-grid');
const artworkCards = document.querySelectorAll('.artwork-card');

// Check URL parameters for category filter
const urlParams = new URLSearchParams(window.location.search);
const categoryParam = urlParams.get('category');

if (categoryParam) {
  const targetBtn = document.querySelector(`.filter-btn[data-filter="${categoryParam}"]`);
  if (targetBtn) {
    setActiveFilter(targetBtn);
    filterArtworks(categoryParam);
  }
}

// Filter Click Event
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filterValue = btn.getAttribute('data-filter');
    setActiveFilter(btn);
    filterArtworks(filterValue);
  });
});

function setActiveFilter(activeBtn) {
  filterBtns.forEach(btn => btn.classList.remove('active'));
  activeBtn.classList.add('active');
}

function filterArtworks(filterValue) {
  artworkCards.forEach(card => {
    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
      card.style.display = 'block';
      // Simple animation
      card.style.opacity = '0';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50);
    } else {
      card.style.display = 'none';
    }
  });

  // Update count text
  const visibleCount = document.querySelectorAll('.artwork-card[style="display: block"]').length;
  // You could update a counter element here if one existed
}

// Sort Change Event
sortSelect?.addEventListener('change', () => {
  const sortValue = sortSelect.value;
  const cardsArray = Array.from(artworkCards);

  if (sortValue === 'price-asc') {
    cardsArray.sort((a, b) => {
      return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
    });
  } else if (sortValue === 'price-desc') {
    cardsArray.sort((a, b) => {
      return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
    });
  } else {
    // Default / Featured - just randomize slightly for demo or keep original order
    // For simplicity, we'll reload original order if we tracked it, 
    // but here we can just leave it as is or implement complex logic.
    // Let's just re-append in original DOM order (which we captured in artworkCards NodeList)
    // Note: NodeList is static, but we can't easily "reset" without re-appending.
    // Let's implement index-based sort if we need to reset.
    // For now, let's just stick to price sorting or reload page for "Featured".
    window.location.reload();
    return;
  }

  // Re-append sorted cards
  cardsArray.forEach(card => collectionGrid.appendChild(card));
});


// --- Artwork Detail Page Logic ---

let currentFrame = 'none';

function switchView(mode) {
  // Update buttons
  document.querySelectorAll('.view-controls .btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  const frameOverlay = document.getElementById('frame-overlay');
  const farmingOptions = document.getElementById('framing-options');

  if (mode === 'standard') {
    frameOverlay.className = 'frame-overlay'; // remove frame
    farmingOptions.style.display = 'none';
    currentFrame = 'none';
    updateFrameButtons('none');
  } else if (mode === 'framed') {
    farmingOptions.style.display = 'block';
    if (currentFrame === 'none') {
      selectFrame('black-ash'); // Default to black ash when switching to framed view
    } else {
      selectFrame(currentFrame);
    }
  }
}

function selectFrame(frameType) {
  currentFrame = frameType;
  const frameOverlay = document.getElementById('frame-overlay');

  // Update Overlay
  frameOverlay.className = 'frame-overlay'; // reset
  if (frameType !== 'none') {
    frameOverlay.classList.add(`frame-${frameType}`);
  }

  // Update Buttons
  updateFrameButtons(frameType);
}

function updateFrameButtons(activeType) {
  document.querySelectorAll('.frame-btn').forEach(btn => {
    if (btn.dataset.frame === activeType) {
      btn.classList.add('active');
      // Add visual indicator for active state if needed beyond simple class
      btn.style.boxShadow = '0 0 0 2px var(--color-gold)';
    } else {
      btn.classList.remove('active');
      btn.style.boxShadow = 'none';
    }
  });
}

// Room View Logic
function openRoomView() {
  const modal = document.getElementById('room-modal');
  const mainImageSrc = document.getElementById('main-image').src;
  const roomArtworkImage = document.getElementById('room-artwork-image');

  roomArtworkImage.src = mainImageSrc;
  modal.style.display = 'flex';
}

function closeRoomModal() {
  document.getElementById('room-modal').style.display = 'none';
}

function changeRoom(roomType) {
  const modalImg = document.querySelector('#room-modal > .modal-content > img');
  // Using simple placeholders or unsplash images for demo rooms
  const rooms = {
    'living': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=90',
    'office': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=90',
    'bedroom': 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1600&q=90'
  };

  if (rooms[roomType]) {
    modalImg.src = rooms[roomType];
  }
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById('room-modal');
  if (event.target == modal) {
    closeRoomModal();
  }
}

// Override or update addToCart for framing
function addToCart() {
  const title = document.querySelector('.product-title')?.innerText || "Artwork";
  const selectedSizeBtn = document.querySelector('.size-option.selected');
  const size = selectedSizeBtn ? selectedSizeBtn.querySelector('.size-name').innerText : "Standard";
  let price = selectedSizeBtn ? selectedSizeBtn.getAttribute('data-price') : "0";

  // basic frame price addition logic
  let framePrice = 0;
  if (currentFrame !== 'none') {
    framePrice = 500; // Flat rate for demo
    price = parseInt(price) + framePrice;
  }

  const frameText = currentFrame !== 'none' ? ` with ${currentFrame.replace('-', ' ')} frame` : '';

  alert(`Added to cart:\n${title}\nSize: ${size}\nFormat: ${currentFrame}\nTotal: USD ${price}`);
}


// Performance Optimization - Debounce Scroll Events
function debounce(func, wait = 10, immediate = true) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Initial Animation trigger for visible cards
setTimeout(() => {
  const visibleCards = document.querySelectorAll('.artwork-card');
  visibleCards.forEach(card => {
    if (window.getComputedStyle(card).display !== 'none') {
      observer.observe(card);
    }
  });
}, 100);


// Initialize
console.log('Christian Nørgaard Fine Art Photography Platform - Prototype v1.0');
