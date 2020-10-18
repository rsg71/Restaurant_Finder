"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var db = {};
const FacebookStrategy = require("passport-facebook").Strategy;

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter(function(file) {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(function(file) {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

passport.use(
  new FacebookStrategy(
    {
      clientID: 770429656855625,
      clientSecret: "918d63ad1fb075d186462161a20d6acaRe",
      callbackURL: "http://localhost:3000/auth/facebook/callback",
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ facebookId: profile.id }, function(err, user) {
        return cb(err, user);
      });
    }
  )
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
