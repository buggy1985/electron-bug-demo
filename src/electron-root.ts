import { app, BrowserView, BrowserWindow } from 'electron';
import electronLog from 'electron-log';


let mainWindow ;


async function launch() {
  const singleInstanceLock = app.requestSingleInstanceLock();
  if(!singleInstanceLock) app.quit();

  app.on('second-instance',()=>{
    if(!mainWindow) return;
    if(mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  app.on('activate',()=>{
    if(!BrowserWindow.getAllWindows().length) createWindow();
  });

  app.on('window-all-closed',()=>{
    mainWindow= null;
    app.quit();
  })

}

//I think I found

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 1000,
    width: 1800,
    title: 'Main window',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
    show:false,
  });

  mainWindow.show();

  const view = new BrowserView({
    webPreferences:{
      nodeIntegration: false,
      contextIsolation: true,
    }
  })

  mainWindow.setBrowserView(view);

  view.webContents.loadURL('https://www.google.com/');


  // mainWindow.loadURL('https://www.google.com/')
  //mainWindow.webContents.openDevTools();
  mainWindow.on('closed', ( )=> {
    mainWindow = null;
  })
}


(async ()=> {

  await app.whenReady();

  await launch();

})();

// app.whenReady().then(async () => {
//   createWindow();

//   electronLog.log('App started');
//   // The main application is bootstrapped here. Removed for demonstration.

//   app.on('activate', function () {
//     // On macOS, it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});