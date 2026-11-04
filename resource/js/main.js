// ---------- AOS ----------
AOS.init({ duration: 800, once: true, offset: 50 });

// ---------- Scroll progress bar ----------
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollH =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const progress = (scrollTop / scrollH) * 100;
  document.getElementById("progress-bar").style.width = progress + "%";
});

// ---------- Floating petals ----------
(function createPetals() {
  const container = document.getElementById("petals-container");
  const colors = ["#c4cba5", "#dde1ca", "#d4b07e", "#b3bda0"];
  for (let i = 0; i < 12; i++) {
    const petal = document.createElement("div");
    petal.classList.add("petal");
    petal.style.left = Math.random() * 100 + "%";
    petal.style.animationDelay = Math.random() * 10 + "s";
    petal.style.animationDuration = 8 + Math.random() * 12 + "s";
    petal.style.opacity = 0.15 + Math.random() * 0.25;
    petal.style.width = 8 + Math.random() * 8 + "px";
    petal.style.height = petal.style.width;
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(petal);
  }
})();

// ---------- Countdown ----------
(function countdown() {
  const weddingDate = new Date("2045-02-14T08:00:00+07:00").getTime();
  function update() {
    const now = Date.now();
    const diff = weddingDate - now;
    if (diff <= 0) {
      document.getElementById("cd-days").textContent = "0";
      document.getElementById("cd-hours").textContent = "0";
      document.getElementById("cd-mins").textContent = "0";
      document.getElementById("cd-secs").textContent = "0";
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById("cd-days").textContent = d;
    document.getElementById("cd-hours").textContent = h;
    document.getElementById("cd-mins").textContent = m;
    document.getElementById("cd-secs").textContent = s;
  }
  update();
  setInterval(update, 1000);
})();

// ---------- Open Invitation ----------
function openInvitation() {
  const content = document.getElementById("invitation-content");
  const cover = document.getElementById("cover");
  content.classList.remove("hidden");
  // Smooth scroll down
  setTimeout(() => {
    cover.nextElementSibling.scrollIntoView({ behavior: "smooth" });
  }, 100);
  // Show scroll hint
  document.getElementById("scroll-hint").style.opacity = "1";
  // Auto-play music if available
  toggleMusic();
}

// ---------- Music toggle ----------
let isPlaying = false;
function toggleMusic() {
  const audio = document.getElementById("bg-music");
  const btn = document.getElementById("music-toggle");
  if (isPlaying) {
    audio.pause();
    btn.classList.remove("playing");
  } else {
    audio.play().catch(() => {});
    btn.classList.add("/");
  }
  isPlaying = !isPlaying;
}

// ---------- Copy to clipboard ----------
function copyToClipboard(elementId, btn) {
  const text = document
    .getElementById(elementId)
    .textContent.replace(/\s/g, "");
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML =
      '<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>';
    setTimeout(() => {
      btn.innerHTML = original;
    }, 2000);
  });
}

// ---------- RSVP Form Submit (front-end only) ----------
document.getElementById("rsvp-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = {
    name: formData.get("name"),
    attendance: formData.get("attendance"),
    message: formData.get("message"),
  };

  // === INTEGRASI WORDPRESS / API ===
  // Ganti console.log berikut dengan fetch() ke endpoint WordPress REST API atau WA API
  console.log("RSVP Data:", data);

  // Contoh kirim ke WordPress REST API:
  // fetch('/wp-json/undangan/v1/rsvp', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // }).then(res => res.json()).then(result => { ... });

  // Contoh kirim ke WhatsApp API (Fonnte / Wablas):
  // fetch('https://api.fonnte.com/send', {
  //   method: 'POST',
  //   headers: { 'Authorization': 'TOKEN_ANDA' },
  //   body: JSON.stringify({
  //     target: '628xxxxxxxxxx',
  //     message: `RSVP Baru!\nNama: ${data.name}\nKehadiran: ${data.attendance}\nUcapan: ${data.message}`
  //   }),
  // });

  // Tambahkan ucapan ke guestbook (front-end demo)
  const guestbook = document.getElementById("guestbook");
  const initial = data.name.charAt(0).toUpperCase();
  const badge = data.attendance === "hadir" ? "✅ Hadir" : "❌ Tidak Hadir";
  const wishHTML = `
      <div class="p-4 rounded-xl bg-white border border-sage-100 shadow-sm">
        <div class="flex items-center gap-2 mb-1.5">
          <div class="w-7 h-7 rounded-full bg-olive-100 flex items-center justify-center text-xs font-bold text-olive-600">${initial}</div>
          <span class="text-sm font-medium text-sage-700">${data.name}</span>
          <span class="text-[10px] text-sage-400 ml-auto">${badge}</span>
        </div>
        <p class="text-xs text-sage-500 leading-relaxed">${data.message || "-"}</p>
      </div>`;
  guestbook.insertAdjacentHTML("afterbegin", wishHTML);

  // Show success & reset
  document.getElementById("rsvp-success").classList.remove("hidden");
  this.reset();
  setTimeout(() => {
    document.getElementById("rsvp-success").classList.add("hidden");
  }, 4000);
});

// ---------- Guest name from URL param ----------
(function setGuestName() {
  const params = new URLSearchParams(window.location.search);
  const guest = params.get("to") || params.get("tamu");
  if (guest) {
    document.getElementById("guest-name").textContent =
      decodeURIComponent(guest);
  }
})();
