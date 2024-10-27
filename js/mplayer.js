document.addEventListener("DOMContentLoaded", function() {
  // audio要素の取得と存在チェック
  const audio = document.getElementsByTagName("audio")[0];
  if (!audio) {
    console.error('Audio element not found.');
    return;
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
  } else {
    console.warn('Play button not found.');
  }

  // Stopボタンの取得と存在チェック
  const stopButton = document.getElementById("stop");
  if (stopButton) {
    stopButton.addEventListener('click', () => {
      audio.pause();
      audio.currentTime = 0;
    });
  } else {
    console.warn('Stop button not found.');
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
  } else {
    console.warn('Seekbar not found.');
  }

  // Time updateのイベントリスナー
  audio.addEventListener("timeupdate", (e) => {
    const current = Math.floor(audio.currentTime);
    const duration = Math.round(audio.duration);
    if (!isNaN(duration)) {
      const currentElement = document.getElementById('current');
      const durationElement = document.getElementById('duration');
      
      if (currentElement) {
        currentElement.innerHTML = playTime(current);
      } else {
        console.warn('Current time display element not found.');
      }
      
      if (durationElement) {
        durationElement.innerHTML = playTime(duration);
      } else {
        console.warn('Duration display element not found.');
      }

      const percent = Math.round((audio.currentTime / audio.duration) * 1000) / 10;
      if (seekbar) {
        seekbar.style.backgroundSize = percent + '%';
      }
    }
  });

  // ボリューム調整関数
  function attenuateVolume() {
    audio.volume = 0.3;
  }

  function fullVolume() {
    audio.volume = 1.0;
  }

// ページ読み込み時の初期化処理
function setCurrentTime($currentTime) {
  const currentElement = document.getElementById("current");
  
  if (audio) {
    // 一時的にtimeupdateイベントを無効化
    audio.removeEventListener("timeupdate", timeUpdateHandler);
    
    audio.currentTime = $currentTime; // audio要素のcurrentTimeを設定
    
    // timeupdateイベントを再登録
    audio.addEventListener("timeupdate", timeUpdateHandler);
  } else {
    console.warn('Audio element not found.');
  }

  if (currentElement) {
    currentElement.innerHTML = playTime($currentTime);
  } else {
    console.warn('Current time display element not found.');
  }
}

  // timeupdate用のハンドラを関数として定義
  function timeUpdateHandler(e) {
    const current = Math.floor(audio.currentTime);
    const duration = Math.round(audio.duration);

    if (!isNaN(duration)) {
      const currentElement = document.getElementById('current');
      const durationElement = document.getElementById('duration');

      if (currentElement) {
        currentElement.innerHTML = playTime(current);
      } else {
        console.warn('Current time display element not found.');
      }

      if (durationElement) {
        durationElement.innerHTML = playTime(duration);
      } else {
        console.warn('Duration display element not found.');
      }

      const percent = Math.round((audio.currentTime / audio.duration) * 1000) / 10;
      if (seekbar) {
        seekbar.style.backgroundSize = percent + '%';
      }
    }
  }

  // 初期化時にtimeupdateイベントリスナーを設定
  audio.addEventListener("timeupdate", timeUpdateHandler);


  // 時間を設定する関数
  function setCurrentTime($currentTime) {
    const songPlayer = document.getElementById("songPlayer");
    if (songPlayer) {
      songPlayer.currentTime = $currentTime;
    } else {
      console.warn('Song player element not found.');
    }

    const currentElement = document.getElementById("current");
    if (currentElement) {
      currentElement.innerHTML = playTime($currentTime);
    } else {
      console.warn('Current time display element not found.');
    }
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
