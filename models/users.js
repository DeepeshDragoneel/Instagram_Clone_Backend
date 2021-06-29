module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        fullname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            trim: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "https://bit.ly/3cCp7oC",
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "New to Instagram Clone!",
        },
    });
    return User;
}
