const webpush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const objectHash = require('object-hash');
const connection = require('./settings/db');
const bcrypt = require('bcrypt');
const Message = require('./models/messages');
const Subscription = require('./models/subscription');
const Users = require('./models/users');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const config = require('../config');
const authMiddleware = require('./middleware/authMiddleware');


const secret = config.secret;
const privateVapidKey = config.privateVapidKey;
const publicVapidKey = config.publicVapidKey;
const saltRounds = 10;

const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methods: "*",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 5001;
const server = async () => {
    try {
        const mongo = await connection();
        app.listen(PORT, () => {
            console.log('Server launched');
        })
    } catch (err) {
        console.log(err);
    }
}
server();

const generateAccessToken = (id, username) => {
    const payload = {
        id,
        username
    }
    return jwt.sign(payload, secret, {expiresIn: '2h'});
}

webpush.setVapidDetails('mailto:eskov@cashalot.co', publicVapidKey, privateVapidKey);

app.get('/users', cors(corsOptions), authMiddleware,  async function(req, res){
    try {
        const users = await Users.find({});
        res.status(200).json({message: 'Users list', users});
    } catch (err) {
        console.log(err)
        res.status(400).json({message: 'Bad request'});
    }
})
app.options('*', cors(corsOptions));

app.post('/subscribe',  authMiddleware, async function(req, res) {
    try {
        let hash = objectHash(req.body);
        let subscription = req.body.subscription;
        let userId = req.body.userId;
        let checkSubscription = await Subscription.find({ 'hash' : hash });
        let theMessage = JSON.stringify({ title: 'You have already subscribed', body: 'Some body text here.' });
        if(checkSubscription.length == 0) {
            const newSubscription = new Subscription({
                hash: hash,
                subscriptionEl: subscription,
                userId
            });
            newSubscription.save(function (err) {
                if (err) {
                    theMessage = JSON.stringify({ title: 'We ran into an error', body: 'Please try again later' });
                    webpush.sendNotification(subscription, theMessage).catch(function(error) {
                        console.error(error.stack);
                    });
                    res.status(400);
                } else {
                    theMessage = JSON.stringify({ title: 'Thank you for Subscribing!', body: 'Some body text here' });
                    webpush.sendNotification(subscription, theMessage).catch(function(error) {
                        console.error(error.stack);
                    });
                    res.status(201);
                }
            });
        } else {
            webpush.sendNotification(subscription, theMessage).catch(function(error) {
                console.error(error.stack);
            });
            res.status(400);
        }
    } catch(e) {
        console.log(e);
    }
});

app.post('/sent-notifications', cors(corsOptions), authMiddleware, async function (req, res){
    try {
        const id = req.body.id;
        const title = req.body.title;
        const body = req.body.body;
        const allSubscriptions = await Subscription.find();
        console.log(allSubscriptions);
        console.log(req.body);
        allSubscriptions.forEach(function(item) {
            if (item.userId === id) {
                let ourMessage = JSON.stringify({title, body});
                webpush.sendNotification(item.subscriptionEl, ourMessage).catch(function(error) {
                    console.error(error.stack);
                });
                res.status(200).json({"message" : "notification sent"});
            }
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({"error" : err});
    }
});

app.post('/registration', cors(corsOptions), async (req,res) => {
    try {
        const username = req.body.username;
        let password = bcrypt.hashSync(req.body.password, saltRounds);
        const isUserExist = await Users.findOne({username});
        if (!isUserExist) {
            const user = new Users({username, password});
            await user.save();
            res.status(201).json({status: '201', message: 'Registration success'});
        } else {
            res.status(400).json('User with this logis is already exist');
        }
    } catch (err) {
        console.log(err)
    }
});

app.post('/login', cors(corsOptions), async (req,res) => {
    try {
        const username = req.body.username;
        const user = await Users.findOne({user: username});
        let checkPassword = bcrypt.compareSync(req.body.password, user.password);
        console.log(user)
        const token = generateAccessToken(user._id, user.username);
        if (checkPassword) {
            res.status(200).json({
                status: "200",
                message: "Login success",
                user: {
                    username: username,
                    id: user._id,
                    token: token
                }
            });
        } else {
            res.status(400).json('Login or password is incorrect');
        }
    } catch (err) {
        console.log(err)
    }
});

