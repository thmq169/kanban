const Board = require("../models/board");
const Section = require("../models/section");
const Task = require("../models/task");

const create = async (req, res) => {
  const { boardId } = req.params;
  try {
    const section = await Section.create({ board: boardId });
    section._doc.tasks = [];
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json(error);
  }
};

const update = async (req, res) => {
  const { sectionId } = req.params;

  try {
    const section = await Section.findByIdAndUpdate(sectionId, {
      $set: req.body,
    });
    section._doc.tasks = [];
    res.status(200).json(section);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteSection = async (req, res) => {
  const { sectionId } = req.params;

  try {
    await Task.deleteMany({ section: sectionId });
    await Section.deleteOne({ _id: sectionId });
    res.status(200).json("deleted section");
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  create,
  update,
  deleteSection,
};
