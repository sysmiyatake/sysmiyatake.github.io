document.addEventListener("DOMContentLoaded", function () {
  const audioPlayers = document.querySelectorAll('.audio-player');  // すべてのオーディオプレイヤーを取得

  audioPlayers.forEach(audio => {
    // オーディオのメタデータが読み込まれたときのイベント
    audio.addEventListener("loadedmetadata", function() {
      const duration = audio.duration;
      console.log("Duration: " + duration); // メタデータが読み込まれた後、オーディオの長さを確認

      // durationが正しく取得できているか確認したい場合
      if (!isNaN(duration)) {
        console.log(`Audio duration: ${duration} seconds`);
      }
    });

    const controls = audio.closest('.song-part').querySelector('.controls');  // audio の親の `.song-part` 内で `.controls` を検索

    if (!controls) {
      console.error("Controls element not found for this audio player.");
      return;  // `.controls` がない場合は処理を中止
    }

    // 各種操作ボタン
    const playButton = controls.querySelector('#play');
    const stopButton = controls.querySelector('#stop');
    const seekbar = controls.querySelector('#seekbar');
    const seekbarWrap = controls.querySelector('.seekbar-wrap');
    const currentTimeElem = controls.querySelector('#current');
    const durationElem = controls.querySelector('#duration');

    // 再生ボタンのクリックイベント
    playButton.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playButton.textContent = 'Pause';  // ボタン表示を「Pause」に変更
      } else {
        audio.pause();
        playButton.textContent = 'Play';  // ボタン表示を「Play」に変更
      }
    });

    // 停止ボタンのクリックイベント
    stopButton.addEventListener('click', () => {
      audio.pause();
      audio.currentTime = 0;  // 停止と同時に再生位置を最初に戻す
      playButton.textContent = 'Play';  // ボタン表示を「Play」に変更
      updateSeekbar();  // シークバーをリセット
      updateTime();  // 時間表示をリセット
    });

    // シークバーのクリックイベント
    if (seekbarWrap) {
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
    }

    // 再生中にシークバーと時間を更新
    audio.addEventListener('timeupdate', () => {
      if (seekbar) {
        updateSeekbar();
        updateTime();
      }
    });

    // 再生が終了したときの処理
    audio.addEventListener('ended', () => {
      playButton.textContent = 'Play';  // 再生が終了したらボタン表示を「Play」に戻す
      updateSeekbar();
      updateTime();
    });

    // メタデータが読み込まれたときに初期化
    audio.addEventListener("loadedmetadata", () => {
      updateSeekbar();
      updateTime();
    });

    // シークバーを更新
    function updateSeekbar() {
      const duration = audio.duration;
      const currentTime = audio.currentTime;
      if (seekbar && !isNaN(duration) && duration > 0) {
        const percent = (currentTime / duration) * 100;
        seekbar.style.width = `${percent}%`;
      }
    }

    // 時間の更新
    function updateTime() {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      const currentFormatted = formatTime(currentTime);
      const durationFormatted = formatTime(duration);
      if (currentTimeElem && durationElem) {
        currentTimeElem.textContent = currentFormatted;
        durationElem.textContent = durationFormatted;
      }
    }

    // 時間を00:00形式にフォーマット
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
  });
});

// "Sys. T. Player (beta)" Sys. T. Miyatake, (Last modified: May 06, 2025;)