const db = require('../models')
async function getSong(id) {
    try {
        let song = await db.Song.findById(id, {
          raw:true,
            include: [
                { model: db.FavoritedSong }
            ]
        })
        return { success: true, message_id: 0, song: song }
    } catch (error) {
        console.log(error)
        return { success: false, message_id: 1, message: 'something bad happened' }
    }

}
module.exports = {
  getSong
}