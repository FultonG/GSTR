'use strict';
let express = require('express');
let bodyParser = require('body-parser');
var mongoClient = require('mongodb').MongoClient; 
let path = require('path');
var request = require('request');
let app = express();
let port = 8080;
var session = require('express-session');
require('log-timestamp');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({secret: 'wowhackathonsecret'}));
app.use(express.static(__dirname));
var sess;
var bcrypt = require('bcrypt');
const saltRounds = 8;
const myPlaintextPassword = 'password';


function isAuthenticated(req, res, next) {
    sess = req.session;
    console.log("Checking for authentication (isAuthenticated)")
    if(sess.user){
        console.log("User '"+sess.user+ "' is authenticated!")
        next();
}   else if (!sess.user){
    console.log("User not authenticated!")
    res.sendFile(path.join(__dirname, 'index.html'));
}
}

function isAuthenticated2(req, res, next) {
    sess = req.session;
    console.log("Checking for authentication (isAuthenticated)")
    if(sess.user){
        console.log("User '"+sess.user+ "' is authenticated!")
        next();
}   else if (!sess.user){
    console.log("User not authenticated!")
    res.send(false)
}
}


app.get('/developers', isAuthenticated, function(req, res){
           res.sendFile(path.join(__dirname, 'dev.html'));
 });
 
 app.get('/educational', function(req, res){
           res.sendFile(path.join(__dirname, 'edu.html'));
 });
 
 app.get('/checklogin', isAuthenticated2, function(req, res){
           res.send(true);
 });


app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});
 
app.post('/login', function(req,response){
    sess = req.session;
    console.log("the session is:"+sess);
        mongoClient.connect("mongodb://localhost:27017/web",function(error,db){
        if(!error){
                    console.log("Connected successfully to MongoDB server");
                    console.log("LOGIN INFORMATION: "+JSON.stringify(req.body));
                    var collection = db.collection('logins');
                    collection.findOne({username:req.body.user_name.toLowerCase()}, function(error,user){
                        if(user !== null){
                        bcrypt.compare(req.body.password, user.password, function(err, res) {
                            if (res == true){
                                console.log("Password correct!")
                                sess.user = user.username;
                                console.log("session user name is "+sess.user)
                                response.send(true)
                            } else {
                            console.log("Login failed! Bad password")
                            response.send(false)
                            }
                        }); 
                        }
                        else{ 
                            console.log("Login failed! Bad Username")
                            response.send(false)
                        }
                    });
        } else{
                console.dir(error);
                response.send(error);
        }
        db.close();
    });
});

app.post('/register',  function(req, res){
    sess = req.session;
    console.log("the session is:"+sess);
        mongoClient.connect("mongodb://localhost:27017/web",function(error,db){
        if(!error){
                    console.log("Connected successfully to MongoDB server");
                    console.log("REGISTRATION INFORMATION: "+JSON.stringify(req.body));
                    var collection = db.collection('logins');
                    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                        if(err){
                            console.log("Hash error: "+err)
                        } else if (!err){
                        collection.insert({firstname:req.body.fname,lastname:req.body.lname,email:req.body.email,username:req.body.username,password:hash})
                        }
                        collection.findOne({username:req.body.username.toLowerCase()}, function(error,user){
                        if(user !== null){
                         sess.user=user.username;
                         res.send(true)
                         console.log("this is true")
                        }  else {
                            console.log("Registration failed! Bad query?")
                            console.log(error)
                            res.send(false)
                        }
                                
                        })
                        db.close();
                        })
                    } else{
                console.dir(error);
                res.send(error);
                db.close();
        }
    });
});


app.get('/checkmongo',function(req, res) {
    mongoClient.connect("mongodb://localhost:27017/logins",function(error,db){
        if(!error){
                    console.log("Connected successfully to MongoDB server");
                    res.send("Connected successfully to server");
                    db.close();
        }
                else{
                    console.dir(error);
                     res.send(error);
                }
            });
        });
        
 app.get('/logout', function (req,res){
    req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
    res.redirect('/');
  }
});
});


app.listen(process.env.PORT,process.env.IP);