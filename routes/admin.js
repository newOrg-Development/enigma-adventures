const express = require("express");
const router = express.Router();
const fs = require("fs");

//const adminHead = module.require("./views/custom/adminHead.hbs");

let gameread = fs.readFileSync("./gameData/gameData.txt");
/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log("amind route");
});

module.exports = router;
