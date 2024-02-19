const Board = require("../models/board");
const Section = require("../models/section");
const Task = require("../models/task");

const create = async (req, res) => {
  const { sectionId } = req.body;

  try {
    const section = await Section.findById(sectionId);
    const taskCount = await Task.find({ section: sectionId }).count();
    const task = await Task.create({
      section: sectionId,
      position: taskCount > 0 ? taskCount : 0,
    });

    task._doc.section = section;
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json(error);
  }
};

const update = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findByIdAndUpdate(taskId, {
      $set: req.body,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const currentTask = await Task.findById(taskId);
    await Task.deleteOne({ _id: taskId });

    const tasks = await Task.find({ section: currentTask.section });

    for (const key in tasks) {
      await Task.findByIdAndUpdate(tasks[key]._id, { $set: { position: key } });
    }

    res.status(200).json("deleted task");
  } catch (error) {
    res.status(500).json(error);
  }
};

const updatePostition = async (req, res) => {
  const {
    resourceList,
    destinationList,
    resourceSectionId,
    destinationSectionId,
  } = req.body;

  const resoureListReverse = resourceList.reverse();
  const destinationListReverse = destinationList.reverse();

  try {
    if (resourceSectionId !== destinationSectionId) {
      for (const key in resoureListReverse) {
        await Task.findByIdAndUpdate(resoureListReverse[key]._id, {
          $set: {
            section: resourceSectionId,
            position: key,
          },
        });
      }
    }

    for (const key in destinationListReverse) {
      await Task.findByIdAndUpdate(destinationListReverse[key]._id, {
        $set: {
          section: destinationSectionId,
          position: key,
        },
      });
    }

    res.status(200).json("updated task");
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  create,
  update,
  deleteTask,
  updatePostition,
};
