/**
 * Helper class for:
 * - Mananging browser history
 * - Responding to VideoFrameManager state changes
 * - Reading state data from URL
 */
function UrlManager(frameManager) {
  this.frameManager = frameManager;
  this.stateStack = 0;
  window.addEventListener('popstate', e => this.onBrowserPopState(e));
  frameManager.onPreStateChange = () => this.onFrameManagerPreStateChange();
  frameManager.onStateChange = () => this.onFrameManagerStateChange();
  this.loadStateFromUrl();
}

/** Called whenever the browser pops a history item. */
UrlManager.prototype.onBrowserPopState = function(e) {
  this.stateStack++;
  var params = e.state;
  if (params) {
    console.log('UrlManager.onBrowserPopState');
    this.frameManager.showLayoutFromUrlParams(params);
  } else {
    this.loadStateFromUrl();
  }
  this.stateStack--;
};

/** Called just before the VideoFrameManager state is about to change. */
UrlManager.prototype.onFrameManagerPreStateChange = function() {
  this.stateStack++;
};

/** Called when the VideoFrameManager state changes. */
UrlManager.prototype.onFrameManagerStateChange = function() {
  this.stateStack--;
  if (this.stateStack == 0) {
    this.pushStateToHistory();
  }
};

/**
 * Build URL params for the current state and push to the browser's history.
 * Returns true on success or false if nothing was pushed to the browser history.
 */
UrlManager.prototype.pushStateToHistory = function() {
  console.log('UrlManager.pushStateToHistory');
  let curParams = parseUrlParameters(window.location.search.substr(1));
  let newParams = this.frameManager.buildUrlParams();
  if (areParamsEqual(curParams, newParams)) {
    return false;
  }
  let newUrl = assembleUrlParameters(newParams);
  if (window.location.search.length > 0) {
    newUrl = window.location.href.replace(window.location.search, newUrl);
  }
  history.pushState(newParams, null, newUrl);
  return true;
};

UrlManager.prototype.loadStateFromUrl = function() {
  console.log('UrlManager.loadStateFromUrl');
  this.stateStack++;
  this.frameManager.showLayoutFromUrlParams(
      parseUrlParameters(window.location.search.substr(1)));
  this.stateStack--;
};
