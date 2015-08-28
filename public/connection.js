//
// connection between browser and the relay proxy
//
var controlSocket = null;

function createSocket() {
  controlSocket = new WebSocket('ws://' + serverAddress + ':' + socketPort);

  controlSocket.onopen = function (event) {
    controlSocket.send('{"type":"INITIALIZE"}');
  };

  controlSocket.onerror = function (event) {
console.log('Cannot open ws');
  };

  controlSocket.onclose = function (event) {
console.log('ws closed');
  };

  controlSocket.onmessage = function (event) {
    var msg = JSON.parse(event.data);
    switch(msg.type) {
      case 'names':
        var remoteName = msg.value;
        for (var i=0; i<msg.value.length; i++) {
          document.getElementById('R'+(i+1)).innerHTML=msg.value[i];
        } 
        break;
      case 'status':
        switch(msg.message) {
          case 'INITIALIZE':
            resetPins();
            break;
          case 'READ':
            controlSocket.send('{"type":"getTitle"}');
            controlSocket.send('{"type":"getNames"}');
            controlSocket.send('{"type":"getState"}');
            break;
          default:
console.log('Unknown status: '+ msg.message);
        }
        break;
      case 'showRelay':
        if (msg.value == 1) {
          displayCloseRelay(msg.position);
        } else {
          displayOpenRelay(msg.position);
        }
        break;
      case 'initial_state':
        for (var i=0; i<msg.value.length; i++) {
          if (msg.value[i] == 1) {
            closeRelay(i);
          } else {
            openRelay(i);
          }
        } 
        break;
      case 'state':
        var remoteRelay = msg.value;
        for (var i=0; i<remoteRelay.length; i++) {
          if (remoteRelay[i] == 1) {
            displayCloseRelay(i);
          } else {
            displayOpenRelay(i);
          }
        } 
        break;
      case 'title':
        document.getElementById('board_name').innerHTML=msg.value;
        break;
      default:
console.log('Unknown message type: '+ msg.type);
    }
  }
};

function displayOpenRelay(aPosition) {
  document.getElementById('R'+(aPosition+1)).className='spread btn btn-danger';
}

function displayCloseRelay(aPosition) {
  document.getElementById('R'+(aPosition+1)).className='spread btn btn-default';
}

function openRelay(aPosition ) {
  controlSocket.send('{"type":"setRelay","position":' + aPosition + ',"value":0}');
  displayOpenRelay(aPosition);
}

function closeRelay(aPosition) {
  controlSocket.send('{"type":"setRelay","position":' + aPosition + ',"value":1}');
  displayCloseRelay(aPosition);
}

createSocket();

function resetPins() {
  if (controlSocket.readyState == 3) {
    createSocket();
  } else {
    controlSocket.send('{"type":"getTitle"}');
    controlSocket.send('{"type":"getNames"}');
    controlSocket.send('{"type":"getInitialState"}');
  }
}

function toggle(aPosition) {
  if (controlSocket.readyState == 3) {
    createSocket();
  } else {
    if (document.getElementById('R'+(aPosition+1)).className == 'spread btn btn-default') {
      openRelay(aPosition);
    } else {
      closeRelay(aPosition);
    }
  }
}
