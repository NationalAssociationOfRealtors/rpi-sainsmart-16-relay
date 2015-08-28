//
// connection between browser and the relay proxy
//
var controlSocket = new WebSocket('ws://' + serverAddress + ':' + socketPort);

controlSocket.onopen = function (event) {
  controlSocket.send('{"type":"INITIALIZE"}');
};

controlSocket.onerror = function (event) {
  console.log('Cannot open ws');
};

controlSocket.onmessage = function (event) {
  var msg = JSON.parse(event.data);
  switch(msg.type) {
    case 'names':
      var remoteName = msg.value;
      for (var i=0; i<msg.value.length; i++) {
        document.getElementById('R'+(i+1)).innerHTML='<span class="button_label">'+msg.value[i]+'</span>';
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

function resetPins() {
  controlSocket.send('{"type":"getTitle"}');
  controlSocket.send('{"type":"getNames"}');
  controlSocket.send('{"type":"getInitialState"}');
}

function displayOpenRelay(aPosition) {
  document.getElementById('R'+(aPosition+1)).className='relayOn';
}

function displayCloseRelay(aPosition) {
  document.getElementById('R'+(aPosition+1)).className='relayOff';
}

function openRelay(aPosition ) {
  controlSocket.send('{"type":"setRelay","position":' + aPosition + ',"value":0}');
  displayOpenRelay(aPosition);
}

function closeRelay(aPosition) {
  controlSocket.send('{"type":"setRelay","position":' + aPosition + ',"value":1}');
  displayCloseRelay(aPosition);
}

function toggle(aPosition) {
  if (document.getElementById('R'+(aPosition+1)).className == 'relayOff') {
    openRelay(aPosition);
  } else {
    closeRelay(aPosition);
  }
}
