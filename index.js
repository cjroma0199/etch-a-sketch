const colorInput = document.querySelector("#color");
const selectColorParagraph = document.querySelector(".select-color");
const customButton = document.querySelector("#custom");
const rainbowButton = document.querySelector("#rainbow");
const shaderButton = document.querySelector("#shader");
const eraserButton = document.querySelector("#eraser");
const buttons = document.querySelectorAll(".button");

const isButtonActive = (button) => {
  return Object.values(button.classList).includes("active-mode");
};

function removeActiveButton(button) {
  buttons.forEach((btn) => {
    btn.classList.remove("active-mode");
    if (btn != button) btn.style.border = "none";
  });
}

const setActiveButton = (button) => {
  button.classList.add("active-mode");
};

function hoverOut() {
  if (!isButtonActive(this)) this.style.border = "none";
}

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

buttons.forEach((button) => {
  button.addEventListener("mouseover", hoverOver);
  button.addEventListener("mouseout", hoverOut);

  button.addEventListener("click", function () {
    removeActiveButton(this);
    setActiveButton(this);
  });
});
