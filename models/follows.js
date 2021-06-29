const { users } = require("../database/connect");

module.exports = (sequelize, DataTypes) => {
    const Follow = sequelize.define("follow", {
        /* follower: {
            type: DataTypes.STRING,
            references: {
                model: "users",
                key: "username",
            },
        },
        followee: {
            type: DataTypes.STRING,
            references: {
                model: "users",
                key: "username",
            },
        }, */
    });
    return Follow;
}