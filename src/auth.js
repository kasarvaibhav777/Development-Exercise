//=====================Importing Module and Packages=====================//
const JWT = require("jsonwebtoken");
const userModel = require("./userModel");
const mongoose = require("mongoose");

//======================== fetch the users list===================================//
const userList = async function (req, res) {
  try {
    //=====================Check Presence of Key with Value in Header=====================//
    let token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(400)
        .send({ status: false, msg: "Token must be Present." });
    }

    //=====================Verify token & asigning it's value in request body =====================//
    JWT.verify(
      token,
      "My-first-round-of-coding-test",
      function (error, decodedToken) {
        if (error) {
          return res
            .status(401)
            .send({ status: false, msg: "Token is not valid" });
        } else {
          token = decodedToken;
        }
      }
    );

    let userId = req.params.userId;

    if (!mongoose.isValidObjectId(req.params.userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid userId" });
    }

    // console.log(userId);

    const userData = await userModel.findOne({
      _id: userId,
      admin: true,
      isDeleted: false,
    });

    if (!userData) {
      return res.status(404).send({
        status: false,
        message: "Only Admin has access to see the users list",
      });
    }
    if (token.Payload.UserId != userId) {
      console.log(token.Payload.UserId);
      return res.status(403).send({
        status: false,
        message: "Only Admin has access to see the users list",
      });
    }

    const data = await userModel.find({
      isDeleted: false,
    });
    return res
      .status(200)
      .send({ status: true, message: "User List", data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

module.exports = { userList };
