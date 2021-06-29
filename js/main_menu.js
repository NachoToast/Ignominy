class MainMenu {
  static tracking = true;
  static trackingColor = 'rgb(255, 238, 139)';

  static menuElement = document.getElementById('mainMenu');
  static savesTableElement = document.getElementById('mainMenuSaveTable');

  static show() {
    this.menuElement.style.display = 'flex';
  }

  static hide() {
    this.menuElement.style.display = 'none';
  }

  // generates the save table rows from the array of save ID's in local storage
  static generateTable() {
    const saveIDs =
      localStorage
        .getItem('Ignominy Save IDs')
        ?.split(',')
        .map((e) => parseInt(e)) ?? [];

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
        saveVersionElement.title = 'Outdated game version';
      }
      saveVersionElement.innerHTML = saveVersion;
      saveRowElement.appendChild(saveVersionElement);
    }

    // save button
    {
      const saveButton = document.createElement('td');
      saveButton.innerHTML = 'Save';
      saveButton.classList.add(
        'pad',
        'noselect',
        'actionButton',
        'saveActionButton'
      );
      saveButton.onclick = () =>
        SaveLoadManager.browserSave(saveID, saveRowElement);
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
      loadButton.onclick = () =>
        SaveLoadManager.browserLoad(saveID, loadButton);
      saveRowElement.appendChild(loadButton);
    }

    // delete button
    {
      const deleteButton = document.createElement('td');
      deleteButton.innerHTML = 'Delete';
      deleteButton.classList.add(
        'pad',
        'noselect',
        'actionButton',
        'deleteActionButton'
      );
      deleteButton.onclick = () =>
        SaveLoadManager.deleteSave(saveID, saveRowElement);
      saveRowElement.appendChild(deleteButton);
    }

    return saveRowElement;
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
      id = 0;
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
      // if an id is specified, update the table row information;
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

  static browserLoad(id = null, loadElement = null) {
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
}

document.getElementById('mainMenuVersionNumber').innerText = version;

MainMenu.generateTable();
