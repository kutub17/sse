var venue;

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function get_info() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            venue = JSON.parse(this.responseText);
            let welcome = `Welcome ${escapeHTML(venue.username)}`;
            document.getElementById("welcome_venue").textContent = welcome;

            console.log("Current User: " + JSON.stringify(venue));
            document.getElementById("venue_name").value = escapeHTML(venue.username);
            document.getElementById("venue_email").value = escapeHTML(venue.email);
            document.getElementById("venue_given_name").value = escapeHTML(venue.given_name);
            document.getElementById("venue_family_name").value = escapeHTML(venue.family_name);
            document.getElementById("venue_DOF").value = escapeHTML(venue.date_of_birth);
            document.getElementById("venue_contact_number_input").value = escapeHTML(venue.contact_number);
            document.getElementById("venue_genderinput").value = escapeHTML(venue.gender);
        }
    };
    xmlhttp.open("GET", "/venues/load_info", true);
    xmlhttp.send();
}

function pop_up() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    load_history();
}

function x_close() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

window.onclick = function(event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

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
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.location.replace("/login.html");
        } else {
            window.location.replace("/login.html");
        }
    };
    xmlhttp.open("POST", "/venues/logout", true);
    xmlhttp.send();
}

function load_history() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            rows = JSON.parse(this.responseText);
            let history = ``;
            for (let row of rows) {
                history += `<tr>
                                <td>${escapeHTML(row.username)}</td>
                                <td>${escapeHTML(row.date)}</td>
                            </tr>`;
            }
            document.getElementById("history_table").innerHTML = history;
        }
    };
    xmlhttp.open("GET", "/venues/history", true);
    xmlhttp.send();
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
    });
}

function update_acc() {
    let c = {
        uname: document.getElementById("venue_name").value,
        mail: document.getElementById("venue_email").value,
        gname: document.getElementById("venue_given_name").value,
        fname: document.getElementById("venue_family_name").value,
        dobirth: document.getElementById("venue_DOF").value,
        phone: document.getElementById("venue_contact_number_input").value,
        gener_n: document.getElementById("venue_genderinput").value,
        userid: venue.v_id
    };

    console.log("Update C: " + JSON.stringify(c));

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Update successfully!");
        }
    };
    xmlhttp.open("POST", "/venues/update_info", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(c));
}

function goto_map() {
    window.location.replace("/venues/mapPage.html");
}
