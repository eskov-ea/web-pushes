const {Schema, model} = require('mongoose');


const message = new Schema({
    user: {type: String, required: true},
    message: {type: String, required: true}
})

module.exports = model('Message', message);