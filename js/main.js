const version = "0.1.6";
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
        {name: "strength", amount: 0, description: "Strength is your raw power and might. It affects fatigue gain, health, and damage."},
        {name: "agility", amount: 0, description: "Agility is how fluently and rapidly you move."},
        {name: "proficiency", amount: 0, description: "Proficiency is how efficiently you use magical powers. It affects maximum mana and how much mana your spells use."},
        {name: "perception", amount:0, description: "Perception is your skill at detecting and observing your surroundings."}
    ],
    scene: -1,
    config: {
        headers: [0, 1, 2, 3, 4],
        debug: 0,
        chrono: {
            day: "dd",
            month: "mm",
            year: "yyyy",
            time: 12, // 12 or 24
            order: 0, // 0 = Date Time, 1 = Time Date
            mode: 0
            /* Modes:
                0.1 - dddd dd mmmm yyyy - Tuesday 27th March 3051
                0.2 - ddd dd mmmm yyyy - Tue 27th March 3051
                1.1 - 
                2
                3
            */
        }
    },
    version: version,
    time: new Date(3051, 0, 0, 6, 0, 0, 0)
}

function generate_game(scene) {
    unhide_headers();
    update_header_borders();
    update_chrono();
    console.log(scene + player.hometown);
}