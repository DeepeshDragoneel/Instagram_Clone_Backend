const db = require("../database/connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { Op } = require("sequelize");
const chalk = require("chalk");
exports.getUserProfileDetails = async (req, res, next) => {
    try {
        const { username } = jwt.verify(req.query.token, process.env.JWT_KEY);
        console.log(username);
        const user = await db.users.findByPk(username);
        const followers = await db.follows.findAndCountAll({
            where: {
                followee: user.username,
            },
        });
        const following = await db.follows.findAndCountAll({
            where: {
                follower: user.username,
            },
        });
        const postsCount = await db.posts.findAndCountAll({
            where: {
                userUsername: user.username,
            },
        });
        const posts = await db.posts.findAll({
            where: {
                userUsername: user.username,
            },
        });
        console.log(followers.count, following.count, postsCount.count);
        res.json({
            user: user,
            followers: followers.count,
            following: following.count,
            postsCount: postsCount.count,
            posts: posts,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.postChangeUserDetails = async (req, res, next) => {
    try {
        console.log(req.body);
        const user = await db.users.findByPk(req.body.originalUserName);
        if (!req.body.usernameChanged) {
            user.fullname = req.body.user.user.fullname;
            user.email = req.body.user.user.email;
            user.bio = req.body.user.user.bio;
        }
        else {
            const existingUser = await db.users.findByPk(req.body.user.user.username);
            console.log(existingUser);
            if (existingUser !== null) {
                return res.json({status: "error", msg:"Username is already taken!"})
            }
            user.username = req.body.user.user.username;
            user.fullname = req.body.user.user.fullname;
            user.email = req.body.user.user.email;
            user.bio = req.body.user.user.bio;
        }
        user.save();
        console.log(user);
        res.json({ status: "success", msg: "Profile Updated" });
    } catch (error) {
        console.log(error);
        res.json({ status: "error", msg: "There is an error with the Server" });
    }
};
