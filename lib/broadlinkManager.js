const customCommands = require('../commands/broadlink-commands.json'),
    bravia = require('../lib/bravia'),
    common = require('../lib/common.js'),
    rmpro = require('../lib/devices/rmpro');

let device = null;

let BroadlinkManager = function (ip, callback) {
    let that = this;

    this.ip = ip;
    this.commonHelper = new common(bravia,null);

    device = rmpro(ip).device;

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
    if(device === false || command === false) {
        console.log('Missing params, sendData failed', typeof device, typeof command);
        return;
    }

    const hexDataBuffer = new Buffer(command, 'hex');
    device.sendData(hexDataBuffer);
};

module.exports = function (ip, callback) {
    return new BroadlinkManager(ip, callback)
};