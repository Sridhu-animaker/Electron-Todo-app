const electron = require("electron");
const { ipcRenderer } = electron;


const list = document.querySelector("ul");
// To append value from Electromn app to the maion window
ipcRenderer.on("todo:addToMainPage", (event, todo) => {
  // Creating list and appending Todos inside the list
  const li = document.createElement("li");
  const text = document.createTextNode(todo);

  li.appendChild(text);
  list.appendChild(li);
});


// To clear the page on clicking clear
ipcRenderer.on(
  "todo:clear",
  () => (list.innerHTML = "")
);
