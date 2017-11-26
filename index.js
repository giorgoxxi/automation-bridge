const express = require('express'),
    bravia = require('./lib/bravia'),
    devices = require('./devices.json'),
    config = require('./config.json'),
    sky = require('./lib/sky'),
    virgin = require('./lib/virgin'),
    broadlink = require('./lib/broadlinkManager'),
    http = require('http'),
    bodyParser = require('body-parser');

let app = express();
let port = process.env.port || 999;

app.use(bodyParser.json());
app.listen(port);

console.log('Listening on port ' + port);

app.post("/", function (req, res) {

    if (!req.body.key || req.body.key !== config.apiKey){
        res.status(401).send();
        return;
    }

    if (req.body.action) {
        res.status(200).send('success');

        let target = req.body.target;

        if (!target){
            target = "bravia";
        }

        let device = devices[target];

        if (target === 'bravia') {
            bravia(device.ip, device.mac, device.password, function (client) {
                client.command(req.body.action)
            })
        }
        else if (target === 'sky') {
            sky(device.ip, function (client) {
                client.command(req.body.action)
            })
        }
        else if (target === 'virgin') {
            virgin(device.ip, function (client) {
                client.command(req.body.action)
            })
        }
        else if (target === 'broadlink') {
            broadlink(device.ip, function (client) {
                client.command(req.body.action)
            })
        }
    } else {
        res.status(500).send('Cannot parse command')
    }

    console.log('Finished processing command');
});


