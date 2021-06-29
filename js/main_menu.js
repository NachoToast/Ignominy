class MainMenu {
  static tracking = true;
  static trackingColor = 'rgb(255, 238, 139)';

  static menuElement = document.getElementById('mainMenu');
  static savesTableElement = document.getElementById('mainMenuSaveTable');

  static show() {
    this.menuElement.classList.add('mainMenuFadeIn');
    this.menuElement.style.display = 'flex';
    setTimeout(() => {
      this.menuElement.classList.remove('mainMenuFadeIn');
    }, 250);
    this.updateAutosaveRow();
  }

  static hide() {
    this.menuElement.classList.add('mainMenuFadeOut');
    setTimeout(() => {
      this.menuElement.style.display = 'none';
      this.menuElement.classList.remove('mainMenuFadeOut');
    }, 250);
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
  }

  // makes a single table row for a save slot
  static makeRowElement(saveID, saveDate, saveVersion, saveData) {
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
        saveButton.innerHTML = 'Save';
        saveButton.classList.add('actionButton', 'saveActionButton');
        saveButton.onclick = () => {
          SaveLoadManager.browserSave(saveID, saveRowElement);
        };
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
      loadButton.classList.add(
        'pad',
        'noselect',
        'actionButton',
        'loadActionButton'
      );
      loadButton.onclick = () => {
        SaveLoadManager.browserLoad(saveID, loadButton);
      };
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

class SaveLoadManager {
  static tracking = true;
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

      const newRow = MainMenu.makeRowElement(id, Date.now(), version, player);
      newRow.classList.add('creating');
      MainMenu.savesTableElement.appendChild(newRow);
      setTimeout(() => newRow.classList.remove('creating'), 250);
    } else {
      // otherwise if another id is specified, update the table row information;
      MainMenu.savesTableElement.replaceChild(
        MainMenu.makeRowElement(id, Date.now(), version, player),
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

  static browserLoad(id = null) {
    if (this.tracking) {
      console.log(
        `%c[${this.name}]%c Loading save ${id}`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }

    const load = JSON.parse(localStorage.getItem(`Ignominy Save ${id}`));
    if (load.version !== version || harsh_check) {
      console.log(
        `%c[${this.name}]%c Doing updater for load version ${load.version}`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
      load.data = VersionDebugger.fixMismatch(version, load.version, load.data);
    }

    player = load.data;
    player.time = new Date(load.data.time);

    // TODO: check if below operations are necessary
    MenuManager.updateMenuWidgets();
    generate_game(player.scene, true);
    if (TradeMenu.isOpen) {
      TradeMenu.close();
    }

    // TODO: add visual feedback for loading
  }

  static export() {
    if (this.tracking) {
      console.log(
        `%c[${this.name}]%c Exporting save`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }
    const file = new Blob(
      [
        JSON.stringify({
          date: Date.now(),
          version: version,
          data: player,
        }),
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

    if (this.tracking) {
      console.log(
        `%c[${this.name}]%c Importing save`,
        `color: ${this.trackingColor}`,
        `color: white`
      );
    }

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
      SaveLoadManager.browserSave();
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

  // checks if an autosave exists already
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
      // 0 not in saves list

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
  }

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

document.getElementById('mainMenuVersionNumber').innerText = version;

SaveLoadManager.checkInitialAutosave();
MainMenu.generateTable();
MainMenu.show();

// TODO: config manager
