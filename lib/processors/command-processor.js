const DELAY_COMMAND_MS = 25;
const DELAY_COMMAND_LENGTH = 4;

let delayBetweenCommands = DELAY_COMMAND_MS;

let CommandProcessor = function (customCommandDefinitions) {
    this.customCommandDefinitions = customCommandDefinitions;
};

CommandProcessor.prototype.executeCommands = function (target, commands, executeCommandCallback) {
    for (let i = 0; i < commands.length; i++) {

        let command = commands[i].trim();
        let commandFound = true;

        console.log(target + ' - Received command: ' + command);

        let commandSequenceToExecute = this.customCommandDefinitions[command];

        if (!commandSequenceToExecute) {
            commandSequenceToExecute = [command];
            commandFound = false;
        }

        let commandSequenceLength = commandSequenceToExecute.length;

        while (commandFound) {
            commandSequenceToExecute = this.expandCommands(commandSequenceToExecute);
            if (commandSequenceToExecute.length === commandSequenceLength) {
                break;
            }
            commandSequenceLength = commandSequenceToExecute.length;
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
                delayBetweenCommands = delayBetweenCommands + parseInt(commandToExecute);
                continue;
            }

            commandExecutioner(commandToExecute, delayBetweenCommands);

            delayBetweenCommands = delayBetweenCommands + DELAY_COMMAND_MS;
        }

        delayBetweenCommands = delayBetweenCommands + DELAY_COMMAND_MS;
    }
};

CommandProcessor.prototype.expandCommands = function (commands) {
    let expandedCommands = [];

    for (let i = 0; i < commands.length; i++) {
        let command = commands[i];

        let customCommand = this.customCommandDefinitions[command];

        if (!customCommand) {
            expandedCommands.push(command);
            continue;
        }

        expandedCommands = expandedCommands.concat(customCommand);
    }

    return expandedCommands;
};

module.exports = function (customCommandDefinitions) {
    return new CommandProcessor(customCommandDefinitions);
};