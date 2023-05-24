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

const installBtn = document.querySelector('.install-btn');
installBtn.disabled = true;
let defferedPromt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallpromt');
  e.preventDefault();

  defferedPromt = e;
  installBtn.disabled = false;

  //   console.log({ defferedPromt });
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

  return false;
});

const fetchBtn = document.querySelector('.fetch-btn');

fetchBtn.addEventListener('click', async () => {
  const data = await fetch('https://jsonplaceholder.typicode.com/posts').then(
    (resp) => resp.json()
  );
  const DOMSting = data.map(({ title, body }) => {
    return `<div class="card single-post">
            <h4>${title}</h4>
            <p class="mb-0">
              ${body}
            </p>
          </div>`;
  });
  const postsContainer = document.querySelector('.posts-container');
  postsContainer.innerHTML = DOMSting;
});
