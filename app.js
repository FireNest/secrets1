//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/secretDB", {useNewUrlParser: true, useUnifiedTopology: true}, function(err) {
  if(!err)
  {
    console.log("database connection successful!");
  }
});

const secretSchema = new mongoose.Schema ({
  email: String,
  password: String
});


secretSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const Secret = mongoose.model("Secret", secretSchema);

app.listen(8000, () => {
  console.log("server started listening on 8000!");
});

app.get("/", (req, res) => {
  res.render("home", {});
});

app.get("/login", (req, res) => {

    res.render("login", {});

});

app.post("/login", (req, res) => {

  var username = req.body.username;
  var password = req.body.password;

  Secret.findOne({email: req.body.username}, function(err, foundSecret){
      if(err)
      {
        console.log(err);
      }
      else {

          if(foundSecret)
          {

            if(foundSecret.password === password)
            {

              res.render("secrets", {});
            }
          }
      }
    });
});

app.get("/register", (req, res) => {

  res.render("register", {});
});

app.post("/register", (req, res) => {

      const secret1 = new Secret ({
      email: req.body.username,
      password: req.body.password
    });

    secret1.save(function(err) {
      if(err)
      {
        console.log(err);
      }
      else {
          res.render("secrets", {});
      }
    });

});

app.get("/submit", (req, res) => {

    res.render("submit", {});
});
