function FloatyCircleBackground(concurrentCount) {
  concurrentCount = concurrentCount || 10;
  
  let background = document.createElement('div');
  background.classList.add('floaty-circle-background');

  this.background = background;
  this.element = background;

  this.colorIndex = Math.floor(Math.random() * _CIRCLE_COLORS.length);
  let intervalMs = _CIRCLE_DURATION * 1000 / concurrentCount;

  for (let i = 0; i < concurrentCount; i++) {
    let timeoutMs = i * _CIRCLE_INIT_SPACING * 1000;
    let durationMs = _CIRCLE_DURATION * 1000
        - (concurrentCount - i) * intervalMs
        - timeoutMs
        + 3000;
    setTimeout(() => this.createCircle(durationMs), timeoutMs);
  }
}


const _CIRCLE_DURATION = 20; // seconds
const _CIRCLE_INIT_SPACING = 0.125; // seconds
const _CIRCLE_COLORS = [
//  '#f4f442',
  '#485dff',
  '#41f44d',
  '#f441ee',
  '#f48541',
  '#41f4e5',
  '#f44141'];


FloatyCircleBackground.prototype.createCircle = function(durationOverride) {
  this.colorIndex = (this.colorIndex + 1) % _CIRCLE_COLORS.length;
  let fillColor = _CIRCLE_COLORS[this.colorIndex];
  let element = document.createElement('div');
  element.classList.add('circle');
  element.style.transform = 'translate(-50%, -50%)';
  element.innerHTML =
      `<svg width="100%" height="100%">
        <circle cx="50%" cy="50%" r="50%" stroke="none" stroke-width="0" fill="${fillColor}"/>
      </svg>`;

  let animStart = new Date().getTime();
  let translateAngle = Math.random() * Math.PI * 2;
  let translateDist = 10 + Math.random() * 15;
  let animDuration = _CIRCLE_DURATION * 1000;
  if (durationOverride) {
    animDuration = durationOverride;
    translateDist *= durationOverride / (_CIRCLE_DURATION * 1000);
  }
  let startTop = 10 + Math.random() * 80;
  let startLeft = 10 + Math.random() * 80;
  let deltaTop = Math.sin(translateAngle) * translateDist;
  let deltaLeft = Math.cos(translateAngle) * translateDist;

  element.style.opacity = 0;
  element.style.top = `${startTop}%`;
  element.style.left = `${startLeft}%`;

  let motionInterval = setInterval(() => {
    let animTime = new Date().getTime() - animStart;
    let animScale = animTime / animDuration;

    if (animTime < 1000) {
      element.style.opacity = `${animTime / 1000}`;
    } else if (animTime > animDuration - 1000) {
      element.style.opacity = `${(animDuration - animTime) / 1000}`;
    } else {
      element.style.opacity = '1';
    }

    element.style.top = `${startTop + deltaTop * animScale}%`;
    element.style.left = `${startLeft + deltaLeft * animScale}%`;

    if (animTime > animDuration) {
      clearInterval(motionInterval);
      this.background.removeChild(element);
      this.createCircle();
    }
  }, 20);

  this.background.appendChild(element);
};


