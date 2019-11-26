var express = require('express');
var router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  console.log("index - path.join(__dirname, 'views')", path.join(__dirname, '../views/'));
  // console.log("index - path.resolve(__dirname, 'public')",path.resolve(__dirname, 'public'));


  // res.sendFile('../views/heatmaps.html', (err) => {
  res.sendFile(path.join(__dirname, '../views/') + 'heatmaps.html', (err) => {
    // res.sendFile('/heatmaps.html', { root : views},(err) => { 
    if (err) console.log("index.js err", err);
    ;
  });
});

module.exports = router;
