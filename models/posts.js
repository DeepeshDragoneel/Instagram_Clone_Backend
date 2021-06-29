module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("post",{
        imageURL: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tag: {
            type: DataTypes.STRING,
        }
    })
    return Post;
}