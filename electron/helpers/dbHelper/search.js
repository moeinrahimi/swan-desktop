const db = require('../models')

async function search(q) {
    try {
        let albums = await db.Album.findAll({
            where: {
                $or: [
                    { title: { $like: '%' + q + '%' } },
                    { artist: { $like: '%' + q + '%' } }
                ]
            },
          limit: 10,
          raw: true
        })
      return albums
    } catch (e) {

    }
}
module.exports = {
    search
}