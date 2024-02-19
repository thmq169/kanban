const mongoose = require("mongoose");
const { shemaOptions } = require("./modelOptions");

const sectionSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled",
    },
  },
  shemaOptions
);

module.exports = mongoose.model("Section", sectionSchema);
