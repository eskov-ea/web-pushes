self.addEventListener('push', e => {
    const data = e.data.json();
    console.log('SW data is ', data)
    // self.registration.showNotification(data.message);
    // console.log(data)
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: 'favicon.png',
        image: data.image
    });

});
