const commonProcessor = require('./common-processor');

let ActionProcessor = function (deviceName, actions, parameters, callback) {
    let that = this;

    this.deviceName = deviceName;
    this.actions = actions;
    this.parameters = parameters;

    if (callback !== undefined) {
        callback(that);
    }
};

ActionProcessor.prototype.executeActions = function () {
    commonProcessor.executeCommands(this.deviceName, this.actions, this.parameters);
};

module.exports = function (deviceName, actions, parameters, callback) {
    return new ActionProcessor(deviceName, actions, parameters, callback);
};