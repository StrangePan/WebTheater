var Param = {
  LAYOUT_TYPE: 'l'
};

var urlParameters;
var players = [];

function getContainer() {
  return document.body;
}

/** Parses the URL parameters and stores the results as a key/value pair in urlParameters. */
function parseUrlParameters() {
  urlParameters = [];
  var query = window.location.search.substring(1);
  var parameters = query.split("&");
  for (var i = 0; i < parameters.length; i++) {
    var pair = parameters[i].split("=");
    urlParameters[pair[0]] = urlParameters[pair[1]];
  }
}

function updateVideoLayout() {
  var layoutType = urlParameters[Param.LAYOUT_TYPE];
  loadLayout(VideoLayouts[layoutType]);
}

function loadLayout(layoutType) {
  var layout = VideoLayouts[layoutType];
  setNumberOfPlayers(layout.length);
  for (var i = 0; i < layout.length; i++) {
    setPlayerFrame(players[i], layout[i]);
  }
}

function setNumberOfPlayers(numPlayers) {
  if (numPlayers < 0 || numPlayers > 10) {
    return;
  }
  while (players.length < numPlayers) {
    pushPlayer();
  }
  while (players.length > numPlayers) {
    popPlayer();
  }
}

/** Create a new video player and add it to the DOM tree and the players array. */
function pushPlayer() {
  var player = createPlayer();
  getContainer().appendChild(player);
  players.push(player);
  return player;
}

/** Remove the last video player from the DOM tree and the players array. */
function popPlayer() {
  var player = players.pop();
  getContainer().removeChild(player);
  return player;
}

function setPlayerFrame(player, frame) {
  player.style.top = frame.top;
  player.style.right = frame.right;
  player.style.bottom = frame.bottom;
  player.style.left = frame.left;
}

function createPlayer() {
  var id = players.length;
  
  var frame = document.createElement('div');
  frame.classList.add('video');
  frame.id = id;
  
  var form = document.createElement('form');
  form.name = 'form' + id;
  form.onsubmit = function(){return insertVid(id);};
  form.method = 'post';
  
  var textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.name = 'video';
  textInput.placeholder = 'Video ID';
  
  var submitInput = document.createElement('input');
  submitInput.type = 'submit';
  submitInput.value = 'Go';
  
  frame.appendChild(form);
  form.appendChild(textInput);
  form.appendChild(submitInput);

  return frame;
}

function insertVid(formId) {
  var player = players[formId];

  var iframe = document.createElement('iframe');
  iframe.src = 'http://www.youtube.com/embed/' + document.forms['form' + formId]['video'].value + '?rel=0';
  iframe.frameBorder = '0';
  iframe.setAttribute('allowfullscreen', '');

  while (player.hasChildNodes()) {
    player.removeChild(player.lastChild);
  }
  player.appendChild(iframe);
  
  return false;
}

