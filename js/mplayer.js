document.addEventListener("DOMContentLoaded", function () {
  let warnedAudioNotFound = false;
  let warnedPlayButtonNotFound = false;
  let warnedStopButtonNotFound = false;
  let warnedSeekbarNotFound = false;

  const audio = document.getElementsByTagName("audio")[0];
  if (!audio && !warnedAudioNotFound) {
    console.error('Audio element not found.');
    warnedAudioNotFound = true;
  }

  const playButton = document.getElementById("play");
  if (playButton) {
    playButton.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playButton.innerHTML = 'Pause';
      } else {
        audio.pause();
        playButton.innerHTML = 'Play';
      }
    });
  } else if (!warnedPlayButtonNotFound) {
    console.warn('Play button not found.');
    warnedPlayButtonNotFound = true;
  }

  const stopButton = document.getElementById("stop");
  if (stopButton) {
    stopButton.addEventListener('click', () => {
      audio.pause();
      audio.currentTime = 0;
      playButton.innerHTML = 'Play';
      updateSeekbar();
      updateTime();
    });
  } else if (!warnedStopButtonNotFound) {
    console.warn('Stop button not found.');
    warnedStopButtonNotFound = true;
  }

  const seekbar = document.getElementById('seekbar');
  const seekbarWrap = document.querySelector('.seekbar-wrap');
  if (seekbar && seekbarWrap) {
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
  } else if (!warnedSeekbarNotFound) {
    console.warn('Seekbar not found.');
    warnedSeekbarNotFound = true;
  }

  const attenuater = document.getElementById("attenuater");
  const fullVolume = document.getElementById("fullVolume");

  if (attenuater) {
    attenuater.addEventListener("click", () => {
      if (audio) {
        audio.volume = 0.33;
      }
    });
  }

  if (fullVolume) {
    fullVolume.addEventListener("click", () => {
      if (audio) {
        audio.volume = 1;
      }
    });
  }

  function updateSeekbar() {
    const duration = audio.duration;
    const currentTime = audio.currentTime;
    if (seekbar && !isNaN(duration) && duration > 0) {
      const percent = (currentTime / duration) * 100;
      seekbar.style.width = `${percent}%`;
    }
  }

  function updateTime() {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    const currentFormatted = formatTime(currentTime);
    const durationFormatted = formatTime(duration);
    const currentElem = document.getElementById('current');
    const durationElem = document.getElementById('duration');
    if (currentElem && durationElem) {
      currentElem.textContent = currentFormatted;
      durationElem.textContent = durationFormatted;
    }
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  audio.addEventListener('timeupdate', () => {
    if (seekbar) {
      updateSeekbar();
      updateTime();
    }
  });

  if (seekbar) {
    seekbar.style.width = '0%';
  }
  updateTime();
});

  if (audio) {
    if (audio.readyState >= 1) {
      updateTime();
    } else {
      audio.addEventListener('loadedmetadata', () => {
        updateTime();
      });
    }
  }
// "Sys. T. Player (beta)" Sys. T. Miyatake, (Last modified: Dec 02, 2024;)