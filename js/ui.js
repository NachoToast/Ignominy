function show_header(option) {
    if (option == 0) { // Menu
        console.log("Menu");
    }
    else if (option == 1) { // Stats
        console.log("Stats");
    }
    else if (option == 2) { // Map
        console.log("Map");
    }
    else if (option == 3) { // Date & Time
        console.log("Date");
    }
    else if (option == 4) { // Inventory
        console.log("Inventory");
    }
}

function unhide_headers() {
    for (let i = 0, len = player.config.headers.length; i < len; i++) {
        if (player.config.debug > 0) console.log(`Unhiding header ${player.config.headers[i]} (${header_options[player.config.headers[i]].innerHTML}).`);
        header_options[player.config.headers[i]].classList.remove("hidden");

    }
    update_header_borders();
}

function update_chrono() {
    let date, year, month, day,
    time, hour, a,

    // Day
    if (player.config.chrono.day == "dd") {
        day = player.time.getDate() + 1;
        if (day < 10) day = "0" + day;
    }
    else if (player.config.chrono.day == "dddd") {
        day = player.time.getDay();
    }
    else if (player.config.chrono.day == "ddd") {
        day = player.time.getDay();
        day = convert_day(day).substring(3);
    }
}

function convert_month(num) {
    if (num == 0) return "January";
    else if (num == 1) return "February";
    else if (num == 2) return "March";
    else if (num == 3) return "April";
    else if (num == 4) return "May";
    else if (num == 5) return "June";
    else if (num == 6) return "July";
    else if (num = 7) return "August";
    else if (num == 8) return "September";
    else if (num == 9) return "October";
    else if (num == 10) return "November";
    else if (num == 11) return "December";
    else return "Invalid month!";
}

function convert_day(num) {
    if (num == 0) return "Sunday";
    if (num == 1) return "Monday";
    if (num == 2) return "Tuesday";
    if (num == 3) return "Wednesday";
    if (num == 4) return "Thursday";
    if (num == 5) return "Friday";
    if (num == 6) return "Saturday";
    else return "Invalid day!"
}

function update_header_borders() {
    let header_width = header.getBoundingClientRect().width;
    for (let i = 0, len = header_options.length; i < len; i++) {
        let my_right = header_options[i].getBoundingClientRect().right;
        if (Math.floor(my_right) >= header_width - 1) header_options[i].style.borderRight = "none";
        else header_options[i].style.borderRight = "solid 1px gray";
    }
}

var header_options = document.getElementsByClassName("header_options"),
header = document.getElementById("header");

window.addEventListener("resize", update_header_borders);
setTimeout(update_header_borders, 200);