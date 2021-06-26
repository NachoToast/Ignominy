// creates a menu element
class Menu {
  static menuConstructors = {
    mainMenu: () => {
      const menu = document.createElement('div');
      menu.classList.add('fullPageOverlay', 'specialScroll', 'mainMenu');

      const menuHeading = document.createElement('h1');
      menuHeading.innerHTML = 'Ignominy';
      menuHeading.classList.add('noselect');
      menu.appendChild(menuHeading);

      const menuText = document.createElement('p');
      menuText.innerHTML = 'A text-based fantasy RPG by NachoToast';
      menuText.classList.add('noselect');
      menu.appendChild(menuText);

      const menuNewGameButton = document.createElement('button');
      menuNewGameButton.innerHTML = 'New Game';
      menuNewGameButton.classList.add('noselect');
      menu.appendChild(menuNewGameButton);

      const menuLoadGameButton = document.createElement('button');
      menuLoadGameButton.innerHTML = 'Load Game';
      menuLoadGameButton.classList.add('noselect');
      menu.appendChild(menuLoadGameButton);

      const menuVersionText = document.createElement('a');
      menuVersionText.innerHTML = `Ignominy Version ${IGNOMINY_VERSION}`;
      menuVersionText.target = '_blank';
      menuVersionText.href = 'https://github.com/NachoToast/Ignominy';
      menu.appendChild(menuVersionText);

      return menu;
    },
    saveMenu: () => {},
  };

  constructor(menuType) {
    // this creates the menu element, should only be called once, since afterwards the element can be referred to as MainMenu.menu
    this.menu = Menu.menuConstructors[menuType]();
    this.show();
  }

  show = () => document.body.appendChild(this.menu);

  hide = () => document.body.removeChild(this.menu);
}
