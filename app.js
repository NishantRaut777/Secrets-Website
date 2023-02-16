// using dotenv to store secrets
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// using mongoose-encryption to provide encryption

const encrypt = require("mongoose-encryption");




const app = express();



app.use(express.static("public"));
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.set('strictQuery', true);

mongoose.connect("mongodb://localhost:27017/userDB" , {useNewUrlParser: true});

// using mongoose.Schema object to be able to use encryption
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



// encrypting only password
// when i use save it will encrypt and when find is used it will decrypt
userSchema.plugin(encrypt , {secret: process.env.SECRET , encryptedFields: ["password"]});

const User = new mongoose.model("User" , userSchema);

app.get("/" , function(req,res){
    res.render("home");
});

app.get("/login" , function(req,res){
    res.render("login");
});

app.get("/register" , function(req,res){
    res.render("register");
});

// handling registeration
app.post("/register" , function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        // i am rendering secrets page here because only when user register or login he will see secrets page therefore not specifying GET for secrets page.
        else{
            res.render("secrets");
        }
    });
});

// handling login
app.post("/login" , function(req , res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username} , function(err , foundUser){
        if(err) {
            console.log(err);
        }
        else{
            if(foundUser){
                if (foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    });
});


app.listen(8081 , function(){
    console.log("Server started on port 8081");
});
