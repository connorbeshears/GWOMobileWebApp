var url = 'https://goodwill-nw2020.herokuapp.com/'

//Author: Connor Beshears
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
                sessionStorage.setItem("accessKey", JSON.parse(response).accessToken) 
                sessionStorage.setItem("storeId", storeID);
                window.location.href = "./pages/mainSelect.html"
            }
        } else if (xhr.status == 500 || xhr.status == 404) {
            document.getElementById("serviceError").hidden = false;
            document.getElementById("warning").hidden = true;
        }
    }
    xhr.send(data);
}


//Author: Connor Beshears
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


//Author: Joshua Schmitz
function phoneLookUp() {
    //This is our phone number look up call
    console.log("running phone look up")
    var xhr = new XMLHttpRequest();
    var phone = document.getElementById("numLookUp").value
    var turl = url + "customer/by/phone/"+phone;
    xhr.open("GET", turl, true);
    xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("accessKey"));
  
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
                //save customer(s) info to session storage from phone lookup
                sessionStorage.setItem("customerInfo", response)
                sessionStorage.setItem("rewardsNum", loyaltyNumber)
                window.location.href = "customerList.html"
            }
        } else if (xhr.status == 500 || xhr.status == 404) {
            document.getElementById("serviceError").hidden = false;
            document.getElementById("warning").hidden = true;
        }
    }
    xhr.send(data);
}


//Author: Joshua Schmitz
function emailLookUp() {
    // Email lookup call
    var xhr = new XMLHttpRequest();
    var email = document.getElementById("emailLookUp").value;
    var turl = url + "customer/by/email/"+email;
    xhr.open("GET", turl, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("accessKey"));
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
                //save customer(s) info to session storage from email lookup
                sessionStorage.setItem("customerInfo", JSON.parse(response))
                sessionStorage.setItem("rewardsNum", loyaltyNumber)
                window.location.href = "customerList.html"
            }
        } else if (xhr.status == 500 || xhr.status == 404) {
            document.getElementById("serviceError").hidden = false;
            document.getElementById("warning").hidden = true;
        }
    }
}


//Author: Josh Schmitz
// Clears out session storage after orders/logging 
function sessionclear() {
    sessionStorage.clear()
    window.location.href = "../index.html"
}

//Author: Connor Beshears
// Generates the list for the customer display page
function generateCustomerList(){
    var customerData = JSON.parse(sessionStorage.getItem("customerInfo"))
    document.getElementById('custList').innerHTML += '<a href="./itemSelect.html" class="list-group-item list-group-item-action pText p-4 background" >' + customerData.firstName + " " + customerData.lastName + '</a>'
}

function generateItemSelect(){
    document.getElementById("name").innerHTML = JSON.parse(sessionStorage.getItem("customerInfo")).firstName + " " + JSON.parse(sessionStorage.getItem("customerInfo")).lastName
    document.getElementById("rewards").innerHTML = sessionStorage.getItem("rewardsNum")
}

function getPhoneNum(){
    var customerData = JSON.parse(sessionStorage.getItem("customerInfo"))
    return customerData.phone
}

function getAddress(){
    var customerData = JSON.parse(sessionStorage.getItem("customerInfo"))
    return customerData.address.line1 + "<br>" + customerData.address.line2 + "<br>" +
    customerData.address.city + "<br>" + customerData.address.state + "<br>" + customerData.address.zip
}


//Author: Connor Beshears
function sendOrderData(pageToGo){
    console.log("sending order data")
    var xhr = new XMLHttpRequest();
    var turl = url + "customer/transaction";
    xhr.open("POST", turl, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("accessKey"));
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    console.log(today)
    var data = JSON.stringify({
        "loyaltyID": sessionStorage.getItem("rewardsNum"),
        "storeID": sessionStorage.getItem("storeId"),
        "date": String(today),
        "items" : JSON.parse(sessionStorage.getItem("items"))
    });
    console.log(data)
    // Response
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var response = xhr.response
            var tmp = JSON.parse(response)
            console.log(tmp)
            if (tmp.error) {
                console.log("service error");
            } else {
                sessionStorage.setItem("transactionId", JSON.parse(response).transactionID)
                window.location.href = pageToGo;
            }
        } else if (xhr.status == 500 || xhr.status == 404) {
            console.log("service not found")
        }
    }
    xhr.send(data);
}