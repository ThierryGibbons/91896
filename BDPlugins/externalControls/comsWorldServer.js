"use strict";

/*jshint esversion: 8 */
/*jshint node: true */

var client = require('discord-rich-presence')('771318173202251777');

//tell the program to use external library(http) whenever http is mentioned
var http = require("http");

//create class called Server
class Server {
    //set local http server preferences
    constructor() {
        this.port = 8080;
        this.ip = "localhost";

        //call start function within this class
        this.start();
    }

    //start server when server called apon
    start() {
        this.server = http.createServer((req, res) => {
            this.processRequest(req, res);
        });

        this.server.on("clientError", (err, socket) => {
            socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
        });
        console.log("Server created");
    }

    //function that logs everything sent over the set port and ip for the server
    listen() {
        this.server.listen(this.port, this.ip);
        console.log("Server listening for connections");
    }

    // text that is displayed when program is started
    textShowcase() {
        console.log("----------");
        console.log("  PureO2");
        console.log("----------");
        var i = 1;
        while (i < 10) {
            console.log("" + "\n");
            i = i += 1;
        }

    }

    //when a post request is sent over the server, the request is processed here
    processRequest(req, res) {
        // Process the request from the client
        // We are only supporting POST
        if (req.method === "POST") {
            // Post data may be sent in chunks so need to build it up
            var body = "";
            var key = "";   // define variable as global
            var val = "";   // "
            req.on("data", (data) => {
                body += data;
                // Prevent large files from benig posted
                if (body.length > 1024) {
                    // Tell Unity that the data sent was too large
                    res.writeHead(413, "Payload Too Large", {"Content-Type": "text/html"});
                    res.end("Error 413");
                }
            });
            req.on("end", () => {
                // Now that we have all data from the client, we process it
                //  console.log("Received data: " + body);
                // Split the key / pair values and print them out
                var vars = body.split("&");
                for (var t = 0; t < vars.length; t++) {
                    var pair = vars[t].split("=");
                    key = decodeURIComponent(pair[0]);
                    val = decodeURIComponent(pair[1]);
                    if (val == "_Leaderboards.cs") {    //check the name of program sending data is _Leaderboards.cs
                        if (key == 1) {
                            console.log(val + ": IRL key 'a' pressed");
                        } else if (key == 2) {

                            console.log(val + ": now Active");
                            res.writeHead(128, {"Content-Type": "text/plain"});
                            res.end("VR Connected!!!");

                        } else if (key == 3) {    //process basic test request
                            console.log(val + ": running basic test");
                            res.writeHead(128, {"Content-Type": "text/plain"});
                            res.end("basic test complete");
                        }
                    }
                }


                // Tell Unity that we received the data OK
                res.writeHead(200, {"Content-Type": "text/plain"});
                res.end("OK");

                // Tell discord 'VR Connected'
                client.updatePresence({state: "chur " + val, details: '🥽'});
                console.log("VR Connected");

            });
        }
        else {
            // Tell Unity that the HTTP method was not allowed
            res.writeHead(405, "Method Not Allowed", {"Content-Type": "text/html"});
            res.end("Error 405");
        }
    }

    discordRP(onlineStatus) {
        client.updatePresence({
          state: onlineStatus,
          details: '🐍',
          //startTimestamp: Date.now(),       // to show amount of time with program open
          //endTimestamp: Date.now() + 1337,
          //largeImageKey: 'snek_large',      // incase i want to add an image to the status message on discord
          //smallImageKey: 'snek_small',      //  "
          instance: true,
        });
    }

}
module.exports.Server = Server;
