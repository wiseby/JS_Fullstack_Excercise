var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var crypto = require("crypto-js");
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
    console.log(users);
    // Verify user
    users.forEach((user) => {
      activeUser = verifyUser(loginUser, user);
    });
    let response = userResponse(activeUser, users);
    if (response.status >= 400) {
      res.send({message: 'Failed to verify user'});
    } else {
      res.send(response);
    }
  });
});

// Create new user
router.post("/register", jsonParser, (req, res) => {
  var newUser = req.body;
  newUser.password = crypto.AES.encrypt(
    newUser.password,
    SECRET_KEY
  ).toString();
  let isUnique = true;
  console.log(newUser);

  getFileContent(USERS_URL, (data) => {
    let users = JSON.parse(data);

    users.forEach((user) => {
      if (user.name === newUser.name) {
        res.send({
          message: `user with name: "${newUser.name}" already exists`,
        });
        isUnique = false;
      }
    });
    if(isUnique) {
      users.push(newUser);
      saveDataToFile(USERS_URL, users);
    }
  });
});

// Change User Info
router.put("/", jsonParser, (req, res) => {
  var incommingUser = req.body;
  console.log(incommingUser);

  getFileContent(USERS_URL, (data) => {
    let users = JSON.parse(data);
    let usersLength = users.length;
    users.forEach((user, idx) => {
      if (verifyUser(incommingUser, user)) {
        users[idx] = incommingUser;
        console.log(user);
      }
    });
    if (users.length === usersLength) {
      saveDataToFile(USERS_URL, users);
    }
    res.send(incommingUser);
  });
});

function verifyUser(reqUser, serverUser) {
  if (serverUser.name === reqUser.name) {
    var bytes = crypto.AES.decrypt(serverUser.password, SECRET_KEY);
    var decryptedData = bytes.toString(crypto.enc.Utf8);
    if (reqUser.password === decryptedData) {
      return serverUser;
    }
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
