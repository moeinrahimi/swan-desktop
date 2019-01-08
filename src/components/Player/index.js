import React, { Component } from 'react';
import './style.css'
import config from '../../constants/config'
import helper from './helper'
import { togglePlay, setSongBasedOnPlatform, previousSong, nextSong,formatTime } from '../../helpers/player'
import {setSongDetails,setCurrentSong,setIsPlaying} from "../../redux/albums/actions/index";
import { connect } from "react-redux";
import favortiedSongs from '../../helpers/favortiedSongs';
import Image from '../Image'
const mapStateToProps = state => {
  return { song: state.song,
    audio : state.audio,
    songs:state.songs,
    shuffle:state.shuffle,
    songIndex:state.songIndex,
};
};
const mapDispatchToProps = dispatch => {
return {
  setSongDetails: albums => dispatch(setSongDetails(albums)),
  setCurrentSong: song => dispatch(setCurrentSong(song)),
  setIsPlaying: song => dispatch(setIsPlaying(song)),
  

};
};

class Player extends Component {
  constructor(props){
    super(props)
    this.state = {
      elapsed: '00:00',
      total: '00:00',
      position : 0 
  }
  }
  componentDidMount(){
    let {audio} = this.props
    let progress = helper.progressBar()
    audio.addEventListener('timeupdate',(event)=>{
      // console.log(event)
      let width = (audio.currentTime / audio.duration) * 100 + '%'
      progress.style.width = width
      this.handleSongPlaying(audio)
    })
    audio.addEventListener('ended',(event)=>{
      this.setState({
        elapsed: '00:00',
        total: '00:00',
        position : 0 
      })
      nextSong(this.props)
    
    })
    let progressBarWidth = 642
    document.querySelector('#middle-bar').addEventListener('mousedown',(e)=>{
      let {audio,isPlaying} = this.props
      console.log(progressBarWidth)
      if(isPlaying){
        let clickedPos = e.pageX - e.target.offsetLeft
        let newTime = (clickedPos  * audio.duration) / progressBarWidth
        console.log(e.target.offsetWidth, '= ',(clickedPos  / e.target.offsetWidth) * audio.duration)
        audio.currentTime = newTime
  }
    })
    let volumeDom = document.querySelector('.volume-slider')
    let volumeChd = document.querySelector('.volume')
    volumeDom.addEventListener('mousedown',(e)=>{
      console.log(e)
      let {audio} = this.props
    let clickedPos = e.clientX - e.target.offsetLeft
    volumeChd.style.width = (clickedPos) + '%'
    audio.volume = clickedPos / 100
    
    
    },false)
    let volumeIcon = document.querySelector('#sound i')
    volumeIcon.addEventListener('click',(e)=>{
      console.log('clicked',audio.muted)
      if(audio.muted){
        audio.muted = false
        volumeIcon.className = 'link flaticon-speaker'
        return 
      }
      audio.muted = true 
      volumeIcon.className = 'link flaticon-mute-volume'
        
    })
  }
  setEplapsed = (elapsed,total,position)=>{
        this.setState({
        elapsed: elapsed,
        total: total,
        position : position
    })
  }
  

  handleSongPlaying = (audio) => {
    let elapsed = formatTime(audio.currentTime)
    let total = formatTime(audio.duration)
    this.setEplapsed(elapsed,total,audio.position)
    
  }
  moveSong = (e)=>{
    let {audio} = this.props
    let clickedPos = e.clientX - e.target.offsetLeft
    let newTime = (clickedPos  / e.target.offsetWidth) * audio.duration
    console.log(newTime ,'timer')
      audio.currentTime = 1
    
   
  }
  render(){
     const {audio,isPlaying,song,album,position}=this.props
     const {total,elapsed} = this.state
     let progressBar = (position / audio.duration) * 100 
      
    return (
    <div id="player">
      <div className="columns">
        <div className="column is-2">
          <div id="currently-playing">
            <div id="currently-cover">
            
            <Image image={album.artwork || song.artwork} />
            </div>
            <div id="currently-text">
              <span><a href="" className="link">{song.title}</a></span>
              <h1>{song.artist}</h1>
            </div>
            <div id="add-to-favaorite">          
            
              {/* <i className={song.favoritedSong ? 'fa fa-heart' : 'far fa-heart'} onClick={()=>favortiedSongs.addSongToFavorites(song)}></i> */}
            
            {song.favoritedSong ? 
              <i className="fa fa-heart" onClick={()=>favortiedSongs.removeFavoritesSong(song,this.props)}></i>
              :
              <i className="flaticon-heart" onClick={()=>favortiedSongs.addSongToFavorites(song,this.props)}></i>
            }
            </div>
              
              
            
            
          </div>
        </div>
        <div className="column is-8">
          <div id="player-controller">
            <div id="player-controls">
                <i className="link flaticon-shuffle-button" onClick={this.props.shuffle}></i>
                  <i className = "link flaticon-back" onClick = { e => previousSong (this.props)}> </i>
                    <i className={(isPlaying == 1 ? 'link flaticon-pause' : 'link flaticon-play-button')} onClick={()=>togglePlay(this.props)} ></i>
                      <i className="link flaticon-next" onClick={e=>nextSong(this.props)} ></i>
                        <i className="link flaticon-repeat"></i>
            </div>
            <div id="progress-bar-container">
              <span className="link">{elapsed}</span>
              <div id="progress-bar">
                <div id="middle-bar">
                

                  <div id="player-position" style={{width:progressBar + '%'}}>
                  
                  </div>
                  
                </div>
              </div>
              <span className="link">{total}</span>
            </div>
          </div>
        </div>
        <div className="column is-2">
          <div id="sound">
            <i className="link flaticon-speaker"></i>
            <div className="volume-slider" >
              <div className="volume"></div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps,null,{ withRef: true })(Player);