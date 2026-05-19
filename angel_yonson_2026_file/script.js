const birthday = new Date("2026-05-17T00:00:00+08:00");
const today = new Date();
const oneDay = 24 * 60 * 60 * 1000;
const dayDiff = Math.floor((birthday.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) / oneDay);
const birthdayStart = new Date("2026-05-17T00:00:00+08:00");

const dateLabel = document.getElementById("dateLabel");
const dayMessage = document.getElementById("dayMessage");
const countdownPanel = document.getElementById("countdownPanel");
const daysLeft = document.getElementById("daysLeft");
const hoursLeft = document.getElementById("hoursLeft");
const minutesLeft = document.getElementById("minutesLeft");
const secondsLeft = document.getElementById("secondsLeft");

if (dayDiff > 0) {
  dateLabel.textContent = `${dayDiff} day${dayDiff === 1 ? "" : "s"} to go`;
  dayMessage.textContent = "A little birthday surprise is ready for Sunday.";
} else if (dayDiff === 0) {
  dateLabel.textContent = "Today is your day";
  dayMessage.textContent = "Happy birthday, Angel. This whole page is for you.";
} else {
  dateLabel.textContent = "Birthday memory";
  dayMessage.textContent = "Keeping this birthday message close, even after the day has passed.";
}

const photos = Array.from({ length: 17 }, (_, index) => `photo (${index + 1}).jpg`);
const activePhoto = document.getElementById("activePhoto");
const caption = document.getElementById("caption");
const thumbGrid = document.getElementById("thumbGrid");
let activeIndex = 0;
let slideTimer;
let birthdaySongStarted = false;

function setPhoto(index) {
  activeIndex = (index + photos.length) % photos.length;
  activePhoto.classList.add("is-changing");

  window.setTimeout(() => {
    activePhoto.src = photos[activeIndex];
    caption.textContent = `Memory ${activeIndex + 1} of ${photos.length}`;
    activePhoto.classList.remove("is-changing");
  }, 180);

  document.querySelectorAll(".thumb-grid button").forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === activeIndex);
  });
}

function nextSlide() {
  setPhoto(activeIndex + 1);
}

function restartSlideshow() {
  window.clearInterval(slideTimer);
  slideTimer = window.setInterval(nextSlide, 3200);
}

function isBirthdayUnlocked() {
  const now = new Date();
  return now >= birthdayStart;
}

function updateCountdown() {
  const now = new Date();
  const remaining = Math.max(0, birthdayStart - now);
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysLeft.textContent = String(days).padStart(2, "0");
  hoursLeft.textContent = String(hours).padStart(2, "0");
  minutesLeft.textContent = String(minutes).padStart(2, "0");
  secondsLeft.textContent = String(seconds).padStart(2, "0");
}

function openMainPage() {
  document.getElementById("intro").classList.add("is-hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  playBirthdaySong();

  for (let i = 0; i < 34; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * 100}vw`;
    sparkle.style.top = `${70 + Math.random() * 25}vh`;
    sparkle.style.animationDelay = `${Math.random() * 450}ms`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 2200);
  }
}

function playBirthdaySong() {
  if (birthdaySongStarted) return;
  birthdaySongStarted = true;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const audio = new AudioContext();
  const master = audio.createGain();
  master.gain.value = 0.055;
  master.connect(audio.destination);

  const notes = [
    ["G4", 0.35], ["G4", 0.18], ["A4", 0.5], ["G4", 0.5], ["C5", 0.5], ["B4", 0.9],
    ["G4", 0.35], ["G4", 0.18], ["A4", 0.5], ["G4", 0.5], ["D5", 0.5], ["C5", 0.9],
    ["G4", 0.35], ["G4", 0.18], ["G5", 0.5], ["E5", 0.5], ["C5", 0.5], ["B4", 0.5], ["A4", 0.9],
    ["F5", 0.35], ["F5", 0.18], ["E5", 0.5], ["C5", 0.5], ["D5", 0.5], ["C5", 1.1]
  ];
  const frequencies = {
    G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33,
    E5: 659.25, F5: 698.46, G5: 783.99
  };

  let time = audio.currentTime + 0.08;
  notes.forEach(([note, duration]) => {
    const oscillator = audio.createOscillator();
    const envelope = audio.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = frequencies[note];
    oscillator.connect(envelope);
    envelope.connect(master);

    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(0.9, time + 0.025);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + duration);

    oscillator.start(time);
    oscillator.stop(time + duration + 0.03);
    time += duration + 0.06;
  });
}

photos.forEach((photo, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", `Show memory ${index + 1}`);

  const image = document.createElement("img");
  image.src = photo;
  image.alt = "";
  button.appendChild(image);

  button.addEventListener("click", () => {
    setPhoto(index);
    restartSlideshow();
  });
  thumbGrid.appendChild(button);
});

document.getElementById("prevPhoto").addEventListener("click", () => {
  setPhoto(activeIndex - 1);
  restartSlideshow();
});
document.getElementById("nextPhoto").addEventListener("click", () => {
  nextSlide();
  restartSlideshow();
});
setPhoto(0);
restartSlideshow();
updateCountdown();
window.setInterval(updateCountdown, 1000);

document.getElementById("startBtn").addEventListener("click", () => {
  if (isBirthdayUnlocked()) {
    openMainPage();
    return;
  }

  countdownPanel.classList.add("is-visible");
  document.getElementById("intro").classList.add("is-countdown");
});
