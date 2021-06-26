// old general UI functions, obsolete 0.1.20
{
  // General Functions
  /*   function recheck_ui_elements() {
    HeaderManager.updateHeaderBorders();
    //calibrate_trade_menu();
    if (Object.values(player.config.meta).indexOf(true) !== -1)
      UIManager.calibrateMetaElements(
        document.getElementsByClassName('std_meta_window')[0]
      );
  } */
  /*   function calibrate_meta(meta_element) {
    meta_element.style.marginTop =
      window.innerHeight - header.offsetHeight + 'px';
  } */
  /*   function change_debug_mode() {
    player.config.debug = config_debug.value;
    if (player.config.debug == 0) config_debug_out.innerText = 'Off';
    else config_debug_out.innerText = player.config.debug;
  } */
  /*   function color_gradient(min, max, current, color_a, color_b, color_c) {
    // returns an rgb value in the format "r, g, b"
    let color_progression;
    if (current >= max) color_progression = 1;
    else color_progression = (current - min) / (max - min); // Standardize as decimal [0-1 (inc)].
    if (color_c) {
      color_progression *= 2;
      if (color_progression >= 1) {
        color_progression -= 1;
        color_a = color_b;
        color_b = color_c;
      }
    }

    let new_red = color_a.red + color_progression * (color_b.red - color_a.red),
      new_green =
        color_a.green + color_progression * (color_b.green - color_a.green),
      new_blue =
        color_a.blue + color_progression * (color_b.blue - color_a.blue);

    let output_red = parseInt(Math.floor(new_red), 10),
      output_green = parseInt(Math.floor(new_green), 10),
      output_blue = parseInt(Math.floor(new_blue), 10);

    return `${output_red}, ${output_green}, ${output_blue}`;
    // final r = x (final red - initial red) + inital red
    // where x is how far along u are (1 = done, 0 = none)
  } */
}

// old header-related functions, obsolete 0.1.20
{
  // Headers
  /*   function show_header(option) {
    if (option == current_header) {
      header_pages[option].classList.add('hidden');
      current_header = -1;
      return;
    }
    if (option == 0) {
      // Menu
      update_menu();
    } else if (option == 1) {
      // Stats
      update_stats();
    } else if (option == 2) {
      // Map
      console.log('Map');
    } else if (option == 3) {
      // Date & Time
      console.log('Date');
    } else if (option == 4) {
      // Inventory
      open_inventory();
    }
    header_pages[current_header]?.classList.add('hidden');
    header_pages[option].classList.remove('hidden');
    current_header = option;
    header_pages[option].style.height =
      document.body.offsetHeight - header.offsetHeight + 'px';
  } */
  /*   function unhide_headers() {
    for (let i = 0, len = player.config.headers.length; i < len; i++) {
      if (player.config.debug > 3)
        console.log(
          `Unhiding header ${player.config.headers[i]} (${
            header_options[player.config.headers[i]].innerHTML
          }).`
        );
      header_options[player.config.headers[i]].classList.remove('hidden');
    }
    update_header_borders();
  } */
  /*   function update_header_borders() {
    let header_width = header.getBoundingClientRect().width;
    for (let i = 0, len = header_options.length; i < len; i++) {
      let my_right = header_options[i].getBoundingClientRect().right;
      if (Math.floor(my_right) >= header_width - 1)
        header_options[i].style.borderRight = 'none';
      else header_options[i].style.borderRight = 'solid 1px gray';
    }
  } */
}

// old trade menu functions, obsolete 0.1.20
{
  // Trade
  // function calibrate_trade_menu() {
  //trade_menu.style.minHeight = window.innerHeight - header.offsetHeight - 40 + "px";
  // }
  /*   function toggle_trade_menu(currently_open) {
    if (currently_open) {
      trade_menu.style.display = 'none';
      doing_trade = false;
      game_window.style.display = 'flex';
      document.removeEventListener('keydown', function (e) {
        if (e.key !== 'x') return;
        toggle_trade_menu(true);
      });
      return;
    }
    trade_menu.style.display = 'flex';
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'x') return;
      toggle_trade_menu(true);
    });
    doing_trade = true;
    game_window.style.display = 'none';
    recheck_ui_elements(); // holy shit it works as intended
  } */
}

// old inventory functions, obsolete 0.1.20
{
  // Inventory
  /*   function open_inventory() {
    let unique_item_count = player.inventory.length,
      full_item_count = 0;
    inv_items = [];
    inventory_container.innerHTML = '';

    if (unique_item_count != 0) {
      for (let i = 0; i < unique_item_count; i++) {
        // find the item in global items array
        let item_index = item_map.indexOf(player.inventory[i].name);
        if (item_index == -1) {
          console.warn(
            `Couldn't find item ${
              i + 1
            } from players inventory in global items array! (${
              player.inventory[i].name
            })`
          );
          continue;
        }
        let item = items[item_index],
          item_element = inventory_generate_item_card(item, i);
        inventory_container.appendChild(item_element);
        inv_items.push(item_element);
        full_item_count += player.inventory[i].count;
      }
    }
    inventory_title.innerHTML = `${player.name}'s Inventory (<span title="Unique item count" class="hover_gray">${unique_item_count}</span> <span title="Total item count" class="hover_gray">[${full_item_count}]</span>)`;
  }
  function inventory_generate_item_card(item, index) {
    // item div
    let d = document.createElement('div');
    d.classList.add('inv_item');
    // item image
    let img = document.createElement('img');
    img.src = `img/item/${item.src}`;
    d.appendChild(img);
    // div with the rest
    let d2 = document.createElement('div');
    d.appendChild(d2);
    // item name + count
    let h1 = document.createElement('h1');
    var count = player.inventory[index].count;
    h1.innerHTML = `${item.name} (${count})`;
    d2.appendChild(h1);
    // item description
    let desc = document.createElement('p');
    desc.innerHTML = item.desc;
    d2.appendChild(desc);
    // use/discard div
    var d3 = document.createElement('div');
    d2.appendChild(d3);
    // (use) div [not yet sure if should implement this feature]

    let d4 = document.createElement('div');
    d2.appendChild(d4);
    let p = document.createElement('p');
    p.innerHTML = 'Discard:';
    d4.appendChild(p);
    let p1 = document.createElement('p');
    p1.classList.add('id');
    p1.innerHTML = '1';
    p1.onclick = function () {
      inventory_discard(index, 1);
    };
    d4.appendChild(p1);
    if (count >= 50) {
      let p = document.createElement('p');
      p.innerHTML = '10';
      p.classList.add('id');
      p.onclick = function () {
        inventory_discard(index, 10);
      };
      d4.appendChild(p);
    } else if (count >= 10) {
      let p = document.createElement('p');
      p.innerHTML = '5';
      p.classList.add('id');
      p.onclick = function () {
        inventory_discard(index, 5);
      };
      d4.appendChild(p);
    }
    if (count > 1) {
      let p = document.createElement('p');
      p.classList.add('id');
      p.innerHTML = 'All';
      p.onclick = function () {
        inventory_discard(index, count);
      };
      d4.appendChild(p);
    }
    return d;
  } */
}

// Menu handling functions, obsolete 0.1.20
{
  // Menu
  /*   function update_menu() {
    // generate save/load html

    let save_elements = 0;
    for (
      let i = 0, len = saveload_defaults['save'].length;
      i < len;
      i++, save_elements++
    ) {
      let o = saveload_defaults['save'][i];
      saveload_options[
        i
      ].innerHTML = `<span title="${o.title}">${o.text} (<span style="color: ${o.inline_color}">${o.inline}</span>)</span>`;
    }

    if (player.config.debug > 3)
      console.log(`Found ${save_elements} save elements in menu.`);

    for (
      let i = 0, len = saveload_defaults['load'].length - save_elements;
      i < len;
      i++
    ) {
      let o = saveload_defaults['load'][2 * i],
        o2 = saveload_defaults['load'][2 * i + 1];
      saveload_options[
        save_elements + i
      ].innerHTML = `<span title="${o2}">${o}</span>`;
    }

    // split because save/load functions feedbacks shouldn't be overwritten on load.
    update_menu_elements();
  } */
  /*   function update_menu_elements() {
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

    if (player.config.debug == 0) config_debug_out.innerText = 'Off';
    else config_debug_out.innerText = player.config.debug;
    config_debug.value = player.config.debug;

    if (player.homekingdom == 'Default') {
      for (let i = 0, len = main_menu_cards.length; i < len; i++) {
        if (i == 1) continue;
        //console.log("hiding card " + i);
        main_menu_cards[i].classList.add('hidden');
      }
    } else {
      for (let i = 0, len = main_menu_cards.length; i < len; i++) {
        main_menu_cards[i].classList.remove('hidden');
      }
    }

    config_hotkeys.checked = player.config.keybinds;
    config_dead_links.checked = player.config.devmode.dead_links;
    config_saveload_data.checked = player.config.devmode.saveload_data;
    config_timestamps_enable.checked = player.config.timestamps.enabled;
    config_scene_tracking.checked = player.config.devmode.scene_tracking;
  } */
  /*   function change_save_option(index, message, color, title) {
    saveload_options[
      index
    ].innerHTML = `<span style="color: ${color}" title="${title}">${message}</span>`;
  } */
  /*   function change_load_option(index, message, color, title) {
    if (index == 1) {
      special_load_option.innerHTML = `<span style="color: ${color}" title="${title}">${message}</span>`;
      return;
    }
    saveload_options[
      index + saveload_defaults['save'].length
    ].innerHTML = `<span style="color: ${color}" title="${title}">${message}</span>`;
  } */
}

// DateTimeManager handles displaying and incrementation of game date and time
class DateTimeManager {
  static dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  static monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // helps convertDate method with replacements from config values ('yyyy', 'mmm', 'd', etc) to markers ('f20', 'f11', 'f03', etc)
  static dateConfigMap = {
    dddd: 'f00',
    ddd: 'f01',
    dd: 'f02',
    d: 'f03',
    mmmm: 'f10',
    mmm: 'f11',
    mm: 'f12',
    m: 'f13',
    yyyy: 'f20',
    yy: 'f21',
  };

  // adds ordinals ('st', 'nd', 'rd', 'th') to the day number
  static addOrdinals(num) {
    if ([11, 12, 13].indexOf(num) != -1) return 'th'; // 11, 12, 13 edge cases

    switch (num % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  static convertToLongDay = (numDay) => this.dayNames[numDay];
  static convertToLongMonth = (numMonth) => this.monthNames[numMonth];

  // converts numerical date values (year, month, day) into player-specified format
  static convertDate(
    date = player.config.chrono.date_format, // date format string, e.g. 'dddd d mmmm, yyyy' could be 'Friday 18 June, 2021'
    timeObj = player.time, // date object
    incOrdinals = player.config.chrono.ordinals // whether to include the 'st', 'nd', 'rd', and 'th' at the end of the day number (if present)
  ) {
    const dayNum = timeObj.getDate(),
      dayLong = this.convertToLongDay(timeObj.getDay()),
      monthNum = timeObj.getMonth(),
      monthLong = this.convertToLongMonth(monthNum),
      year = timeObj.getFullYear(),
      ordinals = incOrdinals ? this.addOrdinals(dayNum) : '';

    // selector conversion: format is fXX
    // f = marker
    // first X: 0 = day, 1 = month, 2 = year
    // second X: 0 = full, 1 = 3-letter, 2 = full numerical, 3 = short numerical
    // this is done to avoid replacing > once, e.g. simply replacing 'm' with the month number doesn't work since 'September' has an 'm' in it

    // dateMap converts markers to formatted date components
    const dateMap = {
      // day
      f00: dayLong,
      f01: dayLong.substring(0, 3), // 'ddd' abbreviated day e.g. Fri
      f02: dayNum < 10 ? '0' + dayNum : dayNum,
      f03: dayNum + ordinals, // 'd' single digit day e.g. 18

      // month
      f10: monthLong,
      f11: monthLong.substring(0, 3), // 'mmm' abbreviated month e.g. Jun
      f12: monthNum < 10 ? '0' + monthNum : monthNum, // 'mm' 2 digit month e.g. 06
      f13: monthNum, // 'm' single digit month, e.g. 6

      // year
      f20: year, // 'yyyy' full year e.g. 2021
      f21: year.toString().substring(2), // 'yy' short numeric year e.g. 21
    };

    // replace config with markers
    date = date.replace(
      /dddd|ddd|dd|d|mmmm|mmm|mm|m|yyyy|yy/g,
      (char) => this.dateConfigMap[char]
    );

    // replace markers with real date
    date = date.replace(
      /f00|f01|f02|f03|f10|f11|f12|f13|f20|f21/g,
      (char) => dateMap[char]
    );

    return date;
  }

  // converts numerical time values (hour, minute, second) into player-specified format
  static convertTime(
    time = player.config.chrono.time_format, // time format string, e.g. 'h:mm' could be '10:11am'
    timeObj = player.time, // date object
    hour24Time = player.config.chrono.time === 24 // whether to use 24 hour time, removing the 'am' and 'pm' suffixes
  ) {
    let hour = timeObj.getHours();

    const second = timeObj.getSeconds(),
      minute = timeObj.getMinutes(),
      period = hour >= 12 ? 'pm' : 'am';

    if (!hour24Time && hour > 12) {
      // 12 hour time format should take modulus 12 of the hour if > 12, e.g. 13 becomes 1
      hour -= 12;
    }
    if (hour === 0 && !hour24Time) {
      // 12 hour time format should display the 0th hour as 12
      hour = 12;
    }

    const timeConfigMap = {
      ss: second < 10 ? '0' + second : second,
      s: second,
      mm: minute < 10 ? '0' + minute : minute,
      m: minute,
      hh: hour < 10 ? '0' + hour : hour,
      h: hour,
    };

    time = time.replace(/ss|s|mm|m|hh|h/g, (char) => timeConfigMap[char]);

    if (!hour24Time) {
      // 12 hour time format should show 'am' and 'pm' suffixes
      time += ' ' + period;
    }

    return time;
  }
}

{
  // private
  /*   function update_date() {
    let year = player.time.getFullYear(),
      month = player.time.getMonth(),
      day = player.time.getDate(),
      long_day = player.time.getDay(),
      ordinals = '',
      date = player.config.chrono.date_format;

    // Selector Conversion
    // f = Marker
    // 0 = Day, 1 = Month, 2 = Year
    // 0 = Full, 1 = 3-Letter, 2 = Full Numerical, 3 = Short Numerical
    // Days
    date = date.replace(/dddd/g, 'f00');
    date = date.replace(/ddd/g, 'f01');
    date = date.replace(/dd/g, 'f02');
    date = date.replace(/d/g, 'f03');
    // Months
    date = date.replace(/mmmm/g, 'f10');
    date = date.replace(/mmm/g, 'f11');
    date = date.replace(/mm/g, 'f12');
    date = date.replace(/m/g, 'f13');
    // Years
    date = date.replace(/yyyy/g, 'f20');
    date = date.replace(/yy/g, 'f21');

    // Long Day
    if (date.includes('f00'))
      date = date.replace(/f00/g, convert_day(long_day));
    if (date.includes('f01'))
      date = date.replace(/f01/g, convert_day(long_day).substring(0, 3));
    // Short Day
    if (date.includes('f02')) {
      let local_day = day;
      if (player.config.chrono.ordinals == true) {
        ordinals = DateTimeManager.addOrdinals(day);
      }
      if (day < 10) local_day = '0' + local_day;
      date = date.replace(/f02/g, local_day + ordinals);
    }
    if (date.includes('f03')) {
      if (player.config.chrono.ordinals == true) {
        ordinals = DateTimeManager.addOrdinals(day);
      }
      date = date.replace(/f03/g, day + ordinals);
    }

    // Long Month
    if (date.includes('f10')) date = date.replace(/f10/g, convert_month(month));
    if (date.includes('f11'))
      date = date.replace(/f11/g, convert_month(month).substring(0, 3));
    // Short Month
    if (date.includes('f12')) {
      let local_month = month + 1;
      if (month < 10) local_month = '0' + local_month;
      date = date.replace(/f12/g, local_month);
    }
    if (date.includes('f13')) date = date.replace(/f13/g, month + 1);

    // Year
    if (date.includes('f20')) date = date.replace(/f20/g, year);
    if (date.includes('f21'))
      date = date.replace(/f21/g, year.toString().substring(2));

    return date;
  } */

  // private
  /*   function update_time() {
    (hour = player.time.getHours()),
      (minute = player.time.getMinutes()),
      (second = player.time.getSeconds()),
      (a = ''),
      (time = player.config.chrono.time_format);
    // Selector Conversion
    // f = Marker
    // 0 = Hour, 1 = Minute, 2 = Second
    // 0 = Full, 1 = Short
    time = time.replace(/hh/g, 'f00');
    time = time.replace(/h/g, 'f01');
    time = time.replace(/mm/g, 'f10');
    time = time.replace(/m/g, 'f11');
    time = time.replace(/ss/g, 'f21');
    time = time.replace(/s/g, 'f20');

    if (player.config.chrono.time == 12) {
      // 12hr Conversion
      if (hour >= 12) a = 'pm';
      else a = 'am';

      if (hour > 12) hour -= 12;
      if (hour == 0) hour = 12;
    }

    if (time.includes('f00')) {
      let local_hour = hour;
      if (hour < 10) local_hour = '0' + local_hour;
      time = time.replace(/f00/g, local_hour);
    }
    if (time.includes('f01')) time = time.replace(/f01/g, hour);
    if (time.includes('f10')) {
      let local_minute = minute;
      if (minute < 10) local_minute = '0' + local_minute;
      time = time.replace(/f10/g, local_minute);
    }
    if (time.includes('f11')) time = time.replace(/f11/g, minute);
    if (time.includes('f20')) time = time.replace(/f20/g, second);
    if (time.includes('f21')) {
      let local_second = second;
      if (second < 10) local_second = '0' + local_second;
      time = time.replace(/f21/g, local_second);
    }
    return time + a;
  } */

  // public - updates UI so called on config changes, time incrementation, and game starts/loads
  function update_chrono(reversed = player.config.chrono.reversed) {
    let date = DateTimeManager.convertDate(),
      time = DateTimeManager.convertTime();

    if (reversed) header_options[3].innerText = date + ' ' + time;
    else header_options[3].innerText = time + ' ' + date;

    HeaderManager.updateHeaderBorders();
  }

  // private
  /*   function convert_month(num) {
    if (num == 0) return 'January';
    else if (num == 1) return 'February';
    else if (num == 2) return 'March';
    else if (num == 3) return 'April';
    else if (num == 4) return 'May';
    else if (num == 5) return 'June';
    else if (num == 6) return 'July';
    else if ((num = 7)) return 'August';
    else if (num == 8) return 'September';
    else if (num == 9) return 'October';
    else if (num == 10) return 'November';
    else if (num == 11) return 'December';
    else return 'Invalid month!';
  } */

  // private
  /*   function convert_day(num) {
    if (num == 0) return 'Sunday';
    if (num == 1) return 'Monday';
    if (num == 2) return 'Tuesday';
    if (num == 3) return 'Wednesday';
    if (num == 4) return 'Thursday';
    if (num == 5) return 'Friday';
    if (num == 6) return 'Saturday';
    else return 'Invalid day!';
  } */

  // private
  /*   function random_date() {
    let random_year = Math.floor(Math.random() * (3052 - 2000) + 2000),
      random_month = Math.floor(Math.random() * 12),
      random_day = Math.floor(Math.random() * (29 - 1) + 1),
      random_hour = Math.floor(Math.random() * 61),
      random_minute = Math.floor(Math.random() * 61);

    player.time = new Date(
      random_year,
      random_month,
      random_day,
      random_hour,
      random_minute,
      0,
      0
    );
    update_chrono();
    console.log(header_options[3].innerHTML);
  } */
}

function update_stats() {
  // visual only

  // name
  stats_name.innerText = player.name;

  // health
  let health_rgb = UIManager.colorGradient(
      0,
      player.max_health,
      player.health,
      std_red,
      std_yellow,
      std_green
    ),
    mana_rgb = UIManager.colorGradient(
      0,
      player.max_mana,
      player.mana,
      std_nomana,
      std_fullmana
    );
  //let tip_top = "144, 238, 144";
  stats_health.innerHTML = `Health: <span style='color: rgb(${health_rgb})'>${
    player.health
  }</span>/${player.max_health} [<span style='color: rgb(${health_rgb})'>${(
    (100 * player.health) /
    player.max_health
  ).toFixed(0)}%</span>]`;

  // mana
  stats_mana.innerHTML = `Mana: <span style='color: rgb(${mana_rgb})'>${
    player.mana
  }</span>/${player.max_mana} [<span style='color: rgb(${mana_rgb})'>${(
    (100 * player.mana) /
    player.max_mana
  ).toFixed(0)}%</span>]`;

  // clear old stats elements [this could probably be optimized]
  let children = stats_container.childElementCount;
  while (children > 2) {
    stats_container.removeChild(stats_container.lastElementChild);
    children -= 1;
  }

  // fatigue
  stats_fatigue.innerHTML =
    `Fatigue <span style='color: rgb(${UIManager.colorGradient(
      0,
      100,
      Math.ceil(player.fatigue),
      { red: 255, green: 255, blue: 255 },
      std_yellow,
      std_red
    )})'>` +
    Math.ceil(player.fatigue) +
    '</span>';
  // gold
  stats_gold.innerHTML = 'Gold ' + player.gold;

  // stats
  for (let i = 0, len = Object.keys(player.stats).length; i < len; i++) {
    // div
    let d = document.createElement('div');
    d.classList.add('stats');
    stats_container.appendChild(d);
    // span
    let s = document.createElement('span');
    s.title = player.stats[Object.keys(player.stats)[i]].description;
    d.appendChild(s);
    // img
    let img = document.createElement('img');
    img.src = `img/ui/${Object.keys(player.stats)[i]}.png`;
    s.appendChild(img);
    // p
    let p = document.createElement('p');
    p.innerHTML =
      Object.keys(player.stats)[i].charAt(0).toUpperCase() +
      Object.keys(player.stats)[i].slice(1) +
      ' ' +
      player.stats[Object.keys(player.stats)[i]].amount;
    s.appendChild(p);
  }
}

// GameManager encapsulates the whole game instance
class GameManager {
  constructor(initial = false) {
    if (initial) {
      console.log(`GameManager instantiated on version ${version}`);
    } else console.log(this.name);
  }
}

// UIManager handles headers, header pages, page resizing, and the trade menu
class UIManager extends GameManager {
  // page resize handling
  static resizeHandler() {
    HeaderManager.updateHeaderBorders();

    // call to refresh meta if enabled
    if (Object.values(player.config.meta).some((e) => e)) {
      UIManager.calibrateMetaElements(
        document.getElementsByClassName('std_meta_window')[0]
      );
    }
  }

  // meta element positioning
  // TODO: Fix div position bugs for this.
  static calibrateMetaElements(metaElement = undefined) {
    if (metaElement === undefined) {
      // BUG: Meta enabled before next scene press = do resize event but meta element doesn't exist yet = error
      console.warn("Tried to resize meta element which doens't yet exist!");
      return;
    }
    metaElement.style.marginTop =
      window.innerHeight - header.offsetHeight + 'px';
  }

  // handles changing debugmode
  // TODO: Overhaul debug/devmode
  static changeDebugMode() {
    player.config.debug = parseInt(config_debug.value);
    if (player.config.debug == 0) {
      config_debug_out.innerText = 'Off';
    } else {
      config_debug_out.innerText = player.config.debug;
    }
  }

  // returns CSS-friendly RGB value as a progression from colorA to colorB (option third color), input color {r: 255, g: 255, b: 255}
  static colorGradient(
    min = 0,
    max = 100,
    current = 50,
    colorA = { r: 0, g: 255, b: 0 },
    colorB = { r: 255, g: 0, b: 0 },
    colorC = undefined
  ) {
    let colorProgression;

    if (min == max) {
      console.warn(
        'Color gradient function cannot have identical minimum and maximum values!'
      );
      return `0, 0, 0`;
    }
    colorProgression = (current - min) / (max - min); // standardize progression to 0-1 (inc)
    colorProgression = Math.max(colorProgression, 0); // lowest progression possible = 0
    colorProgression = Math.min(colorProgression, 1); // highest progression possible = 1

    if (colorC) {
      colorProgression *= 2; // double scale if third colour present
      if (colorProgression >= 1) {
        // if more than halfway set the 'min' color to colorB and the 'max' color to colorC
        colorA = colorB;
        colorB = colorC;
        colorProgression -= 1;
      }
    }

    let redProgress = colorA.red + colorProgression * (colorB.red - colorA.red),
      greenProgress =
        colorA.green + colorProgression * (colorB.green - colorA.green),
      blueProgress =
        colorA.blue + colorProgression * (colorB.green - colorA.green);

    return `${parseInt(redProgress)}, ${parseInt(greenProgress)}, ${parseInt(
      blueProgress
    )}`;
  }
}

// HeaderManager handles header page opening and closing
class HeaderManager extends UIManager {
  // headActions states what each header does when opened
  static headerActions = [
    () => MenuManager.updateSaveLoadElements(), // menu
    () => update_stats, // stats
    () => null, // map
    () => null, // date/time
    () => InventoryManager.open(), // inventory
  ];

  // displays header page (or hides if already open)
  static showHeader(headerNumber = 0) {
    if (headerNumber == current_header) {
      header_pages[headerNumber].classList.add('hidden');
      current_header = -1;
      return;
    }

    if (current_header != -1) {
      header_pages[current_header].classList.add('hidden');
    }
    this.headerActions[headerNumber]();
    header_pages[headerNumber].classList.remove('hidden');
    current_header = headerNumber;
    header_pages[headerNumber].style.height =
      document.body.offsetHeight - header.offsetHeight + 'px';
  }

  // unhides all headers specified in player config
  static unhideAllHeaders() {
    for (let i = 0, len = player.config.headers.length; i < len; i++) {
      header_options[player.config.headers[i]].classList.remove('hidden');
    }
  }

  // hides/shows right border of header options if touching right side of window
  // TODO: Better border display method (maybe permanent?) so this isn't called every resize event.
  static updateHeaderBorders() {
    let headerWidth = header.getBoundingClientRect().width;
    for (let i = 0, len = header_options.length; i < len; i++) {
      let myRight = header_options[i].getBoundingClientRect().right;
      if (Math.floor(myRight) >= headerWidth - 1) {
        header_options[i].style.borderRight = 'none';
      } else {
        header_options[i].style.borderRight = 'solid 1px gray';
      }
    }
  }
}

// TradeManager controls hiding/showing of trade menu
class TradeManager extends UIManager {
  static isOpen = false;

  static menuCloseKey = (e) => {
    if (e.key === 'x') TradeManager.toggleMenu();
  };

  static get open() {
    return this.isOpen;
  }

  static toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
    this.isOpen = !this.isOpen;
  }

  static openMenu() {
    trade_menu.style.display = 'flex';
    document.addEventListener('keydown', this.menuCloseKey);
  }

  static closeMenu() {
    trade_menu.style.display = 'none';
    doing_trade = false;
    game_window.style.display = 'flex';
    document.removeEventListener('keydown', this.menuCloseKey);
  }
}

// MenuManager handles updates to save/load buttons (for feedback) and config control
class MenuManager extends UIManager {
  static saveLoadOptions = [
    {
      text: 'Browser Storage',
      comment: 'Recommended',
      color: '#90EE90',
      tooltip: 'Saves to browsers cache (local storage).',
    },
    {
      text: 'File',
      comment: 'Safest',
      color: '#FFD700',
      tooltip: 'Saves to downloads folder of local machine.',
    },
    {
      text: 'Server',
      comment: 'Cross-Platform',
      color: '#FFC0CB',
      tooltip:
        'Saves to online server, requires playing from official website.',
    },
  ];

  static feedbackColors = {
    true: '#90EE90',
    false: '#F08080',
  };

  // called on every click on the 'Menu' header (if not open already)
  static updateSaveLoadElements() {
    // generate save and load button elements
    for (let i = 0, len = this.saveLoadOptions.length; i < len; i++) {
      let text = this.saveLoadOptions[i].text,
        comment = this.saveLoadOptions[i].comment,
        color = this.saveLoadOptions[i].color,
        tooltip = this.saveLoadOptions[i].tooltip;
      // save element
      saveload_options[
        i
      ].innerHTML = `<span title='${tooltip}'>${text} (<span style='color: ${color}'>${comment}</span>)</span>`;

      // load element
      saveload_options[len + i].innerHTML = `<span title='${tooltip
        .replace(/Saves /g, 'Loads ')
        .replace(/ to /g, ' from ')}'>${text}</span>`;
    }

    MenuManager.updateMenuWidgets();
  }

  // called (indirectly) on every click of the 'Menu' header, and on save/load
  static updateMenuWidgets() {
    /// displaying config changes
    // date/time format
    config_date_format.value = player.config.chrono.date_format;
    config_time_format.value = player.config.chrono.time_format;

    config_time_hours.checked = !player.config.chrono.time == 12;
    config_date_ordinals.checked = player.config.chrono.ordinals;

    update_chrono();

    // meta
    config_authors.checked = player.config.meta.authors;
    config_versions.checked = player.config.meta.version;
    config_legacy_version.checked = player.config.meta.legacy_version;

    // debug
    config_debug.value = player.config.debug; // slider
    if (player.config.debug == 0) {
      // slider text
      config_debug_out.innerText = 'Off';
    } else {
      config_debug_out.innerText = player.config.debug;
    }

    // misc config options
    config_hotkeys.checked = player.config.keybinds;
    config_dead_links.checked = player.config.devmode.dead_links;
    config_saveload_data.checked = player.config.devmode.saveload_data;
    config_timestamps_enable.checked = player.config.timestamps.enabled;
    config_scene_tracking.checked = player.config.devmode.scene_tracking;

    /// hide headers if not in game
    if (player.homekingdom == 'Default') {
      for (let i = 0, len = main_menu_cards.length; i < len; i++) {
        if (i == 1) continue; // never hide main menu header
        main_menu_cards[i].classList.add('hidden');
      }
    } else {
      for (let i = 0, len = main_menu_cards.length; i < len; i++) {
        main_menu_cards[i].classList.remove('hidden');
      }
    }
  }

  // called on save/load attempts, updates relevant button to show feedback (success/failure)
  // TODO: More descriptive feedback somewhere along the chain?
  static showAttemptFeedback(
    index = 0,
    message = 'Unable to save!',
    success = false,
    type = 0
  ) {
    // type 0 = save, type 1 = load
    if (type === 1) index += this.saveLoadOptions.length;
    saveload_options[
      index
    ].innerHTML = `<span style='color: ${this.feedbackColors[success]}'>${message}</span>`;
  }
}

// InventoryManager handles UI related activities in player inventory
class InventoryManager extends UIManager {
  // open the inventory
  static open() {
    let uniqueCount = player.inventory.length,
      fullCount = 0,
      invItems = [];

    inventory_container.innerHTML = '';

    if (uniqueCount != 0) {
      for (let i = 0, len = uniqueCount; i < len; i++) {
        // find item in global items array
        let itemIndex = item_map.indexOf(player.inventory[i].name);
        if (itemIndex == -1) {
          console.warn(
            `Couldn't find item ${i + 1} - ${
              player.inventory[i].name
            } from inventory in global items list.`,
            player.inventory[i]
          );
          continue;
        }

        let item = items[itemIndex],
          itemElement = this.generateItemCard(item, i);
        inventory_container.appendChild(itemElement);
        invItems.push(itemElement);
        fullCount += player.inventory[i].count;
      }
    }

    inventory_title.innerHTML = `${player.name}'s Inventory (<span title='Unique Item Count' class='hover_gray'>${uniqueCount}</span> <span title='Total Item Count' class='hover_gray'>[${fullCount}]</span>)`;
  }

  // generates a 'card' with item name, description, image, count, and other metadata
  static generateItemCard(item, index = 0) {
    // main div
    let itemCard = document.createElement('div');
    itemCard.classList.add('inv_item');

    // image
    let img = document.createElement('img');
    img.src = `img/item/${item.src}`;
    itemCard.appendChild(img);

    // metadata div
    let infoDiv = document.createElement('div');

    // name + count
    let h1 = document.createElement('h1');
    let count = player.inventory[index].count;
    h1.innerHTML = `${item.name} (${count})`;
    infoDiv.appendChild(h1);

    // description
    let desc = document.createElement('p');
    desc.innerHTML = item.desc;
    infoDiv.appendChild(desc);

    // [use] options
    let useDiv = document.createElement('div');
    {
      // item use buttons, currently unused
      /*       if (item?.user !== undefined) {
        infoDiv.appendChild(
          this.itemFuncElements(
            'Use',
            player.inventory[index].count,
            'iu',
            index,
            (a, b) => inventory_use(a, b)
          )
        );
      } */
    }
    infoDiv.appendChild(useDiv);

    // [discard] options
    infoDiv.appendChild(
      this.itemFuncElements(
        'Discard',
        player.inventory[index].count,
        'id',
        index,
        (a, b) => inventory_discard(a, b)
      )
    );

    itemCard.appendChild(infoDiv);

    return itemCard;
  }

  // helper for generateItemCards, to create the discard/use X elements
  static itemFuncElements(
    type = 'Discard', // label to give action in inventory, e.g. 'Discard' or 'Use'
    amount = 1, // amount of item the player has
    cssClass = '', // if buttons have special hover styling, etc
    index = 0, // index of item in global items array
    action = (a, b) => inventory_discard(a, b) // what clicking the button actually does
  ) {
    let infoDiv = document.createElement('div');
    infoDiv.innerHTML = `${type}: `;

    let numbersToGenerate = [1];
    if (amount >= 50) {
      numbersToGenerate.push(10);
    } else if (amount >= 10) {
      numbersToGenerate.push(5);
    }

    // loop
    for (let i = 0, len = numbersToGenerate.length; i < len; i++) {
      let varAmount = document.createElement('p');
      varAmount.classList.add(cssClass);
      varAmount.innerHTML = numbersToGenerate[i];
      varAmount.onclick = () => action(index, numbersToGenerate[i]);
      infoDiv.appendChild(varAmount);
    }

    // all
    if (amount > 1) {
      let all = document.createElement('p');
      all.classList.add(cssClass);
      all.innerHTML = 'All';
      all.onclick = () => action(index, amount);
      infoDiv.appendChild(all);
    }

    return infoDiv;
  }
}

var CurrentGame = new GameManager(true);
