var Sequelize = require('sequelize');
var sequelize = new Sequelize('swan',null,null, {
  host: 'localhost',
  dialect: 'sqlite',
  charset: 'utf8',
  // logging: true,
  storage: './swan-db.sqlite',


})

var db = {};



db.Song = sequelize.import(__dirname + "/Song")
db.Directory = sequelize.import(__dirname + "/Directory")
db.Album = sequelize.import(__dirname + "/Album")

db.Album.hasMany(db.Song)
db.Song.belongsTo(db.Album,{as:'albumm'})
db.Directory.hasMany(db.Song)
db.Song.belongsTo(db.Directory)

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db