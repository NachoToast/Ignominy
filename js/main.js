const version = "0.1.6";

const game_window = document.getElementById("game");

var player = {
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
        debug: 0,
        chrono: {
            time: 12, // 12 or 24
            order: 0, // 0 = Date Time, 1 = Time Date
            ordinals: true,
            date_format: "dddd d mmmm yyyy",
            time_format: "h:mm"
        }
    },
    version: version,
    time: new Date(3051, 0, 1, 7, 0, 0, 0)
}

function generate_game(scene) {
    unhide_headers();
    setTimeout(update_header_borders, 10);
    update_chrono();
    if (player.config.debug > 0) console.log(`%cStarting game%c\nLoaded Scene: ${scene}\nPlayer Hometown: ${player.hometown}, ${player.homekingdom}`, 'color: lime', 'color: unset');
    next_scene(scene);
}

function next_scene(scene) {
    clear_game();
    let scene_index = story.map(e => e.id).indexOf(scene);
    // Probably should make function for universal scene identifiers
    if (scene_index == -1) {
        if (player.config.debug > 0) console.log(`Could not find index of scene ${scene}.`);
        scene_index = 0;
    }
    scene_index = 0;
    full_scene = story[scene_index];
    if (player.config.debug > 0) console.log(`Displaying scene ${scene_index}.`);
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
    if (player.config.debug > 0) console.log(`Found ${valid_text.length} valid text nodes.`);

    // now display all those recorded as 'valid'
    for (let i = 0, len = valid_text.length; i < len; i++) {
        for (let j = 0, j_len = valid_text[i].length; j < j_len; j++) {
            let p = document.createElement("p");
            p.innerHTML = valid_text[i][j];
            d.appendChild(p);
        }

    }

    display_options(scene);
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
    if (player.config.debug > 0) console.log(`Found ${valid_option.length} valid option nodes.`);
    if (valid_option.length == 0) console.warn(`Found no available options for scene ${scene.id}!`);

    // option displaying
    for (let i = 0, len = valid_option.length; i < len; i++) {
        let btn = document.createElement("btn");
        if (valid_option_true[i] == true) {
            btn.classList.add("std_options");
            btn.innerHTML = valid_option[i].text;
            btn.addEventListener('click', () => option_progress_scene(valid_option[i]));
        }
        else {
            btn.classList.add("std_options_fake");
            btn.innerHTML = valid_option[i].alternate;
        }
        d.appendChild(btn);
    }
}

function option_progress_scene(option) {
    console.log(option);
    if (option.time) {
        increment_time(option.time);
    }
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
    if (part["conditions"] === undefined) { // no conditions specified = unconditional
        if (player.config.debug > 0) console.log("No conditions specified.");
        return true;
    }

    // should probably improve error checking for this
    try {
        if (part.conditions(player)) {
            if (player.config.debug > 0) console.log("Met conditions specified.");
            return true;
        }
        else {
            if (player.config.debug > 0) console.log("Did not meet conditions specified.");
            return false;
        }
    }
    catch (err) {
        if (player.config.debug > 0) console.log("Did not meet conditions specified, condition error.");
        if (player.config.debug > 1) console.log(err);
        return false;
    }
}