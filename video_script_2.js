window.addEventListener('DOMContentLoaded', () => {

let shouldStop = false;
let stopped = false;
const downloadLink = document.getElementById('download');
const stopButton = document.getElementById('stop');

stopButton.addEventListener('click', function() {
  shouldStop = true;
})

var handleSuccess = function(stream) {
  const options = {mimeType: 'video/webm'};
  const recordedChunks = [];
  const mediaRecorder = new MediaRecorder(stream, options);

  mediaRecorder.addEventListener('dataavailable', function(e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }

    if(shouldStop === true && stopped === false) {
      mediaRecorder.stop();
      stopped = true;
    }
  });

  mediaRecorder.addEventListener('stop', function() {
    downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
    downloadLink.download = 'acetest.webm';
  });

  mediaRecorder.start();
};

navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(handleSuccess);
});
// var player = document.getElementById('player');

// var handleSuccess = function(stream) {
//   player.srcObject = stream;
// };

// navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(handleSuccess)