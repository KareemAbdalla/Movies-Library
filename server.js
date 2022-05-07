  
'use strict';

const express = require("express");

const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv").config();
app.use(cors());


//functions
const favoriteHandler = (req, res) => {
    res.send("Welcome to Favorite Page");

}

const homeHandler = (req, res) => {
    let test = "home path";
    res.send(test);
}

const notFoundHandler = (req, res) => {
    let tempError = new Error('404', 'Page Not Found');
    res.send(tempError);
}

const serverIssueHandler = (req, res) => {
    let tempError = new Error('500', 'Sorry, something went wrong');
    res.send(tempError);
}


//  http://localhost:3000/
app.get("/", homeHandler);
//  http://localhost:3000/favorite
app.get("/favorite", favoriteHandler);
//  http://localhost:3000/*
app.get("*", notFoundHandler);


function Movie(title, release_date, genre) {
    this.title = title;
    this.release_date = release_date;
    this.genre = genre;

}

app.listen(port, () => {
    console.log(`listening at port ${port}`);
});
