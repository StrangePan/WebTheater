function VideoSelectionForm(id, onSubmit) {
  this.onSubmit = onSubmit;

  let form = document.createElement('form');
  form.classList.add('video-selection-form');
  form.name = 'form' + id;
  form.method = 'post';
  form.onsubmit = () => {
    try {
      onSubmit(form.video.value);
    } catch (error) {
      console.error(error.stack);
    }
    return false;
  };
  form.addEventListener('drag', e => this.onDrag(e));
  form.addEventListener('dragstart', e => this.onDrag(e));
  form.addEventListener('dragover', e => this.onDragStart(e));
  form.addEventListener('dragenter', e => this.onDragStart(e));
  form.addEventListener('dragleave', e => this.onDragEnd(e));
  form.addEventListener('dragend', e => this.onDragEnd(e));
  form.addEventListener('drop', e => this.onDrop(e));

    let manualWrapper = document.createElement('div');
    manualWrapper.classList.add('form-wrapper');

      let leadingInstructions = document.createElement('div');
      leadingInstructions.classList.add('instructions');

        let p1 = document.createElement('p');
        p1.textContent = 'Paste or drop a video URL, then enjoy the show!';
        leadingInstructions.appendChild(p1);

      manualWrapper.appendChild(leadingInstructions);

      let textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.name = 'video';
      textInput.placeholder = 'Video ID';
      manualWrapper.appendChild(textInput);

      let submitInput = document.createElement('input');
      submitInput.type = 'submit';
      submitInput.value = ' ';
      manualWrapper.appendChild(submitInput);

    form.appendChild(manualWrapper);

    let dropOverlay = document.createElement('div');
    dropOverlay.classList.add('drop-overlay');

      let dropImage = document.createElement('img');
      dropImage.src = 'drop_arrow.svg';
      dropImage.classList.add('drop-icon');
      dropOverlay.appendChild(dropImage);

    form.appendChild(dropOverlay);

  this.element = form;
}

VideoSelectionForm.prototype.onDrag = function(e) {
  e.preventDefault();
  e.stopPropagation();
}

VideoSelectionForm.prototype.onDragStart = function(e) {
  this.onDrag(e);
  this.element.classList.add('dragover');
}

VideoSelectionForm.prototype.onDragEnd = function(e) {
  this.onDrag(e);
  this.element.classList.remove('dragover');
}

VideoSelectionForm.prototype.onDrop = function(e) {
  this.onDragEnd(e);
  let items = e.dataTransfer.items;
  if (items.length < 1) {
    return;
  }

  let item = items[0];
  if ((item.kind == 'string') && (item.type.match('^text/plain'))) {
    // This item is the target node
    item.getAsString(s => this.onSubmit(s));
  } else if ((item.kind == 'string') && (item.type.match('^text/uri-list'))) {
    // Drag data item is URI
    item.getAsString(s => this.onSubmit(decodeURIComponent(s)));
  }
}


