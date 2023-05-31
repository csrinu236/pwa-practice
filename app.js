console.warn('Waning something...');

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
const notificationsBtn = document.querySelector('.enable-notifications');
installBtn.disabled = true;
let defferedPromt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallpromt');
  e.preventDefault();

  defferedPromt = e;
  installBtn.disabled = false;

  if (defferedPromt) {
    installBtn.addEventListener('click', () => {
      console.log('CLICKED');
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
    });
  }
});

const fetchBtn = document.querySelector('.fetch-btn');
// This is for manually saved data to cache on demand
const manualSaveBtn = document.querySelector('.manual-save');

fetchBtn.addEventListener('click', async () => {
  const data = await fetch(
    'https://jsonplaceholder.typicode.com/posts?userId=2'
  ).then((resp) => resp.json());
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

// This is for manually saved data to cache on demand
manualSaveBtn.addEventListener('click', () => {
  if ('caches' in window) {
    caches.open('manual-save').then((cacheObj) => {
      //   cacheObj.add('/manifest.json');
    });
  }
});

notificationsBtn.addEventListener('click', () => {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    Notification.requestPermission((result) => {
      console.log('Users choice ', result);
      if (result !== 'granted') {
        console.log('Notifications permission not granted');
      } else {
        // displayNotification(); // NOT subscription based, instead simple js click based
        displaySubBasedNotification(); // It is subscription based, when some one adds a post to backend server,
        // users get notified even if the app is killed.
      }
    });
  }
});

function displayNotification() {
  if ('serviceWorker' in navigator) {
    // we can also set images in notifications like youtube thumbnails
    // we can also set icons in notifications
    // badge is top icon on main desktop screen only showed in android devices
    const options = {
      body: 'working body',
      icon: '/icons/manifest-icon-192.maskable.png',
      image: '/icons/manifest-icon-512.maskable.png',
      dir: 'ltr',
      lang: 'en-IN',
      vibrate: [200, 100, 300],
      badge: '/icons/manifest-icon-192.maskable.png',
      // notifications with same tag actually stack together,
      // tag behaves like id of the notification
      tag: 'pwa-notification',
      actions: [
        {
          action: 'confirm',
          title: 'Okay',
          icon: '/icons/manifest-icon-192.maskable.png',
        },
        {
          action: 'cancel',
          title: 'Cancel',
          icon: '/icons/manifest-icon-192.maskable.png',
        },
      ],
    };
    // ready is like alternative of 'install' event,
    // If we want to access Service Worker registration object outside of SW.JS,
    // this method is the way.
    navigator.serviceWorker.ready.then((swReg) => {
      // we are accessing entire SWRegistration object here,
      // we can many things with this object including push notifications
      // This object is alive even if the app is closed
      swReg.showNotification('Successfully subscribed [from SW]!', options);
    });
  }
}

function displaySubBasedNotification() {
  if (!('serviceWorker' in navigator)) {
    return;
  }
  let reg;
  navigator.serviceWorker.ready
    .then((swReg) => {
      reg = swReg;
      return swReg.pushManager.getSubscription();
    })
    .then((sub) => {
      // sub has any subscriptions we have currently
      // A new sub is always created for new browser device combination
      reg.pushManager.subscribe({
        userVisibleOnly: true,
      });
      if (sub === null) {
        // Create Subscription
      } else {
        //We already have a subscription
      }
    });
}

// Push messages from back end server, means firebase cloud function which
// on firebase server
// Steps
// 1) register a subscription and store it on back end Server
// 2) that stored subscription has endpoint of our browser + device combination
//    to which the server send push notification.
// 3) generate vapid keys & send push notifications => web push package

self.addEventListener('push', (e) => {
  // clearly here SUBSCRIPTION is created with a service worker combination,
  // and if you unregister the SW then a new SW is created and new SW can't
  // identy push notifications of subscriptions of older service worker,
  // stored in firebase

  let data = {
    title: 'fallback title',
    content: 'fallback content ',
  };
  if (e.data) {
    data = JSON.parse(e.data.text());
  }

  const options = {
    body: data.content,
    icon: '/icons/manifest-icon-192.maskable.png',
    image: '/icons/manifest-icon-512.maskable.png',
    // it is not recommended to send images files because webpush, only
    // accepts string data uptp 4kb only, always go with url strings like this.
  };
  // to show notification we should find, SWREG object
  e.waitUntil(self.registration.showNotification(data.title, options));
});
