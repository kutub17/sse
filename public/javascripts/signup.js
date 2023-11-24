function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
}


function validateSignupData(data, userType) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const nameRegex = /^[a-zA-Z\s]+$/;
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // DD-MM-YYYY format
    const phoneRegex = /^[0-9]{10,15}$/;
    const numberRegex = /^[0-9]+$/;

    // Common validation (Username, Email, Password)
    if (!data.username || data.username.length < 3) {
        alert("Username must be at least 3 characters long.");
        return false;
    }
    if (!emailRegex.test(data.email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    if (!passwordRegex.test(data.password)) {
        alert("Password must be at least 8 characters long, including uppercase, lowercase, a number, and a special character.");
        return false;
    }

    // User and Venue shared validation
    if (userType === 'user' || userType === 'venue') {
        if (!nameRegex.test(data.given_name) || !nameRegex.test(data.family_name)) {
            alert("Given Name and Family Name should only contain alphabets.");
            return false;
        }
        if (!dateRegex.test(data.date_of_birth)) {
            alert("Invalid Date of Birth format. Expected format: YYYY-MM-DD.");
            return false;
        }
        if (!phoneRegex.test(data.contact_number)) {
            alert("Invalid contact number format.");
            return false;
        }
        if (!numberRegex.test(data.street_number)) {
            alert("Street Number should be numeric.");
            return false;
        }
        if (!data.street_name || !data.suburb || !data.state) {
            alert("Street Name, Suburb, and State are required.");
            return false;
        }
        if (!data.zip_code || !numberRegex.test(data.zip_code)) {
            alert("Zip Code should be numeric.");
            return false;
        }
    }

    // Additional Venue-specific validation
    if (userType === 'venue') {
        if (!data.venue_code) {
            alert("Venue Code is required.");
            return false;
        }
    }

    // Admin-specific validation
    if (userType === 'admin') {
        if (!data.organization) {
            alert("Organization is required for admin.");
            return false;
        }
        if (!data.admin_code) {
            alert("Admin Code is required.");
            return false;
        }
        // Additional admin-specific validations can be added here
    }

    return true;
}



function show(){
    var user = document.getElementById("iuser").checked;
    var venue = document.getElementById("ivenue").checked;
    var admin = document.getElementById("iadmin").checked;

    if (user && !venue && !admin){
        document.getElementById('admin').style.display = "none";
        document.getElementById('venue').style.display = "none";
        document.getElementById('user').style.display = "block";
        document.getElementById('ivenue').checked = false;
        document.getElementById('iadmin').checked = false;
        document.getElementById('iuser').checked = false;
    }else if (venue && !user && !admin){
        document.getElementById('admin').style.display = "none";
        document.getElementById('user').style.display = "none";
        document.getElementById('venue').style.display = "block";
        document.getElementById('iuser').checked = false;
        document.getElementById('ivenue').checked = false;
        document.getElementById('iadmin').checked = false;
    }else if (!user && !venue && admin){
        document.getElementById('venue').style.display = "none";
        document.getElementById('user').style.display = "none";
        document.getElementById('admin').style.display = "block";
        document.getElementById('ivenue').checked = false;
        document.getElementById('iuser').checked = false;
        document.getElementById('iadmin').checked = false;
    }
}

function signup(){

    if (document.getElementById("user").style.display == "block"){
       signupUser();
    }else if (document.getElementById("venue").style.display == "block"){
       signupVenue();
    }else if (document.getElementById("admin").style.display == "block"){
       signupAdmin();
    }else{
        alert("Wrong user type");
        window.location.replace("/mockSignup.html");
    }
}

function signupUser() {

    var email1;
    var email2;
    var email3;

    if(document.getElementById("email1").value){
        email1 =1;
    }else{
        email1 =0;
    }
    if(document.getElementById("email2").value){
        email2 =1;
    }else{
        email2 =0;
    }
    if(document.getElementById("email3").value){
        email3 =1;
    }else{
        email3 =0;
    }

    let user = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("psw").value,
        given_name: document.getElementById("given_name").value,
        family_name: document.getElementById("family_name").value,
        date_of_birth: document.getElementById("DOF").value,
        receive_email_1: email1,
        receive_email_2: email2,
        receive_email_3: email3,
        contact_number: document.getElementById("contact_number").value,
        gender: document.getElementById("gender").value,
        street_number: document.getElementById("street_number").value,
        street_name: document.getElementById("street_name").value,
        suburb: document.getElementById("suburb").value,
        zip_code: document.getElementById("zip_code").value,
        state: document.getElementById("state").value
    };

    if (!validateSignupData(user,'user')) {
        return;
    }

    user.password = hashPassword(user.password);


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            alert("User successfully created");
            window.location.replace("/login.html");
        }else if (this.readyState == 4 && this.status >= 400) {
            alert("Signup failed");
        }
    };
    xmlhttp.open("POST", "/users/signup", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(user));

}

function signupVenue() {
    var email1;
    var email2;
    var email3;
    if(document.getElementById("venue_email1").value){
        email1 =1;
    }else{
        email1 =0;
    }
    if(document.getElementById("venue_email2").value){
        email2 =1;
    }else{
        email2 =0;
    }
    if(document.getElementById("venue_email3").value){
        email3 =1;
    }else{
        email3 =0;
    }

    let venue = {
        username: document.getElementById("venue_username").value,
        email: document.getElementById("venue_email").value,
        password: document.getElementById("venue_psw").value,
        given_name: document.getElementById("venue_given_name").value,
        family_name: document.getElementById("venue_family_name").value,
        date_of_birth: document.getElementById("venue_DOF").value,
        contact_number: document.getElementById("venue_contact_number").value,
        gender: document.getElementById("venue_gender").value,
        receive_email_1: email1,
        receive_email_2: email2,
        receive_email_3: email3,
        street_number: document.getElementById("venue_street_number").value,
        street_name: document.getElementById("venue_street_name").value,
        suburb: document.getElementById("venue_suburb").value,
        zip_code: document.getElementById("venue_zip_code").value,
        state: document.getElementById("venue_state").value,
        venue_code: document.getElementById("venue_code").value
    };
   
    if (!validateSignupData(venue,'venue')) {
        return;
    }
    venue.password = hashPassword(venue.password);


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            alert("Venue Owner successfully created");
            window.location.replace("/login.html");
        }else if (this.readyState == 4 && this.status >= 400) {
            alert("Signup failed");
        }

    };
    xmlhttp.open("POST", "/venues/signup", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(venue));

}

function signupAdmin() {

    let admin = {
        username: document.getElementById("admin_username").value,
        email: document.getElementById("admin_email").value,
        password: document.getElementById("admin_psw").value,
        organization: document.getElementById("organization").value,
        admin_code: document.getElementById("admin_code").value

    };
    if (!validateSignupData(admin,'admin')) {
        return;
    }
    admin.password = hashPassword(admin.password);


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            alert("Admin successfully created");
            window.location.replace("/login.html");
        }else if (this.readyState == 4 && this.status >= 400) {
            alert("Signup failed");
        }
    };
    xmlhttp.open("POST", "/admins/signup", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(admin));
}