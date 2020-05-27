var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var router = express.Router();

router.post('/', jsonParser, function(req, res) {

  // Parse the incomming requests body for user authentication
  var reqUser = req.body;

  if(reqUser.length !== 1 && reqUser === undefined) {
    res.sendStatus(400);
  }  

  var activeUser;

  fs.readFile('./assets/users.json', (err, data) => {

    if(err) throw err;

    var users = JSON.parse(data);
    var usersLength = users.length;
    console.log(usersLength);
    console.log("Users in file:");
    console.log(users);
    
    users.forEach(user => {
      
      if(user.name == reqUser.name) {
        // Password autentication
        if(user.password == reqUser.password) {
          activeUser = user;     
          console.log("Setting activeUser!!!");
        }
      }
      console.log('Active User: ' + activeUser);
      
    });
    
    // Create response data
    if(activeUser.isAdmin === true) {
      res.send(users);
    } else {
      res.sendStatus(401);
    }
  });
});

module.exports = router;
