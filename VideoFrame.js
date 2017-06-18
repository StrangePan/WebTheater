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

VideoFrame.VIDEO_TYPE_YOUTUBE = 'yt';

/** Show this frame's content selector to the user. */
VideoFrame.prototype.showContentSelection = function() {
  if (this.content instanceof VideoSelectionForm) {
    return;
  }
  this.setContent(
      new VideoSelectionForm(
          this.id,
          form => this.showContentFromUserInput(form.video.value)));
};

/** Attempts to show the relevant content based on the user input. */
VideoFrame.prototype.showContentFromUserInput = function(userInput) {
  this.showYouTubeVideo(userInput);
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


/**
 * Create an array of parameters to write to the browser URL for use when restoring state.
 * Returns a non-null array that may be empty.
 */
VideoFrame.prototype.buildUrlParams = function() {
  return this.content instanceof YouTubeVideo
      ? [VideoFrame.VIDEO_TYPE_YOUTUBE, ...this.content.buildUrlParams()]
      : [];
};

/**
 * Interpret the given array of parameters and show the relevant contents.
 * Params may be null.
 */
VideoFrame.prototype.showContentFromUrlParams = function(params) {
  let videoType = params && params[0];
  let video = null;

  switch (videoType) {
    case VideoFrame.VIDEO_TYPE_YOUTUBE:
      if (this.showYouTubeVideo(params.splice(1))) {
        return;
      }
      break;
  }

  this.showContentSelection();
};


/** Set the content of this frame to the given content controller. Updates the DOM tree. */
VideoFrame.prototype.setContent = function(content) {
  this._onPreStateChange();
  this.content = content;
  setElementContents(this.element, content.element);
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
