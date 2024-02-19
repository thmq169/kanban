const mongoose = require("mongoose");
const { shemaOptions } = require("./modelOptions");

const taskSchema = new mongoose.Schema(
  {
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled",
    },
    content: {
      type: String,
      default: "",
    },
    position: {
      type: Number,
    },
  },
  shemaOptions
);

module.exports = mongoose.model("Task", taskSchema);
