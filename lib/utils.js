var _ = require('lodash');
var unflatten = require('flat').unflatten;

module.exports = {
  decodePayloadFromAccessToken: function(token) {
    var accessTokens = _.split(token, '.');
    var payloadString = new Buffer(accessTokens[1], 'base64').toString('ascii');
    var payloadJson = JSON.parse(payloadString);
    return payloadJson;
  },
}