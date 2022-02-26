/**
 * To generate private and publick key just run this file with node js
 * @type {{supportedContentEncodings: *, WebPushError: function(*, *, *, *, *): void, encrypt: function(*, *, *, *): {salt: *, cipherText: *, localPublicKey: Buffer}, getVapidHeaders: function(string, string, string, string, string, integer=): ({Authorization: string}|undefined), setGCMAPIKey: WebPushLib.setGCMAPIKey, setVapidDetails: WebPushLib.setVapidDetails, sendNotification: WebPushLib.sendNotification, generateRequestDetails: WebPushLib.generateRequestDetails, generateVAPIDKeys: function(): {privateKey: *, publicKey: *}}|{WebPushError?: function(*, *, *, *, *): void, supportedContentEncodings?: *, encrypt?: function(*, *, *, *): {salt: *, cipherText: *, localPublicKey: Buffer}, getVapidHeaders?: function(string, string, string, string, string, integer=): ({Authorization: string}|undefined), generateVAPIDKeys?: function(): {privateKey: *, publicKey: *}, setGCMAPIKey?: WebPushLib.setGCMAPIKey, setVapidDetails?: WebPushLib.setVapidDetails, generateRequestDetails?: WebPushLib.generateRequestDetails, sendNotification?: WebPushLib.sendNotification}}
 */

const webpush = require('web-push');
const fs = require('fs');
let vapidKeysStr = '';

const vapidKeys = webpush.generateVAPIDKeys();

for (let key in vapidKeys) {
    vapidKeysStr += `${key} : ${vapidKeys[key]} \r\n`
}

fs.writeFileSync('vapid.txt', vapidKeysStr);
