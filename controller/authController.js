const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
require('dotenv').config();
const JWT_KEY=process.env.JWT_KEY;

module.exports.signupUser = async function signupUser(req, res) {
  try {
    let dataObj = req.body;
    let user = await userModel.create(dataObj);
    if (user) {
      res.json({
        message: "user signed up",
        data: user,
      });
    } else {
      res.json({ message: "error while signing up" });
    }
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.login = async function login(req, res) {
  try {
    let data = req.body;
    if (data.email) {
      let user = await userModel.findOne({ email: data.email });
      if (user) {
        if (user.password == data.password) {
          let uid = user["_id"];
          let token = jwt.sign({ payload: uid }, JWT_KEY);
          res.cookie("login", token, { httpOnly: true });
          return res.json({
            message: "loggedin success",
            data: user,
          });
        } else {
          return res.json({ message: "wrong credentials" });
        }
      } else {
        return res.json({ message: "user not found" });
      }
    } else {
      res.json({ message: "Empty field" });
    }
  } catch {
    return res.json({ message: err.message });
  }
};

module.exports.protectRoute = async function protectRoute(req, res, next) {
  try {
    let token;
    //console.log(req);
    if (req.cookies.login) {
        
      token = req.cookies.login;
      let payload = jwt.verify(token, JWT_KEY);
       // console.log(payload);
      if (payload) {
        next();
      } else {
        return res.json({
          message: "please login again",
        });
      }
    } else {
      const client = req.get("User-Agent");
      if (client.includes("Mozilla") == true) {
        return res.redirect("/login");
      }
      return res.json({
        message: "operation not allowed",
      });
    }
  } catch {
    res.json({
      message: "login again",
    });
  }
};

module.exports.logout = function logout(req, res) {
  res.cookie("login", " ", { maxAge: 1 });
  res.json({
    message: "user logged out successfully",
  });
};
