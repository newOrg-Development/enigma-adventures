const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  console.log("uuid " + req.query.uuid);
  res.redirect("/");
});

module.exports = router;
