/** Helper class for storing and serializing key/value pairs for URL params. */
function UrlParam(key, value) {
  this.key = key;
  this.value = value;
}

/** Formats the key/value pair for writing to URL. */
UrlParam.prototype.toString = function() {
  return this.value
      ? `${this.key}=${this.value}`
      : `${this.key}`;
};

/** Static function that parses the URL parameters and returns the result as a key/value pair. */
function parseUrlParameters() {
  let parameters = [];
  let urlParameters = window.location.search.substring(1).split("&");
  for (let i = 0; i < urlParameters.length; i++) {
    let pair = urlParameters[i].split('=');
    parameters.push(UrlParam(pair[0], pair[1]));
    parameters[pair[0]] = pair[1];
  }
  return parameters;
}

/** Create a string of URL parameters for the given array of key/value pairs. */
function assembleUrlParameters(params) {
  return params && params.length
      ? `?${params.join('&')}`
      : '';
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
