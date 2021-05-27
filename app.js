//jshint esversion:6
require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")
const port = 3000;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

var userSchema = new mongoose.Schema({
    email: String,
    password:String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"], excludeFromEncryption:  ["email"] });

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){

  res.render("register");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }
    else{
      console.log("ERROR in creating new user");
    }
  });
})

app.post("/login",function(req,res){
  const mail=req.body.username;
  const pass=req.body.password;
  User.findOne({email:mail},function(err,result){
    if(err)
    {
      console.log(err);
    }
    else
    {
      if(result){
        if(result.password===pass)
        {
          res.render("secrets");
        }
      }
    }
  });
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
