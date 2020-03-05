//NOTE: If this function is not called, no other function on the website will work.
//      The backend SHOULD return an unauthorized call if this hasn't been run
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
            var tmp = JSON.parse(response)
            console.log(tmp.error)
            if(tmp.error){
                document.getElementById("warning").hidden = false; 
            } else {
                sessionStorage.setItem("accessKey", response) // get this by sessionStorage.getItem("accessKey")
                window.location.href = "./pages/mainSelect.html"
            }
        }
    }
    xhr.send(data);
}



function lookupManualLoyalty(){
    var xhr = new XMLHttpRequest();
    var url = "https://goodwillomaha-nw2020.azurewebsites.net/employee/login";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var loyaltyNumber = document.getElementById("loyaltyNum").value
    var data = JSON.stringify({ 
        "accessKey" : JSON.parse(sessionStorage.getItem("accessKey")).accessKey,
        "loyaltyID" : loyaltyNumber
    });

    // This handles the response
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            response = xhr.responseText;
            var response = xhr.response
            var tmp = JSON.parse(response)
            console.log(tmp)
            if(tmp.error){
                console.log("Bad fetch")
            } else {
                // TODO: get data ready for customer list 
                // Will need to do some data handling here to move to the customer list
                // Maybe make this a uniform function for all the look ups? 
            }
        }
    }
    xhr.send(data);
}

function phoneLookUp() {

    //This is our phone number look up call
    var xhr = new XMLHttpRequest();
    var url = "https://goodwillomaha-nw2020.azurewebsites.net/user/info/phone";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var phone = document.getElementById("numLookUp").value;
    var data = JSON.stringify({ 
       //  "employeeID" : username,
       //  //"storeID" : storeID,            This will be uncommented when backend is ready
       
        "phone" : phone
    });
}

function emailLookUp() {
    // Email lookup call
    var xhr = new XMLHttpRequest();
    var url = "https://goodwillomaha-nw2020.azurewebsites.net/user/info/email";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var email = document.getElementById("emailLookUp").value;
    var data = JSON.stringify({
        // "employeeID": username,
        // "storeID": storeID,
        "email": email
    });
}

function sessionclear() {
   sessionStorage.clear
}