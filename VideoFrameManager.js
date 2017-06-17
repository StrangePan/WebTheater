function VideoFrameManager(containerId) {
  this.containerId = containerId;
  this.players = [];
}

/** Initializes the video frame manager. */
VideoFrameManager.prototype.init = function() {
  this.showButtons();
}

/** Replaces the contents of the container with buttons for layout options. */
VideoFrameManager.prototype.showButtons = function() {
  clearElementContents(this.getContainer());
  this.getContainer().appendChild(this.createButtonForLayout(VideoLayouts[LayoutType.FULLSCREEN]));
  this.getContainer().appendChild(this.createButtonForLayout(VideoLayouts[LayoutType.VERTICAL_SPLIT]));
  this.getContainer().appendChild(this.createButtonForLayout(VideoLayouts[LayoutType.FOUR_CORNERS]));
}

/** Gets the DOM element that is the container for all of the video frames. */
VideoFrameManager.prototype.getContainer = function() {
  return this.container == null
      ? this.container = document.getElementById(this.containerId)
      : this.container;
}

/** Creates a button that can be clicked by the user to load the given layout. */
VideoFrameManager.prototype.createButtonForLayout = function(layout) {
  var videoManager = this;
  var button = document.createElement('button');
  button.textContent = layout.name;
  button.onclick = function() {
    videoManager.loadLayout(layout);
  };
  return button;
}

/** Update video frames to match the given layout. */
VideoFrameManager.prototype.loadLayout = function(layout) {
  clearElementContents(this.getContainer());
  this.setNumberOfPlayers(layout.frames.length);
  for (var i = 0; i < layout.frames.length; i++) {
    setPlayerFrame(this.players[i], layout.frames[i]);
  }
}

/** Create/destroy video frames until the number of frames match the given number. */
VideoFrameManager.prototype.setNumberOfPlayers = function(numPlayers) {
  if (numPlayers < 0 || numPlayers > 10) {
    return;
  }
  while (this.players.length < numPlayers) {
    this.pushPlayer();
  }
  while (this.players.length > numPlayers) {
    this.popPlayer();
  }
}

/** Create a new video player and add it to the DOM tree and the players array. */
VideoFrameManager.prototype.pushPlayer = function() {
  var player = this.createFrame();
  this.getContainer().appendChild(player);
  this.players.push(player);
  return player;
}

/** Remove the last video player from the DOM tree and the players array. */
VideoFrameManager.prototype.popPlayer = function() {
  var player = this.players.pop();
  this.getContainer().removeChild(player);
  return player;
}

/** Create a new video frame. */
VideoFrameManager.prototype.createFrame = function() {
  var videoManager = this;
  var id = this.players.length;
  
  var frame = document.createElement('div');
  frame.classList.add('video');
  frame.id = id;
  
  var form = document.createElement('form');
  form.name = 'form' + id;
  form.method = 'post';
  form.onsubmit = function() {
    videoManager.loadVideoOnFrame(frame, form.name);
    return false;
  };
  
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

VideoFrameManager.prototype.loadVideoOnFrame = function(frame, formName) {
  var iframe = document.createElement('iframe');
  iframe.src = 'http://www.youtube.com/embed/' + document.forms[formName]['video'].value + '?rel=0';
  iframe.frameBorder = '0';
  iframe.setAttribute('allowfullscreen', '');

  clearElementContents(frame);
  frame.appendChild(iframe);
}


/** Static function for removing all child elements from the given DOM element. */
function clearElementContents(element) {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }
}

/** Static function to update the properties of the given DOM element using the given frame. */
function setPlayerFrame(element, frame) {
  element.style.top = frame.top;
  element.style.right = frame.right;
  element.style.bottom = frame.bottom;
  element.style.left = frame.left;
}
