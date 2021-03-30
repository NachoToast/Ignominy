const version = "0.1.9";

const game_window = document.getElementById("game");

var player = {
    name: "Default",
    homekingdom: "Default",
    hometown: "Default",
    health: 100,
    max_health: 100,
    mana: 100,
    max_mana: 100,
    gold: 100,
    fatigue: 0,
    stats: {
        strength: {
            amount: 0,
            description: "Strength dictates fatigue gain, health, and damage dealt."
        },
        agility: {
            amount: 0,
            description: "Agility is how fluently and rapidly you move."
        },
        proficiency: {
            amount: 0,
            description: "Proficiency is how efficiently you consume mana and how much of it you can store."
        },
        perception: {
            amount: 0,
            description: "Perception is your skill at detecting and observing your surroundings."
        }
    },
    scene: -1,
    config: {
        headers: [0, 1, 2, 3, 4],
        debug: 1,
        chrono: {
            time: 12, // 12 or 24
            order: 0, // 0 = Date Time, 1 = Time Date
            ordinals: true,
            date_format: "dddd d mmmm yyyy",
            time_format: "h:mm"
        }
    },
    history: [
        {id: -5, amount: 10},
        {id: 2, amount: 289}
    ],
    version: version,
    time: new Date(3051, 0, 1, 7, 0, 0, 0)
}

function version_debugger() {
    // use when introducing new object fields (for both story [unlikely] and player) in future versions.
    if (player.config.debug > 0) console.log("%cVersion debugger has nothing to do... yet.", 'color: gray');
}

function generate_game(scene) {
    unhide_headers();
    update_chrono();
    if (player.config.debug > 0) console.log(`%cStarting game%c\nLoaded Scene: ${scene}\nPlayer Hometown: ${player.hometown}, ${player.homekingdom}`, 'color: lime', 'color: unset');
    next_scene(scene);
}

function next_scene(scene) {
    if (player.config.debug > 0) console.log(`%c========== Progressing Scene ==========`, 'color: gold; font-size: 14px');
    clear_game();
    if (scene === undefined) {
        scene = player.scene;
        if (player.config.debug > 0) console.log("No scene specified, so showing current one again.");
    }
    let scene_index = story.map(e => e.id).indexOf(scene);
    // Probably should make function for universal scene identifiers
    if (scene_index == -1) {
        if (player.config.debug > 0) console.warn(`Could not find index of scene ${scene}.`);
        scene_index = story.map(e => e.id).indexOf(-1);
    }
    //scene_index = 0;
    full_scene = story[scene_index];
    //console.log(full_scene);
    player.scene = full_scene.id;
    if (player.config.debug > 0) console.log(`Displaying scene ${story[scene_index].id} [Index ${scene_index}].`);

    display_scene(full_scene);
}

function clear_game() {
    game_window.innerHTML = "";
}

function display_scene(scene) {

    let d = document.createElement("div");
    d.classList.add("std_window");
    game_window.appendChild(d);

    // first check number of texts that satisfy conditions.
    let valid_text = [];
    for (let i = 0, len = scene.text.length; i < len; i++) {
        if (player.config.debug > 0) console.log(`%cChecking text ${i + 1} conditions.`, 'color: aquamarine');
        if (validate_conditions(scene.text[i])) valid_text.push(scene.text[i].content);
        else if (!(scene.text[i].alternate === undefined)) {
            valid_text.push(scene.text[i].alternate);
            if (player.config.debug > 0) console.log("But found alternate text.");
        }
    }
    if (player.config.debug > 0) console.log(`%cFound ${valid_text.length} valid text nodes.`, 'color: magenta');

    // now display all those recorded as 'valid'
    for (let i = 0, len = valid_text.length; i < len; i++) {
        for (let j = 0, j_len = valid_text[i].length; j < j_len; j++) {
            let p = document.createElement("p");
            p.innerHTML = valid_text[i][j];
            d.appendChild(p);
        }

    }

    display_options(scene)
}

function display_options(scene) {

    let d = document.createElement("div");
    d.classList.add("std_window", "std_option_window");
    game_window.appendChild(d);

    // condition checking
    let valid_option = [],
    valid_option_true = [];
    for (let i = 0, len = scene.options.length; i < len; i++) {
        if (player.config.debug > 0) console.log(`%cChecking option ${i + 1} conditions.`, 'color: turquoise');
        //console.log(scene.options[i]);
        if (validate_conditions(scene.options[i])) {
            valid_option.push(scene.options[i]);
            valid_option_true.push(true)
        }
        else if (!(scene.options[i].alternate === undefined)) {
            valid_option.push(scene.options[i]);
            valid_option_true.push(false);
            if (player.config.debug > 0) console.log("But found alternate text.");
        }
    }
    if (player.config.debug > 0) console.log(`%cFound ${valid_option.length} valid option nodes.`, 'color: magenta');
    if (valid_option.length == 0) console.warn(`Found no available options for scene ${scene.id}!`);

    // option displaying
    for (let i = 0, len = valid_option.length; i < len; i++) {
        let btn = document.createElement("btn");
        if (valid_option_true[i] == true) {
            btn.classList.add("std_options");
            btn.innerHTML = valid_option[i].text;
            //if (valid_option[i]?.scene === undefined) valid_option[i].scene = scene.id; // big brain
            btn.addEventListener('click', () => option_progress_scene(valid_option[i]));
            //console.log(valid_option[i])
        }
        else {
            btn.classList.add("std_options_fake");
            btn.innerHTML = valid_option[i].alternate;
        }
        d.appendChild(btn);
    }
}

function option_progress_scene(option) {
    if (option.time) {
        increment_time(option.time);
    }
    if (player.config.debug > 0) console.log("Going to next scene: ", option.scene);
    if (player.config.debug > 1) console.log("Which is:", option);
    next_scene(option.scene);
}

function increment_time(date_object) {

    /* date_object format: {
        year: int,
        month: int,
        week: int,
        day: int,
        hour: int,
        minute: int
    } */

    // Optimize this with fancy object stuff.
    let old_year = player.time.getFullYear(),
    old_month = player.time.getMonth(),
    old_day = player.time.getDate(),
    old_hour = player.time.getHours(),
    old_minute = player.time.getMinutes(),
    add_year = date_object.year ?? 0,
    add_month = date_object.month ?? 0,
    add_day = date_object.day ?? 0,
    add_hour = date_object.hour ?? 0,
    add_minute = date_object.minute ?? 0;

    add_day += (date_object.week ?? 0) * 7;

    new_time = new Date(old_year + add_year, old_month + add_month, old_day + add_day, old_hour + add_hour, old_minute + add_minute, 0, 0);
    player.time = new_time;
    update_chrono();
}

function validate_conditions(part) {

    if (part.conditions !== undefined) { // functional conditions present
        if (player.debug > 0) console.log("Found functional conditions, checking.");
        try {
            if (part.conditions(player)) {
                if (player.config.debug > 0) console.log("Functional conditions met.");
            }
            else {
                if (player.config.debug > 0) console.log("Functional conditions failed.");
                return false;
            }
        }
        catch (err) {
            if (player.config.debug > 0) console.log("Functional conditions failed with error.");
            if (player.config.debug > 1) console.log("If this was (only) due to a undeclared statistic you can safely ignore this.\n", err);
            return false;
        }
    }
    else if (player.config.debug > 0) console.log("No functional conditions found.");

    if (part.norepeat !== undefined) { // norepeat conditions present
        if (player.config.debug > 0) console.log("Found repeat conditions, checking.");
        if (part.norepeat == true) {
            // check players previous scenes with the scene this option links to, if player has already been to that scene then dont show option.
            // attempt index option scene to player previous scenes array, if index != -1, return false
            // TO DO: THIS
            if (player.done.indexOf(part) !== -1) {
                if (player.config.debug > 0) console.log("Repeat conditions failed.");
                return false;
            }
            else if (plauer.config.debug > 0) console.log("Repeat conditions met.");
        }
        else if (player.config.debug > 0) console.warn("Option 'norepeat' field present but set to false, instead just don't include the field!");
    }
    else if (player.config.debug > 0) console.log("No repeat conditions found.");

    return true;
}

function save_game(type) {
    if (type == "browser") {
        localStorage.setItem("Ignominy Save", JSON.stringify(player));
        if (player.config.debug > 0) console.log("Executed browser save.");
        change_save_option(0, "Saved to browser!", "#90EE90", "Successfully saved data to browser storage.");
    }
}

function load_game(type) {
    if (type == "browser") {
        let data = JSON.parse(localStorage.getItem("Ignominy Save"));
        if (data == null) {
            if (player.config.debug > 0) console.log("No save found in local storage.");
            change_load_option(0, "Save not found!", "#F08080", "Have you cleared cache?");
        }
        else {
            //show_header(0);
            change_load_option(0, "Save loaded!", "#90EE90", "Found data in browser storage.");
            if (version !== data.version && player.config.debug > 0) console.warn(`Save version mismatch: Currently on ${version} but save is ${data.version}.`);
            if (player.config.debug > 1) console.log("Executed browser load.");
            if (player.config.debug > 1) console.log("Dumping save: ", data);
            player = data;
            player.time = new Date(data.time);
            player.version = version;
            generate_game(data.scene);
        }

    }

    version_debugger();
}