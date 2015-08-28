'use strict';

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

//
// defaults
//
var custom = require("./branding");
var http_port = 3000,
    host = process.argv[2] || 'localhost',
    ws_port = 3001,
    simulation = true,
    hack = true,
    elementName = [],
    initialPosition = [],
    position = [];
for (var i=0; i<custom.relays.length; ++i) {
  elementName[i] = custom.relays[i][0];
  initialPosition[i] = custom.relays[i][1];
}

function setRelay(aPosition, aValue) {
  if (!simulation) {
    if (aValue == 1) {
      if (hack) {                                                                  
        wpi.pinMode(aPosition, wpi.INPUT);                                         
      } else {                                                                     
        wpi.digitalWrite(aPosition, 1);                                            
      }                                                                            
    } else {
      if (hack) {                                                                  
        wpi.pinMode(aPosition, wpi.OUTPUT);                                        
      } else {                                                                     
        wpi.digitalWrite(aPosition, 0);                                            
      }                                                                            
    } 
  } else {
    if (aValue == 1) {
console.log('CLOSE Relay ' + aPosition);
    } else {
console.log('OPEN Relay ' + aPosition);
    }         
  }
  position[aPosition] = aValue;
}

//
// GPIO 
//
var wpi = null;
if (!simulation) {
  wpi = require('wiring-pi');
  wpi.setup('wpi');
  for (var i = 0; i < 16; ++i) {
    if (!hack) {
      wpi.pinMode(i, wpi.OUTPUT);
    } else {
      wpi.pinMode(i, wpi.INPUT);
    }
  }
}
for (var i = 0; i < 16; ++i) {
  setRelay(i, initialPosition[i]);
}

//
// web socket
//
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ host: host, port: ws_port }),
    msg,
    clients = [];

function listeners() {
  switch (clients.length) {
    case 0:
console.log('There are no applications listening');
      break;
    case 1:
console.log('There is 1 application listening');
      break;
    default:
console.log('There are ' + clients.length + ' applications listening');
  }
}

wss.on('connection', function connection(ws) {

  clients.push(ws);
  listeners();

  ws.on('close', function(data, flags) {
    for (var i=0; i<clients.length; i++) {
      if (clients[i] == this) {
        clients.splice(i,1);
      } 
    }
    listeners();
  });

  ws.on('message', function(data, flags) {
    msg = JSON.parse(data);
    switch(msg.type) {
      case 'INITIALIZE':
          if (clients.length == 1) {
            ws.send('{"type":"status","message":"INITIALIZE"}');
          } else {
            ws.send('{"type":"status","message":"READ"}');
          }
          break;
      case 'getInitialState':
          ws.send('{"type":"initial_state","value":' + JSON.stringify(initialPosition) + '}');
          break;
      case 'getNames':
          ws.send('{"type":"names","value":' + JSON.stringify(elementName) + '}');
          break;
      case 'getState':
          ws.send('{"type":"state","value":' + JSON.stringify(position) + '}');
          break;
      case 'getTitle':
          ws.send('{"type":"title","value":"' + custom.displayTitle + '"}');
          break;
      case 'setRelay':
          setRelay(msg.position, msg.value);
/*
          position[msg.position] = msg.value;
          if (!simulation) {
            if (msg.value == 1) {
              if (hack) {                                                                  
                wpi.pinMode(msg.position, wpi.INPUT);                                         
              } else {                                                                     
                wpi.digitalWrite(msg.position, 1);                                            
              }                                                                            
            } else {
              if (hack) {                                                                  
                wpi.pinMode(msg.position, wpi.OUTPUT);                                        
              } else {                                                                     
                wpi.digitalWrite(msg.position, 0);                                            
              }                                                                            
            } 
          } else {
            if (msg.value == 1) {
console.log('CLOSE Relay ' + msg.position);
            } else {
console.log('OPEN Relay ' + msg.position);
            }         
          }
*/
          for (var i=0; i<clients.length; i++) {
            if (clients[i] != this) {
              clients[i].send('{"type":"showRelay","position":' + msg.position + ',"value": ' + msg.value + '}');
            } 
          }
          break;
      default:
console.log('DO NOT UNDERSTAND WS');
    }

  });
});

//
// http server
//
http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname,
      filename = path.join(process.cwd(), 'public' , uri),
      contentTypesByExtension = {
        '.html': 'text/html',
        '.css':  'text/css',
        '.ico':  'image/x-icon',
        '.js':   'text/javascript'
      };

  fs.exists(filename, function(exists) {
    if(!exists) {
      if (uri == '/branding.js') {
        response.writeHead(200, {'Content-Type': 'text/javascript'});
        response.write("var serverAddress = '" + host + "';\r\n");
        response.write("var socketPort = '" + ws_port + "';\r\n");
      } else {
      response.writeHead(404, {'Content-Type': 'text/plain'});
      response.write("404 Not Found\n");
      }
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) {
      filename += '/index.html';
    }

    fs.readFile(filename, 'binary', function(err, file) {
      if(err) {        
        response.writeHead(500, {'Content-Type': 'text/plain'});
        response.write(err + "\n");
        response.end();
        return;
      }
      var headers = {},
          contentType = contentTypesByExtension[path.extname(filename)];
      if (contentType) {
        headers['Content-Type'] = contentType;
      }
      response.writeHead(200, headers);
      response.write(file, 'binary');
      
      if (uri == '/branding.js') {
        response.write("var serverAddress = '" + host + "';\r\n");
        response.write("var socketPort = '" + ws_port + "';\r\n");
      }
      response.end();
    });

  });
}).listen(http_port, host);

//
// banner
//
console.log('----------------------');
console.log(' SainSmart Relay Proxy');
console.log(' "' + custom.displayTitle + '"');
console.log('----------------------');
console.log('Static file server running at http://' + host + ':' + http_port);
console.log('WebSocket server running at http://' + host + ':' + ws_port);
if (simulation) {
  console.log('Simulation (no relay board is connected)');
}
console.log('');
