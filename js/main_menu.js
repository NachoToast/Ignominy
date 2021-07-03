'use strict';

// menu does showing/hiding of menu pages like the main menu, stats, map, etc.
class Menu {
  static show() {
    this.menuElement.classList.add('menuFadeIn');
    this.menuElement.style.display = 'flex';
    setTimeout(() => {
      this.menuElement.classList.remove('menuFadeIn');
    }, 250);
  }

  static hide() {
    this.menuElement.classList.add('menuFadeOut');
    setTimeout(() => {
      this.menuElement.style.display = 'none';
      this.menuElement.classList.remove('menuFadeOut');
    }, 250);
  }
}

// MainMenu handles save table generation, and updating the autosave row
class MainMenu extends Menu {
  static tracking = false;
  static trackingColor = 'rgb(255, 238, 139)';

  static menuElement = document.getElementById('mainMenu');
  static savesTableElement = document.getElementById('mainMenuSaveTable');
  static versionElement = document.getElementById('mainMenuVersionNumber');

  static show() {
    super.show();
    this.updateAutosaveRow();
  }

  static hide(fromAutosave = false) {
    // if loading from an autosave, menu should hide itself instantly
    if (fromAutosave) {
      this.menuElement.style.display = 'none';
    } else {
      super.hide();
    }
  }

  // handles initial auto save making (and creation if it doesn't exist), and table generation
  static init() {
    if (this.tracking) {
      console.log(
        `%c[${this.name}]%c Initialising main menu`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }
    SaveLoadManager.checkInitialAutosave();
    this.generateTable();
  }

  // generates the save table rows from the array of save ID's in local storage
  static generateTable() {
    const saveIDs =
      localStorage
        .getItem('Ignominy Save IDs')
        ?.split(',')
        .map((e) => parseInt(e)) ?? [];

    saveIDs.sort((a, b) => a - b);

    for (let i = 0, len = saveIDs.length; i < len; i++) {
      const saveData = JSON.parse(
        localStorage.getItem(`Ignominy Save ${saveIDs[i]}`)
      );

      this.savesTableElement.appendChild(
        this.makeRowElement(
          saveIDs[i],
          saveData.date,
          saveData.version,
          saveData.data
        )
      );
    }

    // also do the version showing in top right
    this.versionElement.innerText = version;
  }

  // makes a single table row for a save slot
  static makeRowElement(
    saveID,
    saveDate,
    saveVersion,
    saveData,
    fromSave = false
  ) {
    const saveRowElement = document.createElement('tr');

    // id
    {
      const id = document.createElement('td');
      id.innerHTML = saveID;
      saveRowElement.appendChild(id);
    }

    // date
    {
      const date = document.createElement('td');
      date.innerHTML = new Date(saveDate).toLocaleString();
      saveRowElement.appendChild(date);
    }

    // name
    {
      const name = document.createElement('td');
      name.innerHTML = saveData.name;
      name.classList.add('pad');
      saveRowElement.appendChild(name);
    }

    // version
    {
      const saveVersionElement = document.createElement('td');
      if (saveVersion !== version) {
        saveVersionElement.style.color = 'rgb(255, 238, 139)';
        saveVersionElement.title = 'Outdated save version';
      }
      saveVersionElement.innerHTML = saveVersion;
      saveRowElement.appendChild(saveVersionElement);
    }

    // save button
    {
      const saveButton = document.createElement('td');
      saveButton.classList.add('pad', 'noselect');
      if (saveID !== 0) {
        // if updating row from save, the button shows feedback
        if (fromSave) {
          saveButton.innerHTML = 'Saved!';
          saveButton.style.color = 'gray';
          setTimeout(() => {
            saveButton.innerHTML = 'Save';
            saveButton.style.color = 'white';
            saveButton.classList.add('actionButton', 'saveActionButton');
            saveButton.onclick = () => {
              SaveLoadManager.browserSave(saveID, saveRowElement);
            };
          }, 1000);
        } else {
          saveButton.innerHTML = 'Save';
          saveButton.classList.add('actionButton', 'saveActionButton');
          saveButton.onclick = () => {
            SaveLoadManager.browserSave(saveID, saveRowElement);
          };
        }
      } else {
        saveButton.innerHTML = 'Autosave';
        saveButton.style.color = 'gray';
        saveButton.title = 'This slot is saved automatically';
      }
      saveRowElement.appendChild(saveButton);
    }

    // load button
    {
      const loadButton = document.createElement('td');
      loadButton.innerHTML = 'Load';
      loadButton.classList.add('pad', 'noselect');
      if (saveData.homekingdom === 'Default') {
        loadButton.style.color = 'gray';
        loadButton.title = 'Too early in game to be a valid save';
      } else {
        loadButton.classList.add('actionButton', 'loadActionButton');
        loadButton.onclick = () => {
          SaveLoadManager.browserLoad(saveID, false);
        };
      }
      saveRowElement.appendChild(loadButton);
    }

    // delete button
    if (saveID !== 0) {
      const deleteButton = document.createElement('td');
      deleteButton.innerHTML = 'Delete';
      deleteButton.classList.add(
        'pad',
        'noselect',
        'actionButton',
        'deleteActionButton'
      );
      deleteButton.onclick = () => {
        SaveLoadManager.deleteSave(saveID, saveRowElement);
      };
      saveRowElement.appendChild(deleteButton);
    }

    return saveRowElement;
  }

  // updates the autosave row of the table, called everytime the table is open
  static updateAutosaveRow() {
    const autosaveData = JSON.parse(localStorage.getItem(`Ignominy Save 0`));

    MainMenu.savesTableElement.replaceChild(
      MainMenu.makeRowElement(
        0,
        autosaveData.date,
        autosaveData.version,
        autosaveData.data
      ),
      this.savesTableElement.childNodes[2]
    );
  }
}

// SaveLoadManager handles saving, loading, exporting, and importing player data as well as autosaving and autoloading
class SaveLoadManager {
  static tracking = false;
  static trackingColor = 'pink';

  static browserSave(id = null, saveRowElement = null) {
    if (this.tracking) {
      console.log(
        `%c[${this.name}]%c Saving to browser`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }

    // if no id specified (aka new save slot), generate new unique one
    if (id === null) {
      const usedIDs =
        localStorage
          .getItem('Ignominy Save IDs')
          ?.split(',')
          .map((e) => parseInt(e)) ?? [];
      id = 1;
      while (usedIDs.indexOf(id) !== -1) {
        id++;
      }

      usedIDs.push(id);
      localStorage.setItem('Ignominy Save IDs', usedIDs);

      saveRowElement = MainMenu.makeRowElement(id, Date.now(), version, player);
      saveRowElement.classList.add('creating');
      MainMenu.savesTableElement.appendChild(saveRowElement);
      setTimeout(() => saveRowElement.classList.remove('creating'), 250);
    } else {
      // otherwise if another id is specified, update the table row information;
      MainMenu.savesTableElement.replaceChild(
        MainMenu.makeRowElement(id, Date.now(), version, player, true),
        saveRowElement
      );
    }

    localStorage.setItem(
      `Ignominy Save ${id}`,
      JSON.stringify({
        date: Date.now(),
        version: version,
        data: player,
      })
    );

    return id;
  }

  static deleteSave(id = null, saveRowElement = null) {
    if (this.tracking) {
      console.log(
        `%c[${this.name}]%c Deleting save ${id}`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }

    saveRowElement.classList.add('deleting');

    localStorage.removeItem(`Ignominy Save ${id}`);

    const oldIDs =
      localStorage
        .getItem('Ignominy Save IDs')
        ?.split(',')
        .map((e) => parseInt(e)) ?? [];

    oldIDs.splice(oldIDs.indexOf(id), 1);

    localStorage.setItem(`Ignominy Save IDs`, oldIDs);

    setTimeout(
      () => MainMenu.savesTableElement.removeChild(saveRowElement),
      250
    );
  }

  static browserLoad(id = null, fromAutoSave = false) {
    if (this.tracking) {
      console.log(
        `%c[${this.name}]%c Loading save ${id}`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }

    const load = JSON.parse(localStorage.getItem(`Ignominy Save ${id}`));

    if (load.data.homekingdom === 'Default') {
      console.log(
        `%c[${this.name}]%c Aborted load ${id}, not in-game`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
      return;
    }

    load.data = VersionChecker.fixMismatch(load.version, load.data);

    player = load.data;
    player.time = new Date(load.data.time);

    // TODO: MenuManager.updateMenuWidgets(); - shows headers and updates config displays, basically update header things, stats page, date, etc.
    generate_game(player.scene, true);
    if (TradeMenu.isOpen) {
      TradeMenu.close();
    }

    MainMenu.hide(fromAutoSave);
  }

  static export() {
    console.log(
      `%c[${this.name}]%c Exporting save`,
      `color: ${this.trackingColor}`,
      `color: white`
    );

    const file = new Blob(
      [
        JSON.stringify(
          {
            date: Date.now(),
            version: version,
            data: player,
          },
          null,
          4
        ),
      ],
      {
        type: 'application/json',
      }
    );

    const elem = document.createElement('a');
    elem.href = window.URL.createObjectURL(file);
    elem.download = `${player.name}_${version}.ignosave`;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }

  static import(element) {
    if (element.files[0] === undefined) {
      return;
    }

    console.log(
      `%c[${this.name}]%c Importing save`,
      `color: ${this.trackingColor}`,
      `color: white`
    );

    if (typeof window.FileReader !== 'function') {
      console.log(
        `%c[${this.name}]%c FileReader not supported on browser, aborting import`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
      window.alert('Your browser does not support importing saves.');
      return;
    }

    const reader = new FileReader();
    reader.readAsText(element.files[0], 'UTF-8');
    reader.onload = (contents) => {
      const data = JSON.parse(contents.target.result);
      player = data.data;

      // save imported file to local storage, record id it saved to
      const id = SaveLoadManager.browserSave();
      // then load with reference to save id and element
      SaveLoadManager.browserLoad(id, true);
    };
    reader.onerror = () => {
      console.log(
        `%c[${this.name}]%c Save file read error`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
      window.alert('Error occured reading the imported save file.');
    };
  }

  // checks if an autosave exists already, if not then it makes one; then calls autoload if enabled
  static checkInitialAutosave() {
    if (this.tracking) {
      console.log(
        `%c[${this.name}]%c Checking for previous autosave...`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }

    // see if 0 (autosave ID) is in saves list
    const usedIDs =
      localStorage
        .getItem('Ignominy Save IDs')
        ?.split(',')
        .map((e) => parseInt(e)) ?? [];

    if (usedIDs.indexOf(0) == -1) {
      // 0 not in saves list = make first autosave

      if (this.tracking) {
        console.log(
          `%c[${this.name}]%c No previous autosave found, making new one`,
          `color: ${this.trackingColor}`,
          `color: white`
        );
      }
      usedIDs.push(0);
      localStorage.setItem('Ignominy Save IDs', usedIDs);
      localStorage.setItem(
        `Ignominy Save 0`,
        JSON.stringify({
          date: Date.now(),
          version: version,
          data: player,
        })
      );
    } else if (this.tracking) {
      // 0 in saves list
      console.log(
        `%c[${this.name}]%c Found previous autosave`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }

    // do autoload if enabled
    if (IGNOMINY_CONFIG.saveload.autoload) {
      if (this.tracking) {
        console.log(
          `%c[${this.name}]%c Doing autoload`,
          `color: ${this.trackingColor}`,
          `color: white`
        );
      }
      this.browserLoad(0, true);
    }
  }

  // unlike a normal save, autosave doesn't update its table row every time its called, since it can be called while the menu is not open
  // instead, the autosave row is updated on every menu open
  static autosave() {
    if (this.tracking) {
      console.log(
        `%c[${this.name}]%c Autosaving`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }

    localStorage.setItem(
      `Ignominy Save 0`,
      JSON.stringify({
        date: Date.now(),
        version: version,
        data: player,
      })
    );
  }
}

// ConfigManager handles config changes, and saving/getting config from browser local storage
class ConfigManager {
  static tracking = false;
  static trackingColor = 'yellow';

  // Date & Time
  static dateFormatElement = document.getElementById('dateFormat');
  static ordinalElement = document.getElementById('ordinals');
  static timeHourElement = document.getElementById('timeHour');
  static exampleElement = document.getElementById('mainMenuExampleDate');

  static changeDateFormat = () => {
    IGNOMINY_CONFIG.datetime.format = this.dateFormatElement.value;
    this.changeAnyTimeConfig();
  };

  static toggleTimeOrdinals = () => {
    IGNOMINY_CONFIG.datetime.showTimeOrdinals = this.ordinalElement.checked;
    this.changeAnyTimeConfig();
  };

  static toggle24HourTime = () => {
    IGNOMINY_CONFIG.datetime.twentyFourHourTime = this.timeHourElement.checked;
    this.changeAnyTimeConfig();
  };

  static changeAnyTimeConfig = () => {
    this.saveConfig();
    this.exampleElement.innerHTML = DateTimeManager.formatDate(new Date());
    DateTimeManager.display();
  };

  // Scenes
  static hotkeysElement = document.getElementById('hotkeys');
  static timestampsElement = document.getElementById('timestamps');
  static authorsElement = document.getElementById('metaAuthors');
  static versionElement = document.getElementById('metaVersion');
  static legacyVersionElement = document.getElementById('metaVersionLegacy');

  static toggleHotkeys = () => {
    IGNOMINY_CONFIG.scenes.enableHotkeys = this.hotkeysElement.checked;
    this.saveConfig();
  };

  static toggleTimestamps = () => {
    IGNOMINY_CONFIG.scenes.showTimestamps = this.timestampsElement.checked;
    this.saveConfig();
  };

  static toggleAuthors = () => {
    IGNOMINY_CONFIG.scenes.showAuthors = this.authorsElement.checked;
    this.changeAnyMetaConfig();
  };

  static toggleVersion = () => {
    IGNOMINY_CONFIG.scenes.showVersion = this.versionElement.checked;

    if (!IGNOMINY_CONFIG.scenes.showVersion) {
      IGNOMINY_CONFIG.scenes.showVersionLegacy = false;
      this.legacyVersionElement.checked = false;
    }

    this.changeAnyMetaConfig();
  };

  static toggleLegacyVersion = () => {
    IGNOMINY_CONFIG.scenes.showVersionLegacy =
      this.legacyVersionElement.checked;

    if (IGNOMINY_CONFIG.scenes.showVersionLegacy) {
      this.versionElement.checked = true;
      IGNOMINY_CONFIG.scenes.showVersion = true;
    }
    this.changeAnyMetaConfig();
  };

  static changeAnyMetaConfig = () => {
    this.saveConfig();
    MetaManager.update();
  };

  // Save/Load

  static autoload = document.getElementById('autoload');
  static autosave = document.getElementById('autosave');

  static toggleAutoload = () => {
    IGNOMINY_CONFIG.saveload.autoload = this.autoload.checked;
    this.saveConfig();
  };

  static toggleAutosave = () => {
    IGNOMINY_CONFIG.saveload.autosave = this.autosave.checked;
    this.saveConfig();
  };

  /// Saving & Loading Config

  // config is saved whenever changed
  static saveConfig = () => {
    if (this.tracking) {
      console.log(
        `%c[${this.name}]%c Saving config`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }

    localStorage.setItem(`Ignominy Config`, JSON.stringify(IGNOMINY_CONFIG));
  };

  // loads and returns config from browser, or default config if it doesn't exist
  static loadConfig = () => {
    if (this.tracking) {
      console.log(
        `%c[${this.name}]%c Checking for pre-existing config...`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }

    const storedConfig = localStorage.getItem(`Ignominy Config`);
    const currentConfig = IGNOMINY_DEFAULT_CONFIG;

    // if no stored config is found, use default config
    if (storedConfig === null) {
      if (this.tracking) {
        console.log(
          `%c[${this.name}]%c No pre-existing config found, using default`,
          `color: ${this.trackingColor}`,
          `color: white`
        );
      }
      // no config stored
    } else {
      // otherwise apply key value pairs of the stored config, but only if the key also exists in default (since keys may change in future)
      if (this.tracking) {
        console.log(
          `%c[${this.name}]%c Pre-existing config found, applying`,
          `color: ${this.trackingColor}`,
          `color: white`
        );
      }

      GeneralPurpose.updateSharedKeys(currentConfig, JSON.parse(storedConfig));
    }
    return currentConfig;
  };

  // showConfig updates all the HTML elements to match the stored config, called after loading config from browser
  static showConfig() {
    // Date & Time
    this.dateFormatElement.value = IGNOMINY_CONFIG.datetime.format;
    this.ordinalElement.checked = IGNOMINY_CONFIG.datetime.showTimeOrdinals;
    this.timeHourElement.checked = IGNOMINY_CONFIG.datetime.twentyFourHourTime;
    this.exampleElement.innerHTML = DateTimeManager.formatDate(new Date());
    // Scenes
    this.hotkeysElement.checked = IGNOMINY_CONFIG.scenes.enableHotkeys;
    this.timestampsElement.checked = IGNOMINY_CONFIG.scenes.showTimestamps;
    this.authorsElement.checked = IGNOMINY_CONFIG.scenes.showAuthors;
    this.versionElement.checked = IGNOMINY_CONFIG.scenes.showVersion;
    this.legacyVersionElement.checked =
      IGNOMINY_CONFIG.scenes.showVersionLegacy;
    // Save/Load
    this.autoload.checked = IGNOMINY_CONFIG.saveload.autoload;
    this.autosave.checked = IGNOMINY_CONFIG.saveload.autosave;
  }
}

// General purpose functions that can be useful in many places
class GeneralPurpose {
  // deep clones values from obj2 to obj1 for all shared keys
  // used in loading config
  static updateSharedKeys(
    obj1, // object to update
    obj2 // object to get values from
  ) {
    const keysA = Object.keys(obj1);
    const keysB = Object.keys(obj2);

    for (let i = 0, len = keysA.length; i < len; i++) {
      if (keysB.indexOf(keysA[i]) !== -1) {
        // for each shared key
        if (
          typeof obj2[keysA[i]] !== 'object' ||
          Array.isArray(obj2[keysA[i]])
        ) {
          // overwrite obj1 to obj2 value if value is not an object
          obj1[keysA[i]] = obj2[keysA[i]];
        } else {
          // else if value is an object, recursively compare its keys
          this.updateSharedKeys(obj1[keysA[i]], obj2[keysA[i]]);
        }
      }
    }

    // no return necessary
  }
}
