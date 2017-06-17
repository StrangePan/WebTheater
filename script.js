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

/**
 * Sets the property of the given name for the given object to initialize its value with that
 * returned by func the first time.
 */
function lazy(obj, prop, func) {
  Object.defineProperty(obj, prop, {
    get: () => obj[prop] = func(),
    set: (value) => {
      Object.defineProperty(obj, prop, {value: value});
      return value;
    }
  });
}
