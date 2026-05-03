var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("landing"); // Lembre-se que renomeamos o index para landing!
});

module.exports = router;