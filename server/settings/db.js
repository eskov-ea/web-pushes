const mongoose = require('mongoose');
const config = require('../../config');


module.exports = async function connection  () {
    try {
        await mongoose.connect('mongodb://root:1234@127.0.0.1:27017')
    } catch (err) {
        console.log('DB connection error --> ',err)
    }
};
