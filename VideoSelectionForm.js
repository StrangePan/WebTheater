function VideoSelectionForm(id, onSubmit) {

  let form = document.createElement('form');
  form.name = 'form' + id;
  form.method = 'post';
  form.onsubmit = () => {
    try {
      onSubmit();
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
  
  this.element = form;
}
