const scenes = require('../../scenes.json'),
    deviceManagerFactory = require('../device-manager-factory'),
    devices = require('../../devices.json');

const PARAMETER_KEYWORD = 'PARAM';

let SceneProcessor = function (scene, parameters, callback) {
    let that = this;

    this.scene = scenes[scene];
    this.parameters = parameters;

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

        if (this.parameters) {
            this.replaceParameters(commands);
        }

        deviceManager(deviceConfig, function(manager){
            manager.executeCommands(commands);
        })
    }
};

SceneProcessor.prototype.replaceParameters = function (commands) {
    for (let i = 0; i < commands.length; i++) {
        let command = commands[i];

        if (command.startsWith(PARAMETER_KEYWORD)) {
            let parameterNumber = parseInt(command.substring(PARAMETER_KEYWORD.length));

            if (this.parameters && this.parameters.length >= parameterNumber) {
                commands[i] = this.parameters[parameterNumber - 1];
            }
        }
    }
};

module.exports = (scene, parameters, callback) => {
    return new SceneProcessor(scene, parameters, callback);
};