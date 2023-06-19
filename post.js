const submitBtn = document.querySelector('.submit-btn');
submitBtn.disabled = true;
const fetchBtn = document.querySelector('.fetch-btn');
const city = document.querySelector('#city');
const country = document.querySelector('#country');
// const url = 'https://pwa-practice-49ad4-default-rtdb.firebaseio.com/posts.json';
const url = 'http://localhost:3000/posts';

function toggleSubmitBtn() {
  if (city.value.trim() !== '' && country.value.trim() !== '') {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}

navigator.serviceWorker.onmessage = function (event) {
  console.log('Received message from service worker:', event.data);
};

city.addEventListener('input', toggleSubmitBtn);
country.addEventListener('input', toggleSubmitBtn);

submitBtn.addEventListener('click', async () => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    console.log('SYNC MANAGER BLOCK========================>');
    navigator.serviceWorker.ready.then((swReg) => {
      const post = {
        id: new Date().getTime(),
        city: city.value,
        country: country.value,
      };
      city.value = '';
      country.value = '';
      submitBtn.disabled = true;

      writedata('offline-posts', post)
        .then(() => {
          return swReg.sync.register('sync-new-posts');
        })
        .then((data) => {
          console.log('post registered for SYNC');
          // update DOM
        });
    });
  } else {
    const post = {
      id: new Date().getTime(),
      city: city.value,
      country: country.value,
    };
    city.value = '';
    country.value = '';
    submitBtn.disabled = true;

    const data = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
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
