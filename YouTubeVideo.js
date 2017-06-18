function YouTubeVideo(videoId) {
  let iframe = document.createElement('iframe');
  iframe.src = 'http://www.youtube.com/embed/' + videoId + '?rel=0';
  iframe.frameBorder = '0';
  iframe.setAttribute('allowfullscreen', '');

  this.element = iframe;
}