const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./src/v1/routes");
// const usersRouter = require('./routes/users');

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "http://localhost:5173/"); // update to match the domain you will make the request from
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
          });
        app.get("/", (req, res) => res.send("Hi!, welcome to kanban api"));

app.use("/api/v1", indexRouter);

module.exports = app;
