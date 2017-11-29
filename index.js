const express = require('express'),
    config = require('./config.json'),
    http = require('http'),
    bodyParser = require('body-parser'),
    sceneProcessor = require('./lib/processors/scene-processor'),
    actionProcessor = require('./lib/processors/action-processor');

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

    console.log('Finished processing command');
});


