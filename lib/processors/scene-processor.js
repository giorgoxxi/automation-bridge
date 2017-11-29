const scenes = require('../../scenes.json'),
    deviceManagerFactory = require('../device-manager-factory'),
    devices = require('../../devices.json');

let SceneProcessor = function(scene, callback) {
    let that = this;

    this.scene = scenes[scene];

    if (callback !== undefined && this.scene){
        callback(that);
    }
};

SceneProcessor.prototype.executeScene = function() {
    for(let deviceName in this.scene){
        let deviceManager = deviceManagerFactory(deviceName).deviceManager;

        if (!deviceManager){
            continue;
        }

        let deviceConfig = devices[deviceName];
        let commands = this.scene[deviceName];

        deviceManager(deviceConfig, function(manager){
            manager.executeCommands(commands);
        })
    }
};

module.exports = (scene, callback) => {
    return new SceneProcessor(scene, callback);
};