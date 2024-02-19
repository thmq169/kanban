const mongoose = require("mongoose");
const { shemaOptions } = require("./modelOptions");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  shemaOptions
);

module.exports = mongoose.model("User", userSchema);
