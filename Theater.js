function Theater(containerId) {
  this.container = document.getElementById(containerId);

  this.frameManager = new VideoFrameManager(this.container);
  this.urlManager = new UrlManager(this.frameManager);
  this.controlPanel = new ControlPanel(this.container, this.frameManager);

  setElementContents(this.container, this.frameManager.element, this.controlPanel.element);
}
