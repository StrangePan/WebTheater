/** Class for managing the contents of a frame. */
function VideoFrame(id, params) {
  let frame = document.createElement('div');
  frame.classList.add('video-frame');
  
  this.element = frame;
  this.id = id;
  this.content = null;
  this.onStateChange = null;
  this.showContentFromUrlParams(params);
}

VideoFrame.VIDEO_TYPE_YOUTUBE = 'yt';

/** Show this frame's content selector to the user. */
VideoFrame.prototype.showContentSelection = function() {
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
 * Tries to show an embedded YouTube video in the frame using the given user input string.
 * Returns true on success, false on failure.
 */
VideoFrame.prototype.showYouTubeVideo = function(inputString) {
  let video = YouTubeVideo.createFromString(inputString);
  if (video) {
    this.setContent(video);
  }
  return Boolean(video);
};


/**
 * Create an array of parameters to write to the browser URL for use when restoring state.
 * Returns a non-null array that may be empty.
 */
VideoFrame.prototype.buildUrlParams = function() {
  if (this.content instanceof YouTubeVideo) {
    return [VideoFrame.VIDEO_TYPE_YOUTUBE, ...this.content.buildUrlParams()];
  }
  return [];
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
      video = YouTubeVideo.createFromUrlParams(params.splice(1));
      break;
  }

  if (video) {
    this.setContent(video);
  } else {
    this.showContentSelection();
  }
};


/** Set the content of this frame to the given content controller. Updates the DOM tree. */
VideoFrame.prototype.setContent = function(content) {
  this.content = content;
  setElementContents(this.element, content.element);
  content.onStateChange = this.onStateChange;
  if (this.onStateChange) {
    this.onStateChange();
  }
};

/** Sets this frame's properties based on the properties of the given layout object. */
VideoFrame.prototype.setLayout = function(layout) {
  this.element.style.top = layout.top;
  this.element.style.right = layout.right;
  this.element.style.bottom = layout.bottom;
  this.element.style.left = layout.left;
};
