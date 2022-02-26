const {Schema, model} = require('mongoose');


const subscription = new Schema({
    hash: 'string',
    subscriptionEl: {
        endpoint: 'string',
        expirationTime: 'string',
        keys: {
            p256dh: 'string',
            auth: 'string'
        }
    },
    userId: {type: String}
})

module.exports = model('Subscription', subscription);
