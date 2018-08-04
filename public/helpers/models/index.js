var Sequelize = require('sequelize');
var sequelize = new Sequelize('swan',null,null, {
  host: 'localhost',
  dialect: 'sqlite',
  charset: 'utf8',
  logging: true,
  storage: './test.sqlite',


})

var db = {};



db.Song = sequelize.import(__dirname + "/Song")
db.Directory = sequelize.import(__dirname + "/Directory")

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db