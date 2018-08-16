import axios from 'axios'
import Sound from 'react-sound'
import config from '../constants/config'
import {isDesktop} from "./electron/utils";

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer
const play = async (album, reduxProps) => {
  console.log(reduxProps,'as')
  let { data } = await axios(config.baseURL+`album/songs?albumId=${album.id}`)
  reduxProps.setCurrentAlbum(album)
  let song = data.songs[0]
  reduxProps.setCurrentSong(song)    
  reduxProps.setSongs(data.songs)    
  setTitle(song)
  let songUrl = song.fullPath
  songUrl = `${config.baseURL}songs/play?path=${encodeURIComponent(songUrl)}`
  setSrcAndPlay(reduxProps.audio,songUrl)
  setSongDetails(reduxProps,songUrl,Sound.status.PLAYING,0,song.id)
  reduxProps.setIsPlaying(1)  
}

const setTitle = (song) => {
  let artist 
  if(Array.isArray(song.artist)){
    artist = song.artist[0]
  }else{
    artist = song.artist
  }
  document.title = `${song.title || 'Unknown'} - ${artist || 'Unknown'}`
}

const  playPlaylist = async(playlist,reduxProps,isPlaying)=>{
  console.log(reduxProps.song,'playlist')
  if(isPlaying &&  Object.keys(reduxProps.song).length > 0) 
    return togglePlay(reduxProps)
  let { data } = await axios(config.baseURL+`playlists/${playlist.id}/songs`)
  console.log(data.songs)
reduxProps.setSongs(data.songs)
let song = data.songs[0]
reduxProps.setCurrentSong(song)    
reduxProps.setCurrentPlaylist(playlist)    
setTitle(song)
let songUrl = song.fullPath
songUrl = `${config.baseURL}songs/play?path=${encodeURIComponent(songUrl)}`
setSrcAndPlay(reduxProps.audio,songUrl)
setSongDetails(reduxProps,songUrl,Sound.status.PLAYING,0,song.id)
reduxProps.setIsPlaying(1)
}
const togglePlay = (props) => {
  let {audio} = props
  if(!audio.src)
    return 
    if (audio.paused) {
      console.log('paused play')
      audio.play()
      props.setSongDetails({ playingStatus: Sound.status.PLAYING})
      props.setIsPlaying(1)
    } else {
      audio.pause()
      console.log(' play paused')
  
      props.setSongDetails({ playingStatus: Sound.status.PAUSED })
      props.setIsPlaying(0)
    }
}


const setSrcAndPlay  = (audio,src)=>{
  audio.src = src
  audio.play()
}
const setSongDetails  = (props,songUrl,playingStatus,songIndex,id)=>{
  props.setSongDetails({
    songURL: songUrl,
    playingStatus: playingStatus,
    songIndex: songIndex,
    songId: id,
  
})
}
const setSongBasedOnPlatform = (song,index,redux) => {
 if (isDesktop()) {
   let songUrl = song.fullPath
   ipcRenderer.send('songDataUrl',song.fullPath)
   ipcRenderer.on('dataurl',(e,data)=>{
     let songBase64 = data 
     return setSongsData(songBase64,index,song,redux)
 })
 }else{
   return setSongsData(song.songUrl,index,song,redux)
 }
 

 }

const setSongsData = (songUrl,i,song,redux) => {
 redux.setSongDetails({
   songURL: songUrl,
   playingStatus: Sound.status.PLAYING,
   songIndex: i,
   songId: song.id,
 })
 


  redux.audio.src = songUrl
  redux.audio.play()
  .then(_=>{
    redux.setIsPlaying(1)

  }) .catch(error => {
    console.log(error,'setSongsData func')

  });


 
}
export {
  play,setTitle,playPlaylist,togglePlay,setSongBasedOnPlatform
}