const submitBtn = document.querySelector('.submit-btn');
const fetchBtn = document.querySelector('.fetch-btn');
const city = document.querySelector('#city');
const country = document.querySelector('#country');
const url = 'https://pwa-practice-49ad4-default-rtdb.firebaseio.com/posts.json';

submitBtn.addEventListener('click', async () => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    console.log('SYNC MANAGER BLOCK========================>');
    navigator.serviceWorker.ready.then((swReg) => {
      const post = {
        id: new Date().getTime(),
        city: city.value || 'Hyderabad',
        country: country.value || 'India',
      };
      writedata('offline-posts', post)
        .then(() => {
          return swReg.sync.register('sync-new-posts');
        })
        .then((data) => {
          // update DOM
        });
    });
  } else {
    const post = {
      id: new Date().getTime().toString(),
      city: city.value || 'Hyderabad',
      country: country.value || 'India',
    };
    const data = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(post),
      mode: 'no-cors',
    }).then((resp) => resp);
    console.log(data);
  }
});

let networkRecieved = false;
fetchBtn.addEventListener('click', async () => {
  const data = await fetch(url).then((resp) => resp.json());
  networkRecieved = true;
  console.log(data);
});

if ('indexedDB' in window) {
  readAllData('posts').then((data) => {
    if (!networkRecieved) {
      console.log(data);
    }
  });
}
