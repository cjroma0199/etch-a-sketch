const canvas = document.querySelector(".canvas");
const colorInput = document.querySelector("#color");
const selectColorParagraph = document.querySelector(".select-color");
const customButton = document.querySelector("#custom");
const rainbowButton = document.querySelector("#rainbow");
const shaderButton = document.querySelector("#shader");
const eraserButton = document.querySelector("#eraser");
const buttons = document.querySelectorAll(".button");
const slider = document.querySelector("#canvas-slider");
const sliderValue = document.querySelector(".slider-value");
const clearButton = document.querySelector("#clear");
const gridButton = document.querySelector("#grid");
const pixels = () => {
  return document.querySelectorAll(".pixel");
};

const canvasWith = canvas.offsetWidth;
const canvasHeight = canvas.offsetHeight;

sliderValue.textContent = `Canvas Size: ${slider.value}`;

const isClassActive = (element, strClass) => {
  return Object.values(element.classList).includes(strClass);
};

function removeActiveButton(button) {
  buttons.forEach((btn) => {
    btn.classList.remove("active-mode");
    if (btn != button && !isGrid(btn)) btn.style.border = "none";
  });
}

const setActiveButton = (button) => {
  if (isGrid(button)) return;
  button.classList.add("active-mode");
};

const isGrid = (button) => {
  return button.id == "grid";
};

const isClearButton = (button) => {
  return button.id == "clear";
};

function hoverOut() {
  if (!isClassActive(this, "active-mode") && !isClassActive(this, "grid-on"))
    this.style.border = "none";
}

const toggleGrid = () => {
  if (gridButton.classList.toggle("grid-on")) {
    gridButton.textContent = "Grid: On";
    pixels().forEach((pixel) => pixel.classList.add("border-grid"));
    return;
  }
  gridButton.textContent = "Grid: Off";
  pixels().forEach((pixel) => pixel.classList.remove("border-grid"));
};

const getActiveMode = () => {
  return document.querySelector(".active-mode").id;
};

function hoverOver() {
  if (this.id != "rainbow") {
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
    const div = document.createElement("div");
    div.classList.add("pixel");
    div.classList.add("border-grid");
    div.style.minWidth = `${canvasWith / number}px`;

    div.setAttribute("draggable", "false");
    canvas.appendChild(div);
  }
}

buttons.forEach((button) => {
  button.addEventListener("mouseover", hoverOver);
  button.addEventListener("mouseout", hoverOut);

  button.addEventListener("click", function () {
    if (isGrid(button) || isClearButton(button)) return;
    removeActiveButton(this);
    setActiveButton(this);
  });
});

gridButton.addEventListener("click", function () {
  toggleGrid();
});

slider.addEventListener("input", function () {
  sliderValue.textContent = `Canvas Size: ${this.value}`;
  clearCanvas();
  createPixel(this.value);
});

colorInput.addEventListener("input", function () {
  [shaderButton, customButton, eraserButton, gridButton, clearButton].forEach(
    (button) => {
      button.style.borderColor = colorInput.value;
    }
  );
  slider.style.accentColor = colorInput.value;
});

createPixel(slider.value);
