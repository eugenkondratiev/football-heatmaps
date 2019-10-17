var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });

  console.log("index - path.join(__dirname, 'public')",path.join(__dirname, 'public'));
console.log("index - path.resolve(__dirname, 'public')",path.resolve(__dirname, 'public'));


  res.sendFile('heatmaps.html', (err) => { 
  // res.sendFile('/heatmaps.html', { root : views},(err) => { 
    if (err) console.log("index.js err", err);
    ;
  });
});

module.exports = router;
