import request from './request'
import { toast } from 'react-toastify';
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer

const addSongToFavorites = async (song, redux) => {
    if (Object.keys(song).length == 0)
        return
    try {
        let songId = song.id
        console.log(song, 'hi', songId)
        if (song.type == 'local') {
            ipcRenderer.send('createFavortiteSong', songId)
            ipcRenderer.on('createFavortiteSongResult', (e, updatedSong) => {
                toast.success('song added to playlist successfully')
                redux.setCurrentSong(updatedSong)

            })

        } else {
            let result = await request.createFavoritedSongs(songId)
            song = await request.getSong(songId)
            redux.setCurrentSong(song.song)
            toast.success('song added to playlist successfully')
        }
    } catch (e) {
        console.log(e)
    }

}

const removeFavoritesSong = async (song, redux) => {
    let songId = song.id
    try {
        if (song.type == 'local') {
            ipcRenderer.send('deleteFavortiteSong', songId)
            ipcRenderer.on('deleteFavortiteSongResult', (e, updatedSong) => {
                toast.success('song removed from favorited successfully')
                redux.setCurrentSong(updatedSong)

            })

        } else {

            let result = await request.deleteFavoritedSongs(song.favoritedSong.id)
            song = await request.getSong(song.id)
            redux.setCurrentSong(song.song)
            toast.success('song removed from your library successfully')
        }
    } catch (e) {
        console.log(e)
    }

}


export default {
    addSongToFavorites,
    removeFavoritesSong
}