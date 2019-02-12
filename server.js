'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var ids = require('shortid');
ids.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
var cors = require('cors');
var validUrl = require('valid-url');
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connect(process.env.MONGOOSE_URL, { useNewUrlParser: true });

var Schema = mongoose.Schema;
var shortener = new Schema({
  url: String,
  shortId: String
});
var List = mongoose.model('List', shortener);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// shorturl endpoint
/* 
1. Get the URL
2. Check if the URL has aldready shortened
3. If not, shorten the url
4. Redirect the shortened url to the destiny
*/
app.get("/:shortId", function (req, res) {
  List.findOne({shortId: req.params.shortId},function(err,data){
    if(err){
      console.log(err);
    }
    else if(data != null)
      res.redirect(data.url);
    else 
      res.send("Not found");
  });
});

app.post("/api/shorturl/new", function (req, res) {
  let inputUrl = req.body.url;
  if (validUrl.isUri(inputUrl)){
    List.findOne({url: inputUrl},function(err,data){
      if(err){
        console.log(err);
      }
      else if (data == null){
        console.log("New URL");
        var newDocument = new List({url: inputUrl, shortId: ids.generate()});
        newDocument.save(function (err) {
          if(err) console.log(err);
        });
        res.json({"original_url": req.body.url,"short_url": newDocument.shortId});
      }
      else {
        console.log("Existed URL");  
        res.json({"original_url": req.body.url,"short_url":data.shortId});
      }
    });    
  }
  else {
    res.json({"error":"invalid URL"});
  }
  
  
});
app.listen(port, function () {
  console.log('Node.js listening ...');
});