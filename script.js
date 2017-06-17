var Param = {
  LAYOUT_TYPE: 'l'
};

var urlParameters;

function updateVideoLayout() {
  var layoutType = urlParameters[Param.LAYOUT_TYPE];
  loadLayout(VideoLayouts[layoutType]);
}

/** Static function that parses the URL parameters and returns the result as a key/value pair. */
function parseUrlParameters() {
  var urlParameters = [];
  var query = window.location.search.substring(1);
  var parameters = query.split("&");
  for (var i = 0; i < parameters.length; i++) {
    var pair = parameters[i].split("=");
    urlParameters[pair[0]] = urlParameters[pair[1]];
  }
  return urlParameters;
}

/** Static function for removing all child elements from the given DOM element. */
function clearElementContents(element) {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }
}

/** Static function. Sets the given element's child nodes. Removes any existing children. */
function setElementContents(element) {
  clearElementContents(element);
  for (let i = 1; i < arguments.length; i++) {
    element.appendChild(arguments[i]);
  }
}
