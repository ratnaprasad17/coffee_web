const menuItems = [
  ["Espresso", "hot", "images/espresso.jpg"],
  ["Flat White", "hot", "images/flat-white.jpg"],
  ["Iced Latte", "cold", "images/iced-latte.jpg"],
  ["Cappuccino", "hot", "images/cappuccino.jpg"],
  ["Iced Flat White", "cold", "images/iced-flat-white.jpg"],
  ["Chai Latte", "hot", "images/chai-latte.jpg"],
  ["Croissant", "pastry", "images/croissant.jpg"],
  ["Chocolate Chip Cookie", "pastry", "images/cookie.jpg"]
];

const grid = document.getElementById("grid");
const tabs = document.querySelectorAll(".tabs button");

grid.innerHTML = menuItems.map(([name, category, image]) =>
  `<article class="item" data-c="${category}"><div class="ph"><img src="${image}" alt="${name}" onerror="this.remove()"><div class="name">${name}</div></div></article>`
).join("");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((button) => {
      button.setAttribute("aria-selected", button === tab);
    });

    grid.querySelectorAll(".item").forEach((item) => {
      item.hidden = tab.dataset.f !== "all" && item.dataset.c !== tab.dataset.f;
    });
  });
});

document.querySelectorAll(".pill, .tabs button, .menu-btn, .drawer, .drawer a, .item .name").forEach((control) => {
  const target = { x: 0, y: 0, active: false };
  const current = { x: 0, y: 0, frame: 0 };

  control.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;

    const bounds = control.getBoundingClientRect();
    target.x = event.clientX - bounds.left;
    target.y = event.clientY - bounds.top;
    target.active = true;

    if (!current.frame) {
      current.frame = window.requestAnimationFrame(function followPointer() {
        current.x += (target.x - current.x) * 0.2;
        current.y += (target.y - current.y) * 0.2;

        const x = current.x;
        const y = current.y;
        const tiltStrength = control.matches(".item .name") ? 3 : control.matches(".drawer, .drawer a") ? 0 : 8;
        const tiltX = ((x / bounds.width) - 0.5) * tiltStrength;
        const tiltY = ((0.5 - y / bounds.height) * tiltStrength);

        control.style.setProperty("--glass-x", `${x}px`);
        control.style.setProperty("--glass-y", `${y}px`);
        control.style.setProperty("--halo-x", `${x + 5}px`);
        control.style.setProperty("--halo-y", `${y + 5}px`);
        control.style.setProperty("--tilt-x", `${tiltX}deg`);
        control.style.setProperty("--tilt-y", `${tiltY}deg`);

        if (Math.abs(target.x - current.x) > 0.2 || Math.abs(target.y - current.y) > 0.2) {
          current.frame = window.requestAnimationFrame(followPointer);
        } else {
          current.frame = 0;
        }
      });
    }
  });

  control.addEventListener("pointerleave", () => {
    target.active = false;
    target.x = control.clientWidth / 2;
    target.y = control.clientHeight / 2;

    if (!current.frame) {
      current.frame = window.requestAnimationFrame(function settleToCenter() {
        current.x += (target.x - current.x) * 0.2;
        current.y += (target.y - current.y) * 0.2;
        control.style.setProperty("--glass-x", `${current.x}px`);
        control.style.setProperty("--glass-y", `${current.y}px`);
        control.style.setProperty("--halo-x", `${current.x + 5}px`);
        control.style.setProperty("--halo-y", `${current.y + 5}px`);

        if (Math.abs(target.x - current.x) > 0.2 || Math.abs(target.y - current.y) > 0.2) {
          current.frame = window.requestAnimationFrame(settleToCenter);
        } else {
          current.frame = 0;
        }
      });
    }
  });
});

const menuButton = document.getElementById("menuBtn");
const drawer = document.getElementById("drawer");

menuButton.addEventListener("click", () => {
  const isOpen = drawer.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen);
});

drawer.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    drawer.classList.remove("open");
    menuButton.setAttribute("aria-expanded", false);
  }
});

const trailImages = [
  "images/storefront.jpg",
  "images/espresso.jpg",
  "images/flat-white.jpg",
  "images/iced-latte.jpg",
  "images/cappuccino.jpg",
  "images/iced-flat-white.jpg",
  "images/chai-latte.jpg",
  "images/croissant.jpg",
  "images/cookie.jpg",
  "images/trail-1.jpg",
  "images/trail-2.jpg",
  "images/events.jpg",
  "images/catering.jpg",
  "images/custom-menu.jpg"
];
const mood = document.getElementById("mood");
const trail = document.getElementById("trail");
let lastPosition = { x: -999, y: -999 };
let trailIndex = 0;

mood.addEventListener("mousemove", (event) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const bounds = mood.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;
  if (Math.hypot(x - lastPosition.x, y - lastPosition.y) < 90) return;

  lastPosition = { x, y };

  const card = document.createElement("div");
  card.style.left = `${x}px`;
  card.style.top = `${y}px`;

  const image = new Image();
  image.alt = "";
  image.src = trailImages[trailIndex++ % trailImages.length];
  image.onerror = () => image.remove();
  card.appendChild(image);
  trail.appendChild(card);
  window.setTimeout(() => card.remove(), 1700);
});

const blurObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      blurObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll(".blur").forEach((element) => {
  blurObserver.observe(element);
});

document.getElementById("yr").textContent = new Date().getFullYear();