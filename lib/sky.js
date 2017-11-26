const skyRemote = require('sky-remote'),
    customCommands = require('../commands/sky-commands.json'),
    bravia = require('../lib/bravia'),
    broadlink = require('../lib/broadlinkManager'),
    common = require('../lib/common.js');

let Sky = function (ip, callback){
    let that = this;

    this.ip = ip;
    this.commonHelper = new common(bravia, broadlink);
    this.skyRemote = new skyRemote(this.ip);

    if (callback !== undefined) {
        callback(that)
    }
};

Sky.prototype.command = function (commands) {
    this.commonHelper.runCommands('Sky', commands, customCommands, this.processIRCommand.bind(this));
};

Sky.prototype.processIRCommand = function(command){
    this.skyRemote.press(command);
};

module.exports = function (ip, callback) {
    return new Sky(ip, callback)
};