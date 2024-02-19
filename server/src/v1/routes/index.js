var express = require("express");
var router = express.Router();

router.use("/auth", require("./auth"));
router.use("/board", require("./board"));
router.use("/board/:boardId/sections", require("./section"));
router.use("/board/:boardId/tasks", require("./task"));

module.exports = router;
