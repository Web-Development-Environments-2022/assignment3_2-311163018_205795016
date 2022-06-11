var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcrypt");
const { Char } = require("mssql");

router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    let user_details = {
      ID: req.body.ID,
      username: req.body.username,
      firstname: req.body.first_name,
      lastname: req.body.last_name,
      country: req.body.country,
      password: req.body.password,
      email: req.body.email
      //profilePic: req.body.profilePic
    }
    console.log(req.body.username)
    console.log(req.body.first_name)
    console.log(req.body.last_name)
    console.log(req.body.country)
    console.log(req.body.password)
    console.log(req.body.email)


    //let users = [];
    const users = await DButils.execQuery("SELECT username FROM users");
    console.log(users)
    if (users.find((x) => x.username == user_details.username))
      throw { status: 409, message: "Username taken" };

    // add the new username
    let hash_password = bcrypt.hashSync(
      user_details.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    await DButils.execQuery(
      `INSERT INTO users VALUES ('${user_details.ID}','${user_details.username}', '${user_details.firstname}', '${user_details.lastname}',
      '${user_details.country}', '${hash_password}', '${user_details.email}')`
    );
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    // check that username exists
    console.log(req.body.username)
    //console.log(req.body.username instanceof string)
    console.log(req.body.password)
    const users = await DButils.execQuery("SELECT username FROM users");
    console.log(users)
    //res.send({ success: true, message: "step1 : in" });
    if (!users.find((x) => x.username == req.body.username))
      throw { status: 401, message: "Username or Password incorrect1" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE username = '${req.body.username}'`
      )
    )[0];
    //res.send({ success: true, message: "step2 : in" });    
    console.log(user)
    console.log(bcrypt.compare(req.body.password, user.password))
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect2" };
    }

    // Set cookie
    req.session.user_id = user.ID;


    // return cookie
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});


module.exports = router;