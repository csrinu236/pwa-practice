const player = document.querySelector('#player');
const canvasElement = document.querySelector('#canvas');
const cameraBtn = document.querySelector('.camera-btn');
const captureBtn = document.querySelector('.capture-btn');
const locationBtn = document.querySelector('.location-btn');

captureBtn.disabled = true;

let videoTracks;
let imageCapture;
cameraBtn.addEventListener('click', async () => {
  // checking for support of Camera, Mic, Audio, video etc
  if ('mediaDevices' in navigator) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      videoTracks = stream.getVideoTracks();
      const mediaStreamTrack = stream.getVideoTracks()[0];
      imageCapture = new ImageCapture(mediaStreamTrack);
      player.style.display = 'block';
      player.srcObject = stream;
      captureBtn.disabled = false;
    } catch (error) {
      alert(`${error.name}`);
      console.error(error);
    }
  }
});

captureBtn.addEventListener('click', async () => {
  //   captureBtn.disabled = true;
  const blobContainer = document.querySelector('.blob-container');
  const canvasContainer = document.querySelector('.canvas-container');
  const img = canvasContainer.querySelector('img');
  canvasElement.style.display = 'block';
  canvasContainer.style.display = 'block';
  //   blobContainer.style.display = 'block';
  //   blobContainer.querySelector('h3').innerHTML = 'Blob Image Loading...';
  //   canvasElement.getContext('2d').drawImage(player, 0, 0, 320, 240);
  //   const img = document.querySelector('.blob-image');

  imageCapture
    .grabFrame()
    .then((imageBitmap) => {
      canvasElement.width = imageBitmap.width;
      canvasElement.height = imageBitmap.height;
      canvasElement.getContext('2d').drawImage(imageBitmap, 0, 0);
      const dataURL = canvasElement.toDataURL('image/jpeg', 1.0);
    })
    .catch((error) => console.error('grabFrame() error:', error));

  //   imageCapture
  //     .takePhoto()
  //     .then(
  //       (blob) => {
  //         img.src = URL.createObjectURL(blob);
  //         img.onload = () => {
  //           URL.revokeObjectURL(this.src);
  //           img.style.display = 'block';
  //         };
  //         blobContainer.querySelector('h3').innerHTML =
  //           'Blob Image(More resolution Image)';

  //         videoTracks.forEach((track) => track.stop());
  //         player.style.display = 'none';
  //       },
  //       'image/jpeg',
  //       0.5
  //     )
  //     .catch((error) => console.error('takePhoto() error:', error));
});

// function dataURLtoBlob(dataurl) {
//   var arr = dataurl.split(','),
//     mime = arr[0].match(/:(.*?);/)[1],
//     bstr = atob(arr[1]),
//     n = bstr.length,
//     u8arr = new Uint8Array(n);
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }
//   return new Blob([u8arr], { type: mime });
// }
