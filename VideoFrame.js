/** Class for managing the contents of a frame. */
function VideoFrame(id, params) {
  let frame = document.createElement('div');
  frame.classList.add('video-frame');
  
  this.element = frame;
  this.id = id;
  this.content = null;
  this._onPreStateChange = () => this.onPreStateChange && this.onPreStateChange();
  this._onStateChange = () => this.onStateChange && this.onStateChange();

  this.showContentFromUrlParams(params);
}

VideoFrame.STATE_ENTERING = 0;
VideoFrame.STATE_VISIBLE = 1;
VideoFrame.STATE_EXITING = 2;
VideoFrame.STATE_GONE = 3;

VideoFrame.VIDEO_TYPE_YOUTUBE = 'yt';
VideoFrame.VIDEO_TYPE_TWITCH = 'tw';

/** Show this frame's content selector to the user. */
VideoFrame.prototype.showContentSelection = function() {
  if (this.content instanceof VideoSelectionForm) {
    return;
  }
  this.setContent(
      new VideoSelectionForm(
          this.id,
          inputString => this.showContentFromUserInput(inputString)));
};

/** Attempts to show the relevant content based on the user input. */
VideoFrame.prototype.showContentFromUserInput = function(userInput) {
  this.showYouTubeVideo(userInput) || this.showTwitchVideo(userInput);
};

/**
 * Tries to show an embedded YouTube video in the frame using the given input. Accepts either
 * a user input string or a URL parameter array. Returns true on success, false on failure.
 */
VideoFrame.prototype.showYouTubeVideo = function(input) {
  let newContent = null;

  if (typeof input == 'string') {
    if (this.content instanceof YouTubeVideo && this.content.matchesInputString(input)) {
      return true;
    }
    newContent = YouTubeVideo.createFromInputString(input);
  } else if (typeof input == 'object') {
    if (this.content instanceof YouTubeVideo && this.content.matchesUrlParams(input)) {
      return true;
    }
    newContent = YouTubeVideo.createFromUrlParams(input);
  }

  if (newContent) {
    this.setContent(newContent);
  }
  return Boolean(newContent);
};

VideoFrame.prototype.showTwitchVideo = function(input) {
  let newContent = null;
  
  if (typeof input == 'string') {
    if (this.content instanceof TwitchVideo && this.content.matchesInputString(input)) {
      return true;
    }
    newContent = TwitchVideo.createFromInputString(input);
  } else if (typeof input == 'object') {
    if (this.content instanceof TwitchVideo && this.content.matchesUrlParams(input)) {
      return true;
    }
    newContent = TwitchVideo.createFromUrlParams(input);
  }
  
  if (newContent) {
    this.setContent(newContent);
  }
  return Boolean(newContent);
};


/**
 * Create an array of parameters to write to the browser URL for use when restoring state.
 * Returns a non-null array that may be empty.
 */
VideoFrame.prototype.buildUrlParams = function() {
  let videoType;
  if (this.content instanceof YouTubeVideo) {
    videoType = VideoFrame.VIDEO_TYPE_YOUTUBE;
  } else if (this.content instanceof TwitchVideo) {
    videoType = VideoFrame.VIDEO_TYPE_TWITCH;
  }
  return videoType
      ? [videoType, ...this.content.buildUrlParams()]
      : [];
};

/**
 * Interpret the given array of parameters and show the relevant contents.
 * Params may be null.
 */
VideoFrame.prototype.showContentFromUrlParams = function(params) {
  let videoType = params && params[0];

  switch (videoType) {
    case VideoFrame.VIDEO_TYPE_YOUTUBE:
      if (this.showYouTubeVideo(params.splice(1))) {
        return;
      }
      break;
    case VideoFrame.VIDEO_TYPE_TWITCH:
      if (this.showTwitchVideo(params.splice(1))) {
        return;
      }
      break;
  }

  this.showContentSelection();
};


/** Set the content of this frame to the given content controller. Updates the DOM tree. */
VideoFrame.prototype.setContent = function(content) {
  this._onPreStateChange();
  if (this.content) {
    this.element.removeChild(this.content.element)
  }
  this.content = content;
  this.element.appendChild(content.element);
  content.onPreStateChange = this._onPreStateChange;
  content.onStateChange = this._onStateChange;
  this._onStateChange();
};

/** Sets this frame's properties based on the properties of the given layout object. */
VideoFrame.prototype.setLayout = function(layout) {
  this.element.style.top = layout.top;
  this.element.style.right = layout.right;
  this.element.style.bottom = layout.bottom;
  this.element.style.left = layout.left;
};

VideoFrame.prototype.startEntering = function(callback) {
  this.setState(VideoFrame.STATE_ENTERING);
  let listener = () => {
    this.element.removeEventListener('animationend', listener);
    this.setState(VideoFrame.STATE_VISIBLE);
    if (callback) {
      callpack.apply(null, arguments);
    }
  };
  this.element.addEventListener('animationend', listener);
}

VideoFrame.prototype.startRemoving = function(callback) {
  this.setState(VideoFrame.STATE_EXITING);
  let listener = () => {
    this.element.removeEventListener('animationend', listener);
    this.setState(VideoFrame.STATE_GONE);
    if (callback) {
      callback.apply(null, arguments);
    }
  };
  this.element.addEventListener('animationend', listener);
};

VideoFrame.prototype.setState = function(state) {
  this.element.classList.remove('entering');
  this.element.classList.remove('visible');
  this.element.classList.remove('exiting');
  this.element.classList.remove('gone');
  switch (state) {
    case VideoFrame.STATE_ENTERING:
      this.element.classList.add('entering');
      break;
    case VideoFrame.STATE_VISIBLE:
      this.element.classList.add('visible');
      break;
    case VideoFrame.STATE_EXITING:
      this.element.classList.add('exiting');
      break;
    case VideoFrame.STATE_GONE:
      this.element.classList.add('gone');
      break;
  }
};
