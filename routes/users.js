var express = require('express');
var router = express.Router();
const { logger } = require('../app');

//google clientid
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '393986609657-pp1fij7hs9g11eh402aj96ndnp5t1bao.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

//var passport = require('passport');
//github clientid
var GITHUB_CLIENT_ID = "0e8abbf2f422e989a5f3";
var GITHUB_CLIENT_SECRET = "e964dc8b4029ad6a994bd33408222f9cc802d27d";


const bcrypt = require('bcrypt');
const saltRounds =10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  if ('given_name' in req.body &&
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
      'state' in req.body) {
      
      console.log(req.body.password)
      bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
          if (err) {
              console.log(err);
              res.sendStatus(500);
              return;
          }
          req.pool.getConnection(function(err, connection) {
              if(err) {
                  console.log(err);
                  res.sendStatus(500);
                  return;
              }
              var query = `INSERT INTO users (given_name, family_name, date_of_birth, email, contact_number, gender, COVID_contact, username, password, street_number, street_name, suburb, zip_code, state, receive_email_1, receive_email_2, receive_email_3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
              connection.query(query, [req.body.given_name, req.body.family_name, req.body.date_of_birth, req.body.email, req.body.contact_number, req.body.gender, 0, req.body.username, hash, req.body.street_number, req.body.street_name, req.body.suburb, req.body.zip_code, req.body.state, req.body.receive_email_1, req.body.receive_email_2, req.body.receive_email_3], function(err, rows, fields) {
                  connection.release();
                  if(err) {
                      console.log(err);
                      res.sendStatus(500);
                      return;
                  }
                  res.send();
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
          if(err) {
              console.log(err);
              res.sendStatus(500);
              return;
          }
          var query = `SELECT * FROM users WHERE email=?`;
          connection.query(query, [req.body.username], async function(err, rows, fields) {
              connection.release();
              if(err) {
                  console.log(err);
                  res.sendStatus(500);
                  return;
              }
              if (rows.length > 0) {
                  let valid = await bcrypt.compare(req.body.password, rows[0].password);
                  if (valid) {
                    logger.info("Successfully logged in");
                      delete rows[0].password;
                      req.session.user = rows[0];
                      res.json(rows[0]);
                  } else {
                      logger.info("Wrong login details");
                      return res.sendStatus(401);
                  }
              } else {
                  console.log("User was not found");
                  res.sendStatus(401);
              }
          });
      });
  }
});

router.post('/w',function(req, res, next) {

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
            var query = `SELECT * FROM users WHERE email=?`;
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
                console.log("User was not found For google, need reg");




                  // register
                  /*
                   var query = `INSERT INTO users (given_name,family_name,date_of_birth,email,contact_number,gender                      ,COVID_contact,username,password,street_number,street_name,suburb,zip_code,state,receive_email_1,receive_email_2,receive_email_3)
                                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                  */
            req.pool.getConnection( function(err,connection){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }
                  var query = `INSERT INTO users (given_name,family_name,date_of_birth,email,contact_number,gender,username) VALUES ('${first}',?,?,?,?,?,?)`;
                  connection.query(query,[last,'01/01/1990',email,'110','Unknown',email],
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

router.use(function(req, res, next) {
  if ('user' in req.session){
    next();
  }else{
    res.sendStatus(401);
  }
});

router.post('/logout', function(req, res, next) {
  delete req.session.user;
  res.send();
});

router.post('/checkin', function(req, res, next) {
  var code = req.body.code;

  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = `INSERT INTO check_in (u_id,v_id,date) VALUES (?,(SELECT v_id FROM venues WHERE venue_code=?),now())`;
    connection.query(query,[req.session.user.u_id,code],function(er, rows, fields){
        connection.release();
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }
        res.send();
    });
});
  res.send();
});

router.get('/history', function(req, res, next) {
  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = `SELECT venues.username, check_in.date FROM venues INNER JOIN check_in ON venues.v_id = check_in.v_id WHERE check_in.u_id = ? `;
    connection.query(query,[req.session.user.u_id],function(er, rows, fields){
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

router.get('/load_info', function(req, res, next) {
  res.send(req.session.user);
});



router.post('/update_info', function(req, res, next) {
  var user = req.body;

  console.log("In Server: " + user.userid);

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
    UPDATE users
  SET username = ?, email = ?, given_name = ?, family_name = ?, date_of_birth = ?, contact_number = ?, gender = ?
  WHERE u_id = ?
`;

    connection.query(query,[user.uname,user.mail,user.gname,user.fname,user.dobirth,user.phone,user.gener_n,user.userid],function(er, rows, fields){
        connection.release();
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }

        // update success
         //console.log("HAHAHAHAHAH");
         // update session
        req.session.user.username = user.uname;
        req.session.user.given_name = user.gname;
        req.session.user.family_name = user.fname;
        req.session.user.date_of_birth = user.dobirth;
        req.session.user.email = user.mail;
        req.session.user.contact_number = user.phone;
        req.session.user.gender = user.gener_n;

        res.send();
    });
});

});

/*
// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "https://MY_CS50_URL/githubsignin/callback"
},
function(accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {

    // To keep the example simple, the user's GitHub profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the GitHub account with a user record in your database,
    // and return that user instead.
    return done(null, profile);
  });
}
));

*/


router.get('/mapPage', function(req, res, next) { //template get request to receive info about venue
  req.pool.getConnection( function(err,connection){
    if(err){
        console.log(err);
        res.sendStatus(500);
        return;
    }

    var query = `SELECT longitude, latitude, venue_name, COVID_contact FROM venues`;
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

module.exports = router;

