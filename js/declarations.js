const version = '0.1.22',
  harsh_check = true,
  game_window = document.getElementById('game');

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
      chrono: {
        time: 12, // 12 or 24
        reversed: false,
        ordinals: true,
        date_format: 'dddd d mmmm yyyy',
        time_format: 'h:mm',
      },
      meta: {
        authors: false,
        version: false,
        legacy_version: false,
      },
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
          description: 'Agility is how fluently and rapidly you move.',
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
        headers: [0, 1, 2, 3, 4],
        debug: 0,
        devmode: defaults.devmode,
        chrono: defaults.chrono,
        meta: defaults.meta,
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
    doing_trade = false,
    // TODO: doing_trade isn't necessary, instead check for TradeMenu.isOpen
    past_versions = ['0.1.16'];
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
    // Menu
    // Header & General Elements
    var main_menu = document.getElementById('header_0_main'),
      main_menu_cards = document.getElementsByClassName('mmc');
    main_menu.innerHTML =
      `<span title='Playing Ignominy on version ${version}'>` +
      'Ignominy ' +
      version +
      '</span>';

    // Save + Load
    {
      var saveload_defaults = {
          save: [
            {
              text: 'Browser Storage',
              inline: 'Recommended',
              inline_color: '#90EE90',
              title:
                'Save is stored in selected browsers cache (local storage).',
            },
            {
              text: 'File',
              inline: 'Safest',
              inline_color: '#FFD700',
              title: 'Saves to downloads folder of local machine.',
            },
            {
              text: 'Server',
              inline: 'Cross-Platform',
              inline_color: '#FFC0CB',
              title:
                'Saves to online server, requires playing from official website.',
            },
          ],
          load: [
            'Browser Storage',
            'Load from browser cache.',
            'File',
            'Load file from computer.',
            'Server',
            'Load file from server, requires playing from official website.',
          ],
        },
        saveload_current_changed = [-1, false],
        saveload_options = document.getElementsByClassName('saveload_option'),
        special_load_option = document.getElementById('load_file_label'),
        file_holder = document.getElementById('load_file');
    }

    // Date & Time
    {
      var config_date_format = document.getElementById('config_date_format'),
        config_date_ordinals = document.getElementById('date_ordinals'),
        config_time_format = document.getElementById('config_time_format'),
        config_time_hours = document.getElementById('time_hours'),
        config_reverse = document.getElementById('chrono_reverse');

      // Event Listeners
      config_date_format.addEventListener('input', function () {
        player.config.chrono.date_format = config_date_format.value;
        DateTimeManager.display();
      });
      config_time_format.addEventListener('input', function () {
        player.config.chrono.time_format = config_time_format.value;
        DateTimeManager.display();
      });
      config_date_ordinals.addEventListener('change', function () {
        if (this.checked) {
          player.config.chrono.ordinals = true;
        } else {
          player.config.chrono.ordinals = false;
        }
        DateTimeManager.display();
      });
      config_time_hours.addEventListener('change', function () {
        if (this.checked) {
          player.config.chrono.time = 24;
        } else {
          player.config.chrono.time = 12;
        }
        DateTimeManager.display();
      });
      config_reverse.addEventListener('change', function () {
        player.config.chrono.reversed = this.checked;
        DateTimeManager.display();
      });
    }

    // Dev
    {
      var config_debug = document.getElementById('debug_set'),
        config_debug_out = document.getElementById('debug_out'),
        config_dead_links = document.getElementById('config_dead_links'),
        config_saveload_data = document.getElementById('config_saveload_data'),
        config_scene_tracking = document.getElementById(
          'config_scene_tracking'
        );

      // Event Listeners
      config_dead_links.addEventListener('change', function () {
        if (this.checked) player.config.devmode.dead_links = true;
        else player.config.devmode.dead_links = false;
      });
      config_saveload_data.addEventListener('change', function () {
        if (this.checked) player.config.devmode.saveload_data = true;
        else player.config.devmode.saveload_data = false;
      });
      config_scene_tracking.addEventListener('input', function () {
        player.config.devmode.scene_tracking = this.checked;
      });
    }

    // Misc
    {
      var config_hotkeys = document.getElementById('hotkey_set'),
        config_timestamps_enable = document.getElementById('timestamps_set'),
        config_authors = document.getElementById('meta_authors'),
        config_versions = document.getElementById('meta_versions'),
        config_legacy_version = document.getElementById('meta_versions_legacy');

      // Event Listeners
      config_hotkeys.addEventListener('change', function () {
        if (this.checked) player.config.keybinds = true;
        else player.config.keybinds = false;
        update_keybind_config();
      });
      config_authors.addEventListener('change', function () {
        if (this.checked) player.config.meta.authors = true;
        else player.config.meta.authors = false;
      });
      config_versions.addEventListener('change', function () {
        if (this.checked) player.config.meta.version = true;
        else {
          player.config.meta.version = false;
          player.config.meta.legacy_version = false;
          config_legacy_version.checked = false;
        }
      });
      config_legacy_version.addEventListener('change', function () {
        if (this.checked) {
          config_versions.checked = true;
          player.config.meta.legacy_version = true;
          player.config.meta.version = true;
        } else player.config.meta.legacy_version = false;
      });
      config_timestamps_enable.addEventListener('input', function () {
        player.config.timestamps.enabled = this.checked;
      });
    }
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
