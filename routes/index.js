var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

});

module.exports = router;

router.get('/mapPage', function(req, res, next) { //template get request to receive info about venue
  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }

    var query = `SELECT longitude, latitude, username, COVID_contact FROM venues`;
    connection.query(query,function(er, rows, fields){
        connection.release();
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }
        res.json(rows);
    });
  });
});