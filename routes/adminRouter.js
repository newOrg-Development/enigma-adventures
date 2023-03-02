const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");
const googleController = require("./googleContoller.js");

router.get("/", (req, res) => {});

router.post("/saveHintArray", (req, res) => {
  console.log(req.body.gameHintArray);
  let gameHintArray = req.body.gameHintArray;

  googleController.saveGameHints(gameHintArray).then((data) => {
    res.send("done");
  });
});
module.exports = router;
