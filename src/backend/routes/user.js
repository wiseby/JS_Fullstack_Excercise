var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var crypto = require("crypto-js");
var jsonParser = bodyParser.json();
var router = express.Router();

router.post("/login", jsonParser, (req, res, next) => {
  // Get user from request
  let loginUser = req.body;

  let activeUser;

  // Get users from file
  fs.readFile(USERS_URL, (err, data) => {
    if (err) throw err;

    var users = JSON.parse(data);
    // Verify user
    users.forEach((user) => {
      activeUser = verifyUser(loginUser, user);
    });
    let response = userResponse(activeUser, users);
    if (!activeUser) {
      res.statusCode = 404;
      res.send(response);
    } else {
      console.log(response);
      res.send(response);
    }
  });
});

// Create new user
router.post("/register", jsonParser, (req, res) => {
  var newUser = req.body;
  console.log(newUser);
  newUser.password = crypto.AES.encrypt(
    newUser.password,
    SECRET_KEY
  ).toString();
  let isUnique = true;

  getFileContent(USERS_URL, (data) => {
    let users = JSON.parse(data);

    users.forEach((user) => {
      if (user.name === newUser.name) {
        res.statusCode = 400;
        res.send({
          message: `user with name: "${newUser.name}" already exists`,
        });
        isUnique = false;
      }
    });
    if(isUnique) {
      users.push(newUser);
      saveDataToFile(USERS_URL, users);
      res.statusCode = 200;
      res.send({name: newUser.name});
    }
  });
});

// Change User Info
router.put("/", jsonParser, (req, res) => {
  var incommingUser = req.body;
  console.log(incommingUser);

  let userExists = false;

  let verificationData = {
    name: incommingUser.userData.name,
    password: incommingUser.password
  };

  getFileContent(USERS_URL, (data) => {
    let users = JSON.parse(data);
    let usersLength = users.length;

    users.forEach((user, idx) => {
      if (verifyUser(verificationData, user) !== null) {
        // TODO try flattening operator (...) to prevent password overwrite.
        tempPass = users[idx].password;
        users[idx] = incommingUser.userData;
        users[idx].password = tempPass; 
        userExists = true;
      } 
    });

    // TODO These conditions doesnt make sence!!!
    // Time to refactor!
    if(userExists && users.length === usersLength && users.length !== 0) { 
      saveDataToFile(USERS_URL, users);
      res.send(incommingUser);
    } else {
      console.log('sending 403 response');
      res.statusCode = 403;
    }
  });
});


function verifyUser(reqUser, serverUser) {
  if (serverUser.name === reqUser.name) {
    var bytes = crypto.AES.decrypt(serverUser.password, SECRET_KEY);
    var decryptedData = bytes.toString(crypto.enc.Utf8);
    if (reqUser.password === decryptedData) {
      console.log('verification passed');
      
      return serverUser;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

function getFileContent(srcPath, callback) {
    fs.readFile(srcPath, (err, data) => {
      if (err && err.code === 'ENOENT' | 'ENOTDIR') {
        console.log('correct error catch');
      };
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
  if (user !== undefined) {
    // Check isAdmin instead load admin dashboard.
    if (user.isAdmin) {
      // return user and all users.
      let resBody = {
        user: {
          name: user.name,
          email: user.email
        },
        users: users
      };
      return resBody;
    } else {
      // return active user only.
      let resBody = {
        name: user.name,
        email: user.email,
        isSubscriber: user.isSubscriber
      };
      return resBody;
    }
  } else {
    // Else respond with an error 401 client handles creation of account.
    return { 
      message: "Account doesn't exist"
    };
  }
}

module.exports = router;
