var express = require('express');
var router = express.Router();

const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '393986609657-pp1fij7hs9g11eh402aj96ndnp5t1bao.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {

  if ( 'given_name' in req.body &&
        'family_name' in req.body &&
        'date_of_birth' in req.body &&
        'email' in req.body &&
        'contact_number' in req.body &&
        'gender' in req.body &&
        'receive_email_1' in req.body &&
        'receive_email_2' in req.body &&
        'receive_email_3' in req.body &&
        'username' in req.body &&
        'password' in req.body &&
        'street_number' in req.body &&
        'street_name' in req.body &&
        'suburb' in req.body &&
        'zip_code' in req.body &&
        'state' in req.body &&
        `venue_code` in req.body)

        {
          console.log(req.body.receive_email_1.toString());

          bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            if (err) {
              console.log(err);
              res.sendStatus(500);
              return;
            }
            req.pool.getConnection( function(err,connection){
                  if(err){
                      console.log(err);
                      res.sendStatus(500);
                      return;
                  }
                 
                  var query = `INSERT INTO venues (given_name,family_name,date_of_birth,email,contact_number,gender,COVID_contact,receive_email_1,receive_email_2,receive_email_3,username,password,street_number,street_name,suburb,zip_code,state,venue_code)
                                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                  connection.query(query,[req.body.given_name.toString(),
                                          req.body.family_name.toString(),
                                          req.body.date_of_birth.toString(),
                                          req.body.email.toString(),
                                          req.body.contact_number.toString(),
                                          req.body.gender.toString(),
                                          0,
                                          req.body.receive_email_1.toString(),
                                          req.body.receive_email_2.toString(),
                                          req.body.receive_email_3.toString(),
                                          req.body.username.toString(),
                                          hash,
                                          req.body.street_number.toString(),
                                          req.body.street_name.toString(),
                                          req.body.suburb.toString(),
                                          req.body.zip_code.toString(),
                                          req.body.state.toString(),
                                          req.body.venue_code.toString()],
                                          function(er, rows, fields){
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
        }else{
          res.sendStatus(400);
        }


});

router.post('/login', async function(req, res, next) {  // note use of async; you may need to move this to an inner function
  if ( 'username' in req.body && 'password' in req.body )
  {
    req.pool.getConnection( function(err,connection){
          if(err){
              console.log(err);
              res.sendStatus(500);
              return;
          }
          var query = `SELECT * FROM venues WHERE email=?`;
          connection.query(query,[req.body.username.toString()], async function(er, rows, fields)
          {
            connection.release();
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }
            if(rows.length > 0){
              let valid = await argon2i.verify(rows[0].password, req.body.password);
                if (valid){
                console.log("Successfully logged in");
                delete rows[0].password;
                req.session.venue = rows[0];
                res.json(rows[0]);
                } else{
                  console.log("Worng login details");
                  return res.sendStatus(401);
                }
            }else{
              console.log("User was not found");
              res.sendStatus(401);
            }
          });
      });

  }else{
    console.log("fill in before submitting");
    res.sendStatus(400);
  }
});

router.use(function(req, res, next) {
  if ('venue' in req.session){
    next();
  }else{
    res.sendStatus(401);
  }
});

router.get('/load_info', function(req, res, next) {
  res.send(req.session.venue);
});

router.post('/logout', function(req, res, next) {
  delete req.session.venue;
  res.send();
});

router.get('/history', function(req, res, next) {
  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = `SELECT users.username, check_in.date FROM users INNER JOIN check_in ON users.u_id = check_in.u_id WHERE check_in.v_id = ? `;
    connection.query(query,[req.session.venue.v_id],function(er, rows, fields){
        connection.release();
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }
        if(rows.length > 0){
          res.json(rows);
        }else{
          console.log("No Enteres");
          res.sendStatus(404);
        }
    });
  });
});

router.post('/update_info', function(req, res, next) {
  var venue = req.body;

  console.log("In Server: " + venue.userid);

  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }/*
    var query = `
    UPDATE users
  SET username = '${user.uname}', email = '${user.mail}', given_name = '${user.gname}', family_name = "${user.fname}", date_of_birth = "${user.dobirth}", contact_number = '${user.phone}', gender = "${user.gener_n}"
  WHERE u_id = ${user.userid}
`;*/
var query = `
    UPDATE venues
  SET username = ?, email = ?, given_name = ?, family_name = ?, date_of_birth = ?, contact_number = ?, gender = ?
  WHERE v_id = ?
`;

    connection.query(query,[venue.uname,venue.mail,venue.gname,venue.fname,venue.dobirth,venue.phone,venue.gener_n,venue.userid],function(er, rows, fields){
        connection.release();
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }

        // update success
         //console.log("HAHAHAHAHAH");
         // update session
        req.session.venue.username = venue.uname;
        req.session.venue.given_name = venue.gname;
        req.session.venue.family_name = venue.fname;
        req.session.venue.date_of_birth = venue.dobirth;
        req.session.venue.email = venue.mail;
        req.session.venue.contact_number = venue.phone;
        req.session.venue.gender = venue.gener_n;

        res.send();
    });
});

});


router.post('/wVenues',function(req, res, next) {

    //console.log("\n\n\n\nreq.body " + JSON.stringify(req.body.token));

    var token = req.body.token;
    var email = req.body.email;
    var first = req.body.first;
    var last = req.body.last;

    async function verify() {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
    }
    verify().catch(console.error);



    // verify succs

    // check email same?
      req.pool.getConnection( function(err,connection){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }
            var query = `SELECT * FROM venues WHERE email=?`;
            connection.query(query,[email], function(err, rows, fields)
            {
              connection.release();
              if(err){
                  console.log(err);
                  res.sendStatus(500);
                  return;
              }
              if(rows.length > 0){

                  console.log("Successfully logged in For google");

                  delete rows[0].password;
                  req.session.user = rows[0];
                  res.json(rows[0]);

              }else{
                // register this email
                console.log("venue was not found For google, need reg");




                  // register
                  /*
                  `INSERT INTO venues (given_name, family_name, date_of_birth, email, username) VALUES (${first}, ?, ?, ?, ?)`;
                   var query = `INSERT INTO users (given_name,family_name,date_of_birth,email,contact_number,gender                      ,COVID_contact,username,password,street_number,street_name,suburb,zip_code,state,receive_email_1,receive_email_2,receive_email_3)
                                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                  */
            req.pool.getConnection( function(err,connection){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }
                  var query = `INSERT INTO venues (given_name, family_name, date_of_birth, email, username) VALUES (${first}, ?, ?, ?, ?)`;
                  connection.query(query,[last,'01/01/1990',email,email],
                                          function(err, rows, fields){
                      connection.release();
                      if(err){
                          console.log(err);
                          res.sendStatus(500);
                          return;
                      }

                      console.log("Register succ!!!! In google!");

                      //delete rows[0].password;
                      //req.session.user = rows[0];
                      req.session.user = []
                      req.session.user.username = email;
                      req.session.user.given_name = first;
                      req.session.user.family_name = last;
                      req.session.user.date_of_birth = '01/01/1990';
                      req.session.user.email = email;
                      req.session.user.contact_number = 'NULL';
                      req.session.user.gender = 'Unknown';


                      res.send();
                    });
            });



              }
          });

     });

});



module.exports = router;

