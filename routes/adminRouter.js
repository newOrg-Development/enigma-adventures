const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");
const googleController = require("./Class_googleContoller.js");

router.post("/saveHintArray", (req, res) => {
  googleController
    .saveGameHints(JSON.stringify(req.body.gameStructureArray))
    .then(() => {});
});

router.get("/getStates", (req, res) => {
  googleController.getGameHints().then((data) => {
    res.send(data);
  });
});
module.exports = router;
