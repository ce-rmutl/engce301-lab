const X_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/x.png';
const O_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/circle.png';
// Add event listeners?

function changeToX(event) {
  // Get the element that was clicked
  const container = event.currentTarget;
  // Create an <img> tag with the X img src
  const image = document.createElement('img');
  image.src = X_IMAGE_URL;
  // Append that <img> tag to the element
  container.appendChild(image);
  container.removeEventListener('click', changeToX)
}

const boxes = document.querySelectorAll('#grid div');
for (const box of boxes) {
  box.addEventListener('click', changeToX);
}