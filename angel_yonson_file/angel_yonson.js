// Photo Slideshow
const photos = [
    "photo (1).jpg", "photo (2).jpg", "photo (3).jpg", "photo (4).jpg",
    "photo (5).jpg", "photo (6).jpg", "photo (7).jpg", "photo (8).jpg",
    "photo (9).jpg", "photo (10).jpg", "photo (11).jpg", "photo (12).jpg",
    "photo (13).jpg", "photo (14).jpg", "photo (15).jpg", "photo (16).jpg",
    "photo (17).jpg"
];

let currentIndex = 0;
let slideshowInterval;

function startSlideshow() {
    slideshowInterval = setInterval(nextPhoto, 3000); // Change every 3 seconds
}

function stopSlideshow() {
    clearInterval(slideshowInterval);
}

function nextPhoto() {
    currentIndex = (currentIndex + 1) % photos.length;
    updatePhoto();
}

function prevPhoto() {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    updatePhoto();
}

function updatePhoto() {
    const photoElement = document.getElementById("photo");
    photoElement.style.transform = "scale(0.9)";
    photoElement.style.opacity = 0;

    setTimeout(() => {
        photoElement.src = photos[currentIndex];
        photoElement.style.transform = "scale(1)";
        photoElement.style.opacity = 1;
    }, 300);
}

// Start slideshow on load
startSlideshow();

// Music Player Controls
const music = document.getElementById("music");
const songs = ["music.mp3", "music2.mp3", "music3.mp3"];  // Add more if needed
let songIndex = 0;

function nextSong() {
    songIndex = (songIndex + 1) % songs.length;
    music.src = songs[songIndex];
    music.play();
}

function prevSong() {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    music.src = songs[songIndex];
    music.play();
}

// Auto-play next song when current ends
music.addEventListener("ended", nextSong);
