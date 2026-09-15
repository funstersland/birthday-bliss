/* =========================================
   Birthday Bliss — Welcome Screen Script
   White cherry blossom petals falling gently
   ========================================= */

// White, lavender, and purple shades (no pink)
const PETAL_COLORS = [
  "linear-gradient(145deg, #fffdf8, #f4ead8)",
  "linear-gradient(145deg, #f6d6d4, #e8c4c0)",
  "linear-gradient(145deg, #e8eadc, #c5cbb0)",
  "linear-gradient(145deg, #f4ead8, #d4a0a0)",
  "linear-gradient(145deg, #d5dcc4, #8f9a78)"
];

const floatLayer = document.getElementById("float-layer");

/**
 * Picks a flower color — extra purple
 */
function randomBlossomColor() {
  const roll = Math.random();
  if (roll < 0.4) {
    return "blossom-lavender"; // dusty rose
  }
  if (roll < 0.75) {
    return "blossom-purple"; // sage
  }
  return "blossom-white"; // cream
}

/**
 * Builds a cute 5-petal cherry blossom inside a floater
 */
function addBlossomPetals(floater) {
  for (let i = 0; i < 5; i++) {
    const petal = document.createElement("span");
    petal.classList.add("blossom-petal");
    petal.style.transform = "rotate(" + i * 72 + "deg)";
    floater.appendChild(petal);
  }

  const center = document.createElement("span");
  center.classList.add("blossom-center");
  floater.appendChild(center);
}

function randomBlossomSize() {
  const roll = Math.random();

  if (roll < 0.72) {
    return 5 + Math.random() * 7; // lots of small purple-friendly sizes
  }
  if (roll < 0.88) {
    return 16 + Math.random() * 12; // medium
  }
  return 30 + Math.random() * 18; // a few big ones
}

/**
 * Creates one falling cherry blossom (or a single petal)
 * and removes it after the animation ends
 */
function createFloater() {
  // Don't let too many pile up (keeps the page smooth)
  if (floatLayer.childElementCount > 90) {
    return;
  }

  const floater = document.createElement("span");
  floater.classList.add("floater");

  // Almost everything is a flower now
  const makeFlower = Math.random() < 0.88;

  if (makeFlower) {
    // Extra small purple blossoms mixed through the sky
    const forceSmallPurple = Math.random() < 0.5;
    const colorClass = forceSmallPurple ? "blossom-purple" : randomBlossomColor();
    floater.classList.add("blossom", colorClass);

    const size = forceSmallPurple ? 5 + Math.random() * 8 : randomBlossomSize();
    floater.style.width = size + "px";
    floater.style.height = size + "px";

    // Tiny flowers look farther away; big ones feel closer
    if (size < 14) {
      floater.style.opacity = 0.4 + Math.random() * 0.25;
      floater.style.filter = "blur(0.4px)";
    } else if (size > 32) {
      floater.style.opacity = 0.78 + Math.random() * 0.18;
    } else {
      floater.style.opacity = 0.6 + Math.random() * 0.3;
    }

    addBlossomPetals(floater);

    // Big flowers drift slower, like a soft breeze
    const duration = size > 28 ? 16 + Math.random() * 8 : 9 + Math.random() * 8;
    floater.style.animationDuration = duration + "s";
    floater.style.animationDelay = Math.random() * 2 + "s";
    floater.style.left = Math.random() * 100 + "%";
    floater.style.marginLeft = (Math.random() * 40 - 20) + "px";

    floatLayer.appendChild(floater);
    setTimeout(function () {
      floater.remove();
    }, (duration + 2.2) * 1000);
    return;
  }

  // A few single petals mixed in
  if (Math.random() < 0.5) {
    floater.classList.add("petal-small");
    const width = 5 + Math.random() * 6;
    floater.style.width = width + "px";
    floater.style.height = width * (1.1 + Math.random() * 0.3) + "px";
  } else {
    floater.classList.add("petal");
    const width = 9 + Math.random() * 10;
    floater.style.width = width + "px";
    floater.style.height = width * (1.15 + Math.random() * 0.25) + "px";
  }

  floater.style.background = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
  floater.style.left = Math.random() * 100 + "%";
  const duration = 10 + Math.random() * 8;
  floater.style.animationDuration = duration + "s";
  floater.style.animationDelay = Math.random() * 1.4 + "s";
  floater.style.marginLeft = (Math.random() * 28 - 14) + "px";

  floatLayer.appendChild(floater);
  setTimeout(function () {
    floater.remove();
  }, (duration + 1.5) * 1000);
}

/**
 * Fills the sky with blossoms, then keeps adding more
 */
function startFloating() {
  const isMobile = window.innerWidth < 480;

  // A full burst so the screen feels dreamy right away
  const startCount = isMobile ? 18 : 28;
  for (let i = 0; i < startCount; i++) {
    setTimeout(createFloater, i * 120);
  }

  // Keep adding 1–3 flowers at a time
  const interval = isMobile ? 520 : 380;
  setInterval(function () {
    const extra = isMobile ? 2 : 2 + Math.floor(Math.random() * 3);
    for (let n = 0; n < extra; n++) {
      createFloater();
    }
  }, interval);
}

// Find the buttons and screens
const surpriseBtn = document.getElementById("surprise-btn");

/**
 * Keep older saved lines working after the shared editor was added.
 */
const EDIT_KEY_ALIASES = {
  "welcome-subtitle": "birthdayBlissWelcomeSubtitle",
  "birthday-heading": "birthdayBlissBirthdayHeading"
};

function storageKeyForEdit(editKey) {
  return EDIT_KEY_ALIASES[editKey] || "birthdayBliss:" + editKey;
}

function styleStorageKey(el) {
  const editKey = el.getAttribute("data-edit-key");
  const screen = el.closest(".screen");
  const screenId = screen ? screen.id : "page";
  return "birthdayBliss:lineStyle:" + editKey + ":" + screenId;
}

/**
 * Every data-edit-key line: click to edit, resize, and drag to move.
 * Toolbar only appears after you click a line.
 */
function setupEditableLines() {
  const MIN = 1;
  const MAX = 5;
  const SIZE_SCALE = [0.72, 0.86, 1, 1.18, 1.38];
  const WIDTH_CH = [12, 16, 22, 28, 40];

  const toolbar = document.createElement("div");
  toolbar.id = "line-editor";
  toolbar.className = "line-editor";
  toolbar.hidden = true;
  toolbar.setAttribute("role", "toolbar");
  toolbar.setAttribute("aria-label", "Edit this line");
  toolbar.innerHTML =
    '<button type="button" class="line-tool line-tool-move" data-tool="move" title="Drag to move">⠿</button>' +
    '<button type="button" class="line-tool" data-tool="smaller" title="Smaller">A−</button>' +
    '<button type="button" class="line-tool" data-tool="larger" title="Larger">A+</button>' +
    '<button type="button" class="line-tool" data-tool="narrower" title="Shorter">←</button>' +
    '<button type="button" class="line-tool" data-tool="wider" title="Longer">→</button>' +
    '<button type="button" class="line-tool" data-tool="wrap1" title="One line">1</button>' +
    '<button type="button" class="line-tool" data-tool="wrap2" title="Two lines">2</button>' +
    '<button type="button" class="line-tool" data-tool="done" title="Done">✓</button>';
  document.body.appendChild(toolbar);

  let selected = null;
  let styleState = null;
  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let originX = 0;
  let originY = 0;

  function defaultStyle() {
    return { size: 3, width: 3, wrap: 2, x: 0, y: 0 };
  }

  function loadStyle(el) {
    const raw = localStorage.getItem(styleStorageKey(el));
    if (!raw) {
      return defaultStyle();
    }
    try {
      return Object.assign(defaultStyle(), JSON.parse(raw));
    } catch (error) {
      return defaultStyle();
    }
  }

  function saveStyle(el, data) {
    localStorage.setItem(styleStorageKey(el), JSON.stringify(data));
  }

  function ensureBaseSize(el) {
    if (!el.dataset.baseFontSize) {
      el.dataset.baseFontSize = String(parseFloat(window.getComputedStyle(el).fontSize) || 16);
    }
    return Number(el.dataset.baseFontSize);
  }

  function applyStyle(el, data) {
    const base = ensureBaseSize(el);
    el.style.fontSize = base * SIZE_SCALE[data.size - 1] + "px";
    el.style.maxWidth = WIDTH_CH[data.width - 1] + "ch";
    el.style.whiteSpace = data.wrap === 1 ? "nowrap" : "pre-line";
    el.style.transform = "translate(" + data.x + "px, " + data.y + "px)";
    el.style.position = "relative";
    if (data.x || data.y) {
      el.style.zIndex = "12";
    }
  }

  function splitIntoTwoLines(text) {
    const clean = text.replace(/\s*\n\s*/g, " ").trim();
    if (!clean) {
      return clean;
    }
    const mid = Math.floor(clean.length / 2);
    let breakAt = clean.lastIndexOf(" ", mid);
    if (breakAt < 4) {
      breakAt = clean.indexOf(" ", mid);
    }
    if (breakAt < 0) {
      return clean;
    }
    return clean.slice(0, breakAt).trim() + "\n" + clean.slice(breakAt + 1).trim();
  }

  function saveText(el) {
    const storageKey = storageKeyForEdit(el.getAttribute("data-edit-key"));
    const text = el.innerText.trim();
    if (text) {
      localStorage.setItem(storageKey, text);
    }
    if (el.getAttribute("data-edit-key") === "brand") {
      document.querySelectorAll('[data-edit-key="brand"]').forEach(function (banner) {
        if (banner !== el) {
          banner.textContent = text || banner.textContent;
        }
      });
    }
  }

  function placeToolbar(el) {
    const rect = el.getBoundingClientRect();
    toolbar.hidden = false;
    const barWidth = toolbar.offsetWidth || 280;
    const barHeight = toolbar.offsetHeight || 44;
    let left = rect.left + rect.width / 2 - barWidth / 2;
    let top = rect.top - barHeight - 10;
    if (top < 8) {
      top = rect.bottom + 10;
    }
    left = Math.max(8, Math.min(left, window.innerWidth - barWidth - 8));
    toolbar.style.left = left + "px";
    toolbar.style.top = top + "px";
  }

  function markWrapButtons() {
    if (!styleState) {
      return;
    }
    toolbar.querySelectorAll(".line-tool").forEach(function (btn) {
      const tool = btn.getAttribute("data-tool");
      const on =
        (tool === "wrap1" && styleState.wrap === 1) ||
        (tool === "wrap2" && styleState.wrap === 2);
      btn.classList.toggle("is-active", on);
    });
  }

  function selectLine(el) {
    if (selected && selected !== el) {
      selected.classList.remove("is-line-selected");
      saveText(selected);
    }
    selected = el;
    styleState = loadStyle(el);
    // Don't reshape a line until the visitor has saved edits for it
    if (localStorage.getItem(styleStorageKey(el))) {
      applyStyle(el, styleState);
    }
    el.classList.add("is-line-selected");
    placeToolbar(el);
    markWrapButtons();
  }

  function clearSelection() {
    if (selected) {
      saveText(selected);
      selected.classList.remove("is-line-selected");
    }
    selected = null;
    styleState = null;
    toolbar.hidden = true;
  }

  function pointerPos(event) {
    if (event.touches && event.touches[0]) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    if (event.changedTouches && event.changedTouches[0]) {
      return {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY
      };
    }
    return { x: event.clientX, y: event.clientY };
  }

  function onDragMove(event) {
    if (!dragging || !selected || !styleState) {
      return;
    }
    event.preventDefault();
    const pos = pointerPos(event);
    styleState.x = originX + (pos.x - dragStartX);
    styleState.y = originY + (pos.y - dragStartY);
    applyStyle(selected, styleState);
    placeToolbar(selected);
  }

  function onDragEnd() {
    if (!dragging || !selected || !styleState) {
      dragging = false;
      return;
    }
    dragging = false;
    selected.classList.remove("is-line-dragging");
    saveStyle(selected, styleState);
    placeToolbar(selected);
    window.removeEventListener("pointermove", onDragMove);
    window.removeEventListener("pointerup", onDragEnd);
    window.removeEventListener("touchmove", onDragMove);
    window.removeEventListener("touchend", onDragEnd);
  }

  function startDrag(event) {
    if (!selected || !styleState) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    dragging = true;
    selected.classList.add("is-line-dragging");
    const pos = pointerPos(event);
    dragStartX = pos.x;
    dragStartY = pos.y;
    originX = styleState.x || 0;
    originY = styleState.y || 0;
    window.addEventListener("pointermove", onDragMove, { passive: false });
    window.addEventListener("pointerup", onDragEnd);
    window.addEventListener("touchmove", onDragMove, { passive: false });
    window.addEventListener("touchend", onDragEnd);
  }

  toolbar.querySelectorAll(".line-tool").forEach(function (btn) {
    const tool = btn.getAttribute("data-tool");
    if (tool === "move") {
      btn.addEventListener("pointerdown", startDrag);
      btn.addEventListener("touchstart", startDrag, { passive: false });
      return;
    }

    btn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (!selected || !styleState) {
        return;
      }

      if (tool === "smaller") {
        styleState.size = Math.max(MIN, styleState.size - 1);
      } else if (tool === "larger") {
        styleState.size = Math.min(MAX, styleState.size + 1);
      } else if (tool === "narrower") {
        styleState.width = Math.max(MIN, styleState.width - 1);
      } else if (tool === "wider") {
        styleState.width = Math.min(MAX, styleState.width + 1);
      } else if (tool === "wrap1") {
        styleState.wrap = 1;
        styleState.width = 5;
        selected.textContent = selected.innerText.replace(/\s*\n\s*/g, " ").trim();
        saveText(selected);
      } else if (tool === "wrap2") {
        styleState.wrap = 2;
        if (styleState.width > 4) {
          styleState.width = 4;
        }
        if (selected.innerText.indexOf("\n") === -1) {
          selected.textContent = splitIntoTwoLines(selected.innerText);
          saveText(selected);
        }
      } else if (tool === "done") {
        clearSelection();
        return;
      }

      applyStyle(selected, styleState);
      saveStyle(selected, styleState);
      markWrapButtons();
      placeToolbar(selected);
    });
  });

  document.querySelectorAll("[data-edit-key]").forEach(function (el) {
    const storageKey = storageKeyForEdit(el.getAttribute("data-edit-key"));
    const editKey = el.getAttribute("data-edit-key");
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      if (
        editKey === "reveal-subtitle" &&
        saved.indexOf("\n") === -1 &&
        saved.indexOf("celebrate you") !== -1
      ) {
        el.textContent =
          "Your special day is almost here..\nbut i couldn't wait to celebrate\u00A0you";
      } else if (
        (editKey === "welcome-headline" || editKey === "welcome-subtitle") &&
        (saved.indexOf("🥹") !== -1 ||
          saved.indexOf("🎀") !== -1 ||
          saved.indexOf("💌") !== -1 ||
          saved.indexOf("✨") !== -1)
      ) {
        localStorage.removeItem(storageKey);
      } else {
        el.textContent = saved;
      }
    }

    ensureBaseSize(el);
    // Only restore layout tweaks the visitor already saved
    if (localStorage.getItem(styleStorageKey(el))) {
      applyStyle(el, loadStyle(el));
    }

    el.setAttribute("contenteditable", "true");
    el.setAttribute("spellcheck", "false");

    el.addEventListener("click", function (event) {
      event.stopPropagation();
      selectLine(el);
    });

    el.addEventListener("focus", function () {
      selectLine(el);
    });

    el.addEventListener("blur", function () {
      saveText(el);
    });

    el.addEventListener("keydown", function (event) {
      const allowMultiline = el.getAttribute("data-multiline") === "true";
      if (event.key === "Enter" && !allowMultiline) {
        event.preventDefault();
        el.blur();
      }
      if (event.key === "Escape") {
        clearSelection();
        el.blur();
      }
    });
  });

  document.addEventListener("click", function (event) {
    if (toolbar.contains(event.target)) {
      return;
    }
    if (event.target.closest && event.target.closest("[data-edit-key]")) {
      return;
    }
    clearSelection();
  });

  window.addEventListener("resize", function () {
    if (selected) {
      placeToolbar(selected);
    }
  });
}

setupEditableLines();

const continueBtn = document.getElementById("continue-btn");
const memoriesBtn = document.getElementById("memories-btn");
const welcomeScreen = document.getElementById("welcome-screen");
const revealScreen = document.getElementById("reveal-screen");
const messageScreen = document.getElementById("message-screen");
const memoriesScreen = document.getElementById("memories-screen");
const wishScreen = document.getElementById("wish-screen");
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

  // Soft fade-in for the ornate birthday note
  const birthdayFrame = document.getElementById("birthday-frame");
  birthdayFrame.classList.remove("fade-in");
  setTimeout(function () {
    birthdayFrame.classList.add("fade-in");
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
  showFinale(false);
  refreshAllSlots();
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
   Page 4 — Scrapbook collage (4 photo frames)
   Tap a cream frame to add a picture.
   Use "Create link" in the corner to share.
   ========================================= */

const memories = [
  { file: "sunrise.jpg", uploadedSrc: null },
  { file: "adventure.jpg", uploadedSrc: null },
  { file: "laughs.jpg", uploadedSrc: null },
  { file: "golden-hour.jpg", uploadedSrc: null }
];

let currentMemory = 0;
let isSharedView = false;

const scrapbook = document.getElementById("polaroid-wrap");
const scrapSlots = document.querySelectorAll(".scrap-slot");
const nextMemoryBtn = document.getElementById("next-memory-btn");
const memoryFinale = document.getElementById("memory-finale");
const photoUploadInput = document.getElementById("photo-upload");
const createLinkBtn = document.getElementById("create-link-btn");
const shareStatus = document.getElementById("share-status");
const shareBox = document.getElementById("share-box");
const welcomeCreateLinkBtn = document.getElementById("welcome-create-link-btn");
const welcomeShareStatus = document.getElementById("welcome-share-status");

/**
 * Puts a photo into one collage frame
 */
function fillSlot(index) {
  const slot = scrapSlots[index];
  const img = slot.querySelector(".slot-photo");
  const memory = memories[index];
  const photoPath = memory.uploadedSrc || ("photos/" + memory.file);

  img.onload = function () {
    slot.classList.add("has-photo");
  };
  img.onerror = function () {
    slot.classList.remove("has-photo");
    img.removeAttribute("src");
  };
  img.src = photoPath;
}

function refreshAllSlots() {
  for (let i = 0; i < scrapSlots.length; i++) {
    fillSlot(i);
  }
}

function showFinale(showIt) {
  if (showIt) {
    scrapbook.classList.add("is-hidden");
    nextMemoryBtn.classList.add("is-hidden");
    memoryFinale.hidden = false;
    memoryFinale.classList.remove("is-visible");
    setTimeout(function () {
      memoryFinale.classList.add("is-visible");
    }, 40);
  } else {
    scrapbook.classList.remove("is-hidden");
    nextMemoryBtn.classList.remove("is-hidden");
    memoryFinale.hidden = true;
    memoryFinale.classList.remove("is-visible");
  }
}

scrapSlots.forEach(function (slot) {
  slot.addEventListener("click", function () {
    if (isSharedView) {
      return;
    }
    currentMemory = Number(slot.getAttribute("data-index"));
    photoUploadInput.click();
  });
});

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
  fillSlot(currentMemory);
  photoUploadInput.value = "";
});

nextMemoryBtn.addEventListener("click", function () {
  showFinale(true);
});

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

      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = function () {
      reject(new Error("Could not read a photo."));
    };
    img.src = src;
  });
}

/**
 * Builds a shareable link.
 * Shared opens always start on page 1.
 * If all 4 photos are ready, they are packed into the link for page 4.
 */
async function createShareLink(options) {
  const requirePhotos = options && options.requirePhotos;
  const btn = options && options.button;
  const statusEl = options && options.status;

  function setStatus(message) {
    if (statusEl) {
      statusEl.textContent = message;
    }
    if (shareStatus && statusEl !== shareStatus) {
      // keep page 4 status in sync when creating from page 1
    }
  }

  if (requirePhotos) {
    for (let i = 0; i < memories.length; i++) {
      if (!memories[i].uploadedSrc) {
        setStatus("Add all 4 pictures first.");
        return;
      }
    }
  }

  const allPhotosReady = memories.every(function (memory) {
    return !!memory.uploadedSrc;
  });

  if (btn) {
    btn.disabled = true;
    btn.textContent = "Creating link...";
  }

  if (allPhotosReady) {
    setStatus("Packing your photos into a link...");
  } else {
    setStatus("Creating your link...");
  }

  try {
    const baseUrl = window.location.href.split("#")[0];
    let link = baseUrl;

    if (allPhotosReady) {
      const photos = [];
      for (let i = 0; i < memories.length; i++) {
        const dataUrl = await compressImage(memories[i].uploadedSrc, 340, 0.52);
        photos.push(dataUrl);
      }
      const payload = encodeURIComponent(JSON.stringify({ v: 1, photos: photos }));
      link = baseUrl + "#share=" + payload;

      if (link.length > 1800000) {
        setStatus("Photos are too big. Try smaller pictures.");
        return;
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(link);
      setStatus(
        allPhotosReady
          ? "Link copied! Opens from page 1."
          : "Link copied! Send it to them."
      );
    } else {
      window.prompt("Copy this link:", link);
      setStatus("Link ready — paste and send it.");
    }
  } catch (error) {
    console.error(error);
    setStatus("Could not create the link. Try again.");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Create link";
    }
  }
}

if (createLinkBtn) {
  createLinkBtn.addEventListener("click", function () {
    createShareLink({
      requirePhotos: true,
      button: createLinkBtn,
      status: shareStatus
    });
  });
}

if (welcomeCreateLinkBtn) {
  welcomeCreateLinkBtn.addEventListener("click", function () {
    createShareLink({
      requirePhotos: false,
      button: welcomeCreateLinkBtn,
      status: welcomeShareStatus
    });
  });
}

/**
 * If this page was opened from a share link,
 * load the photos but always start on page 1.
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

    // Always begin on page 1 — later pages keep the packed photos
    welcomeScreen.classList.add("is-active");
    welcomeScreen.setAttribute("aria-hidden", "false");
    revealScreen.classList.remove("is-active");
    revealScreen.setAttribute("aria-hidden", "true");
    messageScreen.classList.remove("is-active");
    messageScreen.setAttribute("aria-hidden", "true");
    memoriesScreen.classList.remove("is-active");
    memoriesScreen.setAttribute("aria-hidden", "true");
    wishScreen.classList.remove("is-active");
    wishScreen.setAttribute("aria-hidden", "true");

    currentMemory = 0;
    showFinale(false);
    refreshAllSlots();
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

const SPARKLE_COLORS = ["#ffffff", "#f4ead8", "#e8c4c0", "#c5cbb0", "#8f9a78", "#fff6c8"];

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
