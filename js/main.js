var devmode = 0, ingame = 0;
const months = [
    {
        name:'January',
        days:31
    },
    {
        name:'February',
        days:28
    },
    {
        name:'March',
        days:31
    },
    {
        name:'April',
        days:30
    },
    {
        name:'May',
        days:31
    },
    {
        name:'June',
        days:30
    },
    {
        name:'July',
        days:31
    },
    {
        name:'August',
        days:31
    },
    {
        name:'September',
        days:31
    },
    {
        name:'October',
        days:31
    },
    {
        name:'November',
        days:30
    },
    {
        name:'December',
        days:31
    }
]
var year = 3051, month, month_number, day, hour, minute, timehalf = 'am';
var player = {
    name:'Placeholder Name',
    health: 100,
    maxhealth:100,
    mana: 100,
    maxmana:100,
    gold:100,
    stats: {
        fatigue:0,
        strength: 0,
        agility: 0,
        proficiency: 0,
        perception:0,
    },
    hometown: {
        name:'Placeholder Kingdom',
        color:'black',
        id:-1
    },
    backstory: {
        name:'Placeholder Backstory',
        color:'black'
    },
    scene:-1,
    completed: [],
    reputation: {
        0:{ebonfront_docks:0,ebonfront_inn:0},
        1:{},
        2:{},
        3:{},
        4:{},
        5:{},
        6:{}
    },
    inns: [],
    inventory:[],
    random:0
}
var kingdoms = [
    {
        name:'Ignoma',
        color:'aquamarine',
        avb:['Fisherman','Sailor','Chef']
    },
    {
        name:'Light Witesia',
        color:'yellowgreen',
        avb:['Explorer','Villager','Hunter']
    },
    {
        name:'The Luma empire',
        color:'palevioletred',
        avb:['Bandit','Innkeeper','Merchant']
    },
    {
        name:'The Kingdom of Dalia',
        color:'orangered',
        avb:['Magician','Student']
    },
    {
        name:'Zalrord',
        color:'cyan',
        avb:['Diplomat','Merchant','Mercenary']
    },
    {
        name:'The Kingdom of Cataclite',
        color:'brown',
        avb:['Soldier','Blacksmith','Mercenary']
    },
    {
        name:'Seld',
        color:'blueviolet',
        avb:['Farmer','Noble','Merchant']
    }
]
var biomes = [
    {
        name:'Sandy Coastlines',
        color:'#00ffff'
    },
    {
        name:'Swamps and Marshes',
        color:'#29ab87'
    },
    {
        name:'Grassy Plains',
        color:'#7cfc00'
    },
    {
        name:'Forests',
        color:'#b5651d'
    },
    {
        name:'Jungles',
        color:'#197419'
    },
    {
        name:'Mountains',
        color:'#a9a9a9'
    },
    {
        name:'Tundra',
        color:'#ffffff'
    },
    {
        name:'Volcanoes',
        color:'#af1b00'
    },
    {
        name:'Hills',
        color:'#90ee90'
    },
    {
        name:'Deserts',
        color:'#edc9af'
    }
]
var backstories = [];
const content = document.getElementById('content');
document.getElementById('name_input').setAttribute('placeholder',random_name());

function random_date() {
    month = months[Math.floor(Math.random() * months.length)]; // 0 to 11 (both inclusive).
    month_number = months.indexOf(month) + 1; // Position of month in array + 1.
    if (month_number < 10) month_number = '0' + month_number;
    day = Math.floor(Math.random() * month.days) + 1; // 0 to (days-1) (both inclusive).
    if (day < 10) day = '0' + day;
    ui_post_date(day,month_number,year);
};
function set_date(d,m,y) { // Usage: set_date(d,m,y); [Year not necessary.]
    day = d;
    if(y==null)y=year;
    else year=y;
    month = months[(m-1)];
    month_number = m;
    if(m<10)m='0'+m;
    if(d<10)d='0'+d;
    if(y<1000){if(y<100){if(y<10)y='000'+y;else{y='00'+y;}}else{y='0'+y;}}
    ui_post_date(d,m,y);
}
function random_time() {
    hour = Math.floor(Math.random() * 24) + 1;
    if (hour > 12) {
        hour -= 12;
        timehalf = 'pm';
    } else timehalf = 'am';
    minute = Math.floor(Math.random() * 60);
    if (minute < 10) minute = '0' + minute;
    ui_post_time(hour,minute,timehalf);
}
function set_time(h,m,t) { // Usage: set_time(h,m,t); [12-Hour format.] 
    hour = h;
    minute = m;
    timehalf = t;
    if(m<10)m='0'+m;
    ui_post_time(h,m,t);
}
function random_stats(max) {
    player.stats.strength = Math.floor(Math.random() * max ) + 1;
    player.stats.agility = Math.floor(Math.random() * max ) + 1;
    player.stats.proficiency = Math.floor(Math.random() * max ) + 1;
    ui_post_stats_all();
}
function random_hp(max) {
    player.health = Math.floor(Math.random() * max) + 1;
    ui_post_hp();
}
function random_mana(max) {
    player.mana = Math.floor(Math.random() * max) + 1;
    ui_post_mana();
}
function newgame() {
    if (devmode == 1) {
        random_stats(10);
        random_hp(100);
        random_mana(100);
        random_date();
        random_time();
    }
    document.getElementById('button_start').style.animationName = 'button_fadeout';
    document.getElementById('button_start').style.animationDelay = '0s';
    document.getElementById('name').style.animationName = 'name_fadein';
    document.getElementById('name').style.pointerEvents = 'all';
    //ui_enablegamebuttons();
}
function random_name() {
    const names = ['Henry','Thomas','Herald','Jake','Geralt','Finn','Oscar','Louie','Hayley','Jennifer','Giles','Felix','David','Arthur','Robin','Peepo','Corey','Russel','Bishop','Avery','Daniel'],
    name = names[Math.floor(Math.random() * names.length)];
    return name;
}
function submit_name() {
    player.name = document.getElementById('name_input').value;
    if (player.name.length <= 2) {
        player.name = document.getElementById('name_input').getAttribute('placeholder');
    }
    document.getElementById('welcome').style.animationName = 'welcome_fadeout';
    document.getElementById('input').style.animationName = 'welcome_fadeout';
    setTimeout(show_location,1000)
}
function delete_element_by_id(thing) {
    const node = document.getElementById(thing);
    while (node.firstChild) {
        node.removeChild(node.lastChild); // Last faster to remove than first.
    }
    node.parentElement.removeChild(node);
}
function delete_element_by_predefined(thing) {
    const node = thing;
    while (node.firstChild) {
        node.removeChild(node.lastChild); // Last faster to remove than first.
    }
    node.parentElement.removeChild(node);
}
function show_location() {
    delete_element_by_id('welcome');
    delete_element_by_id('input');
    delete_element_by_id('button_start');
    document.getElementById('location_prologue').style.animationName = 'location_fadein';
    document.getElementById('location_prologue').innerHTML = `${player.name} grew up in...`;
    document.getElementById('location').style.animationName = 'location_fadein';
    document.getElementById('location').style.pointerEvents = 'all';
    document.getElementById('location_map').style.animationName = 'image_fadein';
    location_colorize();
    difficulty_colorize();
}
function location_colorize() {
    // Making a local text array of the biome names to test for.
    var localbiomes = document.getElementsByClassName('biome');
    var biomenames =[];
    for (let i=0;i<localbiomes.length;i++) { // Create array of local biomes.
        biomenames.push(localbiomes[i]);
    }
    // Testing each global biome for the not-yet-found local biome names.
    for (let i=0;i<biomes.length;i++) { // For every global biome.
        for (let j=0;j<biomenames.length;j++) // For every not-yet-found local biome.
        if (biomes[i].name == biomenames[j].innerHTML) {// If the global biome name matches local biome name.
            //console.log(`Matched ${biomenames[j].innerHTML} with ${biomes[i].color}`); // Update color.
            biomenames[j].style.color = biomes[i].color;
            // These don't work for repeated biomes:
            //biomenames.splice(j,1); // Remove local biome from array.
            //j = biomenames.length // Stop j loop.
        }
    }
}
function difficulty_colorize() {
    var localdiffs = document.getElementsByClassName('location_difficulty');
    var diffs =[];
    for (let i=0;i<localdiffs.length;i++) {
        diffs.push(localdiffs[i]);
    }
    for (let i=0;i<diffs.length;i++) {
        switch (diffs[i].innerHTML) {
            case 'Low':
                diffs[i].style.color = 'lightgreen';
                break;
            case 'Medium':
                diffs[i].style.color = 'yellow';
                break;
            case 'High':
                diffs[i].style.color = '#de1738';
                break;
            default:
                diffs[i].style.color = 'white';
        }
    }
}
function submit_location(location) {
    player.hometown.name = kingdoms[location].name;
    player.hometown.color = kingdoms[location].color;
    player.hometown.id = location;
    var locationcards = document.getElementsByClassName('location_option');
    var locations =[];
    for (let i=0;i<locationcards.length;i++) {
        locations.push(locationcards[i]);
    }
    locations.splice(location,1);
    for (let i=0;i<locations.length;i++) {
        locations[i].style.animationName = 'locations_fadeout';
    }
    document.getElementById('location_map').style.animationName = 'image_fadeout';
    document.getElementById('location_prologue').style.animationName = 'locations_fadeout';
    setTimeout(submit_location2,2000)
}
function submit_location2() {
    delete_element_by_id('location');
    delete_element_by_id('location_prologue');
    document.getElementById('backstory').style.pointerEvents = 'all';
    document.getElementById('backstory').style.animationName = 'location_fadein';
    document.getElementById('backstory_prologue').innerHTML = `Before today, ${player.name} was a...`;
    generate_backstories();
}
function generate_backstories() {
    backstories = [
        {
            name:'Fisherman',
            description:`${player.name} was raised a fisherman from a young age due to the large fishing industry in ${player.hometown.name}.`,
            color: '#00b0ff'
        },
        {
            name:'Sailor',
            description:`${player.name} was a sailor on the ships around ${player.hometown.name} since the day they could walk.`,
            color: '#add8e6'
        },
        {
            name:'Chef',
            description:`${player.name} was taught how to cook early on to help manage their family's restraunt, and knows all about food ingredients.`,
            color: '#ffffff'
        },
        {
            name:'Explorer',
            description:`${player.name} developed a passion for exploring the wilderness in ${player.hometown.name}, and it eventually turned into their profession.`,
            color: '#c3b091'
        },
        {
            name:'Villager',
            description:`${player.name} was the manager of their local village in ${player.hometown.name}, organising hunts, trade, diplomacy, and more.`,
            color: '#b6561d'
        },
        {
            name:'Hunter',
            description:`Through their upbringing, ${player.name}'s knowledge of the surrounding wilderness in ${player.hometown.name} developed them into a skilled hunter of both animals and humans alike.`,
            color: '#228b22'
        },
        {
            name:'Bandit',
            description:`Events in ${player.hometown.name} lead ${player.name} to pursue crime as a way to stay afloat, and it turned out they were extremely good at it.`,
            color: '#b53737'
        },
        {
            name:'Innkeeper',
            description:`Helping manage the family inn, ${player.name} enjoyed the work until they owned their own.`,
            color: '#f05e23'
        },
        {
            name:'Merchant',
            description:`${player.name} was a natural talent at all things trade related, and used their skills in bartering and economics to become a reputable merchant in ${player.hometown.name}.`,
            color: '#ff0090'
        },
        {
            name:'Magician',
            description:`After graduating in ${player.hometown.name}, ${player.name} worked as a freelance magician for various people.`,
            color: 'aquamarine'
        },
        {
            name:'Student',
            description:`${player.name} was a diligent student in ${player.hometown.name}, accumulating vast amounts of magic and non-magic knowledge from all around the world.`,
            color: '#d8d8d8'
        },
        {
            name:'Diplomat',
            description:`When nobles in ${player.hometown.name} noticed ${player.name}'s natural charisma and negotiation ability, they quickly enlisted ${player.name} as a diplomat.`,
            color: 'gold'
        },
        {
            name:'Mercenary',
            description:`${player.name}'s upbringing in ${player.hometown.name} left them with a large amount of combat knowledge and skills that they put to use.`,
            color: '#ba9597'
        },
        {
            name:'Soldier',
            description:`${player.name} listed in ${player.hometown.name}'s army from a young age, slowly climbing the ranks and gaining valuable knowledge, skills, and experience.`,
            color: '#4b5320'
        },
        {
            name:'Blacksmith',
            description:`Though not black nor named Smith, ${player.name} apprenticed at their family's blacksmith in ${player.hometown.name} until it eventually became their job.`,
            color: '#fcf4a3'
        },
        {
            name:'Farmer',
            description:`${player.name} looked after a small farm in ${player.hometown.name}, living an honest, down-to-earth life and becoming knowledgeable of ${player.hometown.name}'s climate.`,
            color: '#90ee90'
        },
        {
            name:'Noble',
            description:`Born into a noble family, ${player.name} filled his parents shoes and governs a small region in ${player.hometown.name}.`,
            color: '#7851a9'
        }
    ];
    const bc = document.getElementById('backstory_container');
    for (let i=0;i<kingdoms.length;i++) { // For each kingdom.
        if (player.hometown.name == kingdoms[i].name) { // In player's hometown kingdom only.
            for (let j=0;j<kingdoms[i].avb.length;j++) { // For each available backstory in kingdom.
                for (let k=0;k<backstories.length;k++) { // For each general backstory
                    if (backstories[k].name == kingdoms[i].avb[j]) { // If kingdom backstory is in general backstory array.
                        //console.log(`Found allowed backstory for ${kingdoms[i].name}: ${backstories[k].name}`);
                        // Creating the element.
                        // div
                        var bs = document.createElement('div');
                        bs.className = 'backstory_option'
                        bs.setAttribute('onClick',`submit_backstory(${k})`);
                        bc.appendChild(bs);
                        // h1
                        var bst = document.createElement('h1');
                        bst.innerHTML = backstories[k].name;
                        bst.style.color = backstories[k].color;
                        bst.className = 'bst';
                        bs.appendChild(bst);
                        // p
                        var bsd = document.createElement('p');
                        bsd.innerHTML = backstories[k].description;
                        bs.appendChild(bsd);
                    }
                }
            }
        }
    }
}
function submit_backstory(k) {
    //console.log(`Submitting backstory (${k}): ${backstories[k].name}`);
    ui_post_stats_all();
    ui_enablegamebuttons();
    player.backstory.name = backstories[k].name;
    player.backstory.color = backstories[k].color
    //console.log(`${player.backstory.name}, ${player.backstory.color}`);
    document.getElementById('content').style.animationName = 'locations_fadeout';
    setTimeout(story_init(), 1000);
}
function story_init() {
    delete_element_by_id('backstory');
    set_date(1,1);
    set_time(7,0,'am');
    document.getElementById('ui_stats_header').innerHTML = player.name;
    create_story_elements();
    generate_story();
    showTextNode(player.hometown.id * 100);
}
function create_story_elements() {
    ingame = 1;
    // Text
    var text = document.createElement('div')
    text.id = 'text'
    content.appendChild(text)
    // Container for buttons.
    var option_buttons = document.createElement('div')
    option_buttons.id = 'option-buttons'
    content.appendChild(option_buttons)
}
function showTextNode(textNodeIndex) {
    player.scene = textNodeIndex
    const textElement = document.getElementById('text')
    const optionButtonsElement = document.getElementById('option-buttons')
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
    if(!textNode.text)textElement.innerText = 'No text found!';
    else textElement.innerText = textNode.text
    while (optionButtonsElement.firstChild) {
      optionButtonsElement.removeChild(optionButtonsElement.firstChild)
    }
    for (let i=0;i<universalOptions.length;i++) {
        textNode.options.unshift(universalOptions[i]);
    }
    textNode.options.forEach(option => {
        if (showOption(option) && showOption2(option)) {
            // div
            const button_div = document.createElement('button_div')
            button_div.classList.add('button_div')
            if (option.reverse == 1) button_div.style.flexDirection = 'row-reverse'
            // text
            const button_desc = document.createElement('button_desc')
            button_desc.classList.add('button_desc')
            button_desc.innerText = option.description
            if (button_desc.innerText == 'undefined') button_desc.innerText = '';
            // button
            const button = document.createElement('button')
            button.innerText = option.text
            button.classList.add('btn')
            if (option.flavor == 1) button.classList.add('btn_flavor');
            else {button.addEventListener('click', () => selectOption(option))}
            button.style.color = option.color
            // appending children
            optionButtonsElement.appendChild(button_div)
            button_div.appendChild(button_desc)
            button_div.appendChild(button)
        }
    })
    for (let i=0;i<universalOptions.length;i++) {
        textNode.options.shift();
    }
}
function showOption(option) {
    if (option.requiredState == null && option.allowRepeats) return true; // If there is no required state and repeats are allowed, return true.
    else {
        if(option.allowRepeats) { // If repeats are allowed, requiredState is not null, so check for required state.
            if(option.requiredState(player)) return true;
            else return false;
        }
        else { // This case is when repeats aren't allowed, and the requiredState is unknown.
            if(option.nextText == -1); // Skip the below check if next text node is the debug one (-1).
            else if(player.completed.indexOf(option.nextText) !== -1) return false; // If the next scene ID is already done by the player, return false.
            // Now that the check for repeats is done, check requiredState.
            if(option.requiredState == null) return true;
            else if(option.requiredState(player)) return true;
            else return false;
        }
    }
}
// (option.requiredState(player)) { // If player meets requirements.
function showOption2(option) {
    if (option.requiredTimes == null) return true; // If there is no required time.
    else {
        let m1,m2,d1,d2,h1,h2,h3,h4,h5,h6,min1,min2,t1,t2,t3;
        // Null Removal
        if(option.requiredTimes['monthA']){m1=option.requiredTimes['monthA'];m2=option.requiredTimes['monthB']}else{m1=0,m2=months.length}
        if(option.requiredTimes['dayA']){d1=option.requiredTimes['dayA'];d2=option.requiredTimes['dayB']}else{d1=0,d2=months[month_number].days}
        if(option.requiredTimes['hourA']){h1=option.requiredTimes['hourA'];h2=option.requiredTimes['hourB']}else{h1=1,h2=12}
        if(option.requiredTimes['hourC']){h3=option.requiredTimes['hourC'];h4=option.requiredTimes['hourD']}else{h3=h1,h4=h2}
        if(option.requiredTimes['hourE']){h5=option.requiredTimes['hourE'];h6=option.requiredTimes['hourF']}else{h5=h3,h6=h4}
        if(option.requiredTimes['minuteA']){min1=option.requiredTimes['minuteA'];min2=option.requiredTimes['minuteB']}else{min1=0,min2=59}
        if(option.requiredTimes['timehalfAB']){t1=option.requiredTimes['timehalfAB']}else{t1=timehalf}
        if(option.requiredTimes['timehalfCD']){t2=option.requiredTimes['timehalfCD']}else{t2=t1}
        if(option.requiredTimes['timehalfEF']){t3=option.requiredTimes['timehalfEF']}else{t3=t2}
        // Condition Checking
        if (
            (month_number >= m1) && (month_number <= m2)
            &&
            (day >= d1) && (day <= d2)
            &&
            (minute >= min1) && (minute <= min2)
            &&
            (
                ( (hour >= h1) && (hour <= h2) && (timehalf == t1) ) //AB
                ||
                ( (hour >= h3) && (hour <= h4) && (timehalf == t2) ) //CD
                ||
                ( (hour >= h5) && (hour <= h6) && (timehalf == t3) ) //EF
            )
        )
        {
            return true;
        }
        else return false;
    }
}
function selectOption(option) {
    if(!option.nextText)nextTextNodeId = -1;
    else if(option.nextText == -2)nextTextNodeId = player.scene;
    else nextTextNodeId = option.nextText;
    /*if (nextTextNodeId < 0) {
      nextTextNodeId = -1
    }*/
    if (player.completed.indexOf(nextTextNodeId) == -1) player.completed.push(nextTextNodeId);
    //player = Object.assign(player, option.setState) // Deprecated, setState is now a funtion below.
    if(option.setState)option.setState();
    if(option['time']) {
        let m=0,d=0,ho=0,min=0;
        if(option['time'].month){ m=option['time'].month}
        if(option['time'].day){ d=option['time'].day}
        if(option['time'].hour){ ho=option['time'].hour}
        if(option['time'].minute){ min=option['time'].minute}
        increment_time(m,d,ho,min)
    }
    showTextNode(nextTextNodeId)
    //console.log(option);
}
function increment_time(m,d,h,min) {
    if (!m)m=0;
    if (!d)d=0;
    if (!h)h=0;
    if (!min)min=0;
    m += month_number;
    d += day;
    h += hour;
    min += minute;
    //console.log(`new date is: ${d}/${m}/${year}, time: ${h}:${min} (timehalf coming soon.)`)
    // Date standardising.
    if (min >= 60) {
        h += 1;
        min -= 60;
    }
    if (h >= 12) {
        if(hour>=12); else { // Prevents timehalf changing again (e.g time went from 12:15pm to 12:30pm).
            if(timehalf=='pm') { // Going from <12:pm to >=12:am signifies a day change.
                timehalf='am';
                d += 1;
            }
            else if(timehalf=='am') { // Going from <12:am to >=12:pm does not signify a day change.
                timehalf='pm';
                player.inns = []; // But it does reset room ownership at inns.
            }
        }
    }
    if (h >= 13) h-=12;
    if (h>=13) {
        h-=12;
        if(timehalf=='pm')timehalf='am';
        else timehalf='pm'
    }
    if (d > months[(month_number-1)].days) {
        d -= months[(month_number-1)].days;
        m += 1;
    }
    if (m>months.length) {
        year +=1;
        m = 1;
    }
    //console.log(`Date: ${d} ${months[(m-1)].name} [${months[(m-1)].days} Days]`);
    set_time(h,min,timehalf);
    set_date(d,m)
}
function random(max) {
    if(!max)max=10;
    return Math.floor(Math.random() * Math.floor(max)) + 1; // 1-[10 or max] (both inclusive)
}