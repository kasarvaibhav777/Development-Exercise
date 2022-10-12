const userModel = require("./userModel");
const JWT = require("jsonwebtoken");

//=====================Checking the input value is Valid or Invalid=====================//
let checkValid = function (value) {
  if (
    typeof value == "undefined" ||
    typeof value == "number" ||
    value.length == 0 ||
    typeof value == null
  ) {
    return false;
  } else if (typeof value == "string") {
    return true;
  }
  return true;
};

//=====================This function is used for SignUp an User=====================//
const createUser = async function (req, res) {
  try {
    let data = req.body;

    //=====================Checking the validation=====================//
    let { fname, lname, mobile, email, password, admin } = data;
    if (!(fname && lname && mobile && email && password && admin)) {
      return res
        .status(400)
        .send({ status: false, msg: "All fields are mandatory." });
    }

    //=====================Validation of First Name=====================//
    if (!checkValid(fname))
      return res
        .status(400)
        .send({ status: false, message: "Please Provide valid Input" });
    if (!/^[A-Za-z]+$\b/.test(fname))
      return res.status(400).send({
        status: false,
        msg: "Please Use Correct Characters in first name",
      });

    //=====================Validation of Last Name=====================//
    if (!checkValid(lname))
      return res
        .status(400)
        .send({ status: false, message: "Please Provide valid Input" });
    if (!/^[A-Za-z]+$\b/.test(lname))
      return res.send({
        status: false,
        message: "Please Use Correct Characters in Last Name",
      });

    //=====================Validation of Phone=====================//
    if (!/^[6-9]\d{9}$/.test(mobile))
      return res
        .status(400)
        .send({ status: false, msg: "Please Use Valid mobile." });

    //=====================Validation of EmailID=====================//
    if (!checkValid(email))
      return res
        .status(400)
        .send({ status: false, message: "Spaces aren't Allowed." });
    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide valid Email" });
    }
    let checkDuplicate = await userModel.findOne({ email: email });
    if (checkDuplicate) {
      return res.status(409).send({
        status: false,
        msg: "This EmailID already exists please provide another EmailID.",
      });
    }

    //=====================Validation of Password=====================//
    if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/.test(
        password
      )
    ) {
      return res.status(400).send({
        status: false,
        msg: "Your password must be at least 8 characters long, contain at least one number and symbol, and have a mixture of uppercase and lowercase letters.",
      });
    }

    //=====================Create User=====================//
    let createAuthor = await userModel.create(data);
    res.status(201).send({ status: true, msg: createAuthor });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

//=====================This function used for User LogIn =====================//
const userLogin = async function (req, res) {
  try {
    let UserName = req.body.email;
    let Password = req.body.password;

    //=====================Checking Mandotory Field=====================//
    if (!(UserName && Password)) {
      return res.status(400).send("All Fields are Mandotory.");
    }

    //=====================Checking Format of Email & Password by the help of Regex=====================//
    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(UserName)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please Check EmailID." });
    }
    if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/.test(
        Password
      )
    ) {
      return res
        .status(400)
        .send({ status: false, msg: "Re-enter your Correct Password." });
    }

    //=====================Fetch Data from DB=====================//
    let userDetail = await userModel.findOne({
      email: UserName,
      password: Password,
    });
    if (!userDetail)
      return res
        .status(400)
        .send({ status: false, msg: "Wrong UserName or Password." });

    //=====================Token Generation by using JWT=====================//
    let Payload = {
      UserId: userDetail._id.toString(),
      EmailID: userDetail.email,
      Password: userDetail.password,
      Project: "Development-Exercise",
    };
    let token = JWT.sign(Payload, "My-first-round-of-coding-test", {
      expiresIn: "1 days",
    });

    //=====================Set Key with value in Response Header=====================//
    res.setHeader("x-api-key", token);

    //=====================Send Token in Response Body=====================//
    res.status(200).send({ status: true, token: token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

//=====================Module Export=====================//
module.exports = { createUser, userLogin };
