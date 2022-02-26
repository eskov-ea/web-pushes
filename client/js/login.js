const loginBtn = document.querySelector('.loginBtn');

loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const username = document.querySelector('#loginInput').value;
    const password = document.querySelector('#passwordInput').value;
    const url = 'http://127.0.0.1:5001/login';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({username, password})
    });
    const response = await res.json();
    if (response.status == 200) {
        const Storage = window.localStorage;
        Storage.userId = response.user.id;
        Storage.login = response.user.username;
        window.location.href = 'http://127.0.0.1:5500/index.html';
    } else {
        console.log('something wrong')
    }
})
