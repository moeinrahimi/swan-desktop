const {Menu, Tray} = require('electron')
const electron = require('electron')
const fs = require('fs')
const isDev = require('electron-is-dev');
const db = require('./helpers/models');
const dataurl = require('dataurl')
db.sequelize.sync(
  {force: true}
).catch(err=>{
  console.log(`Sequelize issue:\nerr name :${err.name}\nerr message :  ${err.message}`)
});
const app = electron.app


// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const song=  require('./helpers/song')

const path =require('path')
const ipcMain = electron.ipcMain
ipcMain.on('saveDir',(event,arg)=>{
  console.log(arg[0] ,' save dir electron js ',event)
  let directory = arg[0]
  song.findSongs(directory)

})

const convertSong = (filePath) => {
  const songPromise = new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) { reject(err); }
      resolve(dataurl.convert({ data, mimetype: 'audio/mp3' }));
    });
  });
  return songPromise;
};
ipcMain.on('songDataUrl',async (event,arg)=>{

  
  let path = arg
  let songData = await convertSong(path)
  console.log(songData ,' data ')
  event.sender.send('dataurl',songData)

  

})



async function createWindow () {
  // Create the browser window.

  mainWindow = new BrowserWindow({width:800,height:600})

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  ipcMain.on('getSongs',async(event)=>{
    let songs = await db.Song.all({raw:true})
    event.sender.send('songs',songs)
  })
  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)
  

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
