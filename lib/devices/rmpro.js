const broadlinkJS = require('broadlinkjs-rm');

let broadlink = new broadlinkJS();

let RmPro = function(host){
    this.host = host;
    this.device = broadlink.discover();
};

module.exports = function(host){
  return new RmPro(host);
};