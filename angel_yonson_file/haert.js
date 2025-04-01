// Heart Animation
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    document.getElementById('heart-container').appendChild(heart);
    
    const startPosX = Math.random() * window.innerWidth;
    heart.style.left = `${startPosX}px`;
    heart.style.bottom = "-20px";
    heart.style.animationDuration = `${Math.random() * 4 + 3}s`;
    heart.style.transform = `scale(${Math.random() * 0.7 + 0.3}) rotate(-45deg)`;
    
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

setInterval(() => {
    for (let i = 0; i < 10; i++) {
        createHeart();
    }
}, 100);
