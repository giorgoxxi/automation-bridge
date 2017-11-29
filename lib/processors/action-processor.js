const deviceManagerFactory = require('../device-manager-factory'),
    devices = require('../../devices.json');

let ActionProcessor = function (deviceName, actions, callback) {
    let that = this;

    this.deviceName = deviceName;
    this.actions = actions;

    if (callback !== undefined) {
        callback(that);
    }
};

ActionProcessor.prototype.executeActions = function () {
    let deviceManager = deviceManagerFactory(this.deviceName).deviceManager;

    if (!deviceManager) {
        return
    }

    let deviceConfig = devices[this.deviceName];
    let commands = this.actions;

    deviceManager(deviceConfig, function (manager) {
        manager.executeCommands(commands);
    })
};

module.exports = function (deviceName, actions, callback) {
    return new ActionProcessor(deviceName, actions, callback);
};