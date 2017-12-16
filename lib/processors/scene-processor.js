const scenes = require('../../user-config/scenes.json'),
    commonProcessor = require('./common-processor');

let SceneProcessor = function (scene, parameters, callback) {
    let that = this;

    this.scene = scenes[scene];
    this.parameters = parameters;

    if (callback !== undefined && this.scene) {
        callback(that);
    }
};

SceneProcessor.prototype.executeScene = function () {
    for (let deviceName in this.scene) {
        let commands = this.scene[deviceName];
        commonProcessor.executeCommands(deviceName, commands, this.parameters);
    }
};

module.exports = (scene, parameters, callback) => {
    return new SceneProcessor(scene, parameters, callback);
};