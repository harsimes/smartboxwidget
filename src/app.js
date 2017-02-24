////////
// This sample is published as part of the blog article at www.toptal.com/blog
// Visit www.toptal.com/blog and subscribe to our newsletter to read great posts
////////

/**
 * Main process
 */
/*var app = require('electron').app
    ipc = require('electron').ipc
    BrowserWindow = require('browser-window');*/
var electron = require('electron')
const {app, BrowserWindow, ipcMain} = require('electron')

var mainWindow = null,
    insertWindow = null;

function createInsertWindow() {
    insertWindow = new BrowserWindow({
        width: 640,
        height: 480,
        show: true
    });

    insertWindow.loadURL('file://' + __dirname + '/windows/insert/insert.html');

    insertWindow.on('closed',function() {
        insertWindow = null;
    });
}

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 280,
        height: 60,
		transparent: true,
		frame: false,
		resizable: false
    });

    //mainWindow.loadURL('file://' + __dirname + '/windows/main/main.html');
	mainWindow.loadURL('file://' + __dirname + '/windows/main.html');
    //mainWindow.openDevTools();

    ipcMain.on('toggle-insert-view', function() {
        if(!insertWindow) {
            createInsertWindow();
        }

        //return (!insertWindow.isclosed() && insertWindow.isVisible()) ? insertWindow.hide() : insertWindow.show();
    });
});

ipcMain.on('resize', function (e, x, y) {
console.log("resize invokded");
  mainWindow.setSize(x, y)
})

