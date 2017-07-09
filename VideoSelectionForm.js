function VideoSelectionForm(id, onSubmit) {

  let form = document.createElement('form');
  form.classList.add('video-selection-form');
  form.name = 'form' + id;
  form.method = 'post';
  form.onsubmit = () => {
    try {
      onSubmit(form);
    } catch (error) {
      console.error(error.stack);
    }
    return false;
  };

  let textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.name = 'video';
  textInput.placeholder = 'Video ID';
  form.appendChild(textInput);

  let submitInput = document.createElement('input');
  submitInput.type = 'submit';
  submitInput.value = ' ';
  form.appendChild(submitInput);

  this.element = form;
}
