// DateTimeManager handles displaying and incrementation of game date and time
class DateTimeManager {
  static tracking = true;
  static trackingColor = 'rgb(255, 238, 139)';

  static dateOutputElement = header_options[3];

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

  // displays a formatted date to HTML element
  static display(
    outputElement = this.dateOutputElement, // the HTML element to write the date and time to
    reversed = player.config.chrono.reversed, // whether the date and time should be in reversed order
    updateHeaders = true // whether to call the update header borders method once the date is written
  ) {
    if (this.tracking) {
      console.log(
        `%c[${this.name}]%c Displaying date`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }
    if (reversed) {
      outputElement.innerHTML = this.convertTime() + ' ' + this.convertDate();
    } else {
      outputElement.innerHTML = this.convertDate() + ' ' + this.convertTime();
    }

    if (updateHeaders) {
      HeaderManager.updateHeaderBorders();
    }
  }
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

// UIManager handles headers, header pages, page resizing, and the trade menu
class UIManager {
  static tracking = true;
  static trackingColor = 'rgb(255, 238, 139)';

  // page resize handling
  static resize() {
    if (this.tracking) {
      console.log(
        `%c[${this.name}]%c Resizing headers`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }

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
        `%c[${this.name}]%c Color gradient function cannot have identical minimum and maximum values! (min: ${min}, max: ${max})`,
        `color: ${this.trackingColor}`,
        `color: white;`
      );
      return `255, 255, 255`;
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
        colorA.blue + colorProgression * (colorB.blue - colorA.blue);

    return `${parseInt(redProgress)}, ${parseInt(greenProgress)}, ${parseInt(
      blueProgress
    )}`;
  }
}

// HeaderManager handles header page opening and closing
class HeaderManager {
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

// TradeMenu controls hiding/showing of trade menu, keydown listening, and generation of new trades
class TradeMenu {
  static tracking = true;
  static trackingColor = 'rgb(255, 238, 139)';

  static menuElement = document.getElementById('trade');
  static isOpen = false;

  // keydown listener
  static checkMenuClose = (e) => {
    if (e.key === 'x') {
      this.toggle();
    }
  };

  static toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
    this.isOpen = !this.isOpen;
  }

  static open() {
    if (this.tracking) {
      console.log(
        `%c[${this.name}]%c Opening trade menu`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }

    this.menuElement.style.display = 'flex';
    game_window.style.display = 'none';
    document.addEventListener('keydown', this.checkMenuClose);
    doing_trade = true;
  }

  static close() {
    if (this.tracking) {
      console.log(
        `%c[${this.name}]%c Closing trade menu`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }

    this.menuElement.style.display = 'none';
    game_window.style.display = 'flex';
    document.removeEventListener('keydown', this.checkMenuClose);
    doing_trade = false;
  }
}

// MenuManager handles updates to save/load buttons (for feedback) and config control
class MenuManager {
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
    // TODO: overhaul, instead of regenerating every time just have the menu hidden
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
    //console.log('updating menu widgets');
    /// displaying config changes
    // date/time format
    config_date_format.value = player.config.chrono.date_format;
    config_time_format.value = player.config.chrono.time_format;

    config_time_hours.checked = !player.config.chrono.time == 12;
    config_date_ordinals.checked = player.config.chrono.ordinals;

    //DateTimeManager.display();

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

// var CurrentGame = new GameManager(true);
