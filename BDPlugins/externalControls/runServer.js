/*jshint esversion: 8 */

var server = require('./comsWorldServer.js');

var httpServer = new server.Server();
httpServer.listen();
httpServer.discordRP("loading..");
httpServer.textShowcase();
