window.addEventListener('DOMContentLoaded', () => {
  const getMic = document.getElementById('mic');
  const recordButton = document.getElementById('record');
  const list = document.getElementById('recordings');
  if ('MediaRecorder' in window) {
    getMic.addEventListener('click', async () => {
      getMic.setAttribute('hidden', 'hidden');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        });
        const mimeType = 'audio/webm';
        let chunks = [];
        const recorder = new MediaRecorder(stream, { type: mimeType });
        recorder.addEventListener('dataavailable', event => {
          if (typeof event.data === 'undefined') return;
            if (event.data.size === 0) return;
            chunks.push(event.data);
          });
        recorder.addEventListener('stop', () => {
          const recording = new Blob(chunks, {
            type: mimeType
          });
          renderRecording(recording, list);
          chunks = [];
        });
        recordButton.removeAttribute('hidden');
        recordButton.addEventListener('click', () => {
          if (recorder.state === 'inactive') {
            recorder.start();
            recordButton.innerText = 'Stop';
          } else {
            recorder.stop();
            recordButton.innerText = 'Record';
          }
        });
      } catch {
        renderError(
          'You denied access to the microphone so this demo will not work.'
        );
      }
    });
  } else {
    renderError("Sorry you dont have media recorder");
  }
});
function renderError(message) {
  const main = document.querySelector('main');
  main.innerHTML = `<div class="error"><p>${message}</p></div>`;
}
function renderRecording(blob, list) {
  const blobUrl = URL.createObjectURL(blob);
  const li = document.createElement('li');
  const audio = document.createElement('audio');
  const anchor = document.createElement('a');
  anchor.setAttribute('href', blobUrl);
  const now = new Date();
  anchor.setAttribute(
    'download',
    `recording-${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDay().toString().padStart(2, '0')}--${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}.webm`
  );
  anchor.innerText = 'Download';
  audio.setAttribute('src', blobUrl);
  audio.setAttribute('controls', 'controls');
  li.appendChild(audio);
  li.appendChild(anchor);
  list.appendChild(li);
}