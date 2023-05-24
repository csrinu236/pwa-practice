if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registered:', registration);
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
}

let defferedPromt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallpromt');
  e.preventDefault();

  defferedPromt = e;
  console.log({ defferedPromt });
  return false;
});

const installBtn = document.querySelector('.install-btn');

installBtn.addEventListener('click', () => {
  console.log('CLICKED');
  if (defferedPromt) {
    defferedPromt.prompt();

    defferedPromt.userChoice.then((choiceResult) => {
      // if (choiceResult.outcome === 'accepted') {
      //   console.log('User accepted the install prompt');
      // }
      if (choiceResult.outcome === 'dismissed') {
        console.log('DISMISSED');
      } else {
        console.log('APP ADDED TO HOME SCREEN');
      }
      defferedPromt = null;
    });
  }
});
