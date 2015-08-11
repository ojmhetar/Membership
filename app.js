
/**
 * Module dependencies.
 */

var bodyParser = require('body-parser'); 
var express = require('express');
var path = require('path'); 
var http = require('http');
var sendgrid = require("sendgrid")(process.env.SGUSER, process.env.SGKEY);
var Parse = require("parse").Parse;
Parse.initialize(process.env.PARSEAPPECLUB, process.env.PARSEJSECLUB);

var email = new sendgrid.Email();


var app = express();


var router = express.Router();

// all environments
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({'extended':'true'}));            
app.use(bodyParser.json());                                     
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


app.listen(process.env.PORT || 8080);
console.log("App listening on port 8080");


app.get('/', function(req,res) {
    res.sendfile('./public/index.html'); 
});


app.post('/api/checkMember', function(req, res) {

    
    var UserObject = Parse.Object.extend("UserObject"); 
    var userObject = new UserObject(); 
    
    var query = new Parse.Query(UserObject); 
    query.equalTo("name", req.body.pid); 
    query.find({ 
        success: function(users) { 
            if(users.length === 1) {
                var user = users[0];
                user.increment("count");
                user.save();

                res.json({"memberExists" : true}); 
            }
            else if(users.length === 0) {
                res.json({"memberExists" : false});
            }
            else {
                res.json({"memberExists" : false}); 
                console.log("There's been an error");    
            }
        },
        error: function(error) {
            console.log("Theres been an error");
        }
        
    }); 
    
});

app.post('/api/newMember', function(req, res) { 
    
    var UserObject = Parse.Object.extend("UserObject"); 
    var userObject = new UserObject(); 
    
    
    userObject.save({pid : req.body.pid, count:1, first: req.body.first, last: req.body.last}).then(function(object) { 
       
        res.json({"memberCreated" : true});           
    });
    
    
});

app.get('/api/getMember/:mem', function(req,res) {
 
    var UserObject = Parse.Object.extend("UserObject"); 
    var userObject = new UserObject();
    var query = new Parse.Query(UserObject); 
    query.equalTo("name", req.params.mem); 
    query.find({
       success: function(users) {
           if(users.length === 1) {
                var user = users[0];
                
                res.json({"firstName": user.get("first"), "count": user.get("count")}); 
            }
            else {
                console.log("Theres been an error");    
            }
           
       },
        error: function(error) {
         console.log("Theres been an error");   
        }
    });
    
}); 
