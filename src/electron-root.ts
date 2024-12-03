import * as path from 'path';
import { app, BrowserWindow, Menu, MenuItem, shell, dialog } from 'electron';
import electronLog from 'electron-log';

function createWindow() {
  const mainWindow = new BrowserWindow({
    height: 1000,
    width: 1800,
    title: 'Main window',
  });
  mainWindow.loadFile(path.join(__dirname, 'static/main.html'));
  //mainWindow.webContents.openDevTools();
}

function createSecondWindow() {
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 800,
    title: 'Second window',
  });
  mainWindow.loadFile(path.join(__dirname, 'static/second.html'));
  //mainWindow.webContents.openDevTools();
}


electronLog.log('requestSingleInstanceLock.');
const gotTheLock = app.requestSingleInstanceLock();

app.on('child-process-gone', (event, details) => {
  electronLog.error('child-process-gone');
  electronLog.error(event);
  electronLog.error(details);
});

app.on('render-process-gone', (event, details) => {
  electronLog.error('render-process-gone');
  electronLog.error(event);
  electronLog.error(details);
});

if (!gotTheLock) {
  electronLog.log('didnt get the lock. quitting.');

  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    electronLog.log('second-instance opened');

    const allWindows = BrowserWindow.getAllWindows();
    //electronLog.log(allWindows);
    if (allWindows.length === 0) {
      dialog.showErrorBox(
        'Cannot start application',
        'Another instance of the application is running in the background.',
      );
      app.quit();
      return;
    }
    const firstWindow = allWindows[0];
    // Someone tried to run a second instance, we should focus our existing window.
    if (firstWindow) {
      if (firstWindow.isMinimized()) firstWindow.restore();
      firstWindow.focus();
      firstWindow.show();
      firstWindow.setVisibleOnAllWorkspaces(true);
    }
  });

  app.whenReady().then(async () => {
    createWindow();

    electronLog.log('App started');
    // The main application is bootstrapped here. Removed for demonstration.


    app.on('activate', function () {
      // On macOS, it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    customizeMenu();
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function customizeMenu() {
  const menu = Menu.getApplicationMenu();

  menu.items.forEach((item) => {
    if (item.label === 'File') {
      const openNewWindowItem = new MenuItem({
        label: 'Open second window',
        click() {
          createSecondWindow();
        },
      });
      item.submenu.append(openNewWindowItem);

    }
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu.items));
}