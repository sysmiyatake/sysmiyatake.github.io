document.addEventListener("DOMContentLoaded", function () {
  const audioPlayers = document.querySelectorAll("audio.audio-player");

  audioPlayers.forEach((audio, index) => {
    const container = audio.closest('.song-part-inner'); // 再生UIの共通の親要素
    if (!container) return;

    const playButton = container.querySelector("#play");
    const stopButton = container.querySelector("#stop");
    const seekbar = container.querySelector("#seekbar");
    const seekbarWrap = container.querySelector(".seekbar-wrap");
    const currentElem = container.querySelector("#current");
    const durationElem = container.querySelector("#duration");

    if (!playButton || !stopButton || !seekbar || !seekbarWrap) {
      console.warn(`Controls not found for audio ${index}`);
      return;
    }

    // 初期化
    seekbar.style.width = '0%';
    updateTime();

    playButton.addEventListener('click', () => {
      if (audio.paused) {
        // 他のすべてのプレイヤーを停止
        audioPlayers.forEach(a => {
          if (a !== audio) {
            a.pause();
            a.currentTime = 0;
            const otherContainer = a.closest('.song-part-inner');
            if (otherContainer) {
              const otherPlay = otherContainer.querySelector("#play");
              if (otherPlay) otherPlay.innerHTML = "Play";
            }
          }
        });

        audio.play();
        playButton.innerHTML = "Pause";
      } else {
        audio.pause();
        playButton.innerHTML = "Play";
      }
    });

    stopButton.addEventListener('click', () => {
      audio.pause();
      audio.currentTime = 0;
      playButton.innerHTML = "Play";
      updateSeekbar();
      updateTime();
    });

    seekbarWrap.addEventListener("click", (e) => {
      const duration = audio.duration;
      if (!isNaN(duration) && duration > 0) {
        const rect = seekbarWrap.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = offsetX / rect.width;
        audio.currentTime = duration * percentage;
        updateSeekbar();
        updateTime();
      }
    });

    audio.addEventListener('timeupdate', () => {
      updateSeekbar();
      updateTime();
    });

    audio.addEventListener('ended', () => {
      playButton.innerHTML = "Play";
      updateSeekbar();
      updateTime();
    });

    audio.addEventListener('loadedmetadata', () => {
      updateSeekbar();
      updateTime();
    });

    function updateSeekbar() {
      const duration = audio.duration;
      const currentTime = audio.currentTime;
      if (!isNaN(duration) && duration > 0) {
        const percent = (currentTime / duration) * 100;
        seekbar.style.width = `${percent}%`;
      }
    }

    function updateTime() {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      if (currentElem && durationElem) {
        currentElem.textContent = formatTime(currentTime);
        durationElem.textContent = formatTime(duration);
      }
    }

    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
  });
});


// "Sys. T. Player (beta)" Sys. T. Miyatake, (Last modified: May 06, 2025;)