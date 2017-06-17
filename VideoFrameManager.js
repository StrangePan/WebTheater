/** Class for coordinating, building, and manaing video frames. */
function VideoFrameManager(containerId) {
  this.frameContainerId = containerId;
  this.playerFrames = [];
}

/** Initializes the video frame manager. */
VideoFrameManager.prototype.init = function() {
  this.showButtons();
};

/** Replaces the contents of the container with buttons for layout options. */
VideoFrameManager.prototype.showButtons = function() {
  
clearElementContents(this.getContainer());
  this.getContainer().appendChild(this.createButtonForLayout(VideoLayouts[LayoutType.FULLSCREEN]));
  this.getContainer().appendChild(this.createButtonForLayout(VideoLayouts[LayoutType.VERTICAL_SPLIT]));
  this.getContainer().appendChild(this.createButtonForLayout(VideoLayouts[LayoutType.FOUR_CORNERS]));
};

/** Gets the DOM element that is the container for all of the video frames. */
VideoFrameManager.prototype.getContainer = function() {
  return this.frameContainer || (this.frameContainer = document.getElementById(this.frameContainerId));
};

/** Creates a button that can be clicked by the user to load the given layout. */
VideoFrameManager.prototype.createButtonForLayout = function(layout) {
  let button = document.createElement('button');
  button.textContent = layout.name;
  button.onclick = () => this.loadLayout(layout);
  return button;
};

/** Update video frames to match the given layout. */
VideoFrameManager.prototype.loadLayout = function(layout) {
  clearElementContents(this.getContainer());
  this.setNumberOfPlayers(layout.frames.length);
  for (let i = 0; i < layout.frames.length; i++) {
    setPlayerFrame(this.playerFrames[i], layout.frames[i]);
  }
};

/** Create/destroy video frames until the number of frames match the given number. */
VideoFrameManager.prototype.setNumberOfPlayers = function(numPlayers) {
  if (numPlayers < 0 || numPlayers > 10) {
    return;
  }
  while (this.playerFrames.length < numPlayers) {
    this.pushPlayer();
  }
  while (this.playerFrames.length > numPlayers) {
    this.popPlayer();
  }
};

/** Create a new video player and add it to the DOM tree and the playerFrames array. */
VideoFrameManager.prototype.pushPlayer = function() {
  let player = this.createFrame();
  this.getContainer().appendChild(player);
  this.playerFrames.push(player);
  return player;
};

/** Remove the last video player from the DOM tree and the playerFrames array. */
VideoFrameManager.prototype.popPlayer = function() {
  let player = this.playerFrames.pop();
  this.getContainer().removeChild(player);
  return player;
};

/** Create a new video frame. */
VideoFrameManager.prototype.createFrame = function() {
  let id = this.playerFrames.length;
  
  let frame = document.createElement('div');
  frame.classList.add('video');
  frame.id = id;
  
  let form = document.createElement('form');
  form.name = 'form' + id;
  form.method = 'post';
  form.onsubmit = () => {
    this.loadVideoOnFrame(frame, form.name);
    return false;
  };
  
  let textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.name = 'video';
  textInput.placeholder = 'Video ID';
  
  let submitInput = document.createElement('input');
  submitInput.type = 'submit';
  submitInput.value = 'Go';
  
  frame.appendChild(form);
  form.appendChild(textInput);
  form.appendChild(submitInput);

  return frame;
};

/** Sets the content of a frame with that which is interpretted from the form with the given name. */
VideoFrameManager.prototype.loadVideoOnFrame = function(frame, formName) {
  let iframe = document.createElement('iframe');
  iframe.src = 'http://www.youtube.com/embed/' + document.forms[formName]['video'].value + '?rel=0';
  iframe.frameBorder = '0';
  iframe.setAttribute('allowfullscreen', '');

  clearElementContents(frame);
  frame.appendChild(iframe);
};


/** Static function to update the properties of the given DOM element using the given frame. */
function setPlayerFrame(element, frame) {
  element.style.top = frame.top;
  element.style.right = frame.right;
  element.style.bottom = frame.bottom;
  element.style.left = frame.left;
}
