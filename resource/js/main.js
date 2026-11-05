// ---------- AOS ----------
AOS.init({ duration: 800, once: true, offset: 50 });

// ---------- Scroll progress bar & Scroll hint fade ----------
window.addEventListener("scroll", () => {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const scrollH =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  // Progress bar logic
  if (scrollH > 0) {
    const progress = (scrollTop / scrollH) * 100;
    document.getElementById("progress-bar").style.width = progress + "%";
  }

  // Sembunyikan scroll hint setelah user scroll ke bawah sedikit
  const scrollHint = document.getElementById("scroll-hint");
  if (scrollHint && scrollTop > 100) {
    scrollHint.style.opacity = "0";
  }
});

// ---------- Floating petals ----------
(function createPetals() {
  const container = document.getElementById("petals-container");
  if (!container) return; // Guard clause

  const colors = ["#c4cba5", "#dde1ca", "#d4b07e", "#b3bda0"];
  for (let i = 0; i < 12; i++) {
    const petal = document.createElement("div");
    petal.classList.add("petal");

    // CSS Inline properties
    petal.style.left = Math.random() * 100 + "%";
    petal.style.animationDelay = Math.random() * 10 + "s";
    petal.style.animationDuration = 8 + Math.random() * 12 + "s";
    petal.style.opacity = (0.15 + Math.random() * 0.25).toString();

    const size = 8 + Math.random() * 8 + "px";
    petal.style.width = size;
    petal.style.height = size;
    petal.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(petal);
  }
})();

// ---------- Countdown ----------
(function countdown() {
  // Pastikan elemennya ada sebelum menjalankan setInterval
  const daysEl = document.getElementById("cd-days");
  if (!daysEl) return;

  const weddingDate = new Date("2026-02-14T08:00:00+07:00").getTime();

  function update() {
    const now = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById("cd-days").textContent = "00";
      document.getElementById("cd-hours").textContent = "00";
      document.getElementById("cd-mins").textContent = "00";
      document.getElementById("cd-secs").textContent = "00";
      return; // Berhenti update jika sudah lewat
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    // Formatting 2 digit
    document.getElementById("cd-days").textContent = d < 10 ? "0" + d : d;
    document.getElementById("cd-hours").textContent = h < 10 ? "0" + h : h;
    document.getElementById("cd-mins").textContent = m < 10 ? "0" + m : m;
    document.getElementById("cd-secs").textContent = s < 10 ? "0" + s : s;
  }

  update();
  setInterval(update, 1000);
})();

// ---------- Music toggle ----------
let isPlaying = false;
function toggleMusic() {
  const audio = document.getElementById("bg-music");
  const btn = document.getElementById("music-toggle");

  if (!audio) return;

  if (isPlaying) {
    audio.pause();
    btn.classList.remove("playing");
    btn.classList.add("paused"); // Opsional untuk style tombol saat di-pause
  } else {
    // Menangkap error jika browser memblokir autoplay
    audio
      .play()
      .then(() => {
        btn.classList.add("playing");
        btn.classList.remove("paused");
      })
      .catch((error) => {
        console.warn(
          "Autoplay dicegah oleh browser. Interaksi user diperlukan.",
          error,
        );
      });
  }
  isPlaying = !isPlaying;
}

// ---------- Open Invitation ----------
function openInvitation() {
  const content = document.getElementById("invitation-content");
  const cover = document.getElementById("cover");
  const musicBtn = document.getElementById("music-toggle");

  content.classList.remove("hidden");

  // Smooth scroll ke bawah, menghindari "cover"
  setTimeout(() => {
    content.scrollIntoView({ behavior: "smooth" });
  }, 100);

  // Show scroll hint
  const scrollHint = document.getElementById("scroll-hint");
  if (scrollHint) scrollHint.style.opacity = "1";

  // Tampilkan tombol musik yang mengambang
  if (musicBtn) {
    musicBtn.classList.add("visible");
  }

  // Putar musik (karena dipicu klik, aman dari blokir browser)
  if (!isPlaying) {
    toggleMusic();
  }
}

// ---------- Copy to clipboard ----------
function copyToClipboard(elementId, btn) {
  const textEl = document.getElementById(elementId);
  if (!textEl) return;

  const text = textEl.textContent.replace(/\s/g, "");

  navigator.clipboard
    .writeText(text)
    .then(() => {
      const original = btn.innerHTML;
      // Ganti dengan ikon centang
      btn.innerHTML =
        '<svg class="w-5 h-5 text-olive-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>';

      setTimeout(() => {
        btn.innerHTML = original;
      }, 2000);
    })
    .catch((err) => {
      console.error("Gagal menyalin:", err);
    });
}

// ---------- RSVP Form Submit ke Google Sheets ----------
const rsvpForm = document.getElementById("rsvp-form");

// GANTI URL DI BAWAH INI DENGAN WEB APP URL DARI GOOGLE APPS SCRIPT ANDA
const scriptURL =
  "https://script.google.com/macros/s/AKfycbyNwtmqA96AlStKjII9EIof3vQYUr7NjpmYcI6owbzQwd7H67Rb6uKkJpzyQb9Owm7WVA/exec";

if (rsvpForm) {
  rsvpForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Ubah tombol menjadi status loading agar user tidak klik 2x
    const submitBtn = rsvpForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = "Mengirim...";
    submitBtn.disabled = true;

    // Ambil data dari form
    const formData = new FormData(this);

    // Tampilkan ke Guestbook Frontend secara instan (Optimistic UI)
    const name = formData.get("name");
    const attendance = formData.get("attendance");
    const message = formData.get("message");
    const guestbook = document.getElementById("guestbook");

    if (guestbook) {
      const initial = name.charAt(0).toUpperCase();
      const badge = attendance === "hadir" ? "✅ Hadir" : "❌ Tidak Hadir";
      const wishHTML = `
          <div class="p-4 rounded-xl bg-white border border-sage-100 shadow-sm transition-all duration-500 ease-in-out animate-pulse">
            <div class="flex items-center gap-2 mb-1.5">
              <div class="w-7 h-7 rounded-full bg-olive-100 flex items-center justify-center text-xs font-bold text-olive-600">${initial}</div>
              <span class="text-sm font-medium text-sage-700">${name}</span>
              <span class="text-[10px] text-sage-400 ml-auto">${badge}</span>
            </div>
            <p class="text-xs text-sage-500 leading-relaxed">${message || "-"}</p>
          </div>`;
      guestbook.insertAdjacentHTML("afterbegin", wishHTML);
    }

    // Kirim data ke Google Sheets via Fetch API
    fetch(scriptURL, { method: "POST", body: formData })
      .then((response) => {
        // Tampilkan notifikasi sukses
        const successMsg = document.getElementById("rsvp-success");
        if (successMsg) {
          successMsg.classList.remove("hidden");
          setTimeout(() => {
            successMsg.classList.add("hidden");
          }, 4000);
        }

        // Hapus class animate-pulse dari elemen yang baru ditambah (tanda sudah masuk server)
        if (guestbook && guestbook.firstElementChild) {
          guestbook.firstElementChild.classList.remove("animate-pulse");
        }

        // Reset form dan kembalikan tombol
        rsvpForm.reset();
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      })
      .catch((error) => {
        console.error("Error!", error.message);
        alert(
          "Maaf, terjadi kesalahan saat mengirim ucapan. Silakan coba lagi.",
        );
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      });
  });
}

// ---------- Fungsi Mengambil & Menampilkan Guestbook dari Google Sheets ----------
function loadGuestbook() {
  const guestbook = document.getElementById("guestbook");
  if (!guestbook) return;

  // Tampilkan efek loading sementara
  guestbook.innerHTML = `
    <div class="flex justify-center items-center py-6">
      <svg class="animate-spin h-6 w-6 text-olive-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-2 text-xs text-sage-500">Memuat ucapan tamu...</span>
    </div>`;

  // Ganti scriptURL di bawah ini dengan URL Web App Google Script Anda
  // (Pastikan menggunakan variabel scriptURL yang sama dengan fungsi POST sebelumnya)
  const scriptURL = "https://script.google.com/macros/s/AKfycbyNwtmqA96AlStKjII9EIof3vQYUr7NjpmYcI6owbzQwd7H67Rb6uKkJpzyQb9Owm7WVA/exec";

  fetch(scriptURL, { method: "GET" })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.result === "success") {
        const data = responseJson.data;
        guestbook.innerHTML = ""; // Hapus teks loading

        // Jika data kosong
        if (data.length === 0) {
          guestbook.innerHTML =
            '<p class="text-center text-xs text-sage-400 py-6">Belum ada ucapan. Jadilah yang pertama!</p>';
          return;
        }

        // Render setiap ucapan (looping)
        data.forEach((item) => {
          if (!item.name) return; // Abaikan baris kosong

          const initial = item.name.charAt(0).toUpperCase();
          const badge =
            item.attendance === "hadir" ? "✅ Hadir" : "❌ Tidak Hadir";
          const message = item.message ? item.message : "-";

          const wishHTML = `
            <div class="p-4 rounded-xl bg-white border border-sage-100 shadow-sm mb-3">
              <div class="flex items-center gap-2 mb-1.5">
                <div class="w-7 h-7 rounded-full bg-olive-100 flex items-center justify-center text-xs font-bold text-olive-600">${initial}</div>
                <span class="text-sm font-medium text-sage-700">${item.name}</span>
                <span class="text-[10px] text-sage-400 ml-auto">${badge}</span>
              </div>
              <p class="text-xs text-sage-500 leading-relaxed">${message}</p>
            </div>`;

          // Masukkan ke paling akhir karena array sudah di-reverse (terbaru di atas)
          guestbook.insertAdjacentHTML("beforeend", wishHTML);
        });
      }
    })
    .catch((error) => {
      console.error("Gagal mengambil data:", error);
      guestbook.innerHTML =
        '<p class="text-center text-xs text-red-400 py-4">Gagal memuat ucapan tamu. Periksa koneksi internet.</p>';
    });
}

// Panggil fungsi ini tepat setelah dokumen selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  loadGuestbook();
});

// ---------- Guest name from URL param ----------
(function setGuestName() {
  const params = new URLSearchParams(window.location.search);
  const guest = params.get("to") || params.get("tamu");
  if (guest) {
    const guestEl = document.getElementById("guest-name");
    if (guestEl) {
      guestEl.textContent = decodeURIComponent(guest);
    }
  }
})();
