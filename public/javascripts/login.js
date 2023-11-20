function login() {

    var user = document.getElementById("user").checked;
    var venue = document.getElementById("venue").checked;
    var admin = document.getElementById("admin").checked;

    if (user && !venue && !admin){
       loginUser();
    }else if (venue && !user && !admin){
       loginVenue();
    }else if (!user && !venue && admin){
       loginAdmin();
    }else{
        alert("Wrong user type");
        window.location.replace("/login.html");
    }

}

function loginAdmin() {

    let admin = {
        username: document.getElementById("email").value,
        password: document.getElementById("psw").value
    };

    if (admin.username == "" || admin.password == ""){
        alert("Wrong login details");
        return;
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            window.location.replace("/admins/main.html");
        }else if (this.readyState == 4 && this.status >= 400) {
            alert("Login failed");
        }
    };
    xmlhttp.open("POST", "/admins/login", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(admin));

}

function loginVenue() {

    let venue = {
        username: document.getElementById("email").value,
        password: document.getElementById("psw").value
    };

    if (venue.username == "" || venue.password == ""){
        alert("Wrong login details");
        return;
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            window.location.replace("/venues/main.html");
        }else if (this.readyState == 4 && this.status >= 400) {
            alert("Login failed");
        }
    };
    xmlhttp.open("POST", "/venues/login", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(venue));

}

function loginUser() {

    let user = {
        username: document.getElementById("email").value,
        password: document.getElementById("psw").value
    };

    if (user.username == "" || user.password == ""){
        alert("Wrong login details");
        return;
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            window.location.replace("/users/main.html");
        }else if (this.readyState == 4 && this.status >= 400) {
            alert("Login failed");
        }
    };
    xmlhttp.open("POST", "/users/login", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(user));

}



function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  /*
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getGivenName());
  console.log('Name: ' + profile.getFamilyName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
*/
  var id_token = {token: googleUser.getAuthResponse().id_token, email:profile.getEmail(), first:profile.getGivenName(), last:profile.getFamilyName() };
  
    var userRadio = document.getElementById('user');
    var venueRadio = document.getElementById('venue');
    var adminRadio = document.getElementById('admin');
    
    var xmlhttp = new XMLHttpRequest();
    if(userRadio.checked == true){


           
            xmlhttp.onreadystatechange = function(){
                
                if (this.readyState == 4 && this.status == 200) {
                    console.log("After login");
                    // logout everytime after it success
                    signOut();
                    window.location.replace("/users/main.html");
                }else if (this.readyState == 4 && this.status >= 400) {
                    alert("Login failed");
                }
            };
            xmlhttp.open("POST", "/users/w", true);
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send(JSON.stringify(id_token));
        }
        
        else if(venueRadio.checked == true){
            
            xmlhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    console.log("After login");
                    // logout everytime after it success
                    signOut();
                    window.location.replace("/privateVenue/main.html");
                }else if (this.readyState == 4 && this.status >= 400) {
                    alert("Login failed");
                }
            };
            xmlhttp.open("POST", "/venues/wVenues", true);
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send(JSON.stringify(id_token));
        }
        

}


  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
