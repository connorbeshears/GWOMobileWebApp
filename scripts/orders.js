// Author: Brianne

// JSON format of orders to send to back end:
//         {
//             "date": string,  <-- stored in sessionStorage.getItem("date")
//                 "items": [   <-- sessionStorage.getItem("items")
//                     {
//                         "itemType": string,  <-- JSON.parse(sessionStorage.getItem('items'))[i].itemType
//                         "unit": string,      <-- JSON.parse(sessionStorage.getItem('items'))[i].unit
//                         "quantity": int      <-- JSON.parse(sessionStorage.getItem('items'))[i].quantity
//                     }
//                 ]
//             "description": string    <-- sessionStorage.getItem("description")
//         }


// functions for processing orders and displaying info
// printByIndexes takes the orders list, indexes list, and itemtype string, prints info related to that itemtype
function printByIndexes(orders, indexes, itemType) {
    for (var i = 0; i < indexes.length; i++) { // for each item in {type}list
        if (i === 0) { // print item type once per set of items
            document.getElementById('confirmList').innerHTML += '<h2>' + itemType + '</h2>';
        }
        var order = orders[indexes[i]] // find specific order
        // determine unit type
        if (order.unit === "box") {
            unit = "Boxes";
        }
        if (order.unit === "bag") {
            unit = "Bags";
        }
        if (order.unit === "each") {
            unit = "Each";
        }
        // print unit:quantity
        document.getElementById('confirmList').innerHTML += '<p class="pText">' + unit + ': ' + order.quantity + '</p>';
        if (i === (indexes.length - 1)) { // print description at end, if there is one
            if (JSON.stringify(order.description).length !== 2) {
                document.getElementById('confirmList').innerHTML += '<p class="pText"> Description: ' + order.description + '</p>';
                // concatenate for description variable
                description = description + order.description + ". ";
            }
        }
    }
}


// printRow takes order list, indexes list, and itemtype string, and prints info in rows for the receipt summary
function printRow(orders, indexes, itemType) {
    for (var i = 0; i < indexes.length; i++) { // for each item in {type}list
        var order = orders[indexes[i]] // find specific order
        // determine unit
        if (order.unit === "box") {
            unit = "Boxes";
        }
        if (order.unit === "bag") {
            unit = "Bags";
        }
        if (order.unit === "each") {
            unit = "Each";
        }
        // print itemtype, unit, and quantity
        document.getElementById('table').innerHTML +=
            "<tr>" +
            "<td class=\"col-md-9\"><em>" + itemType + "</em></td>" +
            "<td class=\"col-md-9\"><em>" + unit + "</em></td>" +
            "<td class=\"col-md-1\" style=\"text-align: center\">" + order.quantity + "</td>" +
            "</tr>";
    }
}


// printInfo takes the order list, and 4 lists of indexes (one for each itemtype) and prints info for each itemtype
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


// printInfoRow is the same as printInfo but prints rows for the receipt summary instead of confirmation page format
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


// printOrders takes the parsed order list and lists for each itemtype, separates orders by item type, then prints by itemtype
function printOrders(parsedItems, clothesIndexes, furnitureIndexes, waresIndexes, miscellaneousIndexes) {
    for (var i = 0; i < JSON.parse(sessionStorage.getItem('items')).length; i++) {
        var order = JSON.parse(sessionStorage.getItem('items'))[i];
        parsedItems.push(order); // add parsed order to list
        if (order['itemType'] === 'Clothing') { // categorize by itemType for printing
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


// printRows is the same as printOrders except it gathers the info to print the receipt summary table
function printRows(parsedItems, clothesIndexes, furnitureIndexes, waresIndexes, miscellaneousIndexes){
    var total = 0;
    // for each order in the sessionStorage orderlist, categorize it for printing
    for (var i = 0; i < JSON.parse(sessionStorage.getItem('items')).length; i++) {
        var order = JSON.parse(sessionStorage.getItem('items'))[i];
        parsedItems.push(order); // add parsed order to list
        if (order['itemType'] === 'Clothing') { // categorize by itemType for printing
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


// get today's date
function findDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }
    var today = dd + mm + yyyy;
    return today;
}


// format date to match backend format
function getFormattedDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var today = mm + "/" + dd + "/" + yyyy;
    return today;
}


// subtract takes the itemType and updates the item count and UI to reflect the new count
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


// add takes the itemType and updates the item count and UI to reflect the new count
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


// createOrder takes the unit and quantity of the donation, generates an order, and adds it to the item list in session storage
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


// submitOrders creates orders for all itemtypes with counts > 0
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



// reference to clean phone num format: https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript
// formatPhoneNum takes phoneNum and formats it: 1 (555) 555-5555
function formatPhoneNum(phoneNum) {
    var clean = ('' + phoneNum).replace(/\D/g, '')
    var match = clean.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return match[1] + ' (' + match[2] + ') ' + match[3] + '-' + match[4] 
    }
    return null
  }


// cancelOrder clears all order-related information from session storage
  function cancelOrder(doReturn) {
    sessionStorage.removeItem("itemType");
    sessionStorage.removeItem("items");
    sessionStorage.removeItem("date");
    sessionStorage.removeItem("description");
    sessionStorage.removeItem("customerInfo");
    if(doReturn){
        window.location.href = "mainSelect.html"
    }
}