const _YT_ID_CHAR = `a-zA-Z0-9_-`;
const _YT_VID_ID = `[${_YT_ID_CHAR}]{11}`;
const _YT_PL_ID = `[A-Z]{2}[${_YT_ID_CHAR}]{2,32}`;
const _YT_VID_ID_PL_ID = `(${_YT_VID_ID})?(?:(?:/?\\?|&)list=(${_YT_PL_ID}))?`;
const _YT_URL_PREFIX = `[/.](?:youtube\\.com/(?:watch/?\\?v=|embed/|playlist/?)|youtu\\.be/)`;

const _YT_VID_ID_MATCHER = new RegExp(`^(${_YT_VID_ID})$`);
const _YT_PL_ID_MATCHER = new RegExp(`^(${_YT_PL_ID})$`);
const _YT_URL_MATCHER = new RegExp(`${_YT_URL_PREFIX}${_YT_VID_ID_PL_ID}(?:[^${_YT_ID_CHAR}]|$)`);
const _YT_RES_MATCHER = new RegExp(`^${_YT_VID_ID_PL_ID}$`);

// Test strings
//   dQw4w9WgXcQ
//   https://www.youtube.com/watch?v=dQw4w9WgXcQ
//   https://youtu.be/dQw4w9WgXcQ
//   https://www.youtube.com/embed/dQw4w9WgXcQ
//   <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
//   https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ#t=0

/** Class for building and controlling a embedded YouTube video. */
function YouTubeVideo(videoId, playlistId) {
  this.videoId = videoId;
  if (typeof playlistId == 'string') {
    this.playlistId = playlistId;
  }
  
  let iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}${playlistId ? '?list=' + playlistId : ''}`;
  iframe.frameBorder = '0';
  iframe.setAttribute('allowfullscreen', '');

  this.element = iframe;
}


/**
 * Attempts to create a new instance using the given input. Expects input to be one of:
 * - YouTube video URL
 * - YouTube short video URL
 *
 * Returns a new YouTubeVideo instance if the given input is supported or null if not.
 */
YouTubeVideo.createFromInputString = function(input) {
  let extracts = YouTubeVideo.parseInputString(input);
  return extracts && new YouTubeVideo(extracts.videoId, extracts.playlistId);
};

/** Extracts video ID and playlist ID from input user string. Returns null on fail. */
YouTubeVideo.parseInputString = function(input) {
  let capturedData = _YT_URL_MATCHER.exec(input) || _YT_RES_MATCHER.exec(input);
  return capturedData && (capturedData[1] || capturedData[2]) && {
    videoId: capturedData[1],
    playlistId: capturedData[2]
  };
};

/** Returns boolean value indicating whether or not the player matches the given input string. */
YouTubeVideo.prototype.matchesInputString = function(input) {
  let extracts = YouTubeVideo.parseInputString(input);
  return extracts
      ? extracts.videoId == this.videoId && extracts.playlistId == this.playlistId
      : false;
};


/** Attempts to create a new instance using the given input params. Returns null if unable. */
YouTubeVideo.createFromUrlParams = function(params) {
  let videoId = params && _YT_VID_ID_MATCHER.test(params[0]) && params[0];
  let playlistId = params && _YT_PL_ID_MATCHER.test(params[1]) && params[1];
  return (videoId || playlistId) && new YouTubeVideo(videoId, playlistId);
};

/**
 * Create an array of parameters to write to the browser URL for use when restoring state.
 * Use createFromUrlParams to construct using these params.
 */
YouTubeVideo.prototype.buildUrlParams = function() {
  let params = [this.videoId];
  if (this.playlistId) {
    params.push(this.playlistId);
  }
  return params;
};

/** Returns boolean value indicating whether or not the palyer matches the given URL params. */
YouTubeVideo.prototype.matchesUrlParams = function(params) {
  return params && params[0] == this.videoId && params[1] == this.playlistId;
};
