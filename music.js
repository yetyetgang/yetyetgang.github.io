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
// Các biến bổ sung cho hệ thống âm lượng
const volumeBtn = document.getElementById('volumeBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeUpIcon = document.getElementById('volumeUpIcon');
const volumeMuteIcon = document.getElementById('volumeMuteIcon');
let hideTimeout;
let previousVolume = 0.3; // Lưu lại mức âm lượng trước khi tắt tiếng

function showPlayer() {
    musicPlayer.classList.add('show');
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => { musicPlayer.classList.remove('show'); }, 5000);
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
    if (bgMusic.paused) { bgMusic.play(); setPlayState(); } else { bgMusic.pause(); setPauseState(); }
});

if (welcomeOverlay) {
    welcomeOverlay.addEventListener('click', () => {
        bgMusic.volume = volumeSlider.value; // Đồng bộ âm lượng ban đầu với thanh kéo
        bgMusic.play().then(() => { setPlayState(); }).catch(error => { console.log(error); });
        welcomeOverlay.style.opacity = '0';
        welcomeOverlay.style.visibility = 'hidden';
        setTimeout(showPlayer, 600);
    });
}

// CHỨC NĂNG 1: THAY ĐỔI ÂM LƯỢNG KHI KÉO THANH TRƯỢT
volumeSlider.addEventListener('input', (e) => {
    e.stopPropagation();
    const volumeValue = e.target.value;
    bgMusic.volume = volumeValue;
    if (volumeValue == 0) {
        bgMusic.muted = true;
        volumeUpIcon.style.display = 'none';
        volumeMuteIcon.style.display = 'block';
    } else {
        bgMusic.muted = false;
        volumeUpIcon.style.display = 'block';
        volumeMuteIcon.style.display = 'none';
        previousVolume = volumeValue;
    }
});

// CHỨC NĂNG 2: BẤM VÀO ICON LOA ĐỂ BẬT/TẮT TIẾNG NHANH
volumeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.muted) {
        bgMusic.muted = false;
        bgMusic.volume = previousVolume;
        volumeSlider.value = previousVolume;
        volumeUpIcon.style.display = 'block';
        volumeMuteIcon.style.display = 'none';
    } else {
        bgMusic.muted = true;
        volumeSlider.value = 0;
        volumeUpIcon.style.display = 'none';
        volumeMuteIcon.style.display = 'block';
    }
});

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
    if (duration) { bgMusic.currentTime = (clickX / width) * duration; }
});
