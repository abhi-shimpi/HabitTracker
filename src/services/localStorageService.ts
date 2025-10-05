function setDataToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getDataFromLocalStorage(key) {
    return localStorage.getItem(key);
}

function removeDatafromLocalstorage(key) {
    localStorage.removeItem(key);
}

export { setDataToLocalStorage, getDataFromLocalStorage ,removeDatafromLocalstorage};