const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron')
const fs = require('fs')
const isDev = require('electron-is-dev');
const db = require('./helpers/models');
const dataurl = require('dataurl')
const songHelper = require('./helpers/dbHelper/song')
var static = require('node-static');
console.log(__dirname + '/artworks')
var fileServer = new static.Server(__dirname+'/artworks');
const favoriteHelper = require('./helpers/favoriteSong')
require('http').createServer(function(request, response) {
    request.addListener('end', function() {
        fileServer.serve(request, response);
    }).resume();
}).listen(8080);
db.sequelize.sync(
  // {force: true}
).catch(err => {
  console.log(`Sequelize issue:\nerr name :${err.name}\nerr message :  ${err.message}`)
});



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const song = require('./helpers/song')

const path = require('path')
ipcMain.on('saveDir', (event, arg) => {
  let directory = arg[0]
  db.Directory.findOrCreate({
    where :{path:directory}
  }).then(dir=>{
song.findSongs(dir[0])
  })
  

})

ipcMain.on('createFavortiteSong',async (event, arg) => {
  let songId = arg
  let result = await favoriteHelper.favoriteASong(songId)
  let songResult = await songHelper.getSong(songId)
  // console.log(result)
    event.sender.send('createFavortiteSongResult', songResult.song)

})

ipcMain.on('deleteFavortiteSong',async (event, arg) => {
  let songId = arg
  let result = await favoriteHelper.deleteFavoritedSongs(songId)
  let songResult = await songHelper.getSong(songId)
  // console.log(result)
    event.sender.send('deleteFavortiteSongResult', songResult.song)

})

ipcMain.on('favortiteSongs',async (event, arg) => {
  
  let result = await favoriteHelper.favoritedSongs()
    event.sender.send('favoritedSongsResult', result)

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
ipcMain.on('songDataUrl', async (event, arg) => {


  let path = arg
  let songData = await convertSong(path)
  // console.log(songData ,' data ')
  event.sender.send('dataurl', songData)



})



async function createWindow() {
  // Create the browser window.

  mainWindow = new BrowserWindow({
      width: 1800,
      height: 800,
    
  })

  mainWindow.loadURL(isDev ? 'http://localhost:3001' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  ipcMain.on('getSongs', async (event) => {
    let songs = await db.Song.all({
      raw:true,
      include:[
        {model:db.FavoritedSong}
      ]
    })
    event.sender.send('songs', songs)
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{

  createWindow()
   // https://electronjs.org/docs/api/accelerator keyboard cheatsheet
   globalShortcut.register('MediaPlayPause', () => {
       console.log('togglePlay is pressed')
       mainWindow.webContents.send('togglePlay')
   })
   globalShortcut.register('MediaNextTrack', () => {
       console.log('next pressed')
        mainWindow.webContents.send('next')
   })
   globalShortcut.register('MediaPreviousTrack', () => {
       console.log('previos pressed')
        mainWindow.webContents.send('previous')
   })
})


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
