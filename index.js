const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain } = electron;


let mainWindow;
let addWindow;


app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
        nodeIntegration: true, // This should be true to aviod error while compiling.
        contextIsolation: false,
      },
  });
  mainWindow.loadURL(`file://${__dirname}/main.html`);

  //   To close the entire app with the subScreen on closing the main screen
  mainWindow.on("closed", () => app.quit());

  //   To creare the menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate); //Will generate the menu
  Menu.setApplicationMenu(mainMenu); //Will create the menu
});



// getting the data from the Add window
ipcMain.on("todo:add", (event, todo) => {
  // Sending the data to the main window
  mainWindow.webContents.send("todo:addToMainPage", todo);
  // To close the window
  addWindow.close();
});



function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add New Todo",
    webPreferences: {
        nodeIntegration: true, // This should be true to aviod error while compiling.
        contextIsolation: false,
      },
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  // The below line is to avoid the garbage collector issue
  addWindow.on("closed", () => (addWindow = null));
}



const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New Todo",
        // This function will be called on clicking the submenu 'New Todo'
        click() {
          createAddWindow();
        },
      },
      {
        label: "Clear Todo",
        click() {
          mainWindow.webContents.send("todo:clear");
        },
      },
      {
        label: "Quit",
        // This function will be called on clicking the submenu 'Quit'
        // acclerator is used to enable hotkeys feature
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];


// To write platform specific code we use the below condition (MacOS : 'darwin') (WindowsOS: 'win32')
if (process.platform === "darwin") {
  menuTemplate.unshift({ label: "" });
}


// To write code for specific mode (production, development, staging, test)
if (process.env.NODE_ENV !== "production") {
  menuTemplate.push({
    label: "View",
    submenu: [
      { role: "reload" },  //To enable reload option 
      {
        label: "Toggle dev tools",
        accelerator:
          process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
    ],
  });
}
