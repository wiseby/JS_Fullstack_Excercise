var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var jsonParser = bodyParser.json();
var router = express.Router();

/* GET users listing. */
router.post("/login", jsonParser, (req, res, next) => {
  // Get user from request
  let loginUser = req.body;
  console.log(loginUser);

  var activeUser;

  // Get users from file
  fs.readFile(USERS_URL, (err, data) => {
    if (err) throw err;
    
    var users = JSON.parse(data);
    console.log("users from file");
    console.log(users);

    // Verify user
    users.forEach((user) => {
      if (
        user.name === loginUser.name &&
        user.password === loginUser.password
      ) {
        activeUser = user;
        console.log("activeUser:");
        console.log(activeUser);
      }
    });
    let response = userResponse(activeUser, users);
    if(response.status >= 400) {
      res.sendStatus(400);
    } else {
      res.send(response);
    }
  });
});

router.post('/register', jsonParser, (req, res) => {
  var newUser = req.body;

  fs.readFile(USERS_URL, )
});

function userResponse(user, users) {
  // If user credentials are correct redirect to dashboard
  if (user) {
    // Check isAdmin instead load admin dashboard.
    if (user.isAdmin) {
      // return user and all users.
      let resBody = {
        user: user,
        users: users,
        status: 200
      };
      return resBody;
    } else {
      // return active user only.
      let resBody = {
        user: user,
        status: 200
      };
      return resBody;
    }
  } else {
    // Else respond with an error 401 client handles creation of account.
    return { status: 401 }
  }
}



module.exports = router;
