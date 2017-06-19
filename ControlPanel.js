/** Class for rendering and managing the contents of the user control panel. */
function ControlPanel(container, frameManager) {
  this.frameManager = frameManager;

  let wrapper = document.createElement('div');
  wrapper.classList.add('control-panel');
  wrapper.addEventListener('')

  let panel = document.createElement('div');

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
  panel.appendChild(buttonGroup);
  wrapper.appendChild(panel);

  this.element = wrapper;
  this.panel = panel;
  this.select(-1);
  
  container.addEventListener('mousemove', e => this.onMouseMove(e));
  container.addEventListener('mouseleave', e => this.onMouseLeave(e));
  this.setHoverState(2);
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

ControlPanel.prototype.onMouseMove = function(e) {
  let distToCenter = Math.abs(e.currentTarget.offsetWidth / 2 - e.clientX);
  let distToTop = Math.abs(e.clientY);
  let distToHorEdge = distToCenter - this.panel.offsetWidth / 2;
  let distToVerEdge = distToTop - this.panel.offsetHeight;

  if (distToHorEdge <= 128 && distToVerEdge <= 0) {
    this.setHoverState(0);
  } else if (distToTop <= this.panel.offsetHeight * 2) {
    this.setHoverState(1);
  } else {
    this.setHoverState(2);
  }
};

ControlPanel.prototype.onMouseLeave = function(e) {
  this.setHoverState(2);
};

ControlPanel.CLASS_VISIBILITY = [
    'visibility-full',
    'visibility-peek',
    'visibility-tuck'
];

ControlPanel.prototype.setHoverState = function(state) {
  if (state === this.hoverState
      || typeof state != 'number'
      || state < 0
      || state >= ControlPanel.CLASS_VISIBILITY.length) {
    return;
  }
  this.hoverState = state;
  for (let i = 0; i < ControlPanel.CLASS_VISIBILITY.length; i++) {
    if (i === state) {
      this.element.classList.add(ControlPanel.CLASS_VISIBILITY[i]);
    } else {
      this.element.classList.remove(ControlPanel.CLASS_VISIBILITY[i]);
    }
  }
};
