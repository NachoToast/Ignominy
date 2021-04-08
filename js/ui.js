function show_header(option) {
    if (option == current_header) {
        header_pages[option].classList.add("hidden");
        current_header = -1;
        return;
    }
    if (option == 0) { // Menu
        update_menu();
    }
    else if (option == 1) { // Stats
        update_stats();
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
    header_pages[current_header]?.classList.add("hidden");
    header_pages[option].classList.remove("hidden");
    current_header = option;
    header_pages[option].style.height = (document.body.offsetHeight - header.offsetHeight) + "px";
}

var stats_health = document.getElementById("stats_health"),
stats_mana = document.getElementById("stats_mana"),
stats_fatigue = document.getElementById("stats_fatigue"),
stats_gold = document.getElementById("stats_gold"),
stats_name = document.getElementById("stats_name");

const std_red = {red: 240, green: 128, blue: 128},
std_yellow = {red: 255, green: 214, blue: 0},
std_green = {red: 144, green: 238, blue: 144},
std_fullmana = {red: 127, green: 255, blue: 212},
std_nomana = {red: 128, green: 128, blue: 128},
stats_container = document.getElementById("header_1_2");

function update_stats() {
    // visual only

    // name
    stats_name.innerText = player.name;
    
    // health
    let health_rgb = color_gradient(0, player.max_health, player.health, std_red, std_yellow, std_green),
    mana_rgb = color_gradient(0, player.max_mana, player.mana, std_nomana, std_fullmana);
    //let tip_top = "144, 238, 144";
    stats_health.innerHTML = `Health: <span style='color: rgb(${health_rgb})'>${player.health}</span>/${player.max_health} [<span style='color: rgb(${health_rgb})'>${(100*player.health/player.max_health).toFixed(0)}%</span>]`;

    // mana
    stats_mana.innerHTML = `Mana: <span style='color: rgb(${mana_rgb})'>${player.mana}</span>/${player.max_mana} [<span style='color: rgb(${mana_rgb})'>${(100*player.mana/player.max_mana).toFixed(0)}%</span>]`;

    // clear old stats elements [this could probably be optimized]
    let children = stats_container.childElementCount;
    while (children > 2) {
        stats_container.removeChild(stats_container.lastElementChild);
        children -= 1;
    }

    // fatigue
    stats_fatigue.innerHTML = `Fatigue <span style='color: rgb(${color_gradient(0, 100, Math.ceil(player.fatigue), {red:255,green:255,blue:255}, std_yellow, std_red)})'>` + Math.ceil(player.fatigue) + "</span>";
    // gold
    stats_gold.innerHTML = "Gold " + player.gold;

    // stats
    for (let i = 0, len = Object.keys(player.stats).length; i < len; i++) {
        // div
        let d = document.createElement("div");
        d.classList.add("stats");
        stats_container.appendChild(d);
        // span
        let s = document.createElement("span");
        s.title = player.stats[Object.keys(player.stats)[i]].description;
        d.appendChild(s);
        // img
        let img = document.createElement("img");
        img.src = `img/ui/${Object.keys(player.stats)[i]}.png`;
        s.appendChild(img);
        // p
        let p = document.createElement("p");
        p.innerHTML = Object.keys(player.stats)[i].charAt(0).toUpperCase() + Object.keys(player.stats)[i].slice(1) + " " + player.stats[Object.keys(player.stats)[i]].amount
        s.appendChild(p);
    }

}
function color_gradient(min, max, current, color_a, color_b, color_c) {
    // returns an rgb value in the format "r, g, b"
    let color_progression;
    if (current >= max) color_progression = 1;
    else color_progression = (current - min) / (max - min); // Standardize as decimal [0-1 (inc)].
    if (color_c) {
        color_progression *= 2;
        if (color_progression >= 1) {
            color_progression -=1;
            color_a = color_b;
            color_b = color_c;
        }
    }

    let new_red = color_a.red + color_progression * (color_b.red - color_a.red),
    new_green = color_a.green + color_progression * (color_b.green - color_a.green),
    new_blue = color_a.blue + color_progression * (color_b.blue - color_a.blue);

    let output_red = parseInt(Math.floor(new_red), 10),
    output_green = parseInt(Math.floor(new_green), 10),
    output_blue = parseInt(Math.floor(new_blue), 10);

    return `${output_red}, ${output_green}, ${output_blue}`;
    // final r = x (final red - initial red) + inital red
    // where x is how far along u are (1 = done, 0 = none)

}

document.getElementById("header_0_main").innerHTML = `<span title='Playing Ignominy on version ${version}'>` + "Ignominy " + version + "</span>";
//document.getElementById


function unhide_headers() {
    for (let i = 0, len = player.config.headers.length; i < len; i++) {
        if (player.config.debug > 3) console.log(`Unhiding header ${player.config.headers[i]} (${header_options[player.config.headers[i]].innerHTML}).`);
        header_options[player.config.headers[i]].classList.remove("hidden");

    }
    update_header_borders();
}

function add_ordinals(num) {
    if (num == "1") return "st";
    else if (num == "2") return "nd";
    else if (num == "3") return "rd";
    else return "th";
}

function update_date() {

    let year = player.time.getFullYear(),
    month = player.time.getMonth(),
    day = player.time.getDate(),
    long_day = player.time.getDay(),
    ordinals = "",
    date = player.config.chrono.date_format;

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

    hour = player.time.getHours(),
    minute = player.time.getMinutes(),
    second = player.time.getSeconds(),
    a = "",
    time = player.config.chrono.time_format;
    // Selector Conversion
    // f = Marker
    // 0 = Hour, 1 = Minute, 2 = Second
    // 0 = Full, 1 = Short
    time = time.replace(/hh/g, "f00");
    time = time.replace(/h/g, "f01");
    time = time.replace(/mm/g, "f10");
    time = time.replace(/m/g, "f11");
    time = time.replace(/ss/g, "f21");
    time = time.replace(/s/g, "f20");

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
    if (time.includes("f20")) time = time.replace(/f20/g, second);
    if (time.includes("f21")) {
        let local_second = second;
        if (second < 10) local_second = "0" + local_second;
        time = time.replace(/f21/g, local_second);
    }
    return time + a;
}

function update_chrono() {


    let date = update_date(),
    time = update_time();

    if (player.config.chrono.order == 0) header_options[3].innerText = date + " " + time;
    else header_options[3].innerText = time + " " + date;

    if (player.config.chrono.order == 0) config_example.innerText = "Example Output: " + date + " " + time;
    else config_example.innerText = "Example Output: " + time + " " + date;

    update_header_borders();
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

var saveload_defaults = {
    save: [
        {
            text: "Browser Storage",
            inline: "Recommended",
            inline_color: "#90EE90",
            title: "Save is stored in selected browsers cache (local storage)."
        },
        {
            text: "File",
            inline: "Safest",
            inline_color: "#FFD700",
            title: "Saves to downloads folder of local machine."
        },
        {
            text: "Server",
            inline: "Cross-Platform",
            inline_color: "#FFC0CB",
            title: "Saves to online server, requires playing from official website."
        }
    ],
    load: [
        "Browser Storage", "Load from browser cache.",
        "File", "Load file from computer.",
        "Server", "Load file from server, requires playing from official website."
    ]
},
saveload_current_changed = [-1, false],
saveload_options = document.getElementsByClassName("saveload_option"),
main_menu = document.getElementById("header_0_main"),
main_menu_cards = document.getElementsByClassName("mmc");

function update_menu() {

    // generate save/load html

    let save_elements = 0;
    for (let i = 0, len = saveload_defaults["save"].length; i < len; i++, save_elements++) {
        let o = saveload_defaults["save"][i];
        saveload_options[i].innerHTML = `<span title="${o.title}">${o.text} (<span style="color: ${o.inline_color}">${o.inline}</span>)</span>`;
    }

    if (player.config.debug > 3) console.log(`Found ${save_elements} save elements in menu.`);
    
    for (let i = 0, len = saveload_defaults["load"].length - save_elements; i < len; i++) {
        let o = saveload_defaults["load"][2 * i],
        o2 = saveload_defaults["load"][2 * i + 1];
        saveload_options[save_elements + i].innerHTML = `<span title="${o2}">${o}</span>`
    }

    // split because save/load functions feedbacks shouldn't be overwritten on load.
    update_menu_elements();

}

function update_menu_elements() {
    config_date_format.value = player.config.chrono.date_format;
    config_time_format.value = player.config.chrono.time_format;

    if (player.config.chrono.time == 12) config_time_hours.checked = false;
    else config_time_hours.checked = true;

    if (player.config.chrono.order == 0) config_reverse.checked = false;
    else config_reverse.checked = true;

    config_date_ordinals.checked = player.config.chrono.ordinals;
    config_authors.checked = player.config.meta.authors;
    config_versions.checked = player.config.meta.version;
    config_legacy_version.checked = player.config.meta.legacy_version;

    update_chrono();

    if (player.config.debug == 0) config_debug_out.innerText = "Off";
    else config_debug_out.innerText = player.config.debug;
    config_debug.value = player.config.debug;

    
    if (player.homekingdom == "Default") {
        for (let i = 0, len = main_menu_cards.length; i < len; i++) {
            if (i == 1) continue;
            //console.log("hiding card " + i);
            main_menu_cards[i].classList.add("hidden");
        }
    }
    else {
        for (let i = 0, len = main_menu_cards.length; i < len; i++) {
            main_menu_cards[i].classList.remove("hidden");
        }
    }

    config_hotkeys.checked = player.config.keybinds;
    config_dead_links.checked = player.config.devmode.dead_links;
    config_saveload_data.checked = player.config.devmode.saveload_data;

}

function change_save_option(index, message, color, title) {
    saveload_options[index].innerHTML = `<span style="color: ${color}" title="${title}">${message}</span>`;
}

let special_load_option = document.getElementById("load_file_label");

function change_load_option(index, message, color, title) {
    if (index == 1) {
        special_load_option.innerHTML = `<span style="color: ${color}" title="${title}">${message}</span>`;
        return;
    }
    saveload_options[index + saveload_defaults["save"].length].innerHTML = `<span style="color: ${color}" title="${title}">${message}</span>`;
}

var header_options = document.getElementsByClassName("header_options"),
header_pages = document.getElementsByClassName("header_pages"),
current_header = -1,
header = document.getElementById("header");

window.addEventListener("resize", update_header_borders);
setTimeout(update_header_borders, 600);

var config_debug = document.getElementById("debug_set"),
config_debug_out = document.getElementById("debug_out"),
config_authors = document.getElementById("meta_authors"),
config_versions = document.getElementById("meta_versions"),
config_legacy_version = document.getElementById("meta_versions_legacy"),
config_date_format = document.getElementById("config_date_format"),
config_date_ordinals = document.getElementById("date_ordinals"),
config_time_format = document.getElementById("config_time_format"),
config_time_hours = document.getElementById("time_hours"),
config_reverse = document.getElementById("chrono_reverse"),
config_example = document.getElementById("config_example"),
config_hotkeys = document.getElementById("hotkey_set"),
config_dead_links = document.getElementById("config_dead_links"),
config_saveload_data = document.getElementById("config_saveload_data");

config_date_format.addEventListener("input", function() {
    player.config.chrono.date_format = config_date_format.value;
    update_chrono();
})

config_time_format.addEventListener("input", function() {
    player.config.chrono.time_format = config_time_format.value;
    update_chrono();
})

config_date_ordinals.addEventListener("change", function() {
    if (this.checked) {
        player.config.chrono.ordinals = true;
    }
    else {
        player.config.chrono.ordinals = false;
    }
    update_chrono();
})

config_time_hours.addEventListener("change", function() {
    if (this.checked) {
        player.config.chrono.time = 24;
    }
    else {
        player.config.chrono.time = 12;
    }
    update_chrono();
})

config_reverse.addEventListener("change", function() {
    if (this.checked) {
        player.config.chrono.order = 1;
    }
    else {
        player.config.chrono.order = 0;
    }
    update_chrono();
})

config_authors.addEventListener("change", function() {
    if (this.checked) player.config.meta.authors = true;
    else player.config.meta.authors = false;
})

config_versions.addEventListener("change", function() {
    if (this.checked) player.config.meta.version = true;
    else {
        player.config.meta.version = false;
        player.config.meta.legacy_version = false;
        config_legacy_version.checked = false;
    }
})

config_legacy_version.addEventListener("change", function() {
    if (this.checked) {
        config_versions.checked = true;
        player.config.meta.legacy_version = true;
        player.config.meta.version = true;
    }
    else player.config.meta.legacy_version = false;
})

function change_debug_mode() {
    player.config.debug = config_debug.value;
    if (player.config.debug == 0) config_debug_out.innerText = "Off";
    else config_debug_out.innerText = player.config.debug;
}

config_hotkeys.addEventListener("change", function() {
    if (this.checked) player.config.keybinds = true;
    else player.config.keybinds = false;
    update_keybind_config();
})

config_dead_links.addEventListener("change", function() {
    if (this.checked) player.config.devmode.dead_links = true;
    else player.config.devmode.dead_links = false
})

config_saveload_data.addEventListener("change", function() {
    if (this.checked) player.config.devmode.saveload_data = true;
    else player.config.devmode.saveload_data = false;
})