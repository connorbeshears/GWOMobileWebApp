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
                sessionStorage.setItem("accessKey", JSON.parse(response).accessKey) // get this by sessionStorage.getItem("accessKey")
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
    var aK = sessionStorage.getItem("accessKey")
    var turl = url + "customer/" + loyaltyNumber + "/info";
    xhr.open("GET", turl, true);
    xhr.setRequestHeader("Authorization", sessionStorage.getItem("accessKey"));
    // This handles the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var response = xhr.response
            var tmp = JSON.parse(response)
            if (tmp.error) {
                console.log(tmp)
                console.log("Bad fetch")
            } else {
                console.log(JSON.parse(response))
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



function printByIndexes(orders, indexes, itemType) {
    for (var i = 0; i < indexes.length; i++) { // for each item in {type}list
        if (i === 0) { // print item type once per set of items
            document.getElementById('confirmList').innerHTML += '<h2>' + itemType + '</h2>';
        }

        var order = orders[indexes[i]] // find specific order
        if (order.unit === "box") {
            unit = "Boxes";
        }
        if (order.unit === "bag") {
            unit = "Bags";
        }
        if (order.unit === "each") {
            unit = "Each";
        }
        document.getElementById('confirmList').innerHTML += '<p>' + unit + ': ' + order.quantity + '</p>';
        if (i === (indexes.length - 1)) { // print description at end, if there is one
            if (JSON.stringify(order.description).length !== 2) {
                document.getElementById('confirmList').innerHTML += '<p> Description: ' + order.description + '</p>';
                // concatenate for description variable
                description = description + order.description + ". ";
            }
        }
    }
}



function printRow(orders, indexes, itemType) {
    for (var i = 0; i < indexes.length; i++) { // for each item in {type}list
        var order = orders[indexes[i]] // find specific order
        if (order.unit === "box") {
            unit = "Boxes";
        }
        if (order.unit === "bag") {
            unit = "Bags";
        }
        if (order.unit === "each") {
            unit = "Each";
        }

        document.getElementById('table').innerHTML +=
            "<tr>" +
            "<td class=\"col-md-9\"><em>" + itemType + "</em></td>" +
            "<td class=\"col-md-9\"><em>" + unit + "</em></td>" +
            "<td class=\"col-md-1\" style=\"text-align: center\">" + order.quantity + "</td>" +
            "</tr>";
    }
}



function printInfo(orders, clothesIndexes, furnitureIndexes, waresIndexes, miscellaneousIndexes) {
    var itemType;
    // print info in order, categorized by itemType
    itemType = "Clothes";
    printByIndexes(orders, clothesIndexes, itemType);
    itemType = "Furniture";
    printByIndexes(orders, furnitureIndexes, itemType);
    itemType = "Wares";
    printByIndexes(orders, waresIndexes, itemType);
    itemType = "Miscellaneous";
    printByIndexes(orders, miscellaneousIndexes, itemType);
}



function printInfoRow(orders, clothesIndexes, furnitureIndexes, waresIndexes, miscellaneousIndexes) {
    var itemType;
    // print info in order, categorized by itemType, printing by row
    itemType = "Clothes";
    printRow(orders, clothesIndexes, itemType);
    itemType = "Furniture";
    printRow(orders, furnitureIndexes, itemType);
    itemType = "Wares";
    printRow(orders, waresIndexes, itemType);
    itemType = "Miscellaneous";
    printRow(orders, miscellaneousIndexes, itemType);
}



function printOrders(parsedItems, clothesIndexes, furnitureIndexes, waresIndexes, miscellaneousIndexes) {
    for (var i = 0; i < JSON.parse(sessionStorage.getItem('items')).length; i++) {
        var order = JSON.parse(sessionStorage.getItem('items'))[i];
        parsedItems.push(order); // add parsed order to list
        if (order['itemType'] === 'clothes') { // categorize by itemType for printing
            clothesIndexes.push(i);
        } else if (order['itemType'] === 'furniture') {
            furnitureIndexes.push(i);
        } else if (order['itemType'] === 'wares') {
            waresIndexes.push(i);
        } else if (order['itemType'] === 'miscellaneous') {
            miscellaneousIndexes.push(i);
        }
    }
    // for each order in the sessionStorage orderlist, print the info about that order
    printInfo(parsedItems, clothesIndexes, furnitureIndexes, waresIndexes, miscellaneousIndexes);
}



function printRows(parsedItems, clothesIndexes, furnitureIndexes, waresIndexes, miscellaneousIndexes){
    var total = 0;
    // for each order in the sessionStorage orderlist, categorize it for printing
    for (var i = 0; i < JSON.parse(sessionStorage.getItem('items')).length; i++) {
        var order = JSON.parse(sessionStorage.getItem('items'))[i];
        parsedItems.push(order); // add parsed order to list
        if (order['itemType'] === 'clothes') { // categorize by itemType for printing
            clothesIndexes.push(i);
        } else if (order['itemType'] === 'furniture') {
            furnitureIndexes.push(i);
        } else if (order['itemType'] === 'wares') {
            waresIndexes.push(i);
        } else if (order['itemType'] === 'miscellaneous') {
            miscellaneousIndexes.push(i);
        }
        total += order.quantity;
    }
    // add a row for each item donated
    printInfoRow(parsedItems, clothesIndexes, furnitureIndexes, waresIndexes, miscellaneousIndexes);
    document.getElementById("total").innerHTML += total + " items donated";
}



function getTotalItems(){

}

function getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }
    var today = dd + mm + yyyy;
}



function subtract(id) {
    if (id === "box") {
        if (boxCount > 0) {
            boxCount -= 1;
            document.getElementById("box").innerHTML = "Boxes: " + boxCount;
        }
    }
    if (id === "bag") {
        if (bagCount > 0) {
            bagCount -= 1;
            document.getElementById("bag").innerHTML = "Bags: " + bagCount;
        }
    }
    if (id === "each") {
        if (eachCount > 0) {
            eachCount -= 1;
            document.getElementById("each").innerHTML = "Each: " + eachCount;
        }
    }
}



function add(id) {
    if (id === "box") {
        boxCount += 1;
        document.getElementById("box").innerHTML = "Boxes: " + boxCount;
    }
    if (id === "bag") {
        bagCount += 1;
        document.getElementById("bag").innerHTML = "Bags: " + bagCount;
    }
    if (id === "each") {
        eachCount += 1;
        document.getElementById("each").innerHTML = "Each: " + eachCount;
    }
}



function createOrder(unit, quantity) { // on submit, multiple times if multiple units increased
    var newOrder = new Object();
    newOrder.itemType = sessionStorage.getItem("itemType"); // from previous page
    newOrder.unit = unit;
    newOrder.quantity = quantity;
    newOrder.description = document.getElementById("description").value;

    if (sessionStorage.items) { // if orders list exists, parse it
        orders = JSON.parse(sessionStorage.getItem('items'));
    } else {
        orders = []; // if orders list doesn't exist, create it
    }
    orders.push(newOrder); // push new order to list
    sessionStorage.setItem('items', JSON.stringify(orders)); // reset new list in sessionstorage
}



function submitOrders() {
    // find which orders to submit based on units
    if (boxCount > 0) {
        createOrder('box', boxCount);
    }
    if (bagCount > 0) {
        createOrder('bag', bagCount);
    }
    if (eachCount > 0) {
        createOrder('each', eachCount);
    }
}