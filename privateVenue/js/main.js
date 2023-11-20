var venue;
function get_info(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            venue = JSON.parse(this.responseText);
            let welcome=``;

            welcome = `Welcome ${venue.username}`;

            document.getElementById("welcome_venue").innerHTML=welcome;

            console.log("Current User: " + JSON.stringify(venue));
            // set the user info to modal
            //document.getElementById("venue_user_name").value = venue.username;
            document.getElementById("venue_name").value = venue.username;
            document.getElementById("venue_email").value = venue.email;

            document.getElementById("venue_given_name").value = venue.given_name;
            document.getElementById("venue_family_name").value = venue.family_name;
            document.getElementById("venue_DOF").value = venue.date_of_birth;
            document.getElementById("venue_contact_number_input").value = venue.contact_number;
            document.getElementById("venue_genderinput").value = venue.gender;
        }

    };
    xmlhttp.open("GET", "/venues/load_info", true);
    xmlhttp.send();
}


// When the user clicks the button, open the modal
function pop_up() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    load_history();
}

// When the user clicks on <span> (x), close the modal
function x_close() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    var modal = document.getElementById("myModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};


// When the user clicks the button, open the modal
function pop_up_Account() {
    var modal = document.getElementById("myModal_venue_account");
    modal.style.display = "block";
}

function x_close_Account() {
    var modal = document.getElementById("myModal_venue_account");
    modal.style.display = "none";
}

function logout() {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            window.location.replace("/login.html");
        } else{
            window.location.replace("/login.html");
        }
    };
    xmlhttp.open("POST", "/venues/logout", true);
    xmlhttp.send();

}

function load_history(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            rows = JSON.parse(this.responseText);
            let history=``;

            for(let row of rows){
                history = history + `<tr>
                                <td>${row.username}</td>
                                <td>${row.date}</td>
                                </tr>`;
            }
            document.getElementById("history_table").innerHTML=history;
        }

    };
    xmlhttp.open("GET", "/venues/history", true);
    xmlhttp.send();
}

//log out google acc
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

//update account
function update_acc(){

    let c = {
        uname: document.getElementById("venue_name").value,
        mail: document.getElementById("venue_email").value,

        gname: document.getElementById("venue_given_name").value,
        fname: document.getElementById("venue_family_name").value,
        dobirth:document.getElementById("venue_DOF").value,
        phone: document.getElementById("venue_contact_number_input").value,
        gener_n: document.getElementById("venue_genderinput").value,
        userid: venue.v_id
    };

    console.log("Update C: " + JSON.stringify(c));

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            alert("Update successfully!");
        }
    };
    xmlhttp.open("POST", "/venues/update_info", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(c));
}

function goto_map(){
    window.location.replace("/venues/mapPage.html");
}