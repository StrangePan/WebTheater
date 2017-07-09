/** Class for coordinating, building, and manaing video frames. */
function VideoFrameManager() {
  this.layoutType = null;
  this.frames = [];
  this._onPreStateChange = () => this.onPreStateChange && this.onPreStateChange();
  this._onStateChange = () => this.onStateChange && this.onStateChange();

  let frameContainer = document.createElement('div');
  frameContainer.classList.add('video-frame-container');

  this.element = frameContainer;
}

VideoFrameManager.KEY_LAYOUT_TYPE = 'l';
VideoFrameManager.KEY_PREFIX_FRAME = 'v';


/** Update video frames to match the given layout. Optional array of URL params. */
VideoFrameManager.prototype.showLayout = function(layoutType, params) {
  if ((layoutType = LayoutType(layoutType)) == null) {
    return;
  }

  this._onPreStateChange();
  this.layoutType = layoutType;
  let layout = VideoLayouts[layoutType];

  for (let i = 0, imax = Math.max(this.frames.length, layout.frames.length); i < imax; i++) {
    if (i >= layout.frames.length) {
      // DO NOT REFERENCE CURRENT FRAMES HERE BECAUSE WE'RE POPPING FROM END!
      this.popFrame();
    } else if (i >= this.frames.length) {
      this.pushFrame(VideoFrameManager.prepareFrameUrlParams(i, params));
      this.frames[i].setLayout(layout.frames[i]);
    } else {
      if (params) {
        this.frames[i].showContentFromUrlParams(VideoFrameManager.prepareFrameUrlParams(i, params));
      }
      this.frames[i].setLayout(layout.frames[i]);
    }
  }
  this._onStateChange();
};

/** Create a new video player and add it to the DOM tree and the playerFrames array. */
VideoFrameManager.prototype.pushFrame = function(params) {
  let frame = this.createFrame(this.frames.length, params);
  if (this.frames.length === 0) {
    this.element.appendChild(frame.element);
  } else {
    this.element.insertBefore(frame.element, this.frames[this.frames.length - 1].element);
  }
  frame.onPreStateChange = this._onPreStateChange;
  frame.onStateChange = this._onStateChange;
  frame.startEntering();
  this.frames.push(frame);
};

/** Remove the last video player from the DOM tree and the playerFrames array. */
VideoFrameManager.prototype.popFrame = function() {
  let frame = this.frames.pop();
  frame.onStateChange = null;
  frame.onPreStateChange = null;
  frame.startRemoving(e => {
    this.element.removeChild(frame.element);
  });
  return frame;
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


/**
 * Attempts to show the layout defined by the given params. Shows the layout selection
 * If unable to use the given params.
 */
VideoFrameManager.prototype.showLayoutFromUrlParams = function(params) {
  let layoutType = null;

  if (params && params.length) {
    layoutType = LayoutType(params[VideoFrameManager.KEY_LAYOUT_TYPE]);
  }

  if (layoutType == null) {
    layout = LayoutType(LayoutType.FULLSCREEN);
  }

  this.showLayout(layoutType, params);
};

/** Create an array of parameters to write to the browser URL. */
VideoFrameManager.prototype.buildUrlParams = function() {
  let params = [];

  if (this.layoutType == null) {
    return params;
  }
  let param = new UrlParam(VideoFrameManager.KEY_LAYOUT_TYPE, this.layoutType)
  params.push(param);
  params[param.key] = param.value;

  for (let i = 0; i < this.frames.length; i++) {
    let frameParams = this.frames[i].buildUrlParams();
    if (!frameParams || !frameParams.length) {
      continue;
    }
    let param = new UrlParam(`${VideoFrameManager.KEY_PREFIX_FRAME}${i}`, frameParams.join(','))
    params.push(param);
    params[param.key] = param.value;
  }
  
  return params;
};

/** Prepare string-formatted frame parameters for consumption by frames. */
VideoFrameManager.prepareFrameUrlParams = function(frameId, params) {
  let frameParams = params && params[`${VideoFrameManager.KEY_PREFIX_FRAME}${frameId}`];
  return frameParams && frameParams.split(',');
};
