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


/** Helper class for storing and serializing key/value pairs for URL params. */
function UrlParam(key, value) {
  this.key = key;
  this.value = value;
}

/** Formats the key/value pair for writing to URL. */
UrlParam.prototype.toString = function() {
  return this.value != null
      ? `${this.key}=${this.value}`
      : `${this.key}`;
};

/** Static function that parses the URL parameters and returns the result as a key/value pair. */
function parseUrlParameters(urlParameters) {
  let parameters = [];
  urlParameters = urlParameters.split('&');
  for (let i = 0; i < urlParameters.length; i++) {
    let pair = urlParameters[i].split('=');
    if (pair[0].length == 0) {
      continue;
    }
    parameters.push(new UrlParam(pair[0], pair[1]));
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

/**
 * Compares two parsed URL parameter tables. Returns true if they have the same values
 * key/value pairs. Ignores order of parameters.
 */
function areParamsEqual(p1, p2) {
  if (p1.length != p2.length) {
    return false;
  }
  for (let i = 0; i < p1.length; i++) {
    if (p1[i].value != p2[p1[i].key]) {
      return false;
    }
  }
  return true;
}
