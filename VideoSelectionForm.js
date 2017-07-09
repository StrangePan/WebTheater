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

  let leadingInstructions = document.createElement('div');
  leadingInstructions.classList.add('instructions');

  let p1 = document.createElement('p');
  p1.textContent = 'Paste a video URL, then enjoy the show!';
  leadingInstructions.appendChild(p1);
  
  form.appendChild(leadingInstructions);

  let textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.name = 'video';
  textInput.placeholder = 'Video ID';
  form.appendChild(textInput);

  let submitInput = document.createElement('input');
  submitInput.type = 'submit';
  submitInput.value = ' ';
  form.appendChild(submitInput);
  
  let followingInstructions = document.createElement('div');
  followingInstructions.classList.add('instructions');
  
  let p2 = document.createElement('p');
  p2.textContent = 'You can also drag and drop in a link.';
  followingInstructions.appendChild(p2);
  
  form.appendChild(followingInstructions);

  this.element = form;
}
