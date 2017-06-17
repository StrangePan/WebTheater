function VideoFrame() {
  lazy(this, 'element', () => this.buildDomElement());
}

VideoFrame.prototype.buildDomElement = function() {
  let frame = document.createElement('div');
  frame.classList.add('video-frame');
  return frame;
};
