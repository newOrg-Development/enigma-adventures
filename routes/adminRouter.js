const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");
const googleController = require("./Class_googleContoller.js");

console.log("admin");
router.get("/", (req, res) => {});

router.post("/saveHintArray", (req, res) => {
  let gameHintArray = req.body;
  googleController
    .saveGameHints(JSON.stringify(req.body.gameStructureArray))
    .then((data) => {});
});

router.get("/getStates", (req, res) => {
  googleController.getGameHints().then((data) => {
    res.send(data);
  });
});
module.exports = router;
