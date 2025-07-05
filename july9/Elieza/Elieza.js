// Photo Slideshow Logic
const photos = [
    "photo (1).jpg", "photo (2).jpg", "photo (3).jpg", "photo (4).jpg",
    "photo (5).jpg", "photo (6).jpg", "photo (7).jpg", "photo (8).jpg",
    "photo (9).jpg", "photo (10).jpg", "photo (11).jpg", "photo (12).jpg",
    "photo (13).jpg", "photo (14).jpg", "photo (15).jpg", "photo (16).jpg",
    "photo (17).jpg", "photo (18).jpg", "photo (19).jpg", "photo (20).jpg"
];

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
    slideshowInterval = setInterval(nextPhoto, 3000);
}

function stopSlideshow() {
    clearInterval(slideshowInterval);
}

// Auto start on page load
window.addEventListener("load", () => {
    startSlideshow();

    // Optional: Stop slideshow when hovering over photo to view clearly
    const photoElement = document.getElementById("photo");
    photoElement.addEventListener("mouseenter", stopSlideshow);
    photoElement.addEventListener("mouseleave", startSlideshow);
});
