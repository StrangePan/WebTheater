/** Class for building and managing a button for selecting a layout. */
function LayoutSelectionButton(text, onclick) {
  let button = document.createElement('button');
  button.textContent = text;
  button.onclick = onclick;
  
  this.element = button;
}