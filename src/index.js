import "./styles.css";
import light from "./assets/light.png";
import dark from "./assets/dark.png";
import lightArrow from "./assets/lightArrow.png";
import darkArrow from "./assets/darkArrow.png";
import lightAdd from "./assets/lightAdd.png";
import darkAdd from "./assets/darkAdd.png";

import { todoFactory } from "./todoFactory";
import { listFactory } from "./listFactory";

const themeBtn = document.querySelector("#theme");
const body = document.querySelector("body");
const listTab = document.querySelector(".showLists--btn");
const listCont = document.querySelector(".lists--cont");
const addListBtn = document.querySelector(".lists--cont img");

// Check for saved theme in localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  body.classList.toggle("dark-theme", savedTheme === "dark");
  themeBtn.src = savedTheme === "dark" ? light : dark;
  themeBtn.dataset.theme = savedTheme;
}

// Theme switch
themeBtn.addEventListener("click", () => {
  const listArrow = document.querySelector(".showLists--btn img");
  if (themeBtn.dataset.theme === "light") {
    body.classList.add("dark-theme");
    themeBtn.dataset.theme = "dark";
    themeBtn.src = light;
    listArrow.src = darkArrow;
    addListBtn.src = darkAdd;
    listTab.classList.add("dark-theme");
    listCont.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark-theme");
    themeBtn.dataset.theme = "light";
    themeBtn.src = dark;
    listArrow.src = lightArrow;
    addListBtn.src = lightAdd;
    listTab.classList.remove("dark-theme");
    listCont.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
  }
});

let currentRotation = 0;
// show/hide lists
listTab.addEventListener("click", () => {
  const listArrow = document.querySelector(".showLists--btn img");
  currentRotation += 180;
  listArrow.style.transform = `rotate(${currentRotation}deg)`;
  listCont.classList.toggle("hideList");
});
