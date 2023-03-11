const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
//const { v4: uuidv4 } = require("uuid");
const googleController = require("./Class_googleContoller.js");
const mongoController = require("../resources/mongoController.js");

router.post("/saveHintArray", (req, res) => {
  mongoController
    .saveGameStructures(req.body.gameStructureArray)
    .then(() => {});
});

router.get("/getStates", (req, res) => {
  //   googleController.getGameHints().then((data) => {
  //     //console.log(data);
  //     res.send(JSON.parse(data));
  //   });
  // });
  mongoController.loadGameStructures().then((data) => {
    res.send(data[0].gameStructure);
  });
});
module.exports = router;
