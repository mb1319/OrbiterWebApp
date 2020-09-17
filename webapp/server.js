// import handler from "./handler.js";
import express from "express";
import sqlite3 from "sqlite3";

const port = 8080;
const app = express();

app.use("/", express.static("static"));
app.use("/", express.json());

let db = new sqlite3.Database("./planetnames.db");

let sql = "SELECT name FROM names";

let nameList = [];

db.all(sql, [], function (err, rows) {
    if (err) {
        throw err;
    }
    rows.forEach(function (row) {
        nameList.push(row.name);//making a list with time..
    });
});

db.close();

app.post("/", function (req, res) {
    console.log("posting... " + req);

    let i = Math.floor(Math.random() * (nameList.length - 1));//random name
    let randomItem = nameList[i];
    const responseObj = {"name": randomItem};
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(responseObj));
});

app.listen(port, function () {
    console.log("listening on port " + port);
});
