const request = require('request'),
    customCommands = require('../../commands/bravia-commands.json'),
    rawCommands = require('../../commands/raw/bravia-raw-commands.json'),
    wol = require('wakeonlan'),
    commandProcessor = require('../processors/command-processor.js');

const TV_DEEP_SLEEP = -1;
const TV_SLEEP = 0;
const TV_ON = 1;
const TV_DEEP_SLEEP_DELAY = 45000;
const TV_SLEEP_DELAY = 5000;

let Bravia = function (deviceConfig, callback) {
    let that = this;

    this.ip = deviceConfig.ip;
    this.secret = deviceConfig.password;
    this.mac = deviceConfig.mac;

    if (callback !== undefined) {
        callback(that)
    }
};

Bravia.prototype.executeCommands = function (commands) {
    let that = this;

    this.checkPowerStatus(function (isOn) {
        let delay = 0;

        let runCommandsFunction = function () {
            new commandProcessor().executeCommands('Bravia', commands, customCommands, that.processCommand.bind(that))
        };

        if (isOn === TV_ON) {
            console.log('TV is on...');
            runCommandsFunction();
        } else {
            console.log('TV is off...');

            delay = isOn === TV_SLEEP ? TV_SLEEP_DELAY : TV_DEEP_SLEEP_DELAY;

            wol(that.mac).then(() => {
                setTimeout(runCommandsFunction, delay);
            });
        }
    });
};

Bravia.prototype.processCommand = function (command) {
    let that = this;

    let body = '<?xml version="1.0"?>' +
        '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
        '<s:Body>' +
        '<u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">' +
        '<IRCCCode>' + rawCommands[command] + '</IRCCCode>' +
        '</u:X_SendIRCC>' +
        '</s:Body>' +
        '</s:Envelope>';

    this.request({
        path: '/sony/IRCC',
        body: body,
        headers: {
            'X-Auth-PSK': that.secret,
            'Content-Type': 'text/xml charset=UTF-8',
            'SOAPACTION': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"'
        }
    }, function (response) {
    })
};

Bravia.prototype.checkPowerStatus = function (callback) {
    let that = this;

    console.log("Checking TV power status...");

    body = JSON.stringify({
        'method': 'getPowerStatus',
        'version': '1.0',
        'params': [],
        'id': 101
    });

    this.request({
        path: '/sony/system',
        body: body,
        headers: {
            'X-Auth-PSK': that.secret,
            'Content-Type': 'text/xml charset=UTF-8',
            'SOAPACTION': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"'
        }
    }, function (response, success) {

        if (!success) {
            callback(TV_DEEP_SLEEP);
            return
        }
        response = JSON.parse(response);

        if (response.result) {

            response.result[0].status === 'active' ? status = TV_ON : status = TV_SLEEP;

            if (callback !== undefined) {
                callback(status)
            }
        }
    })
};

Bravia.prototype.request = function (options, callback) {
    options.url = 'http://' + this.ip + options.path;
    options.timeout = 2000;

    request.post(options, function (error, response, body) {
        if (error) {
            callback(null, false)
        } else if (callback !== undefined) {
            callback(body, true)
        }
    })
};

module.exports = function (deviceConfig, callback) {
    return new Bravia(deviceConfig, callback)
};