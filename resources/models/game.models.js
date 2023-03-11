const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const gameStructureSchema = new Schema({
  gameStructure: JSON,
});

const leaderBoardSchema = new Schema({
  leaderBoard: JSON,
});

const gameSchema = new Schema({
  uuid: String,
  game: JSON,
});

const LeaderBoard = model("LeaderBoard", leaderBoardSchema);
const GameStructure = model("GameStructure", gameStructureSchema);
const Game_mongo = model("Game", gameSchema);

module.exports = { LeaderBoard, GameStructure, Game_mongo };
