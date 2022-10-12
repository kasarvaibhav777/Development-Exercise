//=====================Importing Module and Packages=====================//
const express = require("express");
const bodyParser = require("body-parser");
const route = require("./route.js");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://kasarvaibhav777:VqAQ4xWgRUOXRW7N@cluster0.y2iweu3.mongodb.net/Project-04",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is Connected."))
  .catch((error) => console.log(error));

//===================== Global Middleware for Route =====================//
app.use("/", route);

//===================== It will Handle error When You input Wrong Route =====================//
app.use(function (req, res) {
  var err = new Error("Not Found.");
  err.status = 404;
  return res.status(404).send({ status: "404", msg: "Path not Found." });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Express App Running on Port: " + (process.env.PORT || 3000));
});
