var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    proxy: 'http://194.195.253.34',
    auth:
    {
      //CHANGE EMAIL HERE
        user:'kayli.white@ethereal.email',
        pass:'7s2xh9wb9Hp7EJ1wAE'
        //CHANGE EMAIL HERE
    }

});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  if ('email' in req.body &&
      'username' in req.body &&
      'password' in req.body &&
      'organization' in req.body &&
      'admin_code' in req.body) {

    bcrypt.hash(req.body.password, 10, function(err, hash) { // 10 is the number of salt rounds
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      // Insert into the database with the hashed password
      req.pool.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }

        var query1 = `SELECT codes FROM admin_codes WHERE codes = ?`;
        connection.query(query1, [req.body.admin_code.toString()], function(er, rows, fields) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
          }
          if (rows.length > 0) {
            var query2 = `INSERT INTO admins (username, password, email, organization) VALUES (?, ?, ?, ?)`;
            connection.query(query2, [req.body.username.toString(), hash, req.body.email.toString(), req.body.organization.toString()], function(er, rows, fields) {
              connection.release();
              if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
              }
              res.send();
            });
          } else {
            console.log("Wrong admin code");
            res.sendStatus(401);
          }
        });
      });
    });
  } else {
    res.sendStatus(400);
  }
});

router.post('/login', async function(req, res, next) {
  if ('username' in req.body && 'password' in req.body) {
    req.pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      var query = `SELECT username, password, email, organization FROM admins WHERE email = ?`;
      connection.query(query, [req.body.username.toString()], function(er, rows, fields) {
        connection.release();
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        if (rows.length > 0) {
          bcrypt.compare(req.body.password, rows[0].password, function(err, result) {
            if (result) {
              console.log("Successfully logged in");
              delete rows[0].password;
              req.session.admin = rows[0];
              res.json(rows[0]);
            } else {
              console.log("Wrong login details");
              res.sendStatus(401);
            }
          });
        } else {
          console.log("User was not found");
          res.sendStatus(401);
        }
      });
    });
  } else {
    console.log("Fill in before submitting");
    res.sendStatus(400);
  }
});

router.use(function(req, res, next) {
  if ('admin' in req.session){
    next();
  }else{
    res.sendStatus(401);
  }
});

router.post('/logout', function(req, res, next) {
  delete req.session.admin;
  res.send();
});

router.post('/create_code', function(req, res, next) {

  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = `INSERT INTO admin_codes (code) VALUES (?)`;
    connection.query(query,[req.body.admin_code.toString()],function(er, rows, fields){
        connection.release();
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }
        res.send();
    });
  });

});

router.get('/get_users', function(req, res, next) {
  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = `SELECT username FROM users`;
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

router.post('/show_user_checkins', function(req, res, next) {

  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = `SELECT venues.username, check_in.date FROM venues INNER JOIN check_in ON check_in.v_id = venues.v_id WHERE check_in.u_id = ?`;
    connection.query(query,[req.body.number],function(er, rows, fields){
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

router.get('/get_venues', function(req, res, next) {
  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = `SELECT username FROM venues`;
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

router.post('/show_venue_checkins', function(req, res, next) {

  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = `SELECT users.username, check_in.date FROM users INNER JOIN check_in ON check_in.u_id = users.u_id WHERE check_in.v_id = ?`;
    connection.query(query,[req.body.number],function(er, rows, fields){
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

router.post('/user_covid_contact', function(req, res, next) {

  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = `SELECT COVID_contact FROM users WHERE u_id = ?`;
    connection.query(query,[req.body.number],function(er, rows, fields){
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

router.post('/on_user_covid_contact', function(req, res, next) {

  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = `UPDATE users SET COVID_contact=1 WHERE u_id=?`;
    connection.query(query,[req.body.number],function(er, rows, fields){
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

router.post('/off_user_covid_contact', function(req, res, next) {

  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = `UPDATE users SET COVID_contact=0 WHERE u_id=?`;
    connection.query(query,[req.body.number],function(er, rows, fields){
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

router.post('/venue_covid_contact', function(req, res, next) {

  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = `SELECT COVID_contact FROM venues WHERE v_id = ?`;
    connection.query(query,[req.body.number],function(er, rows, fields){
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

router.post('/on_venue_covid_contact', function(req, res, next) {

  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = `UPDATE venues SET COVID_contact=1 WHERE v_id=?`;
    connection.query(query,[req.body.number],function(er, rows, fields){
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

router.post('/off_venue_covid_contact', function(req, res, next) {

  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = `UPDATE venues SET COVID_contact=0 WHERE v_id=?`;
    connection.query(query,[req.body.number],function(er, rows, fields){
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

router.post('/sendmail', function(req,res,next){

  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = `SELECT venues.email FROM venues WHERE COVID_contact = 1 UNION ALL SELECT users.email FROM users WHERE COVID_contact = 1`;
    connection.query(query,function(err, rows, fields){
        connection.release();
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log(rows[1].email);
        let emails = "";
        for (let row of rows){
          emails = emails + row.email+ ", ";

        }
        console.log(emails);
      let mailOptions_1 =({
        //CHANGE EMAIL HERE
      from: '"Covid Security System" <kayli.white@ethereal.email>', // sender address
      //CHANGE EMAIL HERE
      to: emails, // list of receivers
      //to: "testthe789@gmail.com, test@hotmail.com", //single reciever
      subject: "number 1", // Subject line
      text: "covid contact", // plain text body
      html: "<b>We are sending this email to inform you that you have been in contact with covid</b>", // html body
      });

      let mailOptions_2 =({
        //CHANGE EMAIL HERE
      from: '"Covid Security System" <kayli.white@ethereal.email>', // sender address
        //CHANGE EMAIL HERE
      to: emails, // list of receivers
      //to: "testthe789@gmail.com, test@hotmail.com", //single reciever
      subject: "number 2", // Subject line
      text: "covid contact", // plain text body
      html: "<b>We are sending this email to inform you that you have been in contact with covid</b>", // html body
      });



         transporter.sendMail(mailOptions_1, function(error, info){
      if (error) {
          console.log("error is "+error);
         res.status(400).send("failed :((")
      }
     else {
         console.log('Email sent: ' + info.response);
         res.send("sent mail :)))")
      }
     });

         transporter.sendMail(mailOptions_2, function(error, info){
      if (error) {
          console.log("error is "+error);
         res.status(400).send("failed :((")
      }
     else {
         console.log('Email sent: ' + info.response);
         res.send("sent mail :)))")
      }
     });
       // send mail with defined transport object


      return;

        res.send();
    });


  });
  });


module.exports = router;

