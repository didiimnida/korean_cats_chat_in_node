//Require modulues and models:
var express = require('express');
var pg = require('pg');
var models = require("./models/index.js");
var bodyParser = require('body-parser');
var methodOverride = require("method-override");
//var request = require('request');

var app = express();

//Set view engine: 
app.set("view engine", "ejs");

//Middleware:
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/public'));

//ROUTES:

//BEFORE DB SEEDED USE THIS:
// var chirps = [1,2,3,4,5]; //Change view readout if want to use this array.
// app.get('/', function(req, res){
// 	res.render(__dirname + '/public/views/index.ejs', {chirps: chirps});
// });

//Get all:
app.get('/', function(req, res){
	models.Chirp.findAll({order: '"createdAt" DESC'}).done(function(error, chirps){
		res.render(__dirname + '/public/views/index.ejs', {
			chirps: chirps
		});
	});
});

//Create new:
app.post('/new', function(req, res){
	models.Chirp.create({
		chirp_text:req.body.chirp_text
	}).success(function(data){
		res.redirect("/");
	});
});

//Get specific: EDIT! Add another parameter.    
app.get('/edit/:id', function(req, res){
	models.Chirp.find(req.params.id).success(function(chirp) {
    	res.render(__dirname + '/public/views/edit.ejs', {
        	chirp: chirp
    	});
	});
});

//Update
app.put('/edit/:id', function(req, res){
	models.Chirp.find(req.params.id).success(function(chirp){
		chirp.updateAttributes({
			chirp_text:req.body.chirp_text
		}).success(function(){
			res.redirect("/");
		});
	});
});

//Server:
var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("Server listening at http://%s:%s", host, port);
});

