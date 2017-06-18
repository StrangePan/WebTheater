const _YT_URL_MATCHER = /[/.](?:youtube\.com\/(?:watch\/?\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[^a-zA-Z0-9_-]|$)/;
const _YT_ID_MATCHER = /^([a-zA-Z0-9_-]{11})$/;

// Test strings
//   dQw4w9WgXcQ
//   https://www.youtube.com/watch?v=dQw4w9WgXcQ
//   https://youtu.be/dQw4w9WgXcQ
//   https://www.youtube.com/embed/dQw4w9WgXcQ
//   <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>

function YouTubeVideo(videoId) {
  let iframe = document.createElement('iframe');
  iframe.src = 'http://www.youtube.com/embed/' + videoId + '?rel=0';
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
  let videoId = _YT_URL_MATCHER.exec(input) || _YT_ID_MATCHER.exec(input);
  return videoId && new YouTubeVideo(videoId[1]);
};
