  
'use strict';

const express = require("express");

const app = express();
const port = 3000;
const cors = require("cors");
const axios = require("axios").default;
require("dotenv").config();
app.use(cors());
let apiKey = process.env.API_KEY;

//functions
const favoriteHandler = (req, res) => {
    res.send("Welcome to Favorite Page");

}

const homeHandler = (req, res) => {
    let test = `Home Path`;
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


//constructor
function Movie(title, release_date, genre) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.genre = genre;

}

//function Error(status, responseText) {
  //  this.status = status;
    //this.responseText = responseText;
//}

app.listen(port, () => {
    console.log(`listening at port ${port}`);
});
