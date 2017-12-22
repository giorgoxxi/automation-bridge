const deviceManagerFactory = require('../device-manager-factory'),
    devices = require('../../user-config/devices.json');

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
        commands = CommonProcessor.replaceParameters(commands, parameters);
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
    let processedCommands = commands.slice();

    for (let i = 0; i < processedCommands.length; i++) {
        let command = processedCommands[i];

        if (command.startsWith(PARAMETER_KEYWORD)) {
            let parameterNumber = parseInt(command.substring(PARAMETER_KEYWORD.length));

            if (parameters && parameters.length >= parameterNumber) {
                processedCommands[i] = parameters[parameterNumber - 1];
            }
        }
    }

    return processedCommands;
};

module.exports = CommonProcessor;
