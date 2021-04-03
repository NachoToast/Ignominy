const version = "0.1.11";

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
        debug: 2,
        chrono: {
            time: 12, // 12 or 24
            order: 0, // 0 = Date Time, 1 = Time Date
            ordinals: true,
            date_format: "dddd d mmmm yyyy",
            time_format: "h:mm"
        },
        meta: {
            authors: true,
            version: true,
            legacy_version: true
        }
    },
    history: [
        {id: -5, amount: 10},
        {id: 2, amount: 289},
        {id: 69}
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
        if (player.config.debug > 1) console.log(`%cChecking text ${i + 1} conditions.`, 'color: aquamarine');
        if (validate_conditions(scene.text[i])) valid_text.push(scene.text[i].content);
        else if (!(scene.text[i].alternate === undefined)) {
            valid_text.push(scene.text[i].alternate);
            if (player.config.debug > 2) console.log("But found alternate text.");
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

    display_options(scene);

    if (Object.values(player.config.meta).indexOf(true) !== -1) display_meta(scene);
}

function display_meta(scene) {

    if (player.config.debug > 1) console.log(`Attempting display metadata for scene ${scene.id}`);

    if(scene.meta === undefined) {
        if (player.config.debug > 1) console.warn(`Scene ${scene.id} has no metadata!`);
        return;
    }
    // TODO: Add spans (maybe span detection for authors names?)
    let d = document.createElement("div");
    d.classList.add("std_window", "std_meta_window");
    game_window.appendChild(d);
    if (player.config.meta.authors == true) { // authors
        let authors = document.createElement("p");
        authors.classList.add("meta_authors");
        authors.innerHTML = "Authors: <span style='color: lightgray'>";
        for (let i = 0, len = scene.meta.authors.length; i < len; i++) {

            authors.innerHTML += "<span style='color: lightgray'>" + scene.meta.authors[i] + "</span>"
            if (i == len - 2) authors.innerHTML += ", & ";
            else if (i !== len - 1) authors.innerHTML += ", "; 
            else authors.innerHTML += ".";
        }
        d.appendChild(authors);
    }
    if (player.config.meta.version == true) { // version
        let version = document.createElement("p");
        version.classList.add("meta_version");
        version.innerHTML = "Added: <span style='color: lightgray'>" + scene.meta.version + "</span>";
        if (player.config.meta.legacy_version == true && scene.meta.legacy_version !== undefined) version.innerHTML += " [<span style='color: lightgray'>" + scene.meta.legacy_version + "</span>]";
        d.appendChild(version);
    }


}

function display_options(scene) {

    let d = document.createElement("div");
    d.classList.add("std_window", "std_option_window");
    game_window.appendChild(d);

    // condition checking
    let valid_option = [],
    valid_option_true = [];
    for (let i = 0, len = scene.options.length; i < len; i++) {
        if (player.config.debug > 1) console.log(`%cChecking option ${i + 1} conditions.`, 'color: turquoise');
        //console.log(scene.options[i]);
        if (validate_conditions(scene.options[i])) {
            valid_option.push(scene.options[i]);
            valid_option_true.push(true)
        }
        else if (!(scene.options[i].alternate === undefined)) {
            valid_option.push(scene.options[i]);
            valid_option_true.push(false);
            if (player.config.debug > 2) console.log("But found alternate text.");
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

function add_to_history(scene_id) {

    // initialisation
    //if (player.config.debug > 0) console.log(`%cInitiating history record for scene ${scene_id}.`, 'color: pink');
    let history_index = player.history.map(e => e.id).indexOf(scene_id);

    if (history_index !== -1) { // if exists in history
        if (player.config.debug > 0) console.log(`%cFound scene ${scene_id} in history (index ${history_index}).`, "color: pink");
        if (player.history[history_index]?.amount === undefined) {
            if (player.config.debug > 0) console.warn(`Scene ${scene_id} in history has no amount specified! Setting to 0.`);
            player.history[history_index].amount = 0;
        }
        player.history[history_index].amount += 1;
        if (player.config.debug > 0) console.log(`%cIncremented amount by 1 (now ${player.history[history_index].amount})`, "color: pink");
    }
    else { // otherwise add to history 
        if (player.config.debug > 0) console.log(`%cScene ${scene_id} does not exist in history, adding it now (with amount 1).`, "color: pink");
        player.history.push({id: scene_id, amount: 1});
    }
}

function option_progress_scene(option) {
    if (player.config.debug > 0) console.log("%c=== Scene Pre-Processing ===", 'color: lime');
    if (player.config.debug > 2) console.log("Option Dump:", option);
    
    let checkhistory = true;
    if (option?.novisit !== undefined) {
        if (option.novisit == true) {
            if (player.config.debug > 0) console.log("%cSkipped add to history for found scene due to 'novisit' tag.", "color: pink");
            checkhistory = false;
        }
        else if (player.config.debug > 0) console.warn("novisit tag present but false, instead just don't include novisit tag at all!");
    }
    if (checkhistory == true) {
        if (option.scene === undefined) {
            if (player.config.debug > 0) console.log("%cDoing add to history with current scene for undefined scene destination.", "color: pink");
            add_to_history(player.scene);
        }
        else {
            if (story.map(e => e.id).indexOf(option.scene) !== -1) add_to_history(option.scene);
            else if (player.config.debug > 0) console.log("%cSkipped add to history for unfound scene destination.", "color: pink");
        }
    }
    
    if (option.time) {
        if (player.config.debug > 2) console.log("Incrementing Time:", option.time);
        increment_time(option.time);
    }

    if (option.action) {
        option.action();
        if (player.config.debug > 2) console.log("Doing option actions.");
        if (player.config.debug > 3) console.log("Action dump:", option.action);
    }

    if (player.config.debug > 0) console.log("Going to next scene: ", option.scene);
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
        if (player.debug > 2) console.log("Found functional conditions, checking.");
        try {
            if (part.conditions(player)) {
                if (player.config.debug > 2) console.log("Functional conditions met.");
            }
            else {
                if (player.config.debug > 2) console.log("Functional conditions failed.");
                return false;
            }
        }
        catch (err) {
            if (player.config.debug > 2) console.log("Functional conditions failed with error.");
            if (player.config.debug > 3) console.log("If this was (only) due to a undeclared statistic you can safely ignore this.\n", err);
            return false;
        }
    }
    else if (player.config.debug > 2) console.log("No functional conditions found.");

    if (part.norepeat !== undefined) { // norepeat conditions present
        if (player.config.debug > 2) console.log("Found repeat condition, checking.");
        if (typeof part.norepeat === "boolean") {
            if (part.norepeat == false) {
                if (player.config.debug > 3) console.warn("Repeat condition present but false, instead just don't include repeat condition at all!");
            }
            else {
                if (player.history[player.history.map(e => e.id).indexOf(player.scene)]?.amount > 1) {
                    if (player.config.debug > 3) console.log("Repeat condition failed, not first visit on THIS scene.");
                    return false;
                    // undefined doesn't return false since if the scene is undefined in history the player hasn't visited it at all.
                }
            }
        }
        else if (typeof part.norepeat === "number") {
            if (player.history[player.history.map(e => e.id).indexOf(part.norepeat)]?.amount > 1) {
                if (player.config.debug > 3) console.log("Repeat condition failed, not visit on OTHER scene.");
                return false;
            }
        }
        else if (Array.isArray(part.norepeat)) {
            if (part.norepeat.length == 2) { // this scene
                let visit_amount = player.history[player.history.map(e => e.id).indexOf(player.scene)]?.amount,
                min = part.norepeat[0],
                max = part.norepeat[1];
                if (min === true) {
                    if (player.config.debug > 3) console.warn("Specified min norepeats as 'true', this should only be done for max!");
                    min = visit_amount;
                }
                if (max === true) max = visit_amount;

                if (visit_amount < min || visit_amount > max) {
                    if (player.config.debug > 3) console.log("Repeat condition failed, invalid number of visits on THIS scene.");
                    return false;
                }
            }
            else if (part.norepeat.length == 3) { // other scene
                let visit_amount = player.history[player.history.map(e => e.id).indexOf(part.norepeat[0])]?.amount,
                min = part.norepeat[1],
                max = part.norepeat[2];
                if (min === true) {
                    if (player.config.debug > 3) console.warn("Specified min norepeats as 'true', this should only be done for max!");
                    min = visit_amount;
                }
                if (max === true) max = visit_amount;
                if (visit_amount < part.norepeat[1] || visit_amount > part.norepeat[2]) {
                    if (player.config.debug > 3) console.log("Repeat condition failed, invalid number of visits on OTHER scene.");
                    return false;
                }
            }
            else if (player.config.debug > 2) console.warn("Invalid array length of repeat condition!");
        }
        else if (player.config.debug > 2) console.warn("Invalid type of repeat condition!");
    }
    else if (player.config.debug > 2) console.log("No repeat condition found.");

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
            update_menu_elements();
            player.version = version;
            generate_game(data.scene);
        }

    }

    version_debugger();
}

function reset_game() {
    let r = confirm("Confirm game reset.");
    if (r !== true) return;
    console.log("Reset!");
}