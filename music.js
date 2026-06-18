const musicPlayer = document.getElementById('musicPlayer');
const bgMusic = document.getElementById('bg-music');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const currentTimeEl = document.getElementById('currentTime');
const durationTimeEl = document.getElementById('durationTime');
const welcomeOverlay = document.getElementById('welcomeOverlay');
let hideTimeout;

function showPlayer() {
    musicPlayer.classList.add('show');
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        musicPlayer.classList.remove('show');
    }, 5000);
}

musicPlayer.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
musicPlayer.addEventListener('mouseleave', () => {
    hideTimeout = setTimeout(() => musicPlayer.classList.remove('show'), 3000);
});

function setPlayState() {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
}

function setPauseState() {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
}

playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
        bgMusic.play();
        setPlayState();
    } else {
        bgMusic.pause();
        setPauseState();
    }
});

if (welcomeOverlay) {
    welcomeOverlay.addEventListener('click', () => {
        bgMusic.play().then(() => {
            setPlayState();
        }).catch(error => {
            console.log("Lỗi phát nhạc:", error);
        });

        welcomeOverlay.style.opacity = '0';
        welcomeOverlay.style.visibility = 'hidden';

        setTimeout(showPlayer, 600);
    });
}

bgMusic.addEventListener('timeupdate', () => {
    const { duration, currentTime } = bgMusic;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        let currentMin = Math.floor(currentTime / 60);
        let currentSec = Math.floor(currentTime % 60);
        if (currentSec < 10) currentSec = `0${currentSec}`;
        currentTimeEl.innerText = `${currentMin}:${currentSec}`;
        
        let durationMin = Math.floor(duration / 60);
        let durationSec = Math.floor(duration % 60);
        if (durationSec < 10) durationSec = `0${durationSec}`;
        durationTimeEl.innerText = `${durationMin}:${durationSec}`;
    }
});

progressContainer.addEventListener('click', (e) => {
    e.stopPropagation();
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = bgMusic.duration;
    if (duration) {
        bgMusic.currentTime = (clickX / width) * duration;
    }
});
