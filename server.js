'use strict';

const express = require("express");

const app = express();
const port = 3000;
const cors = require("cors");
const axios = require("axios").default;
require("dotenv").config();
app.use(cors());
let apiKey = "3c271d042d5fcc4c342a5b1ddcbbc20b"
const movieData = require("./Movie Data/data.json");

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

const trendingHandler = (req, res) => {
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
    axios.get(url).then(result => {
        let tempMovie = result.data.results.map(item => {
            return new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
        })
        res.json(tempMovie);
    }).catch(error => {
        console.log('error');
        res.send("error in getting data from API")
    });
}

const searchHandler = (req, res) => {
    let name = req.query.query;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${name}&page=2`;
    axios.get(url).then(result => {
        let tempMovie = result.data.results.map(item => {
            return new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
        })
        res.json(tempMovie);
    }).catch(error => {
        console.log('error');
        res.send("error in getting data from API")
    });
}

const discoverHandler = (req, res) => {
    let sort_by = req.query.sort_by;

    /* Allowed Values: , popularity.asc, popularity.desc, release_date.asc, 
                        release_date.desc, revenue.asc, revenue.desc, primary_release_date.asc, 
                        primary_release_date.desc, original_title.asc, original_title.desc, 
                        vote_average.asc, vote_average.desc, vote_count.asc, vote_count.desc
                    default: popularity.desc*/
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=${sort_by}&include_adult=false&include_video=false&page=1`;
    
    axios.get(url).then(result => {
        let tempMovie = result.data.results.map(item => {
            return new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
        })
        res.json(tempMovie);
    }).catch(error => {
        console.log('error');
        res.send("error in getting data from API")
    });
}

const upcomingHandler = (req, res) => {
    let url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
    axios.get(url).then(result => {
        let tempMovie = result.data.results.map(item => {
            return new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
        })
        res.json(tempMovie);
    }).catch(error => {
        console.log('error');
        res.send("error in getting data from API")
    });
}

//  http://localhost:3000/
app.get("/", homeHandler);
//  http://localhost:3000/favorite
app.get("/favorite", favoriteHandler);
//  http://localhost:3000/trending
app.get("/trending", trendingHandler);
//  http://localhost:3000/search?query="The"
app.get("/search", searchHandler);
//  http://localhost:3000/discover?sort_by=popularity.desc
app.get("/discover", discoverHandler);
//  http://localhost:3000/upcoming
app.get("/upcoming", upcomingHandler);
//  http://localhost:3000/*
app.get("*", notFoundHandler);


//constructor
function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

app.listen(port, () => {
    console.log(`listening at port ${port}`);
});