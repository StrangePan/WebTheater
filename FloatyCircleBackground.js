function FloatyCircleBackground() {
  let background = document.createElement('div');
  background.classList.add('floaty-circle-background');

  this.background = background;
  this.element = background;

  this.colorIndex = Math.floor(Math.random() * FloatyCircleBackground.circleColors.length);
  setInterval(() => this.createCircle(), 1750);
}


FloatyCircleBackground.circleColors = [
  '#485dff',
//  '#f4f442',
  '#41f44d',
  '#f441ee',
  '#f48541',
  '#41f4e5',
  '#f44141'];

FloatyCircleBackground.prototype.createCircle = function() {
  this.colorIndex = (this.colorIndex + 1) % FloatyCircleBackground.circleColors.length;
  let fillColor = FloatyCircleBackground.circleColors[this.colorIndex];
  let element = document.createElement('div');
  element.classList.add('circle');
  element.style.transform = 'translate(-50%, -50%)';
  element.innerHTML =
      `<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" id="svg8" version="1.1" viewBox="0 0 10 10" height="100%" width="100%">
      <defs id="defs2" /><metadata id="metadata5"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata>
      <g transform="translate(0,-287)" id="layer1"><circle r="5" cy="292" cx="5" id="path4485" style="fill:${fillColor};fill-opacity:1;stroke:none;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none" /></g></svg>`;

  let translateAngle = Math.random() * Math.PI * 2;
  let translateDist = 10 + Math.random() * 15;
  let animStart = new Date().getTime();
  let animDuration = 20000;
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
    }
  }, 20);

  this.background.appendChild(element);
};


