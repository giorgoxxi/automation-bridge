const deviceManagerFactory = require('../device-manager-factory'),
    devices = require('../../devices.json');

const PARAMETER_KEYWORD = 'PARAM';

let CommonProcessor = function () {
};

CommonProcessor.executeCommands = function (deviceName, commands, parameters) {
    let deviceConfigs = {};
    let deviceConfig = devices[deviceName];

    if (!deviceConfig) {
        for (let deviceDefinition in devices) {
            let device = devices[deviceDefinition];

            if (device.group && device.group === deviceName) {
                deviceConfigs[deviceDefinition] = device;
            }
        }
    } else {
        deviceConfigs[deviceName] = deviceConfig;
    }

    if (parameters) {
        CommonProcessor.replaceParameters(commands, parameters);
    }

    for (let deviceNameConfig in deviceConfigs) {
        let deviceManager = deviceManagerFactory(deviceNameConfig).deviceManager;

        if (deviceManager) {
            deviceManager(deviceConfigs[deviceNameConfig], function (manager) {
                manager.executeCommands(commands);
            })
        }
    }
};

CommonProcessor.replaceParameters = function (commands, parameters) {
    for (let i = 0; i < commands.length; i++) {
        let command = commands[i];

        if (command.startsWith(PARAMETER_KEYWORD)) {
            let parameterNumber = parseInt(command.substring(PARAMETER_KEYWORD.length));

            if (parameters && parameters.length >= parameterNumber) {
                commands[i] = parameters[parameterNumber - 1];
            }
        }
    }
};

module.exports = CommonProcessor;
