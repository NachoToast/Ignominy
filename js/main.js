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
    stats: [
        {name: "strength", amount: 0, description: "Strength dictates fatigue gain, health, and damage dealt."},
        {name: "agility", amount: 0, description: "Agility is how fluently and rapidly you move."},
        {name: "proficiency", amount: 0, description: "Proficiency is how efficiently you consume mana and how much of it you can store."},
        {name: "perception", amount:0, description: "Perception is your skill at detecting and observing your surroundings."}
    ],
    scene: ["story_global", 0],
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
    time: new Date(3051, 0, 1, 23, 59, 0, 0)
}

function generate_game(scene) {
    unhide_headers();
    update_header_borders();
    update_chrono();
    if (player.config.debug > 0) console.log(`Starting game\nLoaded Scene: ${scene}\nPlayer Hometown: ${player.hometown}, ${player.homekingdom}`);
    next_scene(scene);
}

function next_scene(scene) {
    clear_game();
    player.scene = scene;
    display_scene(this[scene[0]][scene[1]])
}

function clear_game() {
    game_window.innerHTML = "";
}

function display_scene(scene) {
    let d = document.createElement("div");
    d.classList.add("std_window", "std_story");
    game_window.appendChild(d);
    let story_text = 
}