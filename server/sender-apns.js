//https://github.com/node-apn/node-apn
//https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns
//https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification


const apn = require('apn');
const fs = require('fs');
const config = require('../config');


const privateKey = fs.readFileSync('../AuthKey_9HU4TZ5FNM.p8');
const options = {
    token: {
      key: privateKey,
      keyId: config.kid,
      teamId: config.iss
    },
    production: false
  };

const apnProvider = new apn.Provider(options);

let deviceToken = "1F89916340154CC440E68219373B8695CA627D73E04E33CA0015E1E88A93FE2C";
//let deviceToken = Buffer.from("1F89916340154CC440E68219373B8695CA627D73E04E33CA0015E1E88A93FE2C", 'hex');

let note = new apn.Notification();

note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
note.badge = 3;
note.sound = "ping.aiff";
note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
note.payload = {'messageFrom': 'John Appleseed'};
// note.topic = "<your-app-bundle-id>";

apnProvider.send(note, deviceToken).then( (result) => {
    // see documentation for an explanation of result
    console.log(result)
  });
