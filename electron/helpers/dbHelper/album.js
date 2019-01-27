const db = require('../models')

async function getAlbumSongs(id) {
  let albumId = id
  try {
    let songs = await db.Song.findAll({
      where: { albumId: albumId },
      include: [
        { model: db.FavoritedSong }
      ],
      raw:true
    })
    return songs
  } catch (error) {
    console.log(error)
  }

}
module.exports = {getAlbumSongs}