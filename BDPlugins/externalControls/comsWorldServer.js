"use strict";

/*jshint esversion: 9 */
/*jshint node: true */

var http = require("http");

class Server
{
    constructor()
    {
        this.port = 8080;
        this.ip = "localhost";

        this.start();


    }

    start()
    {
        this.server = http.createServer((req, res) =>
        {
            this.processRequest(req, res);
        });

        this.server.on("clientError", (err, socket) =>
        {
            socket.end("http/1.1 400 Bad Request\r\n\r\n");
        });
        console.log("Server created");
    }


    //FIXME
    //post cool stuff
    post({body, ...options}) {
        return new Promise((resolve,reject) => {
          const req = http.request({
              method: 'POST',
              ...options,
          }, res => {
            const chunks = [];
            res.on('data', data => chunks.push(data));
            res.on('end', () => {
              let body = Buffer.concat(chunks);
              switch(res.headers['content-type']) {
                  case 'application/json':
                    body = JSON.parse(body);
                    break;
              }
              resolve(body);
            });
          });
          req.on('error', reject);
          if(body) {
            req.write(body);
          }
          req.end();
          console.log("endeeeed");
        })
        .catch(console.log("I caught it 2"));
    }



    listen()
    {
        this.server.listen(this.port, this.ip);
        console.log("Server listening for connections");
    }

    processRequest(req, res)
    {
        // Process the request from the client
        // We are only supporting POST
        if (req.method === "POST")
        {
            // Post data may be sent in chunks so need to build it up
            var body = "";
            req.on("data", (data) =>
            {
                body += data;
                // Prevent large files from benig posted
                if (body.length > 1024)
                {
                    // Tell Unity that the data sent was too large
                    res.writeHead(413, "Payload Too Large", {"Content-Type": "text/html"});
                    res.end("Error 413");
                }
            });
            req.on("end", () =>
            {
                // Now that we have all data from the client, we process it
                console.log("Received data: " + body);
                // Split the key / pair values and print them out
                var vars = body.split("&");
                for (var t = 0; t < vars.length; t++)
                {
                    var pair = vars[t].split("=");
                    var key = decodeURIComponent(pair[0]);
                    var val = decodeURIComponent(pair[1]);
                    console.log(key + ":" + val);
                }
                // Tell Unity that we received the data OK
                res.writeHead(200, {"Content-Type": "text/plain"});
                res.end("OK");
            });
        }
        else
        {
            // Tell Unity that the http method was not allowed
            res.writeHead(405, "Method Not Allowed", {"Content-Type": "text/html"});
            res.end("Error 405");
        }
    }

}
module.exports.Server = Server;
