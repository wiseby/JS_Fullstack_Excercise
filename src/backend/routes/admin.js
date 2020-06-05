var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var router = express.Router();

//GET LoginForm
router.get('/', function(req, res) {
  res.render('adminLogin');
})

router.post('/', jsonParser, function(req, res) {

  // Parse the incomming requests body for user authentication
  var reqUser = req.body;
  console.log(reqUser);

  if(reqUser.length !== 1 && reqUser === undefined) {
    res.sendStatus(400);
  }  

  var activeUser;

  fs.readFile(ADMIN_URL, (err, adminData) => {
    if(err) throw err;

    var admins = JSON.parse(adminData);
    
    admins.forEach(admin => {      
      if(admin.name == reqUser.name) {
        // Password autentication
        // TODO implement crypt.js
        if(admin.password == reqUser.password) { 
          activeUser = admin; }
      }
    });
    
    // Get all regular users
    fs.readFile(USERS_URL, (err, userData) => {
      if(err) throw err;

      let users = JSON.parse(userData)
      
      // Create response data
      if(activeUser) {
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
});


module.exports = router;
