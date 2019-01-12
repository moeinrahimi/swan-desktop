
var Sequelize = require('sequelize');
var sequelize = new Sequelize('swan',null,null, {
  host: 'localhost',
  dialect: 'sqlite',
  charset: 'utf8',
  logging: console.log,
  // logging: false,
  storage: './swan-db.sqlite',


})

var db = {};



db.Song = sequelize.import(__dirname + "/Song")
db.Directory = sequelize.import(__dirname + "/Directory")
db.Album = sequelize.import(__dirname + "/Album")
db.FavoritedSong = sequelize.import(__dirname + "/FavoritedSong")

db.Album.hasMany(db.Song)
db.Song.belongsTo(db.Album,{as:'albumm'})
db.Directory.hasMany(db.Song)
db.Song.belongsTo(db.Directory)
db.FavoritedSong.belongsTo(db.Song)
db.Song.hasOne(db.FavoritedSong)

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db