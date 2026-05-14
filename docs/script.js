// Fake loader + shake hook
const loader = document.getElementById("fakeLoader");
const loaderFill = document.getElementById("loaderFill");
const loaderPercent = document.getElementById("loaderPercent");

let p = 0;
let pendingShake = sessionStorage.getItem("memeShake") === "1";

const hideLoader = () => {
  loader.style.display = "none";
  if (pendingShake) {
    pendingShake = false;
    sessionStorage.removeItem("memeShake");
    shakeOnLoad();
  }
};

const timer = setInterval(() => {
  p += Math.floor(Math.random() * 12) + 4;
  if (p >= 100) p = 100;
  loaderFill.style.width = `${p}%`;
  loaderPercent.textContent = `${p}%`;

  if (p === 100) {
    clearInterval(timer);
    // Piccola pausa prima di nascondere il loader
    setTimeout(hideLoader, 300);
  }
}, 120);

const it = {
  title: "Che ti aspettavi, genio?",
  subtitle: "Nice try. Qui non c’è nulla da vedere.",
  memeText: "EHHH VOLEVI?",
  goBack: "Torna indietro",
  tryAgain: "Riprova",
};

const en = {
  title: "What were you expecting, genius?",
  subtitle: "Nice try. Nothing to see here.",
  memeText: "HEH... YOU WISH?",
  goBack: "Go Back",
  tryAgain: "Try again",
};

const isItalian = navigator.language?.toLowerCase().startsWith("it");
const t = isItalian ? it : en;

document.documentElement.lang = isItalian ? "it" : "en";
document.getElementById("title").textContent = t.title;
document.getElementById("subtitle").textContent = t.subtitle;
document.getElementById("memeText").textContent = t.memeText;
document.getElementById("goBackBtn").textContent = t.goBack;
document.getElementById("tryAgainBtn").textContent = t.tryAgain;

// --- Try again: reload -> then animate after loader ends
const tryAgainBtn = document.getElementById("tryAgainBtn");
tryAgainBtn.addEventListener("click", () => {
  sessionStorage.setItem("memeShake", "1");
  location.reload();
});

const shakeOnLoad = () => {
  const meme = document.querySelector(".meme");
  meme.animate(
    [
      { transform: "translateX(0px)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(0px)" },
    ],
    { duration: 240, iterations: 2 }
  );
};

if (sessionStorage.getItem("memeShake") === "1") {
  sessionStorage.removeItem("memeShake");
  window.addEventListener("load", () => {
    // aspetta che il fake loader sparisca
    setTimeout(shakeOnLoad, 500);
  });
}

// --- Go Back: first click arms “dodgy” mode, second click actually goes back
const goBackBtn = document.getElementById("goBackBtn");
let dodgyArmed = false;

const moveButton = () => {
  const padding = 20;
  const btnRect = goBackBtn.getBoundingClientRect();
  const maxX = window.innerWidth - btnRect.width - padding;
  const maxY = window.innerHeight - btnRect.height - padding;

  const x = Math.max(padding, Math.floor(Math.random() * maxX));
  const y = Math.max(padding, Math.floor(Math.random() * maxY));

  goBackBtn.style.left = `${x}px`;
  goBackBtn.style.top = `${y}px`;
};

goBackBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!dodgyArmed) {
    dodgyArmed = true;
    goBackBtn.classList.add("dodgy");

    // unlock the button
    const rect = goBackBtn.getBoundingClientRect();
    goBackBtn.style.position = "fixed";
    goBackBtn.style.left = `${rect.left}px`;
    goBackBtn.style.top = `${rect.top}px`;
    goBackBtn.style.zIndex = "9999";

    setTimeout(moveButton, 50);
    return;
  }

  history.back();
});

// Desktop:
goBackBtn.addEventListener("mouseenter", () => {
  if (dodgyArmed) moveButton();
});

// Mobile:
goBackBtn.addEventListener(
  "touchstart",
  (e) => {
    if (dodgyArmed) {
      e.preventDefault();
      moveButton();
    }
  },
  { passive: false }
);
