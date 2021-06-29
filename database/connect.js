const chalk = require('chalk');
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
    "InstagramClone",
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: "localhost",
        dialect: "mysql",
    }
);

sequelize
    .authenticate()
    .then(() => {
        console.log(chalk.green.bold("Connection to DataBase Established"));
    })
    .catch((error) => {
        console.log(chalk.red.bold(error));
    });

let db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.follows = require("../models/follows")(sequelize, DataTypes);
db.users = require('../models/users')(sequelize, DataTypes);
db.posts = require('../models/posts')(sequelize, DataTypes);
db.likes = require('../models/likes')(sequelize, DataTypes);
db.comments = require('../models/comments')(sequelize, DataTypes);

db.users.hasMany(db.posts);
db.posts.belongsTo(db.users);

db.posts.hasMany(db.likes);
db.likes.belongsTo(db.posts);
db.users.hasOne(db.likes);
db.likes.belongsTo(db.users);

db.posts.hasMany(db.comments);
db.comments.belongsTo(db.posts);
db.users.hasMany(db.comments);
db.comments.belongsTo(db.users);

/* db.users.belongsToMany(db.users, {
    through: "follows",
    as: "follower",
});
db.users.belongsToMany(db.users, {
    through: "follows",
    as: "followee",
}); */

db.users.hasMany(db.follows, {
    foreignKey: {
        name: "follower",
    },
});
db.follows.belongsTo(db.users);
db.users.hasMany(db.follows, {
    foreignKey: {
        name: "followee",
    },
});
db.follows.belongsTo(db.users);

sequelize.sync({  }).then(() => {
    console.log("Tables Synced!")
}).catch((error)=>{
    console.log(error);
})

module.exports = db;