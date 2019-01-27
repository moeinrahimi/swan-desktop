const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer

export const getFavoritedSongsFromIPC = () => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('favortiteSongs')
        ipcRenderer.on('favoritedSongsResult', (e, songs) => {
            return resolve(songs.favorites)
        })
    })
}

export const getAlbumSongsFromIPC = (id) => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('getAlbumSongs',id)
        ipcRenderer.on('getAlbumSongsSongsResult', (e, songs) => {
            return resolve(songs)
        })
    })
}

export const searchLocal = async (q) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('searchSongs', q)
    ipcRenderer.on('searchSongsResult', (e, data) => {
      // console.log(data, 'searchSongsResult')
      return resolve(data)
    })
  })
}