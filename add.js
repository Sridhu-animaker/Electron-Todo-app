const electron = require("electron");
const { ipcRenderer } = electron;


document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();

  const { value } = document.querySelector("input"); // Destructuring input value from form
  // Sending value to electron app from add window
  ipcRenderer.send("todo:add", value);
});
