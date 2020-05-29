var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var jsonParser = bodyParser.json();
var router = express.Router();

router.post("/login", jsonParser, (req, res, next) => {
  // Get user from request
  let loginUser = req.body;

  var activeUser;

  // Get users from file
  fs.readFile(USERS_URL, (err, data) => {
    if (err) throw err;

    var users = JSON.parse(data);

    // Verify user
    users.forEach((user) => {});
    activeUser = verifyUser(loginUser, user);
    let response = userResponse(activeUser, users);
    if (response.status >= 400) {
      res.sendStatus(400);
    } else {
      res.send(response);
    }
  });
});


// Create new user
router.post("/register", jsonParser, (req, res) => {
  var newUser = req.body;

  getFileContent(USERS_URL, (data) => {
    let users = JSON.parse(data);

    users.forEach((user) => {
      if (user.name === newUser.name) {
        res
          .sendStatus(400)
          .send({
            message: `user with name: "${newUser.name}" already exists`,
          });
      }
    });
    users.push(newUser);
    saveDataToFile(USERS_URL, users);
  });
});


router.put("/", jsonParser, (req, res) => {
  var incommingUser = req.body;
  console.log(incommingUser);

  getFileContent(USERS_URL, (data) => {
    let users = JSON.parse(data);
    let usersLength = users.length;
    users.forEach((user, idx) => {
      if(verifyUser(incommingUser, user)) {
        users[idx] = incommingUser;
        console.log(user);
      }
    });
    if(users.length === usersLength) {
      saveDataToFile(USERS_URL, users);
    }
    res.send(incommingUser);
  });
});


function verifyUser(reqUser, serverUser) {
  if (serverUser.name === reqUser.name 
      &&
      serverUser.password === reqUser.password) {
    return serverUser;
  }
}

function getFileContent(srcPath, callback) {
  fs.readFile(srcPath, (err, data) => {
    if (err) throw err;
    callback(data);
  });
}

function saveDataToFile(srcPath, data) {
  let stringData = JSON.stringify(data, null, 4);
  fs.writeFile(srcPath, stringData, (err) => {
    if (err) throw err;
    console.log("Data successfully saved");
  });
}

function userResponse(user, users) {
  // If user credentials are correct redirect to dashboard
  if (user) {
    // Check isAdmin instead load admin dashboard.
    if (user.isAdmin) {
      // return user and all users.
      let resBody = {
        user: user,
        users: users,
        status: 200,
      };
      return resBody;
    } else {
      // return active user only.
      let resBody = {
        user: user,
        status: 200,
      };
      return resBody;
    }
  } else {
    // Else respond with an error 401 client handles creation of account.
    return { status: 401 };
  }
}

module.exports = router;
