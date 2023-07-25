const canvas = document.querySelector('.canvas');
const colorInput = document.querySelector('#color');
const selectColorParagraph = document.querySelector('.select-color');
const customButton = document.querySelector('#custom');
const rainbowButton = document.querySelector('#rainbow');
const shaderButton = document.querySelector('#shader');
const eraserButton = document.querySelector('#eraser');
const buttons = document.querySelectorAll('.button');
const slider = document.querySelector('#canvas-slider');
const sliderValue = document.querySelector('.slider-value');
const clearButton = document.querySelector('#clear');
const gridButton = document.querySelector('#grid');
const pixels = canvas.childNodes;

const canvasWith = canvas.offsetWidth;
const canvasHeight = canvas.offsetHeight;

const COLOR_WHITE = 'rgb(255, 255, 255)';

let mouse = 0;

sliderValue.textContent = `Canvas Size: ${slider.value}`;

const isClassActive = (element, strClass) => {
  return Object.values(element.classList).includes(strClass);
};

function removeActiveButton(button) {
  buttons.forEach((btn) => {
    btn.classList.remove('active-mode');
    if (btn != button && !isGrid(btn)) btn.style.border = 'none';
  });
}

const setActiveButton = (button) => {
  if (isGrid(button)) return;
  button.classList.add('active-mode');
};

const isGrid = (button) => {
  return button.id == 'grid';
};

const isClearButton = (button) => {
  return button.id == 'clear';
};

function hoverOut() {
  if (!isClassActive(this, 'active-mode') && !isClassActive(this, 'grid-on'))
    this.style.border = 'none';
}

const toggleGrid = () => {
  if (gridButton.classList.toggle('grid-on')) {
    gridButton.textContent = 'Grid: On';
    pixels.forEach((pixel) => pixel.classList.add('border-grid'));
    return;
  }
  gridButton.textContent = 'Grid: Off';
  pixels.forEach((pixel) => pixel.classList.remove('border-grid'));
};

const isActiveMode = (mode) => {
  return mode == document.querySelector('.active-mode').id;
};

function hoverOver() {
  if (this.id != 'rainbow') {
    this.style.borderLeft = `8px solid ${colorInput.value}`;
    return;
  }
  this.style.cssText = `border-left: 8px solid transparent;
    border-image: linear-gradient(
    to top,
    #b827fc 0%,
    #2c90fc 25%,
    #b8fd33 50%,
    #fec837 75%,
    #fd1892 100%);
    border-image-slice: 1;`;
}

function clearCanvas() {
  while (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }
}

function createPixel(number) {
  for (let i = 0; i < number * number; i++) {
    const div = document.createElement('div');
    div.classList.add('pixel');
    div.classList.add('border-grid');
    div.style.minWidth = `${canvasWith / number}px`;
    div.setAttribute('draggable', 'false');
    canvas.appendChild(div);
  }
}

function randomNumber(range) {
  return Math.floor(Math.random() * range + 1);
}

function rainbow(pixel) {
  if (isClassActive(pixel, 'shaded')) pixel.classList.remove('shaded');
  return `rgb(${randomNumber(255)} ,${randomNumber(255)}, ${randomNumber(255)}, 1)`;
}

function eraser(pixel) {
  if (isClassActive(pixel, 'shaded')) pixel.classList.remove('shaded');
  return COLOR_WHITE;
}

function custom(pixel) {
  if (isClassActive(pixel, 'shaded')) pixel.classList.remove('shaded');
  return toRGBA(colorInput.value);
}

function getBaseColor(color, start = '(', end = ')') {
  char1 = rgba.indexOf(start) + 2;
  char2 = rgba.lastIndexOf(end);
  return rgba.substring(char1, char2);
}

function shader(pixel) {
  const currentColor = pixel.style.backgroundColor;
  const color = colorInput.value;
  const currentOpacity = +opacity.get(currentColor);

  if (isClassActive(pixel, 'shaded') && toRGBA(color, currentOpacity) == currentColor) {
    return opacity.replace(currentColor, (currentOpacity + 0.1).toFixed(1));
  }

  if (toRGBA(color) != currentColor && !isClassActive(pixel, 'shaded')) {
    pixel.classList.add('shaded');
    return opacity.set(color, 0.1);
  }
}

function clear() {
  pixels.forEach((pixel) => {
    pixel.style.backgroundColor = COLOR_WHITE;
    if (isClassActive(pixel, 'shaded')) pixel.classList.remove('shaded');
  });
}

function toRGBA(color, opacity = 1) {
  const red = parseInt(color.substr(1, 2), 16);
  const green = parseInt(color.substr(3, 2), 16);
  const blue = parseInt(color.substr(5, 2), 16);

  if (opacity >= 1 || opacity == 1) {
    return `rgba(${red}, ${green}, ${blue})`;
  }

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

const opacity = {
  get: function (rgba, start = ',', end = ')') {
    char1 = rgba.lastIndexOf(start) + 2;
    char2 = rgba.lastIndexOf(end);
    return rgba.substring(char1, char2);
  },
  replace: function (color, set) {
    return color.replace(this.get(color), set);
  },
  set: function (color, opacity) {
    return toRGBA(color, opacity);
  },
};

function removeShade() {
  pixels.forEach((pixel) => {
    if (isClassActive(pixel, 'shaded')) pixel.classList.remove('shaded');
  });
}

function getActiveMode(pixel) {
  if (isActiveMode('custom')) return custom(pixel);
  if (isActiveMode('rainbow')) return rainbow(pixel);
  if (isActiveMode('eraser')) return eraser(pixel);
  return shader(pixel);
}

function draw(pixel, color) {
  pixel.style.backgroundColor = color;
}

function isMouseDown() {
  document.addEventListener('mousedown', function (e) {
    mouse = true;
  });
  document.addEventListener('mouseup', function (e) {
    mouse = false;
  });
}

function activateCanvas() {
  pixels.forEach((pixel) => {
    pixel.addEventListener('mouseover', () => {
      if (!mouse) return;
      draw(pixel, getActiveMode(pixel));
    });
    pixel.addEventListener('click', () => {
      draw(pixel, getActiveMode(pixel));
    });
  });
}

buttons.forEach((button) => {
  button.addEventListener('mouseover', hoverOver);
  button.addEventListener('mouseout', hoverOut);

  button.addEventListener('click', function () {
    if (isClearButton(button)) {
      clear();
      return;
    }
    if (isGrid(button)) return;
    removeActiveButton(this);
    setActiveButton(this);
  });
});

gridButton.addEventListener('click', function () {
  toggleGrid();
});

slider.addEventListener('input', function () {
  sliderValue.textContent = `Canvas Size: ${this.value}`;
  clearCanvas();
  createPixel(this.value);
});

slider.addEventListener('change', activateCanvas);

colorInput.addEventListener('input', function () {
  [shaderButton, customButton, eraserButton, gridButton, clearButton].forEach(
    (button) => {
      button.style.borderColor = colorInput.value;
    }
  );
  slider.style.accentColor = colorInput.value;
});

colorInput.addEventListener('change', removeShade);

if (!canvas.lastChild) createPixel(slider.value);

activateCanvas();
isMouseDown();

// slidesShow

var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs((slideIndex += n));
}

function showDivs(n) {
  let i;
  let img = document.getElementsByClassName('mySlides');
  if (n > img.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = img.length;
  }
  for (i = 0; i < img.length; i++) {
    img[i].style.display = 'none';
  }
  img[slideIndex - 1].style.display = 'block';
}
