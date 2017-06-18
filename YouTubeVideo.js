const _YT_ID_CHAR = `a-zA-Z0-9_-`;
const _YT_VID_ID = `[${_YT_ID_CHAR}]{11}`;
const _YT_PL_ID = `[${_YT_ID_CHAR}]{13}`;
const _YT_VID_ID_PL_ID = `(${_YT_VID_ID})(?:(?:/?\\?|&)list=(${_YT_PL_ID}))?`;
const _YT_URL_PREFIX = `[/.](?:youtube\\.com/(?:watch/?\\?v=|embed/)|youtu\\.be/)`;

const _YT_URL_MATCHER = new RegExp(`${_YT_URL_PREFIX}${_YT_VID_ID_PL_ID}(?:[^${_YT_ID_CHAR}]|$)`);
const _YT_RES_MATCHER = new RegExp(`^${_YT_VID_ID_PL_ID}$`);

// Test strings
//   dQw4w9WgXcQ
//   https://www.youtube.com/watch?v=dQw4w9WgXcQ
//   https://youtu.be/dQw4w9WgXcQ
//   https://www.youtube.com/embed/dQw4w9WgXcQ
//   <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
//   https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ#t=0

function YouTubeVideo(videoId, playlistId) {
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
YouTubeVideo.createFromString = function(input) {
  let videoId = _YT_URL_MATCHER.exec(input) || _YT_RES_MATCHER.exec(input);
  return videoId && new YouTubeVideo(videoId[1], videoId[2]);
};
