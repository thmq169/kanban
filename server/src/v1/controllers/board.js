const Board = require("../models/board");
const Section = require("../models/section");
const Task = require("../models/task");

const create = async (req, res) => {
  try {
    const boardCount = await Board.find().count();
    const board = await Board.create({
      user: req.user._id,
      position: boardCount > 0 ? boardCount : 0,
    });
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAll = async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user._id }).sort("-position");
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updatePositions = async (req, res) => {
  const { boards } = req.body;
  try {
    for (const key in boards.reverse()) {
      const board = boards[key];
      await Board.findByIdAndUpdate(board._id, { $set: { position: key } });
    }
    res.status(200).json("updated");
  } catch (error) {
    res.status(500).json(error);
  }
};

const getOne = async (req, res) => {
  const { boardId } = req.params;

  try {
    const board = await Board.findOne({ user: req.user._id, _id: boardId });
    if (!board) {
      return res.status(404).json("Board not found");
    }

    const sections = await Section.find({ board: boardId });

    for (const section of sections) {
      const tasks = await Task.find({ section: section._id })
        .populate("section")
        .sort("-position");
      section._doc.tasks = tasks;
    }
    board._doc.sections = sections;
    res.status(200).json(board);
  } catch (error) {
    res.status(500).json(error);
  }
};

const update = async (req, res) => {
  const { boardId } = req.params;
  const { title, description, favorite } = req.body;

  try {
    if (title === "") req.body.title = "Untitled";
    if (description === "") req.body.description = "Add description here";

    const currentBoard = await Board.findById(boardId);
    if (!currentBoard) return res.status(404).json("Board not found");

    if (favorite !== undefined && currentBoard.favorite !== favorite) {
      const favorites = await Board.find({
        user: currentBoard.user,
        favorite: true,
        _id: { $ne: boardId },
      }).sort("-favoritePosition");
      if (favorite) {
        req.body.favoritePosition = favorites.length > 0 ? favorites.length : 0;
      } else {
        for (const key in favorites) {
          const element = favorites[key];
          await Board.findByIdAndUpdate(element._id, {
            $set: { favoritePosition: key },
          });
        }
      }
    }

    const board = await Board.findByIdAndUpdate(boardId, { $set: req.body });

    res.status(200).json(board);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getFavorites = async (req, res) => {
  try {
    const favorites = await Board.find({
      user: req.user._id,
      favorite: true,
    }).sort("-favoritePosition");

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateFavoritePositions = async (req, res) => {
  const { boards } = req.body;
  try {
    for (const key in boards.reverse()) {
      const board = boards[key];
      await Board.findByIdAndUpdate(board._id, {
        $set: { favoritePosition: key },
      });
    }
    res.status(200).json("updated");
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteBoard = async (req, res) => {
  const { boardId } = req.params;

  try {
    const sections = await Section.find({ board: boardId });

    for (const section of sections) {
      await Task.deleteMany({ section: section._id });
    }

    await Section.deleteMany({ board: boardId });

    const currentBoard = await Board.find({ board: boardId });

    if (currentBoard.favorite) {
      const favorites = await Board.find({
        user: currentBoard.user,
        favorite: true,
        _id: { $ne: boardId },
      }).sort("favoritePosition");

      for (const key in favorites) {
        const element = favorites[key];
        await Board.findByIdAndUpdate(element._id, {
          $set: { favoritePosition: key },
        });
      }
    }

    await Board.deleteOne({ _id: boardId });

    const boards = await Board.find().sort("position");
    for (const key in boards) {
      const board = boards[key];
      await Board.findByIdAndUpdate(board._id, { $set: { position: key } });
    }

    res.status(200).json("deleted");
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getAll,
  create,
  updatePositions,
  getOne,
  update,
  getFavorites,
  updateFavoritePositions,
  deleteBoard,
};
