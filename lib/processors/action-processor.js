const commonProcessor = require('./common-processor');

let ActionProcessor = function (deviceName, actions, callback) {
    let that = this;

    this.deviceName = deviceName;
    this.actions = actions;

    if (callback !== undefined) {
        callback(that);
    }
};

ActionProcessor.prototype.executeActions = function () {
    commonProcessor.executeCommands(this.deviceName, this.actions);
};

module.exports = function (deviceName, actions, callback) {
    return new ActionProcessor(deviceName, actions, callback);
};