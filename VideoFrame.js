/** Class for managing the contents of a frame. */
function VideoFrame(id) {
  let frame = document.createElement('div');
  frame.classList.add('video-frame');
  
  this.element = frame;
  this.id = id;
  this.showContentSelection();
}

/** Show this frame's content selector to the user. */
VideoFrame.prototype.showContentSelection = function() {
  setElementContents(
    this.element,
    new VideoSelectionForm(this.id, form => this.showVideoFromUrl(form.video.value)).element);
};

VideoFrame.prototype.showVideoFromUrl = function(videoUrl) {
  this.showYouTubeVideo(videoUrl);
}

/**
 * Tries to show an embedded YouTube video in the frame to the video identified by the string.
 * Returns the video element created if successful and null if not.
 */
VideoFrame.prototype.showYouTubeVideo = function(videoString) {
  let video = YouTubeVideo.createFromString(videoString);
  if (video) {
    setElementContents(this.element, video.element);
  }
  return video;
}

/** Sets this frame's properties based on the properties of the given layout object. */
VideoFrame.prototype.setLayout = function(layout) {
  this.element.style.top = layout.top;
  this.element.style.right = layout.right;
  this.element.style.bottom = layout.bottom;
  this.element.style.left = layout.left;
};
