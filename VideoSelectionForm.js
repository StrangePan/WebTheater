function VideoSelectionForm(onSubmit) {
  this.onSubmit = onSubmit;
  lazy(this, 'element', () => this.buildDomElement());
}

VideoSelectionForm.prototype.buildDomElement = function() {
  let form = document.createElement('form');
  form.name = 'form' + id;
  form.method = 'post';
  form.onsubmit = () => {
    try {
      this.onSubmit();
    } catch (error) {
      console.log(error);
    }
    return false;
  };
  
  let textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.name = 'video';
  textInput.placeholder = 'Video ID';
  
  let submitInput = document.createElement('input');
  submitInput.type = 'submit';
  submitInput.value = 'Go';
  
  form.appendChild(textInput);
  form.appendChild(submitInput);
  return form;
};
