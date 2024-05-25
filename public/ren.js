document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('myButton');

  button.addEventListener('click', () => {
    output.textContent = 'Button was clicked!';
  });
});
