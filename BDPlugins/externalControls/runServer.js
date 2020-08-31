/* jshint esversion: 9 */

var server = require('./comsWorldServer.js');

var http = require("http");

var httpServer = new server.Server();
httpServer.listen();

httpServer.post({body: "text here"});



async function _post() {
  const res = await httpServer.post({
    hostname: 'sentry.io',
    path: `/temp`,
    headers: {
      'Authorisation': `Bearer ${process.env.SENTRY_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'production' : 'demo',
    })
  })
  .catch(console.log("i caught it!!"));
}

_post();
