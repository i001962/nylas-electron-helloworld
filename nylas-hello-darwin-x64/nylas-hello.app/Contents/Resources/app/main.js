var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var dialog = require('dialog');
var ghReleases = require('electron-gh-releases');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Open the DevTools. important to see if code/token is returned
  mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  checkAutoUpdate();

  function checkAutoUpdate() {

    var autoUpdateOptions = {
      repo: 'i001962/nylas-electron-helloworld',
      currentVersion: app.getVersion()
    };

    var update = new ghReleases(autoUpdateOptions, function (autoUpdater) {
      autoUpdater
        .on('error', function(event, message) {
          console.log('ERRORED.');
          console.log('Event: ' + JSON.stringify(event) + '. MESSAGE: ' + message);
        })
        .on('update-downloaded', function (event, releaseNotes, releaseName,
          releaseDate, updateUrl, quitAndUpdate) {
          console.log('Update downloaded');
          confirmAutoUpdate(quitAndUpdate);
        });
    });

    // Check for updates
    update.check(function (err, status) {
      if (err || !status) {
        console.log('Status of Version checking: ' + err + status);
        //app.dock.hide();
      }

      if (!err && status) {
        console.log('About to download update');
        update.download();
      }
    });
  }

  function confirmAutoUpdate(quitAndUpdate) {
    dialog.showMessageBox({
      type: 'question',
      buttons: ['Update & Restart', 'Cancel'],
      title: 'Update Available',
      cancelId: 99,
      message: 'There is an update available. Would you like to update now?'
    }, function (response) {
        console.log('Exit: ' + response);
        app.dock.hide();
        if (response === 0) {
          quitAndUpdate();
        }
      }
    );
  }
});
