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