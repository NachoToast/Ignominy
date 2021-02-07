function create_trade_menu(trader) {
    // Main div
    const trademenu = document.createElement('div');
    trademenu.id = 'trade_menu'
    content.appendChild(trademenu)
    // Meta div
    const trademenumeta = document.createElement('div');
    trademenumeta.id = 'trade_menu_meta'
    trademenu.appendChild(trademenumeta);
    const trademenumeta_h2 = document.createElement('h1');
    trademenumeta_h2.id = 'trade_menu_h2';
    trademenumeta_h2.innerHTML = `Gold: ${player.gold}`
    trademenumeta.appendChild(trademenumeta_h2);
    const trademenumeta_h3 = document.createElement('h1');
    trademenumeta_h3.id = 'trade_menu_h3';
    trademenumeta_h3.innerHTML = 'Close';
    trademenumeta_h3.addEventListener('click', () => close_trade_menu())
    trademenumeta.appendChild(trademenumeta_h3);
    // Trades div
    const trademenucard_container = document.createElement('div');
    trademenucard_container.id = 'trade_menu_card_container';
    trademenu.appendChild(trademenucard_container);
    // Generate Cards
    let specifictrades = trades[trades.map(e => e.name).indexOf(trader)];
    for (let i=0;i<specifictrades.sell.length; i++) {
        // Index
        let thisitem = items[items.map(e => e.name).indexOf(specifictrades.sell[i])];
        // div (Container)
        let me1 = document.createElement('div');
        me1.classList.add('trade_menu_card');
        me1.addEventListener('click', () => buy(thisitem))
        trademenucard_container.appendChild(me1)
        // div (Image)
        let me2 = document.createElement('div');
        me1.appendChild(me2)
        // div (Rest)
        let me = document.createElement('div');
        //me.classList.add('trade_menu_card');
        me1.appendChild(me)
        // img
        let meimage = document.createElement('img')
        meimage.setAttribute('src',`${thisitem.icon}`);
        me2.appendChild(meimage);
        // h1
        let metitle = document.createElement('h1');
        metitle.innerHTML = thisitem.name;
        me.appendChild(metitle);
        // p (Description)
        let medesc = document.createElement('p');
        medesc.innerHTML = thisitem.description;
        me.appendChild(medesc);
        // button
        /*let meprice = document.createElement('button');
        meprice.innerHTML = `Buy: ${thisitem.value} Gold`;
        meprice.addEventListener('click', () => buy(thisitem));
        me.appendChild(meprice);*/
        // p (Price)
        let meprice = document.createElement('p');
        meprice.innerHTML = `${thisitem.value} Gold`
        meprice.id = 'trade_menu_card_price'
        me.appendChild(meprice);
    }
    //console.log(specifictrades);
}
function close_trade_menu() {
    delete_element_by_id('trade_menu')
}
function buy(item) {
    if(player.gold >= item.value) {
        player.gold -= item.value;
        trademenu_update();
        acquire(item,1);
    }
    else return;
}
function acquire(item, amount) {
    if(player.inventory.map(e => e.name).indexOf(item.name) !== -1) { // If player already has item.
        player.inventory[player.inventory.map(e => e.name).indexOf(item.name)].count += amount;
    }
    else {
        player.inventory.push(item);
        player.inventory[player.inventory.map(e => e.name).indexOf(item.name)].count += amount-1;
    }
}
function sell(item) {

}
function trademenu_update() {
    document.getElementById('trade_menu_h2').innerHTML = `Gold: ${player.gold}`;
    ui_post_stats_gold();
}
var trades = [];
function generate_trade() {
    trades = [
        {
            name:'Innkeeper',
            sell:['Seafood Meal','Beer'],
            buy:[]
        },
        {
            name:'Other Person'
        }
    ]
}