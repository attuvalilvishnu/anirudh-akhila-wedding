
let video;
let loader;
let music;
let playBtn;
let pauseBtn;
let isUserPause = false;
let parsedData = {};

async function init() {
    const data = localStorage.getItem("data");
    parsedData = data ? JSON.parse(data) : await loadJSON();
    const source = document.getElementById("data-template").innerHTML;
    const template = Handlebars.compile(source);
    document.getElementById("target").innerHTML = template(parsedData);
    loadDomContent();
}

init();

async function loadJSON() {
    try {
        const response = await fetch("data.json");
        const data = await response.json();
        return data;
    } catch (err) {
        alert("Failed to load JSON. Make sure you are running a local server.");
        console.error(err);
    }
}

function loadDomContent() {
    video = document.getElementById('bg-video');
    loader = document.getElementById('loader');
    music = document.getElementById("music");
    playBtn = document.getElementById("play-btn");
    pauseBtn = document.getElementById("pause-btn");

    video.addEventListener('canplaythrough', () => {
        // Video is ready to play
        loader.style.display = 'none';
        video.style.visibility = 'visible';
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isUserPause) {
                play();
            } else {
                pause();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(video);

    // Initialize buttons on page load
    updateButtons();
    coutdown();
}



function safePlay() {
    if (video?.readyState >= 3) {
        play();
    } else {
        video.addEventListener("canplay", play, { once: true });
    }
}



// Toggle buttons visibility
function updateButtons() {
    if (video.paused || video.ended) {
        playBtn.style.display = "inline-block";
        pauseBtn.style.display = "none";

    } else {
        playBtn.style.display = "none";
        pauseBtn.style.display = "inline-block";
    }
}


function pause() {
    pauseVideo();
    pauseMusic();
}

function play() {
    playVideo();
    playMusic();
}

function userPlayVideo() {
    isUserPause = false;
    playVideo();
}

function userPauseVideo() {
    isUserPause = true;
    pauseVideo();
}

function playVideo() {
    video.play();
    playMusic();
    updateButtons();
}

function pauseVideo() {
    video.pause();
    pauseMusic();
    updateButtons();
}
function restartVideo() {
    isUserPause = false;
    video.currentTime = 0; // Go to the start
    playVideo();          // Play from beginning
    restartMusic();
    updateButtons();
}

function pauseMusic() {
    music.pause();
}

// Play music when page is visible and window is focused
function playMusic() {
    music.play().catch(() => {
        // Autoplay may require user interaction on mobile
    });
}

function restartMusic() {
    music.currentTime = 0;
    playMusic();
}

// Music toggle
function toggleMusic() {
    if (!music.paused) {
        pauseMusic()
    } else {
        playMusic();
    }
}

// Window blur/focus (switching apps or leaving browser)
window.addEventListener("blur", () => {
    music.paused || music.ended
        ? isUserPause = true
        : isUserPause = false;
    pause();
});
window.addEventListener("focus", () => {
    if (!isUserPause) play();
});

function scrollInvite() {
    const invite = document.getElementById("invite-sections");
    invite.style.display = "block"; // Show container

    const sections = document.querySelectorAll(".invite-section");
    sections.forEach((sec, index) => {
        setTimeout(() => {
            sec.classList.add("show"); // Trigger animation
        }, index * 400); // 400ms delay between each section
    });

    // Scroll to the first section after 300ms
    setTimeout(() => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }, 300);

    // Start music
    setTimeout(() => toggleMusic(), 400);
}

// Countdown
function coutdown(){
const eventDate = new Date(parsedData.reception_section.date).getTime();
setInterval(function () {
    const now = new Date().getTime();
    const diff = eventDate - now;
    if (diff > 0) {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        document.getElementById("countdown").innerHTML = `
      <div class="time-box">
        <div class="time-number">${d}</div>
        <div class="time-label">Days</div>
      </div>
      <div class="time-box">
        <div class="time-number">${h}</div>
        <div class="time-label">Hours</div>
      </div>
      <div class="time-box">
        <div class="time-number">${m}</div>
        <div class="time-label">Minutes</div>
      </div>
      <div class="time-box">
        <div class="time-number">${s}</div>
        <div class="time-label">Seconds</div>
      </div>
    `;
    } else {
        document.getElementById("countdown").innerHTML = "<p>🎉 The celebration has begun! 🎉</p>";
    }
}, 1000);
}



// Guest personalization
const params = new URLSearchParams(window.location.search);
const guest = params.get('guest');
if (guest) {
    document.getElementById("guest").innerHTML = "Dear " + guest + ", we are delighted to invite you!";
}


