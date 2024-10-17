import "./styles.css";
import { parseISO, format } from "date-fns";
import light from "./assets/light.png";
import dark from "./assets/dark.png";
import lightArrow from "./assets/lightArrow.png";
import darkArrow from "./assets/darkArrow.png";
import lightAdd from "./assets/lightAdd.png";
import darkAdd from "./assets/darkAdd.png";
import lightDel from "./assets/lightDel.png";
import darkDel from "./assets/darkDel.png";

import { todoFactory } from "./todoFactory";
import { listFactory } from "./listFactory";

const themeBtn = document.querySelector("#theme");
const body = document.querySelector("body");
const listTab = document.querySelector(".showLists--btn");
const listCont = document.querySelector(".lists--cont");
const addListBtn = document.querySelector(".lists--cont img");
const addTodoBtn = document.querySelector(".addTodo--img");
const todosCont = document.querySelector(".todos--cont");
const listForm = document.querySelector(".listForm");
const todoForm = document.querySelector(".taskForm");

let indivLists;

// list memory
let lists = [];

// Check for saved theme in localStorage
let savedTheme = localStorage.getItem("theme");

// Apply saved theme on page load
if (savedTheme) {
  const listArrow = document.querySelector(".showLists--btn img");
  const completedTasks = document.querySelectorAll(".completed");
  const delIcons = document.querySelectorAll(".delIcon");
  const completeTaskBtns = document.querySelectorAll(".completeBtn");

  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
    themeBtn.src = light;
    themeBtn.dataset.theme = "dark";
    listArrow.src = darkArrow;
    addListBtn.src = darkAdd;
    listTab.classList.add("dark-theme");
    listCont.classList.add("dark-theme");
    completeTaskBtns.forEach((item) => item.classList.add("dark-theme"));
    completedTasks.forEach((item) => item.classList.add("dark-theme"));
    delIcons.forEach((item) => (item.src = lightDel));
  } else {
    body.classList.remove("dark-theme");
    themeBtn.src = dark;
    themeBtn.dataset.theme = "light";
    listArrow.src = lightArrow;
    addListBtn.src = lightAdd;
    listTab.classList.remove("dark-theme");
    listCont.classList.remove("dark-theme");
    completedTasks.forEach((item) => item.classList.remove("dark-theme"));
    completeTaskBtns.forEach((item) => item.classList.remove("dark-theme"));
    delIcons.forEach((item) => (item.src = darkDel));
  }
}

// Theme switch event listener
themeBtn.addEventListener("click", () => {
  const listArrow = document.querySelector(".showLists--btn img");
  const completedTasks = document.querySelectorAll(".completed");
  const delIcons = document.querySelectorAll(".delIcon");
  const completeTaskBtns = document.querySelectorAll(".completeBtn");
  const addTodoBtn = document.querySelector(".addTodo--img");

  if (themeBtn.dataset.theme === "light") {
    savedTheme = "dark";
    body.classList.add("dark-theme");
    themeBtn.dataset.theme = "dark";
    themeBtn.src = light;
    listArrow.src = darkArrow;
    addListBtn.src = darkAdd;
    if (addTodoBtn) addTodoBtn.src = darkAdd;
    listTab.classList.add("dark-theme");
    listCont.classList.add("dark-theme");
    completedTasks.forEach((item) => item.classList.add("dark-theme"));
    completeTaskBtns.forEach((item) => item.classList.add("dark-theme"));
    delIcons.forEach((item) => (item.src = lightDel));
    localStorage.setItem("theme", "dark");
  } else {
    savedTheme = "light";
    body.classList.remove("dark-theme");
    themeBtn.dataset.theme = "light";
    themeBtn.src = dark;
    listArrow.src = lightArrow;
    addListBtn.src = lightAdd;
    if (addTodoBtn) addTodoBtn.src = lightAdd;
    listTab.classList.remove("dark-theme");
    listCont.classList.remove("dark-theme");
    completedTasks.forEach((item) => item.classList.remove("dark-theme"));
    completeTaskBtns.forEach((item) => item.classList.remove("dark-theme"));
    delIcons.forEach((item) => (item.src = darkDel));
    localStorage.setItem("theme", "light");
  }
});

// show/hide lists
let currentRotation = 0;
listTab.addEventListener("click", () => {
  const listArrow = document.querySelector(".showLists--btn img");
  currentRotation += 180;
  listArrow.style.transform = `rotate(${currentRotation}deg)`;
  listCont.classList.toggle("hideList");
});

// display controller
const displayController = {
  activeList: null,
  renderLists() {
    while (listCont.children.length > 1) {
      listCont.removeChild(listCont.lastChild);
    }
    lists.forEach((list, i) => {
      const container = document.createElement("div");
      container.classList.add("indivListCont", `${i}`);
      const listTitle = document.createElement("h2");
      listTitle.innerHTML = list.listName;
      container.appendChild(listTitle);
      listCont.appendChild(container);
      const delList = document.createElement("img");
      delList.classList.add("delIcon");
      savedTheme === "dark"
        ? (delList.src = lightDel)
        : (delList.src = darkDel);
      delList.addEventListener("click", () => {
        lists.splice(i, 1);
        container.style.background = "#D62828";
        container.classList.add("shake");
        setTimeout(() => {
          displayController.renderLists();
          todosCont.innerHTML = "";
        }, 250);
      });
      container.appendChild(delList);
    });
    indivLists = document.querySelectorAll(".indivListCont");
    indivLists.forEach((list) =>
      list.addEventListener("click", (e) => {
        if (e.target.localName === "div" || e.target.localName === "h2") {
          const listArrow = document.querySelector(".showLists--btn img");
          listCont.classList.toggle("hideList");
          this.activeList =
            e.target.localName === "h2"
              ? e.target.parentNode.classList[1]
              : e.target.classList[1];

          currentRotation += 180;
          listArrow.style.transform = `rotate(${currentRotation}deg)`;
          this.renderTodos();
        }
      })
    );
  },
  renderTodos() {
    todosCont.innerHTML = "";
    const addTodo = document.createElement("img");
    savedTheme === "dark" ? (addTodo.src = darkAdd) : (addTodo.src = lightAdd);
    addTodo.classList.add("addTodo--img");
    todosCont.appendChild(addTodo);
    addTodo.addEventListener("click", () => {
      todoForm.classList.remove("hiddenForm");
    });

    if (lists[this.activeList].todos.length > 0) {
      const todos = lists[this.activeList].todos;

      todos.forEach((item, i) => {
        const container = document.createElement("li");

        container.classList.add("indivTodoCont");
        const title = document.createElement("h3");
        title.innerHTML = item.title;
        title.classList.add("todo--title", item.completed ? "completed" : null);
        savedTheme === "dark" ? title.classList.add("dark-theme") : null;
        container.appendChild(title);
        todosCont.appendChild(container);
        const date = document.createElement("span");
        date.innerHTML = item.completed
          ? `Completed on: ${item.completedOn}`
          : `Complete by: ${item.dueDate}`;
        container.appendChild(date);
        const desc = document.createElement("p");
        desc.innerHTML = item.description;
        desc.classList.add("todo--desc", "hidden");
        container.appendChild(desc);
        container.addEventListener("click", (e) => {
          desc.classList.toggle("hidden");
          desc.classList.toggle("visible");
        });
        const completeBtn = document.createElement("div");
        completeBtn.classList.add("completeBtn");
        item.completed ? completeBtn.classList.add("completedTaskBtn") : null;
        savedTheme === "dark" ? completeBtn.classList.add("dark-theme") : null;
        container.appendChild(completeBtn);
        completeBtn.addEventListener("click", (e) => {
          lists[this.activeList].todos[i].toggleCompleted();
          this.renderTodos();
        });
        const delIcon = document.createElement("img");
        delIcon.classList.add("delIcon");
        delIcon.src = savedTheme === "dark" ? lightDel : darkDel;
        container.appendChild(delIcon);
        delIcon.addEventListener("click", (e) => {
          container.style.background = "#D62828";
          container.classList.add("shake");
          lists[this.activeList].removeTodo(i);
          setTimeout(() => {
            this.renderTodos();
          }, 250);
        });
      });
    }
  },
};

addListBtn.addEventListener("click", () => {
  const listArrow = document.querySelector(".showLists--btn img");
  listCont.classList.toggle("hideList");
  currentRotation += 180;
  listArrow.style.transform = `rotate(${currentRotation}deg)`;
  listForm.classList.remove("hiddenForm");
});

listForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newList = listFactory(e.target.querySelector("input").value);
  lists.push(newList);
  displayController.renderLists();
  e.target.reset();
  e.target.classList.add("hiddenForm");
});

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  let taskTitle;
  let taskDesc;
  let taskDate;
  for (let [key, value] of formData.entries()) {
    if (key === "title") {
      taskTitle = value;
    } else if (key === "description") {
      taskDesc = value;
    } else {
      taskDate = parseISO(value);
    }
  }

  if (taskTitle && taskDate) {
    const activeIndex = parseInt(displayController.activeList, 10);
    lists[activeIndex].addTodo(
      todoFactory(taskTitle, taskDesc, format(taskDate, "dd/MM/yy"))
    );

    displayController.renderTodos();
    e.target.reset();
    e.target.classList.add("hiddenForm");
  }
});

displayController.renderLists();

// responsive
