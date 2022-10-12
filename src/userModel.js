const mongoose = require("mongoose");

//=====================Creating Author Schema=====================//
const userSchema = new mongoose.Schema(
  {
    fname: { type: String, require: true, trim: true },
    lname: { type: String, require: true, trim: true },
    mobile: { type: String, require: true },
    email: {
      type: String,
      lowercase: true,
      require: true,
      unique: true,
      trim: true,
    },
    password: { type: String, require: true, minimum: 8, trim: true },
    admin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//=====================Module Export=====================//
module.exports = mongoose.model("User", userSchema);
