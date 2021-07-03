const version = '0.1.25',
    game_window = document.getElementById('game');

// default config
const IGNOMINY_DEFAULT_CONFIG = {
    datetime: {
        format: 'dd/MM/yy h:mmp',
        twentyFourHourTime: false,
        showTimeOrdinals: true,
    },
    scenes: {
        enableHotkeys: true,
        showTimestamps: true,
        showAuthors: false,
        showVersion: false,
        showVersionLegacy: false,
    },
    saveload: {
        autoload: true,
        autosave: true,
    },
};

const SKILLS = {
    strength: {
        description:
            'Strength dictates fatigue gain, health, and damage dealt.',
        icon: 'img/ui/strength.png',
        alwaysVisible: true,
    },
    agility: {
        description: 'Agility is how fluently and rapidly you move.',
        icon: 'img/ui/agility.png',
        alwaysVisible: true,
    },
    proficiency: {
        description:
            'Proficiency is how efficiently you consume mana and how much of it you can store.',
        icon: 'img/ui/proficiency.png',
        alwaysVisible: true,
    },
    perception: {
        description:
            'Perception is your skill at detecting and observing your surroundings.',
        icon: 'img/ui/perception.png',
        alwaysVisible: true,
    },
};

{
    // Configuration Objects
    var defaults = {
            timestamps_config: {
                enabled: true,
                threshold: 15,
                unit: 0, // 0 - Minute, 1 - Hour, 2 - Day
            },
            devmode: {
                dead_links: true,
                saveload_data: false,
                scene_tracking: false,
                trade_info: false,
            },
            random: global_random(),
        },
        scene_presets = {
            default: { fatigue: 0.3, time: { second: 5 } },
            caravan: { fatigue: 10 }, // unused
        },
        tracked_stats = {
            health: 0,
            max_health: 0,
            mana: 0,
            max_mana: 0,
            stats: {},
            gold: 0,
            fatigue: 0,
        },
        delta_thresholds = {
            // (only shows messages if change is >= threshold)
            fatigue: 5,
            gold: 1,
            health: 1,
            mana: 1,
            max_mana: 1,
            max_health: 1,
            stats: 1,
        },
        keybinds = [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '0',
            '!',
            '@',
            '#',
            '$',
            '%',
            '^',
            '&',
            '*',
            '(',
            ')',
        ];
}

{
    // Player Related
    var player = {
            name: 'Default',
            homekingdom: 'Default',
            hometown: 'Default',
            health: 100,
            max_health: 100,
            mana: 100,
            max_mana: 100,
            gold: 100,
            fatigue: 0,
            stats: {
                strength: {
                    amount: 0,
                    description:
                        'Strength dictates fatigue gain, health, and damage dealt.',
                },
                agility: {
                    amount: 0,
                    description:
                        'Agility is how fluently and rapidly you move.',
                },
                proficiency: {
                    amount: 0,
                    description:
                        'Proficiency is how efficiently you consume mana and how much of it you can store.',
                },
                perception: {
                    amount: 0,
                    description:
                        'Perception is your skill at detecting and observing your surroundings.',
                },
            },
            scene: -1,
            previous_scene: null,
            config: {
                debug: 0,
                devmode: defaults.devmode,
                keybinds: true,
                timestamps: defaults.timestamps_config,
            },
            history: [],
            version: version,
            time: new Date(3051, 0, 1, 7, 0, 0, 0),
            random: defaults.random,
            inns: [],
            latest_time_increment: 0,
            inventory: [],
        },
        doing_trade = false; // TODO: doing_trade isn't necessary, instead check for TradeMenu.isOpen
}

{
    // UI Elements
    {
        // General Headers + Container
        var header_options = document.getElementsByClassName('header_options'),
            header_pages = document.getElementsByClassName('header_pages'),
            current_header = -1,
            header = document.getElementById('header');
    }

    {
        // Stats
        var stats_health = document.getElementById('stats_health'),
            stats_mana = document.getElementById('stats_mana'),
            stats_fatigue = document.getElementById('stats_fatigue'),
            stats_gold = document.getElementById('stats_gold'),
            stats_name = document.getElementById('stats_name'),
            stats_container = document.getElementById('header_1_2');
    }

    {
        // Map
        var this_year = new Date().getFullYear(),
            calculate_year = document.getElementById('calculate_year');
        calculate_year.innerHTML = this_year;
        calculate_year.title = 3051 - this_year + ' Years';

        var map_sliders = document.getElementsByClassName('map_options'),
            map_outputs = document.getElementsByClassName('map_outputs'),
            maps = document.getElementsByClassName('map_s'),
            zoom_level = 1,
            base_height = 1405.5,
            base_width = 2880,
            zoom_output = document.getElementsByClassName('map_zoom_output');

        for (let i = 0, len = maps.length; i < len; i++) {
            maps[i].width = base_width;
            maps[i].height = base_height;
        }
    }

    {
        // Inventory
        var inventory_title = document.getElementById('inv_title');
        inventory_container = document.getElementById('inv_container');
    }

    {
        // Colours
        var std_red = { red: 240, green: 128, blue: 128 },
            std_yellow = { red: 255, green: 214, blue: 0 },
            std_green = { red: 144, green: 238, blue: 144 },
            std_fullmana = { red: 127, green: 255, blue: 212 },
            std_nomana = { red: 128, green: 128, blue: 128 };
    }

    {
        // Trade
        //var trade_menu = document.getElementById('trade'),
        var trade_shop = document.getElementById('trade_shop'),
            trademenu_goldcount = document.getElementById('trade_gold');
    }

    {
        // Name Select
        var input_name = document.getElementById('player_input_name'),
            input_name_submit = document.getElementById('input_name_submit');

        input_name.addEventListener('keyup', function (input) {
            if (input_name.value.length < 1 || input_name.value.length > 20) {
                input_name_submit.disabled = true;
                input_name_submit.classList.add('nope');
                return;
            }
            if (input_name_submit.disabled == true) {
                input_name_submit.disabled = false;
                input_name_submit.classList.remove('nope');
            }
            if (input.key == 'Enter') {
                submit_name();
            }
        });
    }
}

{
    // Game Mechanic
    var current_options_displayed = [];
}
