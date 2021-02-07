const ui = document.getElementById('ui'),
ui_pages = [document.getElementById('ui_menu'),document.getElementById('ui_stats'),document.getElementById('ui_date'),document.getElementById('ui_time'),document.getElementById('ui_inventory')],
ui_mobile = document.getElementById('ui_mobile'),
ui_health = document.getElementById('ui_health'),
ui_mana = document.getElementById('ui_mana'),
ui_strength = document.getElementById('strength_value'),
ui_agility = document.getElementById('agility_value'),
ui_proficiency = document.getElementById('proficiency_value'),
ui_perception = document.getElementById('perception_value'),
ui_gold = document.getElementById('gold_value'),
ui_fatigue = document.getElementById('fatigue_value'),
ui_fatigueN = document.getElementById('fatigue_name'),
ui_date = document.getElementById('ui_tb3'), ui_dateM = document.getElementById('ui_tb3a'),
ui_time = document.getElementById('ui_tb4'), ui_timeM = document.getElementById('ui_tb4a');

function ui_clearpages() {
    var i;
    for (i=0; i<ui_pages.length; i++) {
        ui_pages[i].style.visibility = 'hidden';
        ui_pages[i].style.position = 'absolute';
    }
    close_inventory();
}
function ui_pagetoggle(page) {
        const requestedpage = ui_pages[page];
        if (ui.style.visibility == 'visible') { // If UI already open.
            if (requestedpage.style.visibility == 'visible') { // If requested page is already open.
                if(requestedpage.id=='ui_inventory')close_inventory();
                requestedpage.style.visibility = 'hidden';
                ui.style.visibility = 'hidden';
            }
            else {
                openrequestedpage(requestedpage);
            }
        }
        else {
            ui.style.visibility = 'visible';
            openrequestedpage(requestedpage);
        }
        function openrequestedpage(requestedpage) {
            ui_clearpages();
            requestedpage.style.visibility = 'visible';
            requestedpage.style.position = 'static';
            if (requestedpage.id=='ui_inventory') render_inventory();
    }
}
function ui_open_mobile_menu() {
    if (ui_mobile.style.visibility == 'visible') {
        ui_mobile.style.visibility = 'hidden';
        ui_mobile.style.position = 'static';
        ui_mobile.style.animationName = 'none';
        ui_clearpages();
        ui.style.visibility = 'hidden';
    }
    else {
        ui_mobile.style.visibility = 'visible';
        ui_mobile.style.position = 'absolute';
        ui_mobile.style.animationName = 'mobile_fadein';
    }
}
function ui_discord() {
    window.open('https://discord.gg/PEGUcb4', '_blank');
}
function ui_reset() {
    location.reload();
}
function ui_disablebutton(button) {
    const ui_buttons = [document.getElementById('ui_tb1'),document.getElementById('ui_tb2'),document.getElementById('ui_tb3'),document.getElementById('ui_tb4'),document.getElementById('ui_tb5')];
    const ui_buttons2 = [document.getElementById('ui_tb1a'),document.getElementById('ui_tb2a'),document.getElementById('ui_tb3a'),document.getElementById('ui_tb4a'),document.getElementById('ui_tb5a')];
        const ui_button = ui_buttons[button];
        const ui_button2 = ui_buttons2[button];
        ui_button.style.visibility = 'hidden';
        ui_button.style.position = 'absolute';
        ui_button2.style.visibility = 'hidden';
        ui_button.style.position = 'absolute';
}
function ui_enablebutton(button) {
    const ui_buttons = [document.getElementById('ui_tb1'),document.getElementById('ui_tb2'),document.getElementById('ui_tb3'),document.getElementById('ui_tb4'),document.getElementById('ui_tb5')];
    const ui_buttons2 = [document.getElementById('ui_tb1a'),document.getElementById('ui_tb2a'),document.getElementById('ui_tb3a'),document.getElementById('ui_tb4a'),document.getElementById('ui_tb5a')];
        const ui_button = ui_buttons[button];
        const ui_button2 = ui_buttons2[button];
        if (screen.width >= 768) {
            ui_button.style.visibility = 'visible';
            ui_button.style.position = 'static';
        }
        else {
            ui_button2.style.visibility = 'visible';
            //ui_button.style.position = 'static';
        }
}
function ui_disablegamebuttons() {
    const gamebuttons = [1,2,3,4];
    gamebuttons.forEach(btn => ui_disablebutton(btn));
}
function ui_enablegamebuttons() {
    const gamebuttons = [1,2,3,4];
    gamebuttons.forEach(btn => ui_enablebutton(btn));
}
function ui_post_time(h,m,t) {
    ui_time.childNodes[1].textContent = `${h}:${m} ${t}`;
    ui_timeM.childNodes[1].textContent = `${h}:${m} ${t}`;

}
function ui_post_date(d, m, y) {
    ui_date.childNodes[1].textContent = `${d}/${m}/${y}`;
    ui_dateM.childNodes[1].textContent = `${d}/${m}/${y}`;
}
function ui_post_stats_all() {
    ui_post_stats_strength();
    ui_post_stats_agility();
    ui_post_stats_proficiency();
    ui_post_stats_perception();
    ui_post_stats_gold();
}
function ui_post_stats_strength() {
    ui_strength.innerHTML = player.stats.strength;
}
function ui_post_stats_agility() {
    ui_agility.innerHTML = player.stats.agility;
}
function ui_post_stats_perception() {
    ui_perception.innerHTML = player.stats.perception;
}
function ui_post_stats_proficiency() {
    ui_proficiency.innerHTML = player.stats.proficiency;
}
function ui_post_stats_fatigue() {
    ui_fatigue.innerHTML = Math.ceil(player.stats.fatigue);
    if (player.stats.fatigue < 50) {
        ui_fatigue.style.color = 'white'
        ui_fatigueN.style.color = 'white'
    }
    else if (player.stats.fatigue < 75) {
        ui_fatigue.style.color = 'yellow'
        ui_fatigueN.style.color = 'yellow'
    }
    else if (player.stats.fatigue < 90) {
        ui_fatigue.style.color = 'orange'
        ui_fatigueN.style.color = 'orange'
    }
    else {
        ui_fatigue.style.color = 'red'
        ui_fatigueN.style.color = 'red'
    }
}
function ui_post_stats_gold() {
    ui_gold.innerHTML = player.gold;
}
function ui_post_hp() {
    ui_health.innerHTML = `Health: ${player.health}/${player.maxhealth} [${Math.floor(player.health/player.maxhealth*100)}%]`;
}
function ui_post_mana() {
    ui_mana.innerHTML = `Mana: ${player.mana}/${player.maxmana} [${Math.floor(player.mana/player.maxmana*100)}%]`;
}
if(devmode !== 1) ui_disablegamebuttons();
function ui_save() {
    if (ingame == 1) {
        ui_commit_save();
    }
    else return; // Should just change button visibilities (and pointer events).
}
function ui_commit_save() {
    let timedata = {
        y:year,
        mn:month_number,
        d:day,
        h:hour,
        m:minute,
        t:timehalf
    }
    data_a = JSON.stringify(player)
    data_b = JSON.stringify(timedata)
    data_c = `[${data_a},${data_b}]`
    localStorage.setItem('Ignominy Save', data_c);
    alert('Saved the Game.')
}
function ui_load() {
    let data = JSON.parse(localStorage.getItem('Ignominy Save'));
    if (data == null) {
        alert('No save found.')
    } else {
        if (!ingame == 1) { // Ingame being 1 means story elements have already been generated (and non-story ones deleted).
            delete_element_by_id('welcome');
            delete_element_by_id('button_start');
            delete_element_by_id('input');
            delete_element_by_id('location_prologue');
            delete_element_by_id('location');
            delete_element_by_id('backstory');
            create_story_elements();
        }
        if(document.getElementById('trade_menu'))close_trade_menu();
        ui_enablegamebuttons();
        player = data[0];
        set_date(data[1].d,data[1].mn,data[1].y);
        set_time(data[1].h,data[1].m,data[1].t)
        document.getElementById('ui_stats_header').innerText = `${player.name}`;
        generate_story();
        showTextNode(data[0].scene);
        ui_pagetoggle(0);
        ui_post_stats_all();
        if(document.getElementById('ui_mobile').style.visibility == 'visible')ui_open_mobile_menu();
        document.getElementById('content').style.alignItems = 'flex-start';
    }
}
function render_inventory() {
    let inventory = document.createElement('ui_inventory_items');
    inventory.id='ui_inventory_items';
    ui_pages[4].appendChild(inventory);
    for (let i=0;i<player.inventory.length;i++) {
        // div
        let thing = document.createElement('div');
        thing.classList.add('inventory_item');
        inventory.appendChild(thing);
        // img
        let thing_image = document.createElement('img');
        thing_image.setAttribute('src',`${player.inventory[i].icon}`);
        thing.appendChild(thing_image);
        // h1
        let thing_name = document.createElement('h1');
        if(player.inventory[i].count > 1)thing_name.innerHTML = `${player.inventory[i].name} (${player.inventory[i].count})`;
        else thing_name.innerHTML = `${player.inventory[i].name}`;
        thing.appendChild(thing_name);
    }
}
function close_inventory() {
    if(document.getElementById('ui_inventory_items'))delete_element_by_id('ui_inventory_items');
}