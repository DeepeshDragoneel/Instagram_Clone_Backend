const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const chalk = require('chalk');
require("dotenv").config();

const router = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(router);

let port = process.env.port || 8000;

app.listen(port, (error) => {
    if (error) {
        return console.log(chalk.red.bold("ERROR CONNECTED TO EXPRESS: " + error));
    }
    console.log(chalk.green.bold("CONNECTED TO EXPRESS!"));
});
