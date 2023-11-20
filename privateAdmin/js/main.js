var users=[];
var venues=[];




// When the user clicks the button, open the modal
function pop_up() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    get_users();
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

/* When the user clicks on the drop down button,
toggle between hiding and showing the dropdown content */
function choose_user() {
    get_users();
    let user_list =``;
    let i = 1;
    for(let user of users){
        user_list = user_list + `<a onclick="show_user_checkins(${i})">User ${i}: ${user.username}</a>
                                `;
                                i++;
    }
    document.getElementById("myDropdown").innerHTML=user_list;
    document.getElementById("myDropdown").classList.toggle("show");
}

function show_user_checkins(){
    user_covid_contact(arguments[0]);
    var number = arguments[0];

    var the_number = {
        number: number.toString()
    };

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            rows = JSON.parse(this.responseText);
            console.log(rows);
            let table = ``;
            for(let row of rows){
                table = table +`<tr>
                                <td>${row.username}</td>
                                <td>${row.date}</td>
                                </tr>`;
            }
            document.getElementById("user_checkin_table").innerHTML=table;
        }
    };
    xmlhttp.open("POST", "/admins/show_user_checkins", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(the_number));
}

function user_covid_contact(){

    var number = arguments[0];

    var the_number = {
        number: number.toString()
    };
    let covid_contact = ``;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            rows = JSON.parse(this.responseText);
            if(!rows[0].COVID_contact || rows[0].COVID_contact=="0"){
                covid_contact = `<h3>User ${number} Covid Contact FALSE</h3><a onclick="on_user_covid_contact(${number})">Turn Covid Contact ON</a>`;
            }else if(rows[0].COVID_contact=="1"){
                covid_contact = `<h3>User ${number} Covid Contact TRUE</h3><a onclick="off_user_covid_contact(${number})">Turn Covid Contact OFF</a>`;
            }
            document.getElementById("covid_contact").innerHTML=covid_contact;
        }
    };
    xmlhttp.open("POST", "/admins/user_covid_contact", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(the_number));
}

function on_user_covid_contact(){
    var number = arguments[0];

    var the_number = {
        number: number.toString()
    };
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            rows = JSON.parse(this.responseText);
            user_covid_contact(number);
        }
    };
    xmlhttp.open("POST", "/admins/on_user_covid_contact", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(the_number));
}

function off_user_covid_contact(){
    var number = arguments[0];

    var the_number = {
        number: number.toString()
    };
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            rows = JSON.parse(this.responseText);
            user_covid_contact(number);
        }
    };
    xmlhttp.open("POST", "/admins/off_user_covid_contact", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(the_number));
}

function get_users(){

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            rows = JSON.parse(this.responseText);
            users=rows;
        }
    };
    xmlhttp.open("GET", "/admins/get_users", true);
    xmlhttp.send();

}

// When the user clicks the button, open the modal
function pop_up_venue() {
    var modal = document.getElementById("myModal_venue");
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
function x_close_venue() {
    var modal = document.getElementById("myModal_venue");
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    var modal = document.getElementById("myModal_venue");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

/* When the user clicks on the drop down button,
toggle between hiding and showing the dropdown content */
function choose_venue() {
    get_venues();
    let venue_list =``;
    let i = 1;
    for(let venue of venues){
        venue_list = venue_list + `<a onclick="show_venue_checkins(${i})">Venue ${i}: ${venue.username}</a>
                                `;
                                i++;
    }
    document.getElementById("myDropdown_venue").innerHTML=venue_list;
    document.getElementById("myDropdown_venue").classList.toggle("show");
}

function show_venue_checkins(){
    venue_covid_contact(arguments[0]);
    var number = arguments[0];

    var the_number = {
        number: number.toString()
    };

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            rows = JSON.parse(this.responseText);
            console.log(rows);
            let table = ``;
            for(let row of rows){
                table = table +`<tr>
                                <td>${row.username}</td>
                                <td>${row.date}</td>
                                </tr>`;
            }
            document.getElementById("venue_checkin_table").innerHTML=table;
        }
    };
    xmlhttp.open("POST", "/admins/show_venue_checkins", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(the_number));
}

function venue_covid_contact(){

    var number = arguments[0];

    var the_number = {
        number: number.toString()
    };
    let covid_contact = ``;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            rows = JSON.parse(this.responseText);
            if(!rows[0].COVID_contact || rows[0].COVID_contact=="0"){
                covid_contact = `<h3>Venue ${number} Covid Contact FALSE</h3><a onclick="on_venue_covid_contact(${number})">Turn Covid Contact ON</a>`;
            }else if(rows[0].COVID_contact=="1"){
                covid_contact = `<h3>Venue ${number} Covid Contact TRUE</h3><a onclick="off_venue_covid_contact(${number})">Turn Covid Contact OFF</a>`;
            }
            document.getElementById("covid_contact_venue").innerHTML=covid_contact;
        }
    };
    xmlhttp.open("POST", "/admins/venue_covid_contact", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(the_number));
}

function on_venue_covid_contact(){
    var number = arguments[0];

    var the_number = {
        number: number.toString()
    };
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            rows = JSON.parse(this.responseText);
            venue_covid_contact(number);
        }
    };
    xmlhttp.open("POST", "/admins/on_venue_covid_contact", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(the_number));
}

function off_venue_covid_contact(){
    var number = arguments[0];

    var the_number = {
        number: number.toString()
    };
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            rows = JSON.parse(this.responseText);
            venue_covid_contact(number);
        }
    };
    xmlhttp.open("POST", "/admins/off_venue_covid_contact", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(the_number));
}

function get_venues(){

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            rows = JSON.parse(this.responseText);
            venues=rows;
        }
    };
    xmlhttp.open("GET", "/admins/get_venues", true);
    xmlhttp.send();

}

// When the user clicks the button, open the modal
function pop_up_code() {
    var modal = document.getElementById("myModal_code");
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
function x_close_code() {
    var modal = document.getElementById("myModal_code");
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    var modal = document.getElementById("myModal_code");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function logout() {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            window.location.replace("/login.html");
        } else{
            window.location.replace("/login.html");
        }
    };
    xmlhttp.open("POST", "/admins/logout", true);
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
    xmlhttp.open("GET", "/users/history", true);
    xmlhttp.send();
}

function new_code(){
    let code = {
        admin_code: document.getElementById("admin_code").value
    };

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            window.location.replace("/admins/main.html");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Code creation failed");
            window.location.replace("/admins/main.html");
        }
    };
    xmlhttp.open("POST", "/admins/create_code", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(code));
}

function send_email(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            alert("Emails Sent Successfully!");
        }
    };
    xmlhttp.open("POST", "/admins/sendmail", true);
    xmlhttp.send();
}

function goto_map(){
    window.location.replace("/admins/mapPage.html");
}