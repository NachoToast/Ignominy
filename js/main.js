const version = "0.1.18",
harsh_check = false,
game_window = document.getElementById("game"),
// should move declarations to another document tbh

scene_presets = {
    default: {fatigue: 0.3, time: {second: 5}},
    caravan: {fatigue: 10} // unused
},

defaults = {
    timestamps_config: {
        enabled: true,
        threshold: 15,
        unit: 0 // 0 - Minute, 1 - Hour, 2 - Day
    },
    devmode: {
        dead_links: true,
        saveload_data: false,
        scene_tracking: false,
        trade_info: false
    },
    random: global_random(),
    chrono: {
        time: 12, // 12 or 24
        order: 0, // 0 = Date Time, 1 = Time Date
        ordinals: true,
        date_format: "dddd d mmmm yyyy",
        time_format: "h:mm"
    },
    meta: {
        authors: false,
        version: false,
        legacy_version: false
    },
};

var tracked_stats = {
    health: 0,
    max_health: 0,
    mana: 0,
    max_mana: 0,
    stats: {},
    gold: 0,
    fatigue: 0
},

player = {
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
    previous_scene: null,
    config: {
        headers: [0, 1, 2, 3, 4],
        debug: 0,
        devmode: defaults.devmode,
        chrono: defaults.chrono,
        meta: defaults.meta,
        keybinds: true,
        timestamps: defaults.timestamps_config
    },
    history: [],
    version: version,
    time: new Date(3051, 0, 1, 7, 0, 0, 0),
    random: defaults.random,
    inns: [],
    latest_time_increment: 0,
    inventory: []
},

past_versions = ["0.1.16"],
doing_trade = false,

delta_thresholds = { // (only shows messages if change is >= threshold)
    fatigue: 5,
    gold: 1,
    health: 1,
    mana: 1,
    max_mana: 1,
    max_health: 1,
    stats: 1
};

function version_debugger(save, verbose) {
    // use when introducing new object fields (for story [unlikely] and player objects) in future versions.
    // if (verbose) console.log("%cVersion debugger has nothing to do... yet.", 'color: gray');
    // to do: use the above 'past_versions' array for conditional checks instead of checking everything all the time.
    // maybe procedural append it aswell?
    save.version = version;
    // 0.1.16
    if (save?.random === undefined) {
        save.random = defaults.random;
        if (verbose) console.log("%cAdded random field.","color: gray");
    }
    if (save?.inns === undefined) {
        save.inns = [];
        if (verbose) console.log("%cAdded inns array.","color: gray");
    }
    if (save?.config.timestamps === undefined) {
        save.config.timestamps = defaults.timestamps_config;
        if (verbose) console.log("%cAdded config.timestamps object.", "color: gray");
    }
    if (save?.previous_scene === undefined) {
      save.previous_scene = null;
      if (verbose) console.log("%cAdded previous_scene field.", "color: gray");
    }
    if (save?.config?.devmode?.scene_tracking === undefined) {
        save.config.devmode.scene_tracking = defaults.devmode.scene_tracking;
        if (verbose) console.log("%cAdded config.devmode.scene_tracking bool.", "color: gray");
    }
    // 0.1.17
    if (save?.config?.devmode?.trade_info === undefined) {
        save.config.devmode.trade_info = defaults.devmode.trade_info;
        if (verbose) console.log("%cAdded config.devmode.trade_info bool.", "color: gray");
    }
    if (save?.inventory === undefined) {
        save.inventory = [];
        if (verbose) console.log("%cAdded inventory array.", "color: gray");
    }
    return save;
}

function global_random(min, max, step) { // returns number between min (inclusive) and max (exclusive).
    if (min === undefined) {
        min = 1;
        max = 101;
        step = 1;
    }
    else if (max === undefined) {
        max = min;
        min = 0;
        step = 1;
    }
    else if (step === undefined) step = 1;
    let num = Math.floor(Math.random() * (max - min));
    num = Math.floor(num / step) * step;
    return min + num;
}

function random_chance(percentage) {
    if (percentage >= global_random()) return true;
    return false;
}

function generate_game(scene, fromload) {
    unhide_headers();
    update_chrono();
    if (player.config.debug > 0) console.log(`%cStarting game%c\nLoaded Scene: ${scene}\nPlayer Hometown: ${player.hometown}, ${player.homekingdom}`, 'color: lime', 'color: unset');
    next_scene(scene, fromload);
    update_keybind_config();
}

function update_keybind_config() {
    if (player.config.keybinds == true) document.addEventListener("keydown", function(e) {
        keybind_progress_scene(e.key);
    });
    else document.removeEventListener("keydown", function(e) {
        keybind_progress_scene(e.key);
    })
}

function filter_text(string) {
    string = string.replace(/PLAYERNAME/g, player.name);
    return string;
}

function next_scene(scene, fromload) {
    if (player.config.devmode.scene_tracking) console.log(`Updating previous scene from ${player.previous_scene} to ${player.scene}`);
    player.previous_scene = player.scene;
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
    if (full_scene?.random !== undefined) {
        if (full_scene.random === true) player.random = global_random();
        else player.random = global_random(full_scene.random);
    }

    if (player.config.debug > 0) console.log(`Displaying scene ${story[scene_index].id} [Index ${scene_index}].`);
    display_scene(full_scene, fromload);
}

function clear_game() {
    game_window.innerHTML = "";
}

function display_scene(scene, fromload) {

    if (!fromload) {
        let deltas = check_tracked_stats(),
        elements = [];
        for (let i = 0, len = deltas.length; i < len; i++) {
            let delta_msg = make_delta_element(deltas[i]);
            if (delta_msg !== undefined) {
                if (Array.isArray(delta_msg)) {
                    for (let j = 0; j < delta_msg.length; j++) {
                        elements.push(delta_msg[j]);
                    }
                }
                else elements.push(delta_msg);
            }
        }
        if (elements.length > 0) {
            let d = document.createElement("div");
            d.classList.add("std_window", "std_delta")
            game_window.appendChild(d);
            for (let i = 0, len = elements.length; i < len; i++) {
                d.appendChild(elements[i]);
            }
        }
    }
    set_tracked_stats();


    let d = document.createElement("div");
    d.classList.add("std_window", "std_storywindow");
    game_window.appendChild(d);

    // first check number of texts that satisfy conditions.
    let valid_text = [];
    for (let i = 0, len = scene.text.length; i < len; i++) {
        if (player.config.debug > 1) console.log(`%cChecking text ${i + 1} conditions.`, 'color: aquamarine');
        if (validate_conditions(scene.text[i])) valid_text.push(scene.text[i].content);
        else if (scene.text[i].alternate !== undefined) {
            if (validate_hard_conditions(scene.text[i])) {
                valid_text.push(scene.text[i].alternate);
                if (player.config.debug > 2) console.log("But found alternate text.");
            }
        }
    }
    if (player.config.debug > 0) console.log(`%cFound ${valid_text.length} valid text nodes.`, 'color: magenta');

    // now display all those recorded as 'valid'
    for (let i = 0, len = valid_text.length; i < len; i++) {
        for (let j = 0, j_len = valid_text[i].length; j < j_len; j++) {
            let p = document.createElement("p");
            p.innerHTML = filter_text(valid_text[i][j]);
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

    calibrate_meta(d);
}

function display_options(scene) {

    let d = document.createElement("div");
    d.classList.add("std_window", "std_option_window");
    game_window.appendChild(d);
    current_options_displayed = [];

    // catch no options
    try {
        if (scene.options.length);
    } catch {
        if (player.config.debug > 0) console.warn(`Scene ${scene.id} has no options!`);
        next_scene(-1);
        return;
    }

    // condition checking
    let valid_option = [],
    valid_option_true = [];

    // inn room/rest scenes standard options (always before other options)
    if (rest_scenes.indexOf(scene.id) !== -1) {
        valid_option.push({
            text: "Sleep (-10% Fatigue)",
            time: {hour: 1},
            action: function() {player.fatigue *= 0.9},
            fatigue: false,
            perm_timestamps: true
        },
        {
            text: "Sleep (-50% Fatigue) (Restores Health)",
            time: {hour: 3},
            action: function() {player.fatigue *= 0.5; player.health = player.max_health},
            fatigue: false,
            perm_timestamps: true
        },
        {
            text: "Sleep (-100% Fatigue) (Restores Health & Mana)",
            time: {hour: 6},
            action: function() {player.fatigue = 0; player.health = player.max_health; player.mana = player.max_mana},
            fatigue: false,
            perm_timestamps: true
        });
        valid_option_true.push(true, true, true);
    }

    for (let i = 0, len = scene.options.length; i < len; i++) {
        if (player.config.debug > 1) console.log(`%cChecking option ${i + 1} conditions.`, 'color: turquoise');
        //console.log(scene.options[i]);
        if (validate_conditions(scene.options[i])) {
            valid_option.push(scene.options[i]);
            valid_option_true.push(true)
        }
        else if (scene.options[i].alternate !== undefined) {
            //console.log("found alternate");
            if (validate_hard_conditions(scene.options[i])) {
                valid_option.push(scene.options[i]);
                valid_option_true.push(false);
                if (player.config.debug > 2) console.log("But found alternate text.");
            }
        }
    }
    if (player.config.debug > 0) console.log(`%cFound ${valid_option.length} valid option nodes.`, 'color: magenta');
    if (valid_option.length == 0) console.warn(`Found no available options for scene ${scene.id}!`);

    // option displaying
    for (let i = 0, len = valid_option.length; i < len; i++) {
        let btn = document.createElement("btn");
        if (valid_option_true[i] == true) {
            btn.classList.add("std_options", "noselect");

            // keybinds
            if (player.config.keybinds == true) btn.innerHTML = keybind_text(current_options_displayed.length) + valid_option[i].text;
            else btn.innerHTML = valid_option[i].text;

            // timestamps
            if (player.config.timestamps.enabled == true || valid_option[i]?.perm_timestamps === true && valid_option[i]?.time !== undefined) btn.innerHTML = btn.innerHTML + get_timestamps(valid_option[i].time);

            //if (valid_option[i]?.scene === undefined) valid_option[i].scene = scene.id; // big brain
            btn.addEventListener('click', () => option_progress_scene(valid_option[i]));
            current_options_displayed.push(valid_option[i]);
            //console.log(valid_option[i])
            btn.innerHTML = filter_text(btn.innerHTML);
        }
        else {
            btn.classList.add("std_options_fake");
            for (let j = 0, j_len = valid_option[i].alternate.length; j < j_len; j++) {
                btn.innerHTML += valid_option[i].alternate[j];
                if (j !== j_len) btn.innerHTML += "<br>";
            }
        }
        if (player.config.devmode.dead_links == true && validate_option_scene(valid_option[i])) {
            btn.classList.add("std_options_dead");
        }
        d.appendChild(btn);
    }

    // key binding
    //options = document.getElementsByClassName("std_options");
    //if (player.config.keybinds == true) display_keybinds();
}

function get_timestamps(time_object) {
        /* date_object format: {
        year: int,
        month: int,
        week: int,
        day: int,
        hour: int,
        minute: int,
        second: int
    } */

    //unit: 0 - Minute, 1 - Hour, 2 - Day
    if (time_object?.year !== undefined) return ` [${time_object.year}y]`;
    if (time_object?.month !== undefined) return ` [${time_object.month}mo]`;
    if (time_object?.week !== undefined) return ` [${time_object.week}w]`;

    // assume threshold is never >= 7 days
    if (player.config.timestamps.unit >= 2 && time_object?.day !== undefined && time_object.day >= player.config.timestamps.threshold) return ` [${time_object.day}d]`;
    if (player.config.timestamps.unit >= 1) {
        // assume threshold is never >= 24 hours
        if (time_object?.day !== undefined) return ` [${time_object.day}d]`;
        if (time_object?.hour !== undefined && time_object.hour >= player.config.timestamps.threshold) return ` [${time_object.hour}h]`
    }
    if (player.config.timestamps.unit >= 0) {
        if (time_object?.day !== undefined) return ` [${time_object.day}d]`;
        // assume threshold is never >= 60 minutes
        if (time_object?.hour !== undefined) return ` [${time_object.hour}h]`;
        if (time_object?.minute !== undefined && time_object.minute >= player.config.timestamps.threshold) return ` [${time_object.minute}m]`;
    }

    return "";
}

var current_options_displayed = [];

function validate_option_scene(option) {
    // returns true if option's scene is not found.
    if (!option.scene) return false;
    if (story.map(e => e.id).indexOf(option.scene) == -1) return true;
    if (story[story.map(e => e.id).indexOf(option.scene)]?.options?.length === undefined) return true;
    else return false;
}

function keybind_progress_scene(key) {
    if (current_header !== -1) return; // don't listen when pages open
    if (doing_trade) return; // don't listen when trade menu open
    let index = keybinds.indexOf(key);
    if (index == -1) return; // only listen to allowed keys
    if (index >= current_options_displayed.length) return; // don't listen for non-existent options
    
    option_progress_scene(current_options_displayed[index]);

}

function keybind_text(option_number) {
    let msg = option_number + 1;
    if (msg == 10) msg = 0;
    else if (msg > 10 ) msg = "Shift+" + (msg - 10); 
    return "[" + msg + "] ";
}

const keybinds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];

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
    
    // novisit
    if (option?.novisit !== undefined) {
        if (option.novisit == true) {
            if (player.config.debug > 0) console.log("%cSkipped add to history for found scene due to 'novisit' tag.", "color: pink");
        }
        else if (player.config.debug > 0) console.warn("novisit tag present but false, instead just don't include novisit tag at all!");
    }
    else if (option.scene === undefined) {
        if (player.config.debug > 0) console.log("%cDoing add to history with current scene since option has undefined scene destination.", "color: pink");
        add_to_history(player.scene);
    }
    else if (story.map(e => e.id).indexOf(option.scene) !== -1) {
        add_to_history(option.scene);
        if (player.config.debug > 3) console.log("%cDoing add to history with found scene destination.", "color: pink");
    }
    else if (player.config.debug > 0) console.log("%cSkipped add to history for unfound scene destination.", "color: pink");
    
    // time
    if (option?.time !== undefined) {
        if (player.config.debug > 2) console.log("Option time tag present, checking.")
        if (typeof option.time == "object") {
            if (player.config.debug > 3) console.log("Option time tag has object, incrementing.");
            increment_time(option.time);
        }
        else if (option.time !== false) {
            if (player.config.debug > 0) console.warn("time tag present but not false or an object!");
        }
        else if (player.config.debug > 3) console.log("Option time tag is boolean and false.");
    }
    else {
        increment_time(scene_presets.default.time);
        if (player.config.debug > 3) console.log("Option time tag absent, doing default time incrementation.");
    }

    // action
    if (option.action) {
        option.action();
        if (player.config.debug > 2) console.log("Doing option actions.");
        if (player.config.debug > 3) console.log("Action dump:", option.action);
    }
    
    // fatigue
    if (option?.fatigue !== undefined) {
        if (typeof option.fatigue == "number") player.fatigue += option.fatigue;
        else if (option.fatigue !== false) {
            if (player.config.debug > 0) console.warn("fatigue tag present but not false nor a number!");
        }
    }
    else player.fatigue += scene_presets.default.fatigue;

    // random
    // this isn't documented or tested because its not advised to use, instead add random to the scene so that anything that points to it rolls a random number.
    if (option?.random !== undefined) {
        if (option.random === true) player.random = global_random();
        else if (player.config.debug > 0) console.warn("Option random tag present but not boolean and true!");
    }

    //if (player.config.debug > 0) console.log("Going to next scene: ", option.scene);
    next_scene(option.scene);
}

function increment_time(date_object) {

    /* date_object format: {
        year: int,
        month: int,
        week: int,
        day: int,
        hour: int,
        minute: int,
        second: int
    } */

    // Optimize this with fancy object stuff.
    let old_year = player.time.getFullYear(),
    old_month = player.time.getMonth(),
    old_day = player.time.getDate(),
    old_hour = player.time.getHours(),
    old_minute = player.time.getMinutes(),
    old_second = player.time.getSeconds(),
    add_year = date_object.year ?? 0,
    add_month = date_object.month ?? 0,
    add_day = date_object.day ?? 0,
    add_hour = date_object.hour ?? 0,
    add_minute = date_object.minute ?? 0,
    add_second = date_object.second ?? 0;
    add_day += (date_object.week ?? 0) * 7;

    new_time = new Date(old_year + add_year, old_month + add_month, old_day + add_day, old_hour + add_hour, old_minute + add_minute, old_second + add_second, 0);
    player.latest_time_increment = (new_time - player.time) / 1000;
    player.time = new_time;
    update_chrono();

    if (player.inns.length > 0) track_inns(player.latest_time_increment / 3600);
}

function track_inns(elapsed) {
    for (let i = 0, len = player.inns.length; i < len; i++) {
        player.inns[i].hours -= elapsed;
        if (player.inns[i].hours <= 0) player.inns.splice(i);
    }
}

function has_inn(scene_id) {
    if (scene_id === undefined) scene_id = player.scene;
    if (player.inns.map(e => e.id).indexOf(scene_id) !== -1) return true;
    return false;

}

function add_inn(inn_id, hour_length) {
    if (inn_id === undefined) {
        inn_id = player.scene;
        hour_length = 24;
    }
    else if (hour_length === undefined) {
        hour_length = 24;
    }
    if (has_inn() == false) {
        player.inns.push({id: inn_id, hours: hour_length})
    }
    else {
        player.inns[player.inns.map(e => e.id).indexOf(inn_id)].hours += hour_length;
    }
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

function validate_hard_conditions(part) {
    //console.log("checking for harsh conditions");
    if (part.hard_conditions === undefined) return true;
    if (player.config.debug >= 3) console.log("Evaulating harsh conditions.");
    if (part.hard_conditions(player)) return true;
    return false;
}

function save_game(type) {
    if (type == "browser") {
        localStorage.setItem("Ignominy Save", JSON.stringify(player));
        if (player.config.debug > 0) console.log("Executed browser save.");
        change_save_option(0, "Saved to browser!", "#90EE90", "Successfully saved data to browser storage.");
    }
    else if (type == "file") {
        let file = new Blob([JSON.stringify(player, null, 2)], {type: 'application/json'}),
        elem = window.document.createElement("a");
        elem.href = window.URL.createObjectURL(file);
        elem.download = `${player.name}_${version}.ignosave`;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
        if (player.config.debug > 0) console.log("Executed file save.");
        change_save_option(1, "Saved to file!", "#90EE90", "Successfully saved file to local machine.");
    }
}

var file_holder = document.getElementById("load_file");

function load_game(type) {
    if (type == "browser") {
        let data = JSON.parse(localStorage.getItem("Ignominy Save"));
        if (data == null) {
            if (player.config.debug > 0) console.log("No save found in local storage.");
            change_load_option(0, "Save not found!", "#F08080", "Have you cleared cache?");
            return;
        }
        true_load(0, "Found data in browser storage.", data);
        return;
    }
    if (type == "file") {
        let file = file_holder.files[0];
        if (player.config.debug > 1) console.log("Dumping load meta: ", file);
        if (!file) {
            if (player.config.debug > 0) console.log("No file specified for browser load.");
            change_load_option(1, "No file specified.", "#F08080", "Browser might be unsupported.");
            return;
        }
        if (file.name.slice(-9) !== ".ignosave") {
            if (player.config.debug > 0) console.log("Invalid file type for browser load.");
            change_load_option(1, "Invalid file type!", "#F08080", "Must be '.ignosave' extension.");
            return;
        }
        if (typeof window.FileReader !== "function") {
            if (player.config.debug > 0) console.warn("Browser does not support file reader API!");
            change_load_option(1, "File loading not supported!", "#F08080", "Is your browser outdated?");
            return;
        }
        if (player.config.debug > 2) console.log("Loaded file passed all checks.");
        //change_load_option(1, "Loaded from file!", "#90EE90", "Local save file loaded!");
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (contents) {
            let data = JSON.parse(contents.target.result);
            if (player.config.debug > 0) console.log("Executed browser load.");
            if (player.config.debug > 1) console.log("Dumping load: ", data);
            true_load(1, "Local save filed loaded successfully!", data);

        }
        reader.onerror = function() {
            if (player.config.debug > 0) console.error("Browser load error!");
            change_load_option(1, "File read error!", "#F08080", "Something wrent wrong :P");
        }
    }

}

function true_load(load_index, tooltip, data) {
    //show_header(0); (personal preference)
    change_load_option(load_index, "Save loaded!", "#90EE90", tooltip);
    player.config.devmode.saveload_data = player.config.devmode.saveload_data || data.config.devmode.saveload_data
    if (player.config.devmode.saveload_data) console.log("Executed browser load.");

    if (version !== data.version || harsh_check) {
        if (player.config.devmode.saveload_data) console.warn(`Save version mismatch: Currently on ${version} but save is ${data.version}!`);
        data = version_debugger(data, player.config.devmode.saveload_data);
    }

    player = data;
    player.time = new Date(data.time);
    update_menu_elements();
    generate_game(data.scene, true);
    toggle_trade_menu(true);
}

function reset_game() {
    let r = confirm("Confirm game reset.");
    if (r == true) location.reload();
}

var trademenu_goldcount = document.getElementById("trade_gold"),
item_map = items.map(e => e.name);

function start_trade(vendor_name, modifiers, global_modifiers) {
    trade_shop.innerHTML = "";
    trademenu_goldcount.innerHTML = `<span style='color: rgb(${color_gradient(0, 100, player.gold, std_red, {red: 255, green: 215, blue: 0})})'>Gold: ` + player.gold + "</span>";
    let verbose = player.config.devmode.trade_info,
    index = vendors.map(e => e.name).indexOf(vendor_name);
    if (index == -1) {
        if (verbose) console.warn(`Couldn't find vendor ${vendor_name} for scene ${player.scene}.`);
        return;
    }
    let trade_items = [];
    for (let i = 0, len = vendors[index].items.length; i < len; i++) {
        if (item_map.indexOf(vendors[index].items[i]) == -1) {
            if (verbose) console.warn(`Couldn't find item ${vendors[index].items[i]}.`);
            continue;
        }
        trade_items.push(items[item_map.indexOf(vendors[index].items[i])]);
    }
    if (trade_items.length == 0) {
        if (verbose) console.log(`No items to display for ${vendor_name} on scene ${player.scene}.`);
        // To Do: Add conditionality to items (maybe tie into reputation system).
        return;
    }

    // not necessary but good practice imo
    if (modifiers === undefined || modifiers === null) modifiers = [];
    if (typeof modifiers == "string") var mods = [modifiers];
    else var mods = modifiers;

    if (global_modifiers === undefined || global_modifiers === null) global_modifiers = [];
    if (typeof global_modifiers == "string") var global_mods = [global_modifiers];
    else var global_mods = global_modifiers;

    let inventory_map = player.inventory.map(e => e.name);
    for (let i = 0, len = trade_items.length; i < len; i++) {
        // main div
        let d = document.createElement("div");
        d.classList.add("trade_item");
        trade_shop.appendChild(d);
        // picture
        let img = document.createElement("img");
        img.src = `img/item/${trade_items[i].src}`;
        d.appendChild(img);
        // everything else
        let d2 = document.createElement("div");
        d.appendChild(d2);
        // item name
        let h = document.createElement("h1");
        h.classList.add("item_name");
        h.innerHTML = trade_items[i].name
        d2.appendChild(h);
        // description
        let p = document.createElement("p");
        p.classList.add("item_desc");
        p.innerHTML = trade_items[i].desc
        d2.appendChild(p);
        // own + cost container
        let d3 = document.createElement("div");
        d2.appendChild(d3);
        // own
        let p3 = document.createElement("p");
        p3.classList.add("item_owncount");
        if (inventory_map.indexOf(trade_items[i].name) == -1) p3.innerHTML = "Own: 0";
        else p3.innerHTML = "Own: " + player.inventory[inventory_map.indexOf(trade_items[i].name)].count;
        d3.appendChild(p3);
        // cost
        let p2 = document.createElement("p");
        p2.classList.add("item_cost");
        let cost = trade_items[i].cost;
        if (trade_items[i].tags !== undefined && modifiers.length > 0) cost = modify_item_cost(cost, trade_items[i].tags, mods, verbose);
        if (global_mods.length > 0) cost = modify_global_item_cost(cost, global_mods, verbose);
        if (player.gold < cost) p2.innerHTML = "<span style='color: lightcoral'>" + cost + " Gold</span>";
        else p2.innerHTML = cost + " Gold";
        d3.appendChild(p2);
        
        d.onclick = function() {attempt_buy_item(trade_items[i], cost, i)};
    }

    toggle_trade_menu();
}

var item_modifier_map = item_modifiers.map(e => e.name);

function attempt_buy_item(item, cost, el_index) {
    let inventory_map = player.inventory.map(e => e.name);
    let verbose = player.config.devmode.trade_info;
    if (verbose) console.log(`Attempting to buy item ${item.name} for ${cost} gold, player has ${player.gold} gold.`);
    if (player.gold < cost) {
        document.getElementsByClassName("item_cost")[el_index].innerHTML = "<span style='color: lightcoral'>Not Enough Gold!</span>";
        return;
    }
    player.gold -= cost;
    if (inventory_map.indexOf(item.name) !== -1) {
        if (verbose) console.log("Found item in inventory already, incrementing count by 1.", item);
        player.inventory[inventory_map.indexOf(item.name)].count += 1;
    }
    else {
        if (verbose) console.log("Adding new item to inventory.", item);
        player.inventory.push({name: item.name, count: 1});
        inventory_map.push(item.name);
    }

    document.getElementsByClassName("item_owncount")[el_index].innerHTML = "Own: " + player.inventory[inventory_map.indexOf(item.name)].count;
    trademenu_goldcount.innerHTML = `<span style='color: rgb(${color_gradient(0, 100, player.gold, std_red, {red: 255, green: 215, blue: 0})})'>Gold: ` + player.gold + "</span>";

    update_item_gold_color();
}

function update_item_gold_color() {
    let items = document.getElementsByClassName("item_cost");
    for (let i = 0, len = items.length, g = player.gold; i < len; i++) {
        if (items[i].innerHTML.includes("N")) continue;
        if (items[i].innerHTML.includes("<")) continue;
        if (g < items[i].innerHTML.slice(0, items[i].innerHTML.indexOf(" "))) items[i].innerHTML = "<span style='color: lightcoral'>" + items[i].innerHTML + "</span>";
    }
}

function modify_item_cost(cost, item_tags, modifiers, verbose) {
    if (verbose) {
        //console.log(`Doing modify item cost with original cost ${cost}`);
        console.log("Item tags:", item_tags);
        console.log("Modifiers:", modifiers);
    }
    for (let i = 0, len = item_tags.length; i < len; i++) {
        if (modifiers.indexOf(item_tags[i]) == -1) continue;
        let mod_index = item_modifier_map.indexOf(item_tags[i]);
        if (mod_index == -1) {
            if (verbose) console.warn(`Couldn't find cost modifier for item with tag ${item_tags[i]}`);
            continue;
        }
        if (verbose) {
            let shown_cost = cost;
            console.log(`Changed the cost of an item from ${shown_cost} to ${shown_cost += item_modifiers[mod_index].offset} Gold thanks to tag ${item_tags[i]}.`);
        }
        cost += item_modifiers[mod_index].offset
    }
    return cost;
}

var global_item_modifiers_map = global_item_modifiers.map(e => e.name);

function modify_global_item_cost(cost, global_modifiers, verbose) {
    if (verbose) {
        //console.log(`Doing modify global item cost with original cost ${cost}`);
        console.log("Global Modifiers:", global_modifiers);
    }
    for (let i = 0, len = global_modifiers.length; i < len; i++) {
        if (global_item_modifiers_map.indexOf(global_modifiers[i]) == -1) {
            if (verbose) console.warn(`Couldn't find any global item modifiers for ${global_modifiers[i]}`);
            continue;
        }
        if (verbose) console.log(`Applying global item modifier ${global_modifiers[i]} to item.`);
        cost += global_item_modifiers[global_item_modifiers_map.indexOf(global_modifiers[i])].offset;
    }
    return cost;
}

function inventory_use(index, amount) {
    //console.log(`Using ${amount} x ${index}.`);
}
function inventory_discard(index, amount) {
    //console.log(`Discarding ${amount} x ${index}.`);
    player.inventory[index].count -= amount;
    if (doing_trade) regenerate_trade_owns(player.inventory[index].name, player.inventory[index].count);
    if (player.inventory[index].count <= 0) player.inventory.splice(index, 1);
    open_inventory(); // optimize this so it only changes the 1 item instead of refreshing all of them. currently stuck trying to delete node/child at index.
}

function regenerate_trade_owns(name, new_count) {
    //console.log("regenerating owns count with ", name, " and amount: ", new_count);
    let owns = document.getElementsByClassName("item_owncount"),
    names = document.getElementsByClassName("item_name");
    if (owns.length != names.length) {
        console.warn(`Couldn't check update trade menu own count for item ${name}, found ${names.length} item names but ${owns.length} item own counts!`);
        return;
    }
    for (let i = 0, len = names.length; i < len; i++) {
        if (name != names[i].innerText) continue;
        owns[i].innerText = "Own: " + new_count;
        break;
    }
}

function has_item(name, amount, max_amount) {
    // amount and max_amount are optional and both inclusively return true.
    let inventory_map = player.inventory.map(e => e.name);
    if (typeof name == "string") {
        let index = inventory_map.indexOf(name);
        if (index == -1) return false;
        if (amount && player.inventory[index].count < amount) return false;
        if (max_amount && player.inventory[index].count > max_amount) return false;
        return true;
    }
}

function set_tracked_stats() {
    for (var k in tracked_stats) {
        tracked_stats[k] = JSON.parse(JSON.stringify(player[k]));
        // Does not work for: Date, undefined, Infinity, RegExps, Maps, Sets, Blobs, FileLists, ImageDatas, sparse Arrays, Typed Arrays, and other complex types. Good thing I don't know what half of those are.
    }
}

function check_tracked_stats() {
    let return_array = [];
    for (var k in tracked_stats) {
        if (JSON.stringify(tracked_stats[k]) == JSON.stringify(player[k])) continue;
        return_array.push(k);
    }
    return return_array;
}

function make_delta_element(statname) {
    if (statname == "stats") {
        let output_array = [],
        player_stats = Object.keys(player.stats),
        local_tracked_stats = Object.keys(tracked_stats.stats);
        if (player_stats.length != local_tracked_stats.length) { // new stats added
            if (player_stats.length < local_tracked_stats.length) {
                console.warn("Option removed a player stat! This might be supported in the future, but for now please do not do this!");
                return;
            }
            for (let i = local_tracked_stats.length, len = player_stats.length; i < len; i++) {
                let p = document.createElement("p"),
                amount = player.stats[player_stats[i]].amount,
                name = player_stats[i];
                p.innerHTML = `${get_sign(amount)}${amount} ${name.charAt(0).toUpperCase() + name.slice(1)}`;
                //console.log(`New stat added: ${player_stats[i]}, ${player.stats[player_stats[i]].amount}`);
                output_array.push(p);
            }
        }
        else {
            for (let i = 0, len = player_stats.length; i < len; i++) {
                let new_amount = player.stats[player_stats[i]].amount,
                old_amount = tracked_stats.stats[local_tracked_stats[i]].amount,
                signed_delta = Math.floor(new_amount - old_amount),
                delta = Math.abs(signed_delta);
                if (delta < delta_thresholds.stats) continue;
                let p = document.createElement("p");
                p.innerHTML = `${get_sign(signed_delta)}${delta} ${player_stats[i].charAt(0).toUpperCase() + player_stats[i].slice(1)}`;
                output_array.push(p);
            }
        }
        return output_array;
    }
    let signed_delta = Math.floor((player[statname] ?? 0) - tracked_stats[statname]),
    delta = Math.abs(signed_delta);
    if (delta < delta_thresholds[statname] ?? delta + 1) return;
    let p = document.createElement("p");
    p.innerHTML = `${get_sign(signed_delta)}${delta} ${statname.charAt(0).toUpperCase() + statname.slice(1)}`;
    return p;
}

function get_sign(num) {
    if (num < 0) return "-";
    return "+";
}