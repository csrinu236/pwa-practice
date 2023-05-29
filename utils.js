const dbPromise = idb.open('posts-store', 1, (db) => {
  //   db we, got access to database object here
  if (!db.objectStoreNames.contains('posts')) {
    db.createObjectStore('posts', { keyPath: 'id' });
  }
  if (!db.objectStoreNames.contains('offline-posts')) {
    db.createObjectStore('offline-posts', { keyPath: 'id' });
  }
  // id is useful to find single object in that databse
});

const writedata = (st, data) => {
  return dbPromise.then((db) => {
    const tx = db.transaction(st, 'readwrite');
    const store = tx.objectStore(st);
    store.put(data);
    return tx.complete;
  });
};

const readAllData = (st) => {
  return dbPromise.then((db) => {
    const tx = db.transaction(st, 'readonly');
    const store = tx.objectStore(st);
    return store.getAll();
  });
};

const deleteItemFromDB = (st, id) => {
  console.log('ID ID=========> ', id);
  return dbPromise.then((db) => {
    const tx = db.transaction(st, 'readwrite');
    const store = tx.objectStore(st);
    store.delete(id);
    return tx.complete;
  });
};
