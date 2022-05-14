'use strict';

const express = require('express');
const server = express();
const port = 3000;
const moviesdetails = require('./Movies feedback/data.json')
const cors = require('cors');
server.use(cors());
const axios = require ('axios'); 
require(`dotenv`).config(); 
let apiKey = "3c271d042d5fcc4c342a5b1ddcbbc20b" 

function Reviews (id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}
let url = "postgres://karim1996:0000@localhost:5432/karim1996";
server.use(express.json());
const { Client } = require('pg');
const client = new Client(url);

server.get("/", getrequest);
server.get("/favourites", getfavourites);
server.get("/trending", trending);                   
server.get("/search", search);                       
server.get("/topmovies", topmovies);                 
server.get("/discover", discover);                   
server.post('/addMovie', post);               
server.get('/getMovies', getAll);                
server.put('/update/:id', update);           
server.delete('/delete/:id', dlt);       
server.get('/getMovie/:id', getOne);           
server.use(handleError);                             


server.get("*", error404);

function getrequest(req, res) {
    let data = new Reviews (moviesdetails.title,  moviesdetails.poster_path, moviesdetails.overview);
    res.status(200).json(data);
}

function getfavourites(req, res) {
     res.send("Welcome To The Favorite Page");
}
function error404 (req,res){
    res.status(404).send("Oops! Sorry, the page you've requested could not be found");
}

function trending (req, res){
    let url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
    let profile = []
    axios.get(url).then(result => {
        console.log(result.data);
        result.data.results.map(item => {
            profile.push (new Reviews (item.id, item.title, item.release_date, item.poster_path, item.overview))
        })
        res.status(200).json(profile);
    }).catch(reqerror => {console.log(reqerror)});
}

function search (req, res){
    let movietitle = req.query.query;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movietitle}&page=1&include_adult=false`;
    let searchprofile = [];
    axios.get(url).then(result => {
        console.log(result.data);
        result.data.results.map(item => {
            searchprofile.push (new Reviews (item.id, item.title, item.release_date, item.poster_path, item.overview))
        })
        res.status(200).json(searchprofile);
    }).catch(reqerror => {console.log(reqerror)});
}

function topmovies (req, res){
    let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
    let top_rated = [];
    axios.get(url).then(result => {
        console.log(result.data);
        result.data.results.map(item => {
            top_rated.push (new Reviews (item.id, item.title, item.release_date, item.poster_path, item.overview))
        })
        res.status(200).json(top_rated);
    }).catch(reqerror => {console.log(reqerror)});
}

function discover (req, res){
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;
    let discover = [];
    axios.get(url).then(result => {
        console.log(result.data);
        result.data.results.map(item => {
            discover.push (new Reviews (item.id, item.title, item.release_date, item.poster_path, item.overview))
        })
        res.status(200).json(discover);
    }).catch(reqerror => {console.log(reqerror)});
}

function post(req, res) {
    console.log(req.body);

    let {names,descript,comments} = req.body; 

   let sql = `INSERT INTO movie(names,descript,comments) VALUES($1, $2, $3) RETURNING *;`; 
   let values = [names,descript,comments];
   
    client.query(sql, values).then((result) => {
        console.log(result);
        

    }).catch((err) => {
        handleError(err, req, res);
    })
}
function getAll(req, res) {
    let sql = `SELECT * FROM movie;`;
    client.query(sql).then((result)=>{
        console.log(result);
        res.json(result.rows);
    }).catch((err) => {
         handleError(err, req, res);
    })
}

function handleError(error,req,res, next){
    res.status(500).send(error)
}

function update (req,res)           
{
    const id = req.params.id;
    const movie = req.body; 
    const sql = `UPDATE movie SET names=$1, descript=$2, comments=$3 WHERE id = ${id} RETURNING *;`;
    let values = [movie.names, movie.descript, movie.comments];

    client.query (sql,values).then(data=>{res.status(200).json(data.rows)
    }).catch(error=>{
        console.log(error);
        handleError(error,req,res)})
}

function dlt(req,res)        
{
    const id = req.params.id;
    const sql = `DELETE FROM movie WHERE id = ${id};`; 
    client.query(sql).then(()=>{
        res.status(200).json("deleted");
    }).catch(error=>{handleError(error,req,res)})
}

function getOne (req,res)        
{
    const id = req.params.id;
    const sql = `SELECT * FROM movie WHERE id = ${id}`;
    client.query(sql).then(data=>{
        res.status(200).json(data.rows)
        }).catch(error=>{handleError(error,req,res)})

}

client.connect().then(() => {
    server.listen(port, () => {console.log(`${port}`);})
})