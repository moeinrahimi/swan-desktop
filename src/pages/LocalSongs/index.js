import React, { Component } from 'react';
import SongList from '../../components/SongList';
import { toast } from 'react-toastify';
import './styles.css'
import { setAlbums, setCurrentSong, setSongDetails, setIsPlaying, setSongs, setCurrentPlaylist } from "../../redux/albums/actions/index";
import { connect } from "react-redux";
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer
// const fs = electron.remote.require('fs');
// const path = electron.remote.require('path');
const dialog = window.require('electron').remote.dialog


const mapStateToProps = state => {
  return {
    song: state.song,

    songURL: state.songURL,
    album: state.album,
    playingStatus: state.playingStatus,
    songIndex: state.songIndex,
    isPlaying: state.isPlaying,
    songId: state.songId,
    audio: state.audio,
    shuffle: state.shuffle,
    songs: state.songs,
    song: state.song,
    currentSongs: state.currentSongs,
    currentPlaylist: state.currentPlaylist,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setAlbums: albums => dispatch(setAlbums(albums)),
    setSongDetails: albums => dispatch(setSongDetails(albums)),
    setCurrentSong: song => dispatch(setCurrentSong(song)),
    setIsPlaying: song => dispatch(setIsPlaying(song)),
    setSongs: songs => dispatch(setSongs(songs)),
    setCurrentPlaylist: playlist => dispatch(setCurrentPlaylist(playlist)),

  };
};
class LocalSongs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      songs: [],
    }
  }
  async componentDidMount() {
    ipcRenderer.send('getSongs')
    console.log('22222222')

    ipcRenderer.on('songs', (e, data) => {
      console.log(data, '111111111')
      this.setState({
        songs: data
      })
    })
    // this.setState({songs : favorited.favorites})

  }
  togglePlaylistModal() {
    this.setState({
      playlistModal: !this.state.playlistModal
    })
  }

  _saveDirectoryLocal = async () => {
    try {
      dialog.showOpenDialog({ properties: ['openDirectory'] }, (dir) => {
        console.log(dir, 'dir')
        if (dir)
          ipcRenderer.send('saveDir', dir)

      })


    } catch (e) {
      console.log(e)
      toast.error('something went wrong ,  try again')
    }

  }
  render() {
    let { songs } = this.state
    return (
      <div>

        <div className="columns">
          <div className="column">
            <div className="local-top-header">
              <button className="button is-success" onClick={this._saveDirectoryLocal}>add directory from local</button>
            </div>

          </div>

        </div>
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <SongList songs={songs} />
          </div>
        </div>

      </div>

    )
  }

}
export default connect(mapStateToProps, mapDispatchToProps)(LocalSongs);
