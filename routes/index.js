var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("landing", { title: "Cidade Sorriso" }); // Lembre-se que renomeamos o index para landing!
});

module.exports = router;