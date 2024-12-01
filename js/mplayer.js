document.addEventListener("DOMContentLoaded", function() {
  // 初期化フラグを設定
  let warnedAudioNotFound = false;
  let warnedPlayButtonNotFound = false;
  let warnedStopButtonNotFound = false;
  let warnedSeekbarNotFound = false;
  let warnedAttenuateButtonNotFound = false;
  let warnedFullVolumeButtonNotFound = false;

  // audio要素の取得と存在チェック
  const audio = document.getElementsByTagName("audio")[0];
  if (!audio && !warnedAudioNotFound) {
    console.error('Audio element not found.');
    warnedAudioNotFound = true;
  }

  // Playボタンの取得と存在チェック
  const playButton = document.getElementById("play");
  if (playButton) {
    playButton.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playButton.innerHTML = playButton.innerHTML === 'Play' ? 'Pause' : 'Play';
      } else {
        audio.pause();
        playButton.innerHTML = 'Play';
      }
    });
  } else if (!warnedPlayButtonNotFound) {
    console.warn('Play button not found.');
    warnedPlayButtonNotFound = true;
  }

  // Stopボタンの取得と存在チェック
  const stopButton = document.getElementById("stop");
  if (stopButton) {
    stopButton.addEventListener('click', () => {
      audio.pause();
      audio.currentTime = 0;
    });
  } else if (!warnedStopButtonNotFound) {
    console.warn('Stop button not found.');
    warnedStopButtonNotFound = true;
  }

  // Seekbarの取得と存在チェック
  const seekbar = document.getElementById('seekbar');
  if (seekbar) {
    seekbar.addEventListener("click", (e) => {
      const duration = Math.round(audio.duration);
      if (!isNaN(duration)) {
        const mouse = e.pageX;
        const rect = seekbar.getBoundingClientRect();
        const position = rect.left + window.scrollX;
        const offset = mouse - position;
        const width = rect.right - rect.left;
        audio.currentTime = Math.round(duration * (offset / width));
      }
    });
  } else if (!warnedSeekbarNotFound) {
    console.warn('Seekbar not found.');
    warnedSeekbarNotFound = true;
  }

  // 音量アッテネータボタンの取得とイベントリスナー設定
  const attenuateButton = document.getElementById("attenuater");
  if (attenuateButton) {
    attenuateButton.addEventListener('click', attenuateVolume);
  } else if (!warnedAttenuateButtonNotFound) {
    console.warn('Attenuate button not found.');
    warnedAttenuateButtonNotFound = true;
  }

  // 音量フル設定ボタンの取得とイベントリスナー設定
  const fullVolumeButton = document.getElementById("fullVolume");
  if (fullVolumeButton) {
    fullVolumeButton.addEventListener('click', fullVolume);
  } else if (!warnedFullVolumeButtonNotFound) {
    console.warn('Full Volume button not found.');
    warnedFullVolumeButtonNotFound = true;
  }

  // 音量アッテネータ関数
  function attenuateVolume() {
    audio.volume = 0.33;
  }

  // 音量フル設定関数
  function fullVolume() {
    audio.volume = 1.0;
  }

  // 時間を表示する関数
  function playTime(t) {
    let hms = '';
    const h = t / 3600 | 0;
    const m = t % 3600 / 60 | 0;
    const s = t % 60;
    const z2 = (v) => ('00' + v).slice(-2);
    
    if (h != 0) {
      hms = h + ':' + z2(m) + ':' + z2(s);
    } else if (m != 0) {
      hms = z2(m) + ':' + z2(s);
    } else {
      hms = '00:' + z2(s);
    }
    return hms;
  }
});

// This is "Sys. T. Player" beta ver.