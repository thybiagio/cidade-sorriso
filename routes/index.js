var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Não é por acaso, é por enquanto.' });
});

module.exports = router;