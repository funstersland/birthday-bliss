/* =========================================
   Birthday Bliss — Welcome Screen Script
   White cherry blossom petals falling gently
   ========================================= */

// Soft white shades only (no pink)
const PETAL_COLORS = [
  "linear-gradient(145deg, #ffffff, #f8f5fc)",
  "linear-gradient(145deg, #ffffff, #f3eef9)",
  "linear-gradient(145deg, #fefefe, #ebe4f5)",
  "linear-gradient(145deg, #ffffff, #f6f2fb)"
];

// The layer in the HTML where petals will be added
const floatLayer = document.getElementById("float-layer");

/**
 * Creates one falling white petal (normal or small)
 * and removes it after the animation ends
 */
function createFloater() {
  const floater = document.createElement("span");
  floater.classList.add("floater");

  // Mix of regular petals and smaller petals (no hearts, no pink flowers)
  const isSmall = Math.random() < 0.4;

  if (isSmall) {
    floater.classList.add("petal-small");
    const width = 5 + Math.random() * 6; // 5px to 11px
    const height = width * (1.1 + Math.random() * 0.3);
    floater.style.width = width + "px";
    floater.style.height = height + "px";
  } else {
    floater.classList.add("petal");
    const width = 9 + Math.random() * 10; // 9px to 19px
    const height = width * (1.15 + Math.random() * 0.25);
    floater.style.width = width + "px";
    floater.style.height = height + "px";
  }

  // Soft white gradient for this petal
  const colorIndex = Math.floor(Math.random() * PETAL_COLORS.length);
  floater.style.background = PETAL_COLORS[colorIndex];

  // Random horizontal start position
  floater.style.left = Math.random() * 100 + "%";

  // Different gentle fall speeds (10 to 18 seconds)
  const duration = 10 + Math.random() * 8;
  floater.style.animationDuration = duration + "s";

  // Stagger when each petal starts falling
  floater.style.animationDelay = Math.random() * 1.4 + "s";

  // Tiny sideways offset so they look natural
  floater.style.marginLeft = (Math.random() * 28 - 14) + "px";

  floatLayer.appendChild(floater);

  // Remove after the animation finishes
  setTimeout(function () {
    floater.remove();
  }, (duration + 1.5) * 1000);
}

/**
 * Keeps creating petals on a timer
 * (fewer on phones so it stays smooth and elegant)
 */
function startFloating() {
  for (let i = 0; i < 7; i++) {
    setTimeout(createFloater, i * 400);
  }

  const isMobile = window.innerWidth < 480;
  const interval = isMobile ? 1300 : 1000;

  setInterval(createFloater, interval);
}

// Find the buttons and screens
const surpriseBtn = document.getElementById("surprise-btn");
const continueBtn = document.getElementById("continue-btn");
const memoriesBtn = document.getElementById("memories-btn");
const welcomeScreen = document.getElementById("welcome-screen");
const revealScreen = document.getElementById("reveal-screen");
const messageScreen = document.getElementById("message-screen");
const memoriesScreen = document.getElementById("memories-screen");
const wishScreen = document.getElementById("wish-screen");
const birthdayHeading = document.getElementById("birthday-heading");
const messageCard = document.getElementById("message-card");
const wishPageBtn = document.getElementById("wish-page-btn");
const makeWishBtn = document.getElementById("make-wish-btn");
const cakeScene = document.getElementById("cake-scene");
const wishSent = document.getElementById("wish-sent");
const wishConfetti = document.getElementById("wish-confetti");

/**
 * Hides one screen and shows another (smooth fade via CSS)
 */
function showScreen(hideScreen, showScreen) {
  hideScreen.classList.remove("is-active");
  hideScreen.setAttribute("aria-hidden", "true");

  showScreen.classList.add("is-active");
  showScreen.setAttribute("aria-hidden", "false");
}

/**
 * Welcome button → birthday reveal (page 2)
 */
surpriseBtn.addEventListener("click", function () {
  showScreen(welcomeScreen, revealScreen);

  // Soft fade-in for the birthday heading
  birthdayHeading.classList.remove("fade-in");
  setTimeout(function () {
    birthdayHeading.classList.add("fade-in");
  }, 50);
});

/**
 * Continue button → message card (page 3)
 */
continueBtn.addEventListener("click", function () {
  showScreen(revealScreen, messageScreen);

  // Soft fade-in for the elegant card
  messageCard.classList.remove("fade-in");
  setTimeout(function () {
    messageCard.classList.add("fade-in");
  }, 50);
});

/**
 * Continue button → memories slideshow (page 4)
 */
memoriesBtn.addEventListener("click", function () {
  showScreen(messageScreen, memoriesScreen);
  // Reset slideshow each time we open page 4
  currentMemory = 0;
  showFinale(false);
  showMemory(currentMemory, false);
});

/**
 * Continue button → make a wish (page 5)
 */
wishPageBtn.addEventListener("click", function () {
  showScreen(memoriesScreen, wishScreen);
  // Reset cake in case they return later
  cakeScene.classList.remove("is-blown");
  makeWishBtn.classList.remove("is-hidden");
  wishSent.hidden = true;
  wishSent.classList.remove("is-visible");
  wishConfetti.innerHTML = "";
});

/* =========================================
   Page 4 — Memory slideshow (exactly 4 photos)
   Tap "Add a picture" inside the Polaroid frame to upload.
   Use "Create link" to share the framed photos with someone.
   ========================================= */

// Exactly 4 memories. Upload a picture inside the frame for each one.
const memories = [
  { file: "sunrise.jpg", uploadedSrc: null },
  { file: "adventure.jpg", uploadedSrc: null },
  { file: "laughs.jpg", uploadedSrc: null },
  { file: "golden-hour.jpg", uploadedSrc: null }
];

let currentMemory = 0;
let isMemoryFading = false; // stops double-clicks mid-fade
let isSharedView = false; // true when opened from a share link

const memoryPhoto = document.getElementById("memory-photo");
const memoryPhotoWrap = document.getElementById("memory-photo-wrap");
const nextMemoryBtn = document.getElementById("next-memory-btn");
const polaroidWrap = document.getElementById("polaroid-wrap");
const memoryFinale = document.getElementById("memory-finale");
const uploadPhotoBtn = document.getElementById("upload-photo-btn");
const photoUploadInput = document.getElementById("photo-upload");
const createLinkBtn = document.getElementById("create-link-btn");
const shareStatus = document.getElementById("share-status");
const shareBox = document.getElementById("share-box");

/**
 * Updates the in-frame button for the current memory
 */
function updateUploadButton(hasPhoto) {
  // Receivers of a share link cannot upload
  if (isSharedView) {
    uploadPhotoBtn.classList.add("is-hidden");
    if (hasPhoto) {
      memoryPhotoWrap.classList.add("has-photo");
    } else {
      memoryPhotoWrap.classList.remove("has-photo");
    }
    return;
  }

  uploadPhotoBtn.classList.remove("is-hidden");

  if (hasPhoto) {
    memoryPhotoWrap.classList.add("has-photo");
    uploadPhotoBtn.textContent = "Change picture";
  } else {
    memoryPhotoWrap.classList.remove("has-photo");
    uploadPhotoBtn.textContent = "Add a picture";
  }
}

/**
 * Shows or hides the final message (after Photo 4)
 */
function showFinale(showIt) {
  if (showIt) {
    polaroidWrap.classList.add("is-hidden");
    nextMemoryBtn.classList.add("is-hidden");

    memoryFinale.hidden = false;
    memoryFinale.classList.remove("is-visible");
    setTimeout(function () {
      memoryFinale.classList.add("is-visible");
    }, 40);
  } else {
    polaroidWrap.classList.remove("is-hidden");
    nextMemoryBtn.classList.remove("is-hidden");

    memoryFinale.hidden = true;
    memoryFinale.classList.remove("is-visible");
  }
}

/**
 * Shows one memory inside the Polaroid frame.
 * fade = true means soft fade out → change → fade in
 */
function showMemory(index, fade) {
  const memory = memories[index];
  const photoPath = memory.uploadedSrc || ("photos/" + memory.file);

  function applyMemory() {
    memoryPhoto.classList.remove("is-visible");
    updateUploadButton(false);

    memoryPhoto.onload = function () {
      memoryPhoto.classList.add("is-visible");
      updateUploadButton(true);
      isMemoryFading = false;
    };

    memoryPhoto.onerror = function () {
      memoryPhoto.classList.remove("is-visible");
      updateUploadButton(false);
      isMemoryFading = false;
    };

    memoryPhoto.src = photoPath;
    memoryPhoto.alt = "A little memory";
  }

  if (!fade) {
    applyMemory();
    return;
  }

  isMemoryFading = true;
  memoryPhoto.classList.remove("is-visible");

  setTimeout(function () {
    applyMemory();
  }, 550);
}

// Tap inside the frame → open photo picker
uploadPhotoBtn.addEventListener("click", function () {
  if (isSharedView) {
    return;
  }
  photoUploadInput.click();
});

// When you choose a picture, save it for THIS memory and show it
photoUploadInput.addEventListener("change", function () {
  const file = photoUploadInput.files[0];
  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Please choose a picture file.");
    photoUploadInput.value = "";
    return;
  }

  const memory = memories[currentMemory];

  if (memory.uploadedSrc && memory.uploadedSrc.indexOf("blob:") === 0) {
    URL.revokeObjectURL(memory.uploadedSrc);
  }

  memory.uploadedSrc = URL.createObjectURL(file);
  showMemory(currentMemory, true);
  photoUploadInput.value = "";
});

nextMemoryBtn.addEventListener("click", function () {
  if (isMemoryFading) {
    return;
  }

  if (currentMemory >= memories.length - 1) {
    isMemoryFading = true;
    memoryPhoto.classList.remove("is-visible");

    setTimeout(function () {
      showFinale(true);
      isMemoryFading = false;
    }, 550);
    return;
  }

  currentMemory = currentMemory + 1;
  showMemory(currentMemory, true);
});

/* =========================================
   Create / open a share link with framed photos
   Photos are packed into the link (no server needed)
   ========================================= */

/**
 * Makes a photo smaller so the share link is not too long
 */
function compressImage(src, maxSize, quality) {
  return new Promise(function (resolve, reject) {
    const img = new Image();
    img.onload = function () {
      let width = img.width;
      let height = img.height;
      const longest = Math.max(width, height);
      const scale = Math.min(1, maxSize / longest);

      width = Math.round(width * scale);
      height = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // JPEG keeps the link much shorter than PNG
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = function () {
      reject(new Error("Could not read a photo."));
    };
    img.src = src;
  });
}

/**
 * Builds a link that contains the 4 framed photos
 * and copies it so you can send it
 */
createLinkBtn.addEventListener("click", async function () {
  // Need all 4 pictures first
  for (let i = 0; i < memories.length; i++) {
    if (!memories[i].uploadedSrc) {
      shareStatus.textContent = "Add all 4 pictures first.";
      return;
    }
  }

  createLinkBtn.disabled = true;
  createLinkBtn.textContent = "Creating link...";
  shareStatus.textContent = "Packing your photos into a link...";

  try {
    const photos = [];

    for (let i = 0; i < memories.length; i++) {
      // Smaller size = shorter link that still looks good in the frame
      const dataUrl = await compressImage(memories[i].uploadedSrc, 340, 0.52);
      photos.push(dataUrl);
    }

    const payload = encodeURIComponent(JSON.stringify({ v: 1, photos: photos }));
    const baseUrl = window.location.href.split("#")[0];
    const link = baseUrl + "#share=" + payload;

    if (link.length > 1800000) {
      shareStatus.textContent = "Photos are too big. Try smaller pictures.";
      return;
    }

    // Copy the link for easy sharing
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(link);
      shareStatus.textContent = "Link copied! Send it to them.";
    } else {
      window.prompt("Copy this link:", link);
      shareStatus.textContent = "Link ready — paste and send it.";
    }
  } catch (error) {
    console.error(error);
    shareStatus.textContent = "Could not create the link. Try again.";
  } finally {
    createLinkBtn.disabled = false;
    createLinkBtn.textContent = "Create link";
  }
});

/**
 * If this page was opened from a share link,
 * load the photos and jump to the framed memories
 */
function openSharedLinkIfPresent() {
  const hash = window.location.hash;

  if (hash.indexOf("#share=") !== 0) {
    return;
  }

  try {
    const raw = decodeURIComponent(hash.slice("#share=".length));
    const data = JSON.parse(raw);

    if (!data.photos || !data.photos.length) {
      return;
    }

    for (let i = 0; i < memories.length; i++) {
      memories[i].uploadedSrc = data.photos[i] || null;
    }

    isSharedView = true;
    document.body.classList.add("shared-view");

    // Hide earlier screens and show the framed memories
    welcomeScreen.classList.remove("is-active");
    welcomeScreen.setAttribute("aria-hidden", "true");
    revealScreen.classList.remove("is-active");
    revealScreen.setAttribute("aria-hidden", "true");
    messageScreen.classList.remove("is-active");
    messageScreen.setAttribute("aria-hidden", "true");

    memoriesScreen.classList.add("is-active");
    memoriesScreen.setAttribute("aria-hidden", "false");

    currentMemory = 0;
    showFinale(false);
    showMemory(0, false);
  } catch (error) {
    console.error("Could not open shared memories:", error);
  }
}

// Start the falling white petals when the page is ready
startFloating();

// Check for a share link as soon as the page loads
openSharedLinkIfPresent();

/* =========================================
   Page 5 — Make a wish (cake + candles)
   ========================================= */

const SPARKLE_COLORS = ["#ffffff", "#f3e9ff", "#d4c4f0", "#c9b6e8", "#b8a0e0", "#fff6c8"];

/**
 * Creates a burst of cute sparkle confetti
 */
function burstSparkles() {
  wishConfetti.innerHTML = "";

  for (let i = 0; i < 48; i++) {
    const bit = document.createElement("span");
    bit.classList.add("sparkle-bit");

    const size = 5 + Math.random() * 9;
    bit.style.width = size + "px";
    bit.style.height = size + "px";
    bit.style.left = Math.random() * 100 + "%";
    bit.style.background = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
    bit.style.animationDuration = 1.4 + Math.random() * 1.6 + "s";
    bit.style.animationDelay = Math.random() * 0.35 + "s";
    bit.style.boxShadow = "0 0 8px rgba(255, 255, 255, 0.7)";

    // Some bits are tiny diamond sparkles
    if (Math.random() > 0.55) {
      bit.style.borderRadius = "2px";
      bit.style.transform = "rotate(45deg)";
    }

    wishConfetti.appendChild(bit);
  }

  // Clean up after the animation
  setTimeout(function () {
    wishConfetti.innerHTML = "";
  }, 3200);
}

/**
 * Blow out candles → sparkles → wish sent message
 */
makeWishBtn.addEventListener("click", function () {
  // Softly blow out the candles
  cakeScene.classList.add("is-blown");
  makeWishBtn.classList.add("is-hidden");

  // Sparkle confetti after a tiny moment
  setTimeout(function () {
    burstSparkles();
  }, 350);

  // Then reveal the wish message
  setTimeout(function () {
    wishSent.hidden = false;
    wishSent.classList.remove("is-visible");
    setTimeout(function () {
      wishSent.classList.add("is-visible");
    }, 40);
  }, 1100);
});
