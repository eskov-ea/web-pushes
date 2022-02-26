const sendBtn = document.querySelector('.sendBtn');

sendBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const username = document.querySelector('#loginInput').value;
    const password = document.querySelector('#passwordInput').value;
    const url = 'http://127.0.0.1:5001/registration';
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
    if (response.status == 201) {
        window.location.href = '/login.html';
    } else {
        console.log(response)
    }
});
