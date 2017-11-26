const customCommands = require('../commands/broadlink-commands.json'),
    bravia = require('../lib/bravia'),
    common = require('../lib/common.js'),
    rmpro = require('../lib/devices/rmpro');

let device = null;

let BroadlinkManager = function (deviceConfig, callback) {
    let that = this;

    this.commonHelper = new common(bravia,null);

    device = rmpro(deviceConfig).device;

    setTimeout(function(){
        if (callback !== undefined) {
            callback(that)
        }
    }, 100);
};

BroadlinkManager.prototype.command = function (commands) {
    this.commonHelper.runCommands('Broadlink', commands, customCommands, this.processCommand.bind(this));
};

BroadlinkManager.prototype.processCommand = function (command) {
    if(!device || command === false) {
        console.log('Missing params, sendData failed', typeof device, typeof command);
        return;
    }

    const hexDataBuffer = new Buffer(command, 'hex');
    device.sendData(hexDataBuffer);
};

module.exports = function (deviceConfig, callback) {
    return new BroadlinkManager(deviceConfig, callback)
};