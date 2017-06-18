function VideoFrame(id) {
  let frame = document.createElement('div');
  frame.classList.add('video-frame');
  
  this.element = frame;
  this.id = id;
  this.showContentSelection();
}

/** Show this frame's content selector to the user. */
VideoFrame.prototype.showContentSelection = function() {
  setElementContents(this.element, new VideoSelectionForm(this.id, form => this.onFormSubmit(form)).element);
};

VideoFrame.prototype.onFormSubmit = function(form) {
  this.showYouTubeVideo(form.video.value);
};

VideoFrame.prototype.showYouTubeVideo = function(videoId) {
  setElementContents(this.element, new YouTubeVideo(videoId).element);
}

/** Sets this frame's properties based on the properties of the given layout object. */
VideoFrame.prototype.setLayout = function(layout) {
  this.element.style.top = layout.top;
  this.element.style.right = layout.right;
  this.element.style.bottom = layout.bottom;
  this.element.style.left = layout.left;
};
