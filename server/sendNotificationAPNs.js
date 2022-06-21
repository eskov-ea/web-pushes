const config = require('../config');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const http2 = require("http2");

// export default () => {
//     const tokenPayload = {
//         alg : config.alg,
//         kid : config.kid,
//         iss :  config.iss,
//         iat : Math.round(new Date().getTime() / 1000)
//     };
//     const options = {
//         algoritm : config.alg
//     };
//     const privateKey = fs.readFileSync('../AuthKey_9HU4TZ5FNM.p8');
//     console.log(privateKey);
    
//     const token = jwt.sign(tokenPayload, privateKey, options)
//     console.log(token);
// }

const f = () => {
    const tokenPayload = {
        alg : config.alg,
        kid : config.kid,
        iss :  config.iss,
        iat : Math.round(new Date().getTime() / 1000)
    };
    const options = {
        algorithm : config.alg
    };
    const privateKey = fs.readFileSync('../AuthKey_9HU4TZ5FNM.p8');
    
    const token = jwt.sign(tokenPayload, privateKey, options);
    return token;

}


const express = require('express');
const app = express();


// const send = () => {
//     const token = f();
//     const payload = {
//         'aps': {
//             'alert' : {
//                 'title' : 'New message',
//                 'body' : 'You have one new message!',
//                 'action' : 'Read'
//             },
//             'url-args' : 'https://web-notifications.ru/static/'
//         }
//     };

//     const options = {
//         host: "api.sandbox.push.apple.com:443",
//         path: "/3/device/1F89916340154CC440E68219373B8695CA627D73E04E33CA0015E1E88A93FE2C",
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//             "apns-push-type": "alert"
//         }
//     };
//     const req = http2.request(options, (res) => {
//         res.on("data", function (data) {
//             responseString += data;
//         });
//         res.on("end", function () {
//             console.log(responseString); 
//         });
//     });

//     req.write(JSON.stringify(payload));
//     req.end();
// };

const send = () => {
    const token = f();
    const payload = {
        'aps': {
            'alert' : {
                'title' : 'New message',
                'body' : 'You have one new message!',
                'action' : 'Read'
            },
            'url-args' : 'https://web-notifications.ru/static/'
        }
    };

    const options = {
        // 'host': "api.sandbox.push.apple.com:443",
        ':path': "/3/device/1F89916340154CC440E68219373B8695CA627D73E04E33CA0015E1E88A93FE2C",
        ':method': "POST",
	':scheme' : 'https',
        'headers': {
            // "Content-Type": "application/json",
            "Authorization": `bearer ${token}`,
            // "apns-push-type": "alert"
        }
    };
const client = http2.connect('https://api.sandbox.push.apple.com:443');
console.log(client);
    const req = client.request(options);

    // If there is any error in connecting, log it to the console
    client.on('error', (err) => console.error(err))
    
req.on('response', (headers, flags) => {
        for (const name in headers) {
            if(name === ':status') {
                console.log({payload:`${name}: ${headers[name]}`});
            }
        }
    });

    // req.write(Buffer.from(JSON.stringify(payload), 'hex'));
    req.write(JSON.stringify(payload));
    req.end();
};

send();
