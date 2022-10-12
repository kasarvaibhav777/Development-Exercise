const express = require("express");
const router = express.Router();

const { createUser, userLogin } = require("./userController");
const { userList } = require("./auth");

//=====================Create User(Post API)=====================//
router.post("/user", createUser);

//=====================Login User(Post API)=====================//
router.post("/login", userLogin);

//=====================fetch user list=====================//
router.get("/userList/:userId", userList);

module.exports = router;
