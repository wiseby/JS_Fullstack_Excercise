var express = require('express');
var fs = require('fs');
var router = express.Router();

router.post('/', function(req, res) {

  // Parse the incomming requests body for user authentication
  var reqUser = req.body;

  if(reqUser.length !== 1 && reqUser === undefined) {
    res.sendStatus(400);
  }  

  var activeUser;

  fs.readFile(USERS_URL, (err, data) => {

    if(err) throw err;

    var users = JSON.parse(data);
    
    users.forEach(user => {
      
      if(user.name == reqUser.name) {
        // Password autentication
        if(user.password == reqUser.password) { activeUser = user; }
      }
    });
    
    // Create response data
    if(activeUser.isAdmin === true) {
      var emailAdresses = users.filter(user => user.isSubscriber === true);
      emailAdresses = emailAdresses.map(user => user.email).join();
      res.render(
        'admin', 
        { 
          title: 'Admin',
          adminTitle: `Welcome ${activeUser.name}!`,
          users: users,
          emailAdresses: emailAdresses
        });
    } else {
      res.sendStatus(401);
    }
  });
});

module.exports = router;
