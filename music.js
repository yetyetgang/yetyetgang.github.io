const musicPlayer = document.getElementById('musicPlayer');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const bgMusic = document.getElementById('bg-music');
let hideTimeout;

function showPlayer() {
    musicPlayer.classList.add('show');
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        musicPlayer.classList.remove('show');
    }, 5000);
}

window.addEventListener('load', () => {
    setTimeout(showPlayer, 1000);
});

musicToggleBtn.addEventListener('click', () => {
    musicPlayer.classList.toggle('show');
    if (musicPlayer.classList.contains('show')) {
        showPlayer();
    }
});

bgMusic.addEventListener('play', () => {
    musicToggleBtn.classList.add('playing');
});
bgMusic.addEventListener('pause', () => {
    musicToggleBtn.classList.remove('playing');
});
