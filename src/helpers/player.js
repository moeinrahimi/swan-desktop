import axios from 'axios'
import Sound from 'react-sound'
import config from '../constants/config'
import { isDesktop } from "./electron/utils";
import helper from '../components/Player/helper'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer
const play = async (album, reduxProps) => {
    console.log(reduxProps, 'as')
    let { data } = await axios(config.baseURL + `album/songs?albumId=${album.id}`)
    reduxProps.setCurrentAlbum(album)
    let song = data.songs[0]
    reduxProps.setCurrentSong(song)
    reduxProps.setSongs(data.songs)
    setTitle(song)
    let songUrl = song.fullPath
    songUrl = `${config.baseURL}songs/play?path=${encodeURIComponent(songUrl)}`
    setSrcAndPlay(reduxProps.audio, songUrl)
    setSongDetails(reduxProps, songUrl, Sound.status.PLAYING, 0, song.id)
    reduxProps.setIsPlaying(1)
}

const setTitle = (song) => {
    let artist
    if (Array.isArray(song.artist)) {
        artist = song.artist[0]
    } else {
        artist = song.artist
    }
    document.title = `${song.title || 'Unknown'} - ${artist || 'Unknown'}`
}

const playPlaylist = async (playlist, reduxProps, isPlaying) => {
    console.log(reduxProps.song, 'playlist')
    if (isPlaying && Object.keys(reduxProps.song).length > 0)
        return togglePlay(reduxProps)
    let { data } = await axios(config.baseURL + `playlists/${playlist.id}/songs`)
    console.log(data.songs)
    reduxProps.setSongs(data.songs)
    let song = data.songs[0]
    reduxProps.setCurrentSong(song)
    reduxProps.setCurrentPlaylist(playlist)
    setTitle(song)
    let songUrl = song.fullPath
    songUrl = `${config.baseURL}songs/play?path=${encodeURIComponent(songUrl)}`
    setSrcAndPlay(reduxProps.audio, songUrl)
    setSongDetails(reduxProps, songUrl, Sound.status.PLAYING, 0, song.id)
    reduxProps.setIsPlaying(1)
}
const togglePlay = (props) => {
    let { audio } = props
    if (!audio.src)
        return

    if (audio.paused) {

        console.log('paused play', audio.currentTime)
        audio.play()
        props.setSongDetails({ playingStatus: Sound.status.PLAYING })
        props.setIsPlaying(1)
    } else {
        audio.pause()
        console.log(' play paused', audio.currentTime)

        props.setSongDetails({ playingStatus: Sound.status.PAUSED })
        props.setIsPlaying(0)
    }
}


const setSrcAndPlay = (audio, src) => {
    audio.src = src
    audio.play()
}
const setSongDetails = (props, songUrl, playingStatus, songIndex, id) => {
    props.setSongDetails({
        songURL: songUrl,
        playingStatus: playingStatus,
        songIndex: songIndex,
        songId: id,

    })
}
const setSongBasedOnPlatform = (song, index, redux) => {
    console.log(song)
    let songUrl = song.fullPath
    ipcRenderer.send('songDataUrl', song.fullPath)
    ipcRenderer.on('dataurl', (e, data) => {
        let songBase64 = data
        console.log('inja')
        return setSongsData(songBase64, index, song, redux)
    })



}

const setSongsData = (songUrl, i, song, redux) => {
    redux.setSongDetails({
        songURL: songUrl,
        playingStatus: Sound.status.PLAYING,
        songIndex: i,
        songId: song.id,
    })


    redux.audio.src = songUrl
    redux.audio.play()
        .then(_ => {
            redux.setIsPlaying(1)

        }).catch(error => {
            console.log(error, 'setSongsData func')

        });



}
const nextSong = (props) => {

    let { audio, songs, songIndex, shuffle } = props
    audio.pause()
    console.log(songIndex, 'indexxxxxxxxxxxxxxxxxxx')

    const songsLength = songs.length

    // songIndex = parseInt(songIndex)
    songIndex += 1
    console.log(songsLength, 'songs len', songIndex)
    if (songIndex >= songsLength) {
        if (shuffle) {
            songIndex = 0
        }

    }

    if (songIndex >= songsLength) {
        props.setIsPlaying(0)
        helper.resetProgressBar()
        return
    }

    let song = songs[songIndex]
    // console.log(song,'aaaa')
    setTitle(song)
    props.setCurrentSong(song)
    return setSongBasedOnPlatform(song, songIndex, props)

}

const previousSong = (props) => {

    let { songs, songIndex, audio } = props
    const songsLength = songs.length
    audio.pause()
    songIndex -= 1
    if (songIndex == -1) {
        songIndex = 0
    }
    let song = songs[songIndex]
    let songPath = song.fullPath
    let songURL = `${config.baseURL}songs/play?path=${encodeURIComponent(songPath)}`
    // audio.src=songURL
    // audio.play()
    setTitle(song)
    props.setSongDetails({
        songIndex: songIndex,
        songURL: songURL
    })
    props.setCurrentSong(song)
    return setSongBasedOnPlatform(song, songIndex, props)
}
const formatTime = (msTime) => {
    let minutes = Math.floor(msTime / 60)
    minutes = minutes < 10 ? '0' + minutes.toString().trim() : minutes
    let seconds = Math.floor(msTime % 60)
    seconds = seconds < 10 ? '0' + seconds.toString().trim() : seconds
    let timer = minutes + ':' + seconds
    return timer

}

export {
    play,
    setTitle,
    playPlaylist,
    togglePlay,
    setSongBasedOnPlatform,
    nextSong,
    previousSong,
    formatTime
}