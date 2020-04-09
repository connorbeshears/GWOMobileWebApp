var url = 'https://goodwill-nw2020.herokuapp.com/'

//NOTE: If this function is not called, no other function on the website will work.
//      The backend SHOULD return an unauthorized call if this hasn't been run
function login() {
    console.log("running login")
    //This is our login call and where we get our auth token
    var xhr = new XMLHttpRequest();
    var turl = url + "employee/login";
    xhr.open("POST", turl, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value
    var storeID = document.getElementById("storeNum").value
    var data = JSON.stringify({
        "employeeID": username,
        //"storeID" : storeID,            This will be uncommented when backend is ready
        "password": password
    });

    // This handles the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var response = xhr.response
            var tmp = JSON.parse(response)
            console.log(tmp)
            if (tmp.error) {
                document.getElementById("serviceError").hidden = true;
                document.getElementById("warning").hidden = false;
            } else {
                sessionStorage.setItem("accessKey", JSON.parse(response).accessToken) // Need to change this to be more secure
                window.location.href = "./pages/mainSelect.html"
            }
        } else if (xhr.status == 500 || xhr.status == 404) {
            document.getElementById("serviceError").hidden = false;
            document.getElementById("warning").hidden = true;
        }
    }
    xhr.send(data);
}



function lookupManualLoyalty() {
    var xhr = new XMLHttpRequest();
    var loyaltyNumber = document.getElementById("loyaltyNum").value
    var turl = url + "customer/" + loyaltyNumber + "/info";
    xhr.open("GET", turl, true);
    xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("accessKey"));
    // This handles the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var response = xhr.response
            var tmp = JSON.parse(response)
            if (tmp.error) {
                console.log(tmp)
                console.log("Bad fetch")
                document.getElementById("serviceError").hidden = true;
                document.getElementById("warning").hidden = false;
            } else {
                //save customer(s) info to session storage
                sessionStorage.setItem("customerInfo", response)
                sessionStorage.setItem("rewardsNum", loyaltyNumber)
                window.location.href = "customerList.html"
            }
        }
    }
    xhr.send();
}



function phoneLookUp() {
    //This is our phone number look up call
    console.log("running phone look up")
    var xhr = new XMLHttpRequest();
    var turl = url + "customer/by/phone/"+phone;
    xhr.open("GET", turl, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var phone = document.getElementById("numLookUp").value
    var data = JSON.stringify({
        "accessKey": JSON.parse(sessionStorage.getItem("accessKey")).accessKey,
        "phone": phone
    });

    // This handles the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            response = xhr.responseText;
            var response = xhr.response
            var tmp = JSON.parse(response)
            console.log(tmp)
            if (tmp.error) {
                console.log("Bad fetch")
                document.getElementById("serviceError").hidden = true;
                document.getElementById("warning").hidden = false;
            } else {
                // return all customers under phone number
                sessionStorage.setItem("customerInfo", response) // get this by sessionStorage.getItem("customerInfo")
                window.location.href = "./pages/mainSelect.html"
            }
        } else if (xhr.status == 500 || xhr.status == 404) {
            document.getElementById("serviceError").hidden = false;
            document.getElementById("warning").hidden = true;
        }
    }
    xhr.send(data);
}



function emailLookUp() {
    // Email lookup call
    var xhr = new XMLHttpRequest();
    var email = document.getElementById("emailLookUp").value;
    var turl = url + "customer/by/email/"+email;
    xhr.open("GET", turl, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var data = JSON.stringify({
        "accessKey": JSON.parse(sessionStorage.getItem("accessKey")).accessKey,
        "email": email
    });

    // Response
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            response = xhr.responseText;
            var response = xhr.response
            var tmp = JSON.parse(response)
            console.log(tmp)
            if (tmp.error) {
                console.log("Bad fetch")
            } else {
                // Return customers under email
                sessionStorage.setItem("customerInfo", response) // get this by sessionStorage.getItem("customerInfo")
                window.location.href = "./pages/mainSelect.html"
            }
        } else if (xhr.status == 500 || xhr.status == 404) {
            document.getElementById("serviceError").hidden = false;
            document.getElementById("warning").hidden = true;
        }
    }
}



function sessionclear() {
    sessionStorage.clear

}

// Generates the list for the customer display page
function generateCustomerList(){
    var customerData = JSON.parse(sessionStorage.getItem("customerInfo"))
    document.getElementById('custList').innerHTML += '<a href="./itemSelect.html" class="list-group-item list-group-item-action p-4 background" >' + customerData.firstName + " " + customerData.lastName + '</a>'
}

function generateItemSelect(){
    document.getElementById("name").innerHTML = JSON.parse(sessionStorage.getItem("customerInfo")).firstName + " " + JSON.parse(sessionStorage.getItem("customerInfo")).lastName
    document.getElementById("rewards").innerHTML = sessionStorage.getItem("rewardsNum")
}
