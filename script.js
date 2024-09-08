let taskList = document.getElementById("taskList");
let taskInput = document.getElementById("taskInput");

// Add task when Enter key is pressed
taskInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Load tasks from local storage when the page is loaded
document.addEventListener("DOMContentLoaded", function() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    addTaskFromStorage(task.text, task.completed);
  });
});

// Add task function
function addTask() {
  let taskText = taskInput.value.trim();
  
  if (taskText !== "") {
    addTaskToStorage(taskText, false);
    taskInput.value = "";
  } else {
    alert("Please enter a task!");
  }
}

// Add task to both UI and local storage
function addTaskToStorage(text, completed) {
  let task = { text, completed };
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  addTaskFromStorage(text, completed);
}

// Add task to UI
function addTaskFromStorage(text, completed) {
  let li = document.createElement("li");
  let iconCircle = document.createElement("i");
  iconCircle.classList.add("far", completed ? "fa-check-circle" : "fa-circle");
  let textNode = document.createTextNode(text);
  let iconCross = document.createElement("i");
  iconCross.classList.add("fas", "fa-times", "cross-icon");
  li.appendChild(iconCircle);
  li.appendChild(textNode);
  li.appendChild(iconCross);
  li.addEventListener("click", toggleTask);
  taskList.appendChild(li);
}

// Toggle task completion
function toggleTask() {
  this.classList.toggle("completed");
  let icon = this.querySelector(".fa-circle, .fa-check-circle");
  icon.classList.toggle("fa-circle");
  icon.classList.toggle("fa-check-circle");

  // Update local storage with completed status
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let taskText = this.childNodes[1].nodeValue.trim();
  let taskIndex = tasks.findIndex(task => task.text === taskText);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

// Delete task
function deleteTask(event) {
  event.stopPropagation(); // Prevent toggling task completion when clicking on the cross icon
  this.remove();

  // Remove task from local storage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let taskText = this.childNodes[1].nodeValue.trim();
  let taskIndex = tasks.findIndex(task => task.text === taskText);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

// Add event listener to dynamically added cross icons
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("cross-icon")) {
    event.target.parentElement.remove();
    // Remove task from local storage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskText = event.target.parentElement.childNodes[1].nodeValue.trim();
    let taskIndex = tasks.findIndex(task => task.text === taskText);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }
});

// Clear all completed tasks
function clearCompleted() {
  let completedTasks = document.querySelectorAll(".completed");
  completedTasks.forEach(task => task.remove());

  // Remove completed tasks from local storage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => !task.completed);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}