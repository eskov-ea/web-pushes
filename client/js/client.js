const vapidKey = 'BJ47mTyLGqEnQZR0kymxJmReHKjE9jJgFEPnwbHzYR8RKi3dUguQZvmFu4a49oWkn7JvYRQYSvcQhpidpVlbWVI';

const subscribe = document.querySelector('#subscribe');
const usersContainer = document.querySelector('#users_container');
const Storage = window.localStorage;

subscribe.addEventListener('click', async function (e) {
    /**
     * check scope in prod mode
     * @type {ServiceWorkerRegistration}
     */
    const registration = await navigator.serviceWorker.register('js/serviceWorker.js', {scope: '/js/'});
    console.log('registration   --> ', registration);
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
    });
    const payload = {
        userId: Storage.userId,
        subscription
    }
    console.log('subscription   --> ', subscription);
    await fetch('http://localhost:5001/subscribe/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(payload)
    });
});

const urlBase64ToUint8Array = function(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const getUsers = async () => {
    const res = await fetch('http://localhost:5001/users', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
    });
    const data =  await res.json();
    data.users.map(u => {
        const btnEl = document.createElement('button');
        btnEl.innerText = u.username;
        btnEl.setAttribute("id", u._id);
        btnEl.setAttribute("class", "user btn btn-secondary w-100 my-1");
        usersContainer.appendChild(btnEl);
    })
};
const sendMessage = async (id) => {
    const title = document.querySelector('#msg_title').value;
    const body = document.querySelector('#msg_body').value;
    const payload = {id, title, body}
    const res = await fetch('http://localhost:5001/sent-notifications', {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log(data);
}

getUsers();

usersContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('user')) {
        Storage.resiverId = null;
        usersContainer.childNodes.forEach(u => {
            u.classList.remove('btn-warning');
        });
        e.target.classList.add('btn-warning');
        Storage.resiverId = e.target.id;
    }
})
console.log(Storage)

const sendBtn = document.querySelector('#send');
sendBtn.addEventListener('click', () => {
    sendMessage(Storage.resiverId);
})
