/** Class for rendering and managing the contents of the user control panel. */
function ControlPanel(container, frameManager) {
  this.frameManager = frameManager;

  let wrapper = document.createElement('div');
  wrapper.classList.add('control-panel');

  let buttonGroup = document.createElement('ul');
  buttonGroup.classList.add('layout-select-button-group');

  let buttons = [];
  let buttonLabels = [];
  for (let i = 0; i < 3; i++) {
    buttons[i] = document.createElement('li');
    buttons[i].classList.add('layout-select-button');
    buttons[i].onclick = () => this.select(i);
    buttonLabels[i] = document.createElement('span');
    buttonLabels[i].classList.add('label');
    buttons[i].appendChild(buttonLabels[i]);
  }

  buttons[0].classList.add('layout-select-fullscreen');
  buttonLabels[0].textContent = 'Fullscreen';
  buttons[1].classList.add('layout-select-splitscreen');
  buttonLabels[1].textContent = 'Splitscreen';
  buttons[2].classList.add('layout-select-corners');
  buttonLabels[2].textContent = 'Corners';

  for (let i = 0; i < buttons.length; i++) {
    buttonGroup.appendChild(buttons[i]);
  }
  this.buttons = buttons;
  wrapper.appendChild(buttonGroup);

  this.element = wrapper;
  this.select(-1);
}

ControlPanel.prototype.select = function(buttonInd) {
  this.selected = buttonInd;
  for (let i = 0; i < this.buttons.length; i++) {
    this.setSelected(this.buttons[i], i == buttonInd);
  }
  this.frameManager.showLayout(LayoutType(buttonInd));
};

ControlPanel.prototype.setSelected = function(button, selected) {
  if (selected) {
    button.classList.add('selected');
  } else {
    button.classList.remove('selected');
  }
};
