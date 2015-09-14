
/**
 * Module dependencies.
 */

var bodyParser = require('body-parser'); 
var express = require('express');
var path = require('path'); 
var http = require('http');
var sendgrid = require("sendgrid")(process.env.SGUSER, process.env.SGKEY);
var Parse = require("parse/node").Parse;
Parse.initialize(process.env.PARSEAPPECLUB, process.env.PARSEJSECLUB);
var localStorage = require('localStorage');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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

app.get('/management', function(req, res) {
   res.sendfile('./public/management.html');  
});

app.post('/api/checkMember', function(req, res) {

    
    var UserObject = Parse.Object.extend("UserObject"); 
    var userObject = new UserObject(); 
    
    var query = new Parse.Query(UserObject); 
    query.equalTo("pid", req.body.pid); 
    query.find({ 
        success: function(users) { 
            if(users.length === 1) {
                var user = users[0];
                
                var timeCheck = Math.abs(new Date() - user.updatedAt); 
                if(timeCheck/1000 > 3600) {
                    user.increment("count");
                    user.save();    
                    res.json({"memberExists" : true, "validEntry": true});
                }
                else { 
                    res.json({"memberExists" : true, "validEntry": false});
                }
                

                 
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
    var email = new sendgrid.Email();
    
    
    var subject = 'Welcome to E-Club, ' + req.body.first + '!';
    var recipient = req.body.pid + '@vt.edu'; 
    email.addTo(recipient); 
    email.setFrom('President@vteclub.org'); 
    email.setSubject(subject);
    email.setHtml("Thanks for coming to the meeting today! To stay up to date with our events, sign up for the weekly newsletter here: http://www.vteclub.org/"); 
    sendgrid.send(email); 
    
    
    userObject.save({pid : req.body.pid, count:1, first: req.body.first, last: req.body.last}).then(function(object) { 
       
        res.json({"memberCreated" : true});           
    });
    
    
    
    
    
});

app.get('/api/getMember/:mem', function(req,res) {
 
    var UserObject = Parse.Object.extend("UserObject"); 
    var userObject = new UserObject();
    var query = new Parse.Query(UserObject); 
    query.equalTo("pid", req.params.mem); 
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
