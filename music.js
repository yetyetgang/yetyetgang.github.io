const musicPlayer = document.getElementById('musicPlayer');
const bgMusic = document.getElementById('bg-music');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const currentTimeEl = document.getElementById('currentTime');
const durationTimeEl = document.getElementById('durationTime');
let hideTimeout;

// 1. Hiệu ứng trượt ra tự động khi tải trang và ẩn đi sau 5 giây
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

// Giữ thanh nhạc hiển thị nếu người dùng rê chuột vào widget
musicPlayer.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
musicPlayer.addEventListener('mouseleave', () => {
    hideTimeout = setTimeout(() => musicPlayer.classList.remove('show'), 3000);
});

// Hàm đồng bộ giao diện khi nhạc chạy
function setPlayState() {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
}

// Hàm đồng bộ giao diện khi nhạc dừng
function setPauseState() {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
}

// 2. Xử lý nút bấm Play/Pause thủ công
playBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài body
    if (bgMusic.paused) {
        bgMusic.play();
        setPlayState();
    } else {
        bgMusic.pause();
        setPauseState();
    }
});

// 3. GIẢI PHÁP ĐÁNH LỪA TRÌNH DUYỆT: CLICK BẤT CỨ ĐÂU ĐỂ CHẠY NHẠC
// Người xem click vùng trống hoặc lướt màn hình là nhạc tự động cất lên
function unlockAutoplay() {
    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            setPlayState();
            // Đã kích hoạt thành công, gỡ bỏ lắng nghe để tránh lỗi lặp lại
            document.removeEventListener('click', unlockAutoplay);
            document.removeEventListener('touchstart', unlockAutoplay);
        }).catch(error => {
            console.log("Chờ người dùng click sâu hơn:", error);
        });
    }
}
document.addEventListener('click', unlockAutoplay);
document.addEventListener('touchstart', unlockAutoplay); // Hỗ trợ mượt trên điện thoại

// 4. Cập nhật thanh tiến trình phần trăm chạy và thời gian đếm số
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

// 5. Cho phép người dùng bấm click vào thanh thời gian để tua nhạc
progressContainer.addEventListener('click', (e) => {
    e.stopPropagation();
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = bgMusic.duration;
    if (duration) {
        bgMusic.currentTime = (clickX / width) * duration;
    }
});
