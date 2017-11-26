const devices = require('../devices.json');
const DELAY_COMMAND_MS = 100;
const DELAY_COMMAND_LENGTH = 4;

let delayBetweenCommands = DELAY_COMMAND_MS;

let Common = function (bravia, broadlink) {
    this.bravia = bravia;
    this.broadlink = broadlink;
};

Common.prototype.runCommands = function (target, commands, customCommands, executeCommandCallback) {

    for (let i = 0; i < commands.length; i++) {

        let command = commands[i];

        console.log(target + ' - Received command: ' + command);

        let commandSequence = customCommands[command];

        if (!commandSequence) {
            commandSequence = {"deviceCommands": [command]};
        }

        console.log(target + ' - Command sequence:' + commandSequence.deviceCommands);

        if (this.bravia && commandSequence.braviaCommands) {
            console.log('Bravia - Command sequence:' + commandSequence.braviaCommands);

            let device = devices['bravia'];

            this.bravia(device.ip, device.mac, device.password, function (client) {
                console.log('Calling Bravia commands...');
                client.command(commandSequence.braviaCommands)
            })
        }

        if (this.broadlink && commandSequence.broadlinkCommands) {
            console.log('Broadlink - Command sequence:' + commandSequence.broadlinkCommands);

            let device = devices['broadlink'];

            this.broadlink(device, function (client) {
                console.log('Calling Broadlink commands...');
                client.command(commandSequence.broadlinkCommands)
            })
        }

        deviceCommands = commandSequence.deviceCommands;// this.transformCommands(commandSequence.deviceCommands.slice(), customCommands);

        let commandExecutioner = function (commandToRun, commandDelay) {
            setTimeout(function () {
                console.log(target + ' - Executing command: ' + commandToRun);
                executeCommandCallback(commandToRun);
            }, commandDelay);
        };

        for (let z = 0; z < deviceCommands.length; z++) {
            let deviceCommand = deviceCommands[z];

            if (!isNaN(deviceCommand) && deviceCommand.length >= DELAY_COMMAND_LENGTH) {
                delayBetweenCommands = delayBetweenCommands + parseInt(deviceCommand);
                continue;
            }

            commandExecutioner(deviceCommand, delayBetweenCommands);

            delayBetweenCommands = delayBetweenCommands + DELAY_COMMAND_MS;
        }

        delayBetweenCommands = delayBetweenCommands + DELAY_COMMAND_MS;
    }
};

Common.prototype.transformCommands = function (commands, customCommands) {
    let transformedCommands = [];

    for (let i = 0; i < commands.length; i++) {
        let command = commands[i];
        let rawCommand = customCommands[command];

        if (!rawCommand) {
            rawCommand = command
        }

        if (rawCommand.constructor === Array) {
            transformedCommands = transformedCommands.concat(rawCommand);
        } else {
            transformedCommands.push(rawCommand);
        }
    }

    return transformedCommands;
};

module.exports = function (bravia, broadlink) {
    return new Common(bravia, broadlink);
};