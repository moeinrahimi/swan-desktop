const db = require('./models')
 const favoriteASong = async(songId)=>{  
      try {
          let songs = await db.FavoritedSong.findOrCreate({
              where: {
                  songId: songId
              }
          })
          let song = songs[0]
          if (songs[1] == true) {
              return { success: true, message_id: 0, song: song }
          }
          return { success: true, message_id: 0, message: 'song is already in favorited songs' }
      } catch (error) {
          console.log(error, 'favoritedSongs FavoritedRouter controller')
          return { success: false, message_id: 1, message: 'something bad happened' }
      }
  }



const deleteFavoritedSongs = async (id)=> {
    try {
        let songs = await db.FavoritedSong.destroy({
            where: {
                songId: id
            }
        })
        return { success: true, message_id: 0, message: 'favorited song deleted successfully' }
    } catch (error) {
        console.log(error, 'favoritedSongs FavoritedRouter controller')
        return { success: false, message_id: 1, message: 'something bad happened' }
    }
}

const favoritedSongs = async ()=> {
    try {
        let songs = await db.Song.findAll({
            raw:true,
            include: [
                { model: db.FavoritedSong, required: true }
            ]
        })
        return { success: true, message_id: 0, favorites: songs }
    } catch (error) {
        console.log(error, 'favoritedSongs FavoritedRouter controller')
        return { success: false, message_id: 1, message: 'something bad happened' }
    }
}

module.exports = {
    favoriteASong,
    deleteFavoritedSongs,
    favoritedSongs
}