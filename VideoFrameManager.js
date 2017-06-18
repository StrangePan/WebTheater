/** Class for coordinating, building, and manaing video frames. */
function VideoFrameManager(containerId) {
  this.frameContainerId = containerId;
  this.layoutType = null;
  this.frames = [];
}

VideoFrameManager.KEY_LAYOUT_TYPE = 'l';
VideoFrameManager.KEY_PREFIX_FRAME = 'v';

/** Initializes the video frame manager. */
VideoFrameManager.prototype.init = function() {
  this.showLayoutSelection();
};

/** Gets the DOM element that is the container for all of the video frames. */
VideoFrameManager.prototype.getContainer = function() {
  return this.frameContainer || (this.frameContainer = document.getElementById(this.frameContainerId));
};


/** Replaces the contents of the container with buttons for layout options. */
VideoFrameManager.prototype.showLayoutSelection = function() {
  this.layoutType = null;
  setElementContents(
      this.getContainer(),
      this.createLayoutSelectionButton(LayoutType.FULLSCREEN),
      this.createLayoutSelectionButton(LayoutType.VERTICAL_SPLIT),
      this.createLayoutSelectionButton(LayoutType.FOUR_CORNERS));
};

/** Update video frames to match the given layout. Optional array of URL params. */
VideoFrameManager.prototype.showLayout = function(layoutType, params) {
  this.layoutType = layoutType;
  let layout = VideoLayouts[layoutType];

  if (!this.frames.length) {
    clearElementContents(this.getContainer());
  }

  for (let i = 0, imax = Math.max(this.frames.length, layout.frames.length); i < imax; i++) {
    if (i >= this.frames.length) {
      this.pushFrame(VideoFrameManager.prepareFrameUrlParams(i, params));
      this.frames[i].setLayout(layout.frames[i]);
   } else if (i >= layout.frames.length) {
      // DO NOT REFERENCE CURRENT FRAMES HERE BECAUSE WE'RE POPPING FROM END!
      this.popFrame();
    } else {
      this.frames[i].showContentFromUrlParams(VideoFrameManager.prepareFrameUrlParams(i, params));
      this.frames[i].setLayout(layout.frames[i]);
    }
  }
};

/** Create a new video player and add it to the DOM tree and the playerFrames array. */
VideoFrameManager.prototype.pushFrame = function(params) {
  let frame = this.createFrame(this.frames.length, params);
  this.getContainer().appendChild(frame.element);
  this.frames.push(frame);
};

/** Remove the last video player from the DOM tree and the playerFrames array. */
VideoFrameManager.prototype.popFrame = function() {
  let playerFrame = this.frames.pop();
  this.getContainer().removeChild(playerFrame.element);
  return playerFrame;
};


/** Creates a button that can be clicked by the user to load the given layout. */
VideoFrameManager.prototype.createLayoutSelectionButton = function(layoutType) {
  return new LayoutSelectionButton(
      VideoLayouts[layoutType].name,
      () => this.showLayout(layoutType)).element;
};

/** Create a new video frame. */
VideoFrameManager.prototype.createFrame = function(id, params) {
  return new VideoFrame(id, params);
};


VideoFrameManager.prototype.showLayoutFromUrlParams = function(params) {
  if (!params || !params.length) {
    this.showLayoutSelection();
  }
  
  let layoutType = LayoutType(params[VideoFrameManager.KEY_LAYOUT_TYPE]);
  if (layoutType == null) {
    this.showLayoutSelection();
  } else {
    this.showLayout(layoutType, params);
  }
};

/** Create an array of parameters to write to the browser URL. */
VideoFrameManager.prototype.buildUrlParams = function() {
  let params = [];

  if (this.layoutType == null) {
    return params;
  }
  params.push(new UrlParam(VideoFrameManager.KEY_LAYOUT_TYPE, this.layoutType));

  for (let i = 0; i < this.frames.length; i++) {
    let frameParams = this.frames[i].buildUrlParams();
    if (!frameParams || !frameParams.length) {
      continue;
    }
    params.push(new UrlParam(`${VideoFrameManager.KEY_PREFIX_FRAME}${i}`, frameParams.join(',')));
  }
  
  return params;
}

VideoFrameManager.prepareFrameUrlParams = function(frameId, params) {
  let frameParams = params && params[`${VideoFrameManager.KEY_PREFIX_FRAME}${frameId}`];
  return frameParams && frameParams.value.split(',');
}

