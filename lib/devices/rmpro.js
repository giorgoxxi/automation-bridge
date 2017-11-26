const broadlinkJS = require('broadlinkjs-rm');

let broadlink = new broadlinkJS();

let RmPro = function(deviceConfig){
    this.device = broadlink.genDevice(deviceConfig.deviceType, {"address":deviceConfig.ip, "port":deviceConfig.port}, deviceConfig.mac);
    this.device.auth();
};

module.exports = function(deviceConfig){
  return new RmPro(deviceConfig);
};