var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile('/heatmaps.html', (err) => { 
  // res.sendFile('/heatmaps.html', { root : views},(err) => { 
    if (err) console.log(err);
    ;
  });
});

module.exports = router;
