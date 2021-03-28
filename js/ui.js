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
    let date,
    year = player.time.getFullYear(),
    month = player.time.getMonth(),
    day = player.time.getDate(),
    time,
    hour = player.time.getHours(),
    minute = player.time.getMinutes(),
    a = "";

    function update_date() {

        function add_ordinals(num) {
            if (num == "1") return "st";
            else if (num == "2") return "nd";
            else if (num == "3") return "rd";
            else return "th";
        }
        
        let long_day = player.time.getDay(), ordinals = "", date = player.config.chrono.date_format;

        // Selector Conversion
        // f = Marker
        // 0 = Day, 1 = Month, 2 = Year
        // 0 = Full, 1 = 3-Letter, 2 = Full Numerical, 3 = Short Numerical
        // Days
        date = date.replace(/dddd/g, "f00");
        date = date.replace(/ddd/g, "f01");
        date = date.replace(/dd/g, "f02");
        date = date.replace(/d/g, "f03");
        // Months
        date = date.replace(/mmmm/g, "f10");
        date = date.replace(/mmm/g, "f11");
        date = date.replace(/mm/g, "f12");
        date = date.replace(/m/g, "f13");
        // Years
        date = date.replace(/yyyy/g, "f20");
        date = date.replace(/yy/g, "f21");

        // Long Day
        if (date.includes("f00")) date = date.replace(/f00/g, convert_day(long_day));
        if (date.includes("f01")) date = date.replace(/f01/g, convert_day(long_day).substring(0, 3));
        // Short Day
        if (date.includes("f02")) {
            let local_day = day;
            if (player.config.chrono.ordinals == true) ordinals = add_ordinals(day);
            if (day < 10) local_day = "0" + local_day;
            date = date.replace(/f02/g, local_day + ordinals);
        }
        if (date.includes("f03")) {
            if (player.config.chrono.ordinals == true) ordinals = add_ordinals(day);
            date = date.replace(/f03/g, day + ordinals);
        }

        // Long Month
        if (date.includes("f10")) date = date.replace(/f10/g, convert_month(month));
        if (date.includes("f11")) date = date.replace(/f11/g, convert_month(month).substring(0, 3));
        // Short Month
        if (date.includes("f12")) {
            let local_month = month + 1;
            if (month < 10) local_month = "0" + local_month;
            date = date.replace(/f12/g, local_month);
        }
        if (date.includes("f13")) date = date.replace(/f13/g, month + 1);

        // Year
        if (date.includes("f20")) date = date.replace(/f20/g, year);
        if (date.includes("f21")) date = date.replace(/f21/g, year.toString().substring(2));

        return date;
    }

    function update_time() {

        let time = player.config.chrono.time_format;
        // Selector Conversion
        // f = Marker
        // 0 = Hour, 1 = Minute
        // 0 = Full, 1 = Short
        time = time.replace(/hh/g, "f00");
        time = time.replace(/h/g, "f01");
        time = time.replace(/mm/g, "f10");
        time = time.replace(/m/g, "f11");

        if (player.config.chrono.time == 12) { // 12hr Conversion
            if (hour >= 12) a = "pm";
            else a = "am";

            if (hour > 12) hour -= 12;
            if (hour == 0) hour = 12;
        }

        if (time.includes("f00")) {
            let local_hour = hour;
            if (hour < 10) local_hour = "0" + local_hour;
            time = time.replace(/f00/g, local_hour);
        }
        if (time.includes("f01")) time = time.replace(/f01/g, hour);
        if (time.includes("f10")) {
            let local_minute = minute;
            if (minute < 10) local_minute = "0" + local_minute;
            time = time.replace(/f10/g, local_minute);
        }
        if (time.includes("f11")) time = time.replace(/f11/g, minute);

        return time + a;
    }

    date = update_date();
    time = update_time();

    if (player.config.chrono.order == 0) header_options[3].innerHTML = date + " " + time;
    else header_options[3].innerHTML = time + " " + date;
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

function random_date() {
    let random_year = Math.floor(Math.random() * (3052 - 2000) + 2000),
    random_month = Math.floor(Math.random() * 12),
    random_day = Math.floor(Math.random() * (29 - 1) + 1),
    random_hour = Math.floor(Math.random() * 61),
    random_minute = Math.floor(Math.random() * 61);

    player.time = new Date(random_year, random_month, random_day, random_hour, random_minute, 0, 0);
    update_chrono();
    console.log(header_options[3].innerHTML);
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