const db = require("../database/connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const sgMail = require("@sendgrid/mail");
const chalk = require("chalk");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASS,
    },
});

sgMail.setApiKey(process.env.SEND_GRID_APIKEY);

exports.postSingIn = async (req, res, next) => {
    try {
        let { username, password } = req.body.data;
        console.log(username);
        const user = await db.users.findOne({
            where: {
                username: username,
            },
        });
        if (user === null) {
            res.json({ result: "ERROR" });
        } else {
            const passMatch = await bcrypt.compare(password, user.password);
            console.log(chalk.green(passMatch));
            if (passMatch) {
                const token = jwt.sign(
                    { username: user.username, email: user.email },
                    process.env.JWT_KEY
                );
                res.send({
                    username: user.username,
                    profilePic: user.image,
                    token: token,
                    resutl: "SUCCESS",
                });
            }
            else {
                res.json({ result: "ERROR" });
            }
        }
    } catch (error) {
        console.log(error);
    }
};

exports.postSignUp = async (req, res, next) => {
    // console.log(req.body.data);
    try {
        let { fullname, username, email, password } = req.body.data;
        fullname = fullname.trim();
        username = username.trim();
        email = email.trim();
        password = password.trim();

        if (!validator.isEmail(email)) {
            console.log("Enter a valid Email!");
            return res.send({ status: "error", error: "Enter a valid Email!" });
        }
        if (fullname.length < 4) {
            console.log("FullName must be atleast 4 character's long!");
            return res.status(200).send({
                status: "error",
                error: "FullName must be atleast 4 character's long!",
            });
        }
        if (username.length < 4) {
            console.log("UserName must be atleast 4 character's long!");
            return res.status(200).send({
                status: "error",
                error: "UserName must be atleast 4 character's long!",
            });
        }
        if (username.length > 22) {
            console.log("UserName must not be greater than 22 character's!");
            return res.status(200).send({
                status: "error",
                error: "UserName must not be greater than 22 character's!",
            });
        }
        if (username.includes(" ")) {
            console.log("UserName must not Contain spaces");
            return res.status(200).send({
                status: "error",
                error: "UserName must not Contain spaces",
            });
        }

        if (password.length < 4) {
            console.log("Password must be atleast 4 character's long!");
            return res.status(200).send({
                status: "error",
                error: "Password must be atleast 4 character's long!",
            });
        }

        let user = await db.users.findOne({
            where: {
                [Op.or]: {
                    username: username,
                },
            },
        });
        console.log(user);

        if (user !== null) {
            return res.status(200).send({
                status: "error",
                error: "Username is already taken!",
            });
        } else {
            user = await db.users.findOne({
                where: {
                    [Op.or]: {
                        email: email,
                    },
                },
            });
            console.log(user);

            if (user !== null) {
                return res.status(200).send({
                    status: "error",
                    error: "Email is already taken!",
                });
            }
        }

        const token = jwt.sign(
            {
                fullname: fullname,
                username: username,
                email: email,
                password: password,
            },
            process.env.JWT_KEY
        );
        
        console.log("SENDING EMAIL TO : ", email);
        transporter.sendMail({
            from: process.env.GMAIL,
            to: email,
            subject: "INSTAGRAM_CLONE: Activate your Account",
            html: `<div><h1>Please Verify you Account!</h1><p>Click the Below link to verify your account</p><br/><br/><br/><a href=${process.env.Baseurl}verifySignUp/${token}>Verifiy Your Email</a></div>`,
        });
        // console.log("Email res: ", res);

        res.json({ status: "success" });
    } catch (error) {
        console.log(error);
    }
};

exports.postVerifySignUp = async(req, res, next) => {
    try {
        // console.log("POST VERIFICATION");
        // console.log(req);
        const verify = jwt.verify(req.params.token, process.env.JWT_KEY);
        let { fullname, username, email, password } = verify;
        if (verify) {
            password = await bcrypt.hash(password, 10);
            const user = await db.users.create({
                fullname: fullname,
                username: username,
                email: email,
                password: password,
            });
            console.log("USER CREATED WITH CREDENTIALS: ", user);
            res.send(
                `<div><a href=${process.env.FRONTEND_URL}>Login with you Credentials!</a></div>`
            );
        }
        else {
            res.send(`<h1 style="color: red, textAlign: center">ERROR</h1>`);
        }
    }
    catch (error) {
        console.log(error);
    }
}

exports.home = (req, res, next) => {
    res.send("<h1>Welcome to Instagram clone API!</h1>");
};
