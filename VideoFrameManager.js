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
  setElementContents(
    this.getContainer(),
    this.createButtonForLayout(VideoLayouts[LayoutType.FULLSCREEN]),
    this.createButtonForLayout(VideoLayouts[LayoutType.VERTICAL_SPLIT]),
    this.createButtonForLayout(VideoLayouts[LayoutType.FOUR_CORNERS]));
};

/** Gets the DOM element that is the container for all of the video frames. */
VideoFrameManager.prototype.getContainer = function() {
  return this.frameContainer || (this.frameContainer = document.getElementById(this.frameContainerId));
};

/** Creates a button that can be clicked by the user to load the given layout. */
VideoFrameManager.prototype.createButtonForLayout = function(layout) {
  return new LayoutSelectionButton(layout.name, () => this.loadLayout(layout)).element;
};

/** Update video frames to match the given layout. */
VideoFrameManager.prototype.loadLayout = function(layout) {
  clearElementContents(this.getContainer());
  this.setNumberOfPlayerFrames(layout.frames.length);
  for (let i = 0; i < layout.frames.length; i++) {
    this.playerFrames[i].setLayout(layout.frames[i]);
  }
};

/** Create/destroy video frames until the number of frames match the given number. */
VideoFrameManager.prototype.setNumberOfPlayerFrames = function(numPlayers) {
  if (numPlayers < 0 || numPlayers > 10) {
    return;
  }
  while (this.playerFrames.length < numPlayers) {
    this.pushPlayerFrame();
  }
  while (this.playerFrames.length > numPlayers) {
    this.popPlayerFrame();
  }
};

/** Create a new video player and add it to the DOM tree and the playerFrames array. */
VideoFrameManager.prototype.pushPlayerFrame = function() {
  let playerFrame = this.createPlayerFrame();
  this.getContainer().appendChild(playerFrame.element);
  this.playerFrames.push(playerFrame);
  return playerFrame;
};

/** Remove the last video player from the DOM tree and the playerFrames array. */
VideoFrameManager.prototype.popPlayerFrame = function() {
  let playerFrame = this.playerFrames.pop();
  this.getContainer().removeChild(playerFrame.element);
  return playerFrame;
};

/** Create a new video frame. */
VideoFrameManager.prototype.createPlayerFrame = function() {
  return new VideoFrame(this.playerFrames.lenth);
};
