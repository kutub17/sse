// When the user clicks the button, open the modal
function pop_up() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
function x_close() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    var modal = document.getElementById("myModal");
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
    xmlhttp.open("POST", "/users/logout", true);
    xmlhttp.send();

}


