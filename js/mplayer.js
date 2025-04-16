document.addEventListener("DOMContentLoaded", function () {
  let warnedAudioNotFound = false;
  let warnedSeekbarNotFound = false;

  const audio = document.getElementsByTagName("audio")[0];
  const seekbar = document.getElementById('seekbar');
  const seekbarWrap = document.querySelector('.seekbar-wrap');

  if (!audio && !warnedAudioNotFound) {
    console.error('Audio element not found.');
    warnedAudioNotFound = true;
  }

  // シークバー初期化（再生前に 0% に）
  if (seekbar) {
    seekbar.style.width = '0%';
  }

  // クリックイベントでシークバーを操作
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

  // 再生ボタンの動作
  const playButton = document.getElementById("play");
  const stopButton = document.getElementById("stop");

  if (playButton) {
    playButton.addEventListener('click', () => {
      if (audio.paused) {
        audio.play(); // 再生開始
        playButton.innerHTML = 'Pause'; // ボタン表示変更
      } else {
        audio.pause(); // 一時停止
        playButton.innerHTML = 'Play'; // ボタン表示変更
      }
    });
  }

  if (stopButton) {
    stopButton.addEventListener('click', () => {
      audio.pause();
      audio.currentTime = 0;
      playButton.innerHTML = 'Play';
      updateSeekbar();
      updateTime();
    });
  }

  // シークバー更新のための timeupdate イベント
  audio.addEventListener('timeupdate', () => {
    if (seekbar) {
      updateSeekbar();
      updateTime();
    }
  });

  // 再生が終了したらPlayに戻す
  audio.addEventListener('ended', () => {
    playButton.innerHTML = 'Play'; // 再生完了後に「Play」に戻す
    updateSeekbar();
    updateTime();
  });

  // メタデータが読み込まれたらシークバーと時間を更新
  audio.addEventListener("loadedmetadata", () => {
    updateSeekbar();
    updateTime();
  });

  // 初期化
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

  // 初期化時にシークバーの幅を 0% にしておく
  if (seekbar) {
    seekbar.style.width = '0%';
  }

  updateTime(); // 初期時間表示
});

// "Sys. T. Player (beta)" Sys. T. Miyatake, (Last modified: Apr 16, 2025;)