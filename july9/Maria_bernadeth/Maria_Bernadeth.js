// Photo Slideshow Logic for Bernadeth (31 photos)
const photos = [];
for (let i = 1; i <= 31; i++) {
    photos.push(`photo (${i}).jpg`);
}

let currentIndex = 0;
let slideshowInterval;

function updatePhoto() {
    const photoElement = document.getElementById("photo");
    photoElement.style.opacity = 0;
    photoElement.style.transform = "scale(0.95)";

    setTimeout(() => {
        photoElement.src = photos[currentIndex];
        photoElement.style.opacity = 1;
        photoElement.style.transform = "scale(1)";
    }, 300);
}

function nextPhoto() {
    currentIndex = (currentIndex + 1) % photos.length;
    updatePhoto();
}

function startSlideshow() {
    slideshowInterval = setInterval(nextPhoto, 3000); // 3 seconds per photo
}

function stopSlideshow() {
    clearInterval(slideshowInterval);
}

// Start slideshow on page load
window.addEventListener("load", () => {
    startSlideshow();

    // Pause slideshow on hover for clarity
    const photoElement = document.getElementById("photo");
    photoElement.addEventListener("mouseenter", stopSlideshow);
    photoElement.addEventListener("mouseleave", startSlideshow);

    // Ensure music plays on user interaction if autoplay is blocked
    const music = document.getElementById("music");
    window.addEventListener('click', () => {
        if (music && music.paused) {
            music.play();
        }
    });
});
