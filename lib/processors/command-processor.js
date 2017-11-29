const devices = require('../../devices.json');
const DELAY_COMMAND_MS = 100;
const DELAY_COMMAND_LENGTH = 4;

let delayBetweenCommands = DELAY_COMMAND_MS;

let CommandProcessor = function () {
};

CommandProcessor.prototype.executeCommands = function (target, commands, customCommandDefinitions, executeCommandCallback) {

    for (let i = 0; i < commands.length; i++) {

        let command = commands[i];

        console.log(target + ' - Received command: ' + command);

        let commandSequenceToExecute = customCommandDefinitions[command];

        if (!commandSequenceToExecute){
            commandSequenceToExecute = [command]
        }

        console.log(target + ' - Command sequence: ' + commandSequenceToExecute);

        let commandExecutioner = function (commandToRun, commandDelay) {
            setTimeout(function () {
                console.log(target + ' - Executing command: ' + commandToRun);
                executeCommandCallback(commandToRun);
            }, commandDelay);
        };

        for (let z = 0; z < commandSequenceToExecute.length; z++) {
            let commandToExecute = commandSequenceToExecute[z];

            if (!isNaN(commandToExecute) && commandToExecute.length >= DELAY_COMMAND_LENGTH) {
                delayBetweenCommands = delayBetweenCommands + parseInt(deviceCommand);
                continue;
            }

            commandExecutioner(commandToExecute, delayBetweenCommands);

            delayBetweenCommands = delayBetweenCommands + DELAY_COMMAND_MS;
        }

        delayBetweenCommands = delayBetweenCommands + DELAY_COMMAND_MS;
    }
};

CommandProcessor.prototype.transformCommands = function (commands, customCommands) {
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

module.exports = function () {
    return new CommandProcessor();
};