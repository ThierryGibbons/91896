/*jshint esversion: 8 */

var server = require('./comsWorldServer.js');

var httpServer = new server.Server();
httpServer.listen();
httpServer.discordRP("loading..");

var i = 0;
while (i < 200) {
    console.log(i);
    var i = i += 1;
}
