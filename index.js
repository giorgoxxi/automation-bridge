const express = require('express'),
    config = require('./config.json'),
    bodyParser = require('body-parser'),
    sceneProcessor = require('./lib/processors/scene-processor'),
    actionProcessor = require('./lib/processors/action-processor'),
    fs = require('fs'),
    util = require('util');

let log_file = fs.createWriteStream(__dirname + '/debug.log', {flags: 'a'});
let log_stdout = process.stdout;

console.log = function (d) {
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

process.__defineGetter__('stderr', function () {
    return fs.createWriteStream(__dirname + '/error.log', {flags: 'a'})
});

let app = express();
let port = process.env.port || config.port;

app.use(bodyParser.json());
app.listen(port);

console.log('Listening on port ' + port);

app.post("/", function (request, response) {

    let requestBody = request.body;

    if (!requestBody.key || requestBody.key !== config.apiKey) {
        response.status(401).send();
        return;
    }

    if (!requestBody.scene && (!requestBody.actions && !requestBody.target)) {
        response.status(400).send();
        return;
    }

    if (requestBody.scene) {
        sceneProcessor(requestBody.scene, function (processor) {
            processor.executeScene();
        })
    } else {
        actionProcessor(requestBody.target, requestBody.actions, function (processor) {
            processor.executeActions();
        })
    }

    response.status(200).send();

    console.log('Finished processing request');
});


