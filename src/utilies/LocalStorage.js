async function getStorageItem(key) {
    return new Promise((resolve, reject) => {
        var storedItem = {};
        try {
            storedItem = JSON.parse(localStorage.getItem(key));
            if (storedItem == null)
                resolve({});
            else
                resolve(storedItem);
        }
        catch (error) {
            resolve({});
        }
    })
}

async function setStorageItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

async function setStorageItemDB(key, value) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('RthkArchiveDB', 1);

        request.onerror = function (event) {
            reject('Error opening database');
        };

        request.onsuccess = function (event) {
            const db = event.target.result;

            const transaction = db.transaction(['RthkArchiveTable'], 'readwrite');
            const objectStore = transaction.objectStore('RthkArchiveTable');

            const putRequest = objectStore.put(value, key);

            putRequest.onerror = function (event) {
                reject('Error adding item to IndexedDB');
            };

            putRequest.onsuccess = function (event) {
                resolve();
            };

            transaction.oncomplete = function () {
                db.close();
            };
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('RthkArchiveTable');
        };
    });
}

async function getStorageItemDB(key) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('RthkArchiveDB', 1);

        request.onerror = function (event) {
            reject('Error opening database');
        };

        request.onsuccess = function (event) {
            const db = event.target.result;

            const transaction = db.transaction(['RthkArchiveTable'], 'readonly');
            const objectStore = transaction.objectStore('RthkArchiveTable');

            const getRequest = objectStore.get(key);

            getRequest.onerror = function (event) {
                reject('Error retrieving item from IndexedDB');
            };

            getRequest.onsuccess = function (event) {
                const storedItem = event.target.result;
                if (storedItem) {
                    resolve(storedItem);
                } else {
                    resolve({});
                }
            };

            transaction.oncomplete = function () {
                db.close();
            };
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('RthkArchiveTable');
        };
    });
}
export { getStorageItem, setStorageItem, setStorageItemDB, getStorageItemDB }