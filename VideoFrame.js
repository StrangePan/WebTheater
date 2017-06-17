function VideoFrame(id) {
  this.id = id;
  
  let frame = document.createElement('div');
  frame.classList.add('video-frame');
  
  this.element = frame;
}

VideoFrame.prototype.showContentSelection = function() {
  let form = new VideoSelectionForm(this.id, () => this.onFormSubmit());
  clearElementContents(this.element);
  this.element.appendChild(form);
};
