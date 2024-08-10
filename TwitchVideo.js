const _TW_PARAM_PREFIX_CHANNEL = 'c';
const _TW_PARAM_PREFIX_VIDEO = 'v';
const _TW_PARAM_PREFIX_COLLECTION = 'l';

const _TW_CHANNEL_NAME_CHAR = `a-zA-Z0-9_-`;
const _TW_CHANNEL_NAME = `[${_TW_CHANNEL_NAME_CHAR}]+`;
const _TW_VIDEO_ID_CHAR = `0-9`;
const _TW_VIDEO_ID = `[${_TW_VIDEO_ID_CHAR}]+`;
const _TW_COLLECTION_ID_CHAR = _TW_CHANNEL_NAME_CHAR;
const _TW_COLLECTION_ID = `[${_TW_COLLECTION_ID_CHAR}]+`;
const _TW_URL_PREFIX = `[/.](?:twitch\\.tv/)`;

const _TW_CHANNEL_MATCHER = new RegExp(`^(${_TW_CHANNEL_NAME})$`);
const _TW_VIDEO_MATCHER = new RegExp(`^(${_TW_VIDEO_ID})$`);
const _TW_COLLECTION_MATCHER = new RegExp(`^(${_TW_COLLECTION_ID})$`);
const _TW_URL_MATCHER = new RegExp(`${_TW_URL_PREFIX}(?:(${_TW_CHANNEL_NAME})(?:$|\\?)|videos/(${_TW_VIDEO_ID})(?:\\?collection=)?|collections/)(${_TW_COLLECTION_ID})?`);
console.log(_TW_URL_MATCHER.source);


/** Class for building and controlling an embedded Twitch video. */
function TwitchVideo(channelName, videoId, collectionId) {
  this.channelName = channelName;
  this.videoId = videoId;
  this.collectionId = collectionId;
  
  let iframe = document.createElement('iframe');
  iframe.frameBorder = '0';
  iframe.setAttribute('allowfullscreen', '');
  iframe.scrolling = 'no';

  if (channelName) {
    iframe.src = `https://player.twitch.tv/?channel=${channelName}&muted=false`;
  } else if (videoId) {
    iframe.src = `https://player.twitch.tv/?video=v${videoId}&autoplay=false&muted=false`;
  } else if (collectionId) {
    iframe.src = `https://player.twitch.tv/?collection=${collectionId}&autoplay=false&muted=false`;
  }
  
  this.element = iframe;
}



TwitchVideo.createFromInputString = function(input) {
  let extracts  = TwitchVideo.parseInputString(input);
  return extracts && new TwitchVideo(extracts.channelName, extracts.videoId, extracts.collectionId);
};

TwitchVideo.parseInputString = function(input) {
  let capturedData = _TW_URL_MATCHER.exec(input);
  return capturedData && (capturedData[1] || capturedData[2] || capturedData[3]) && {
    channelName: capturedData[1],
    videoId: capturedData[2],
    collectionId: capturedData[3]
  };
};

TwitchVideo.prototype.matchesInputString = function(input) {
  let extracts = TwitchVideo.parseInputString(input);
  return extracts
      ? extracts.channelName == this.channelName && extracts.videoId == this.videoId && extracts.collectionId == this.collectionId
      : false;
};

TwitchVideo.createFromUrlParams = function(params) {
  if (!params) {
    return null;
  }
  if (params[0] == _TW_PARAM_PREFIX_CHANNEL) {
    let channelName = _TW_CHANNEL_MATCHER.test(params[1]) && params[1];
    return channelName ? new TwitchVideo(channelName, null, null) : null;
  }
  if (params[0] == _TW_PARAM_PREFIX_VIDEO) {
    let videoId = _TW_VIDEO_MATCHER.test(params[1]) && params[1];
    return videoId ? new TwitchVideo(null, videoId, null) : null;
  }
  if (params[0] == _TW_PARAM_PREFIX_COLLECTION) {
    let collectionId = _TW_COLLECTION_MATCHER.test(params[1]) && params[1];
    return collectionId ? new TwitchVideo(null, null, collectionId) : null;
  }
  return null;
}

TwitchVideo.prototype.buildUrlParams = function() {
  if (this.channelName) {
    return [_TW_PARAM_PREFIX_CHANNEL, this.channelName];
  }
  if (this.videoId) {
    return [_TW_PARAM_PREFIX_VIDEO, this.videoId];
  }
  if (this.collectionId) {
    return [_TW_PARAM_PREFIX_COLLECTION, this.collectionId];
  }
  return [];
}

TwitchVideo.prototype.matchesUrlParams = function(params) {
  return params && (
         (params[0] == _TW_PARAM_PREFIX_CHANNEL && params[1] == this.channelName)
      || (params[0] == _TW_PARAM_PREFIX_VIDEO  && params[1] == this.videoId)
      || (params[0] == _TW_PARAM_PREFIX_COLLECTION && params[1] == this.collectionId));
}
