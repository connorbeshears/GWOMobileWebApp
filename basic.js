function login(){
    //This is our login call and where we get our auth token
    var xhr = new XMLHttpRequest();
    var url = "https://goodwillomaha-nw2020.azurewebsites.net/employee/login";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value
    var storeID = document.getElementById("storeNum").value
    var data = JSON.stringify({ 
        "employeeID" : username,
        //"storeID" : storeID,            This will be uncommented when backend is ready
        "password" : password
    });

    // This handles the response
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            response = xhr.responseText;
            var response = xhr.response
            sessionStorage.setItem("header", response) // get this by sessionStorage.getItem("header")
            window.location.href = "./pages/mainSelect.html"
        }
    }
    xhr.send(data);


}