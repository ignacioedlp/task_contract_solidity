document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

// Add task
const taskForm = document.querySelector("#taskForm");

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskForm["title"].value;
  const description = taskForm["description"].value;
  App.createTask(title, description);
});
