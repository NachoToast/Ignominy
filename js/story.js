

var universalOptions = [];
var textnodes = [];
var shows_map_option = [1,11,15,20,21];
var shows_map_ignoma = [1,11,15,20,21]
function generate_story() {
    generate_trade();
    universalOptions = [
        {
            text:'View map.',
            color:'gray',
            requiredState: (player) => shows_map_option.indexOf(player.scene) !== -1,
            nextText:-2,
            allowRepeats:1,
            setState: function() {
                ui_show_map(player.scene);
            }
        },
        {
            text:'You are dangerously fatigued, find somewhere to rest.',
            flavor:1,
            color:'orange',
            requiredState: (player) => player.stats.fatigue >= 75 && player.stats.fatigue < 100
        }, // Fatigue >= 75
        {
            text:'You are extremely fatigued, rest soon or you will faint!',
            flavor:1,
            color:'red',
            requiredState: (player) => player.stats.fatigue > 100
        } // Fatigue > 100
    ]

    textNodes = [
        {
            id:-1,
            text:'This content does not exist. If you believe this is an error, please report it to NachoToast on Discord.',
            options: [
                {
                    description:'(Default Ignoma Start)',
                    text:'Return',
                    nextText:1,
                    reverse:1,
                    color:'aqua',
                    allowRepeats:1
                }
            ]
        }, // -1 Debug
        {
            id:0,
            text:'For better or for worse, you\'ve decided to become an adventurer. As you stand in the streets of Ebonfront, Ignoma\'s capital city, a warm feeling of freedom, inspiration, and motivation stirs within you. What comes next is entirely up to you and you alone.',
            options:[
                {
                    text:'Continue',
                    color:'lime',
                    nextText:1
                }
            ]
        }, // 0
        {
            id:1,
            text:'You stand in the main streets of Ebonfront, Ignoma\'s capital.',
            options:[
                {
                    text:'A few people recognize you and say hello as they pass by.',
                    flavor:1,
                    requiredState: (player) => player.hometown.name == 'Ignoma',
                    requiredTimes:{
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:7,
                        timehalfEF:'pm'
                    }
                },
                {
                    description:'The sound of workers at the docks rings throughout the city, and the smell of fresh fish lingers in the air.',
                    text:'Help out on the docks.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:2,
                    requiredTimes:{
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:1,
                        timehalfEF:'pm'
                    }
                },
                {
                    text:'The sound of workers at the docks rings throughout the city, and the smell of fresh fish lingers in the air.',
                    flavor:1,
                    requiredTimes:{
                        hourA:2,
                        hourB:6,
                        timehalfAB:'pm'
                    }
                },
                {
                    description:'Several signs point towards a local inn.',
                    text:'Visit an inn.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:4,
                    setState: function() {
                        player.stats.fatigue += 0.1;
                        ui_post_stats_fatigue();
                    },
                    time:{
                        minute:1
                    }
                },
                {
                    text:'Head to city outskirts.',
                    color:'aqua',
                    nextText:11,
                    allowRepeats:1,
                    time:{
                        minute:3
                    },
                    setState: function() {
                        player.stats.fatigue += 0.2;
                    }
                },
                {
                    text:'Keep wandering the streets. [15m]',
                    color:'aqua',
                    nextText:1,
                    allowRepeats:1,
                    time:{
                        minute:15
                    },
                    setState: function() {
                        player.stats.fatigue += 0.1;
                        ui_post_stats_fatigue();
                    }
                }
            ]
        }, // 1
        {
            id:2,
            text:'You offer to help load and unload cargo on the docks.',
            options:[
                {
                    description:'The dock workers happily agree, allowing you to',
                    text:'work with them. [5h]',
                    color:'lime',
                    allowRepeats:1,
                    nextText:3,
                    time: {
                        hour:5
                    },
                    requiredState: (player) =>
                    player.reputation[0]['ebonfront_docks'] >= 0,
                    setState: function() {
                        player.reputation[0]['ebonfront_docks'] += 1;
                        player.gold += 10;
                        if (player.backstory.name == 'Sailor') player.gold += 5;
                        player.stats.strength += 1;
                        player.stats.fatigue += 40;
                        ui_post_stats_strength();
                        ui_post_stats_fatigue();
                        ui_post_stats_gold();
                    }
                },
                {
                    text:'The workers refuse, not wanting anything to do with you.',
                    color:'red',
                    flavor:1,
                    requiredState: (player) =>
                    player.reputation[0]['ebonfront_docks'] < 0,
                },
                {
                    description:'\nChange your mind and',
                    text:'\nreturn to the main streets.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:1
    
                }
            ]
        }, // 2
        {
            id:3,
            text:'The hours seem to go by in a flash as you help out on the docks.',
            options:[
                {
                    text:'+10 Gold',
                    flavor:1,
                    color:'gray'
                },
                {
                    text:'+1 Strength',
                    flavor:1,
                    color:'gray'
                },
                {
                    text:'+40 Fatigue',
                    flavor:1,
                    color:'gray'
                },
                {
                    text:'Because of your work experience, you earnt an extra 5 gold.',
                    flavor:1,
                    color:'gray',
                    requiredState: (player) =>
                    player.backstory.name == 'Sailor'
                },
                {
                    description:'\nWiping the sweat from your brow, you',
                    text:'\nreturn to the main streets.',
                    color:'aqua',
                    nextText:1,
                    allowRepeats:1,
                }
            ]
        }, // 3
        {
            id:4,
            text:'You make your way to the local inn.',
            options:[
                {
                    text:'The inn is crowded with people talking and drinking in groups.',
                    flavor:1,
                    requiredTimes:{
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:11,
                        timehalfEF:'pm'
                    }
                },
                {
                    text:'Some of them recognize you, and warmly greet you as you walk in.',
                    flavor:1,
                    requiredTimes:{
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:11,
                        timehalfEF:'pm'
                    },
                    requiredState: (player) =>
                    player.reputation[0]['ebonfront_inn'] >= 3
                    ||
                    player.hometown.name == 'Ignoma'
                },
                {
                    description:'The innkeeper stands at the counter, looking out for trouble,',
                    text:'approach them.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:5,
                    requiredTimes:{
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:11,
                        timehalfEF:'pm'
                    },
                },
                {
                    description:'The counter is staffed by a night-shift worker, glancing at you upon entrance.',
                    text:'Approach them.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:6,
                    requiredTimes:{
                        hourA:12,
                        hourB:12,
                        timehalfAB:'am',
                        hourC:1,
                        hourD:6,
                        timehalfCD:'am'
                    }
                },
                {
                    text:'Head to your room.',
                    color:'aqua',
                    nextText:8,
                    allowRepeats:1,
                    requiredState: (player) =>
                    player.inns.indexOf('ebonfront') !== -1
                },
                {
                    description:'Leave the inn and',
                    text:'return to the main streets.',
                    color:'aqua',
                    nextText:1,
                    allowRepeats:1,
                    setState: function() {
                        player.stats.fatigue += 0.1;
                        ui_post_stats_fatigue();
                    },
                    time:{
                        minute:1
                    }
                }
            ]
        }, // 4
        {
            id:5,
            text:'"Here for a room or some food and drink?" the innkeeper asks you.',
            options:[
                {
                    text:'"The rooms are 10 gold a night." They add.',
                    flavor:1,
                    requiredState: (player) => 
                        player.inns.indexOf('ebonfront') == -1
                },
                {
                    text:'"A room please."',
                    color:'aqua',
                    nextText:7,
                    allowRepeats:1,
                    setState: function() {
                        player.gold -= 10;
                        ui_post_stats_gold();
                        player.inns.push('ebonfront');
                    },
                    requiredState: (player) =>
                    player.gold >= 10
                    &&
                    player.inns.indexOf('ebonfront') == -1,
                    time:{
                        minute:1
                    }
                },
                {
                    text:'You do not have enough money for a room.',
                    flavor:1,
                    requiredState: (player) =>
                    player.gold < 10
                    &&
                    player.inns.indexOf('ebonfront') == -1
                },
                {
                    text:'"Some food and drink."',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:9,
                    setState: function() {
                        create_trade_menu('Innkeeper');
                    }
                },
                {
                    text:'Nevermind',
                    color:'aqua',
                    nextText:9,
                    allowRepeats:1
                }
            ]
        }, // 5
        {
            id:6,
            text:'"Bar\'s closed, rooms are 10 gold a night."',
            options:[
                {
                    text:'"A room please."',
                    color:'aqua',
                    nextText:7,
                    allowRepeats:1,
                    setState: function() {
                        player.gold -= 10;
                        ui_post_stats_gold();
                        player.inns.push('ebonfront');
                    },
                    time:{
                        minute:1
                    },
                    requiredState: (player) =>
                    player.gold >= 10
                    &&
                    player.inns.indexOf('ebonfront') == -1,
                },
                {
                    text:'You do not have enough money for a room.',
                    flavor:1,
                    requiredState: (player) =>
                    player.gold < 10
                    &&
                    player.inns.indexOf('ebonfront') == -1
                },
                {
                    text:'Nevermind',
                    color:'aqua',
                    nextText:9,
                    allowRepeats:1
                }
            ]
        }, // 6
        {
            id:7,
            text:'You are given a room key and head upstairs.',
            options:[
                {
                    text:'-10 Gold',
                    color:'gray',
                    flavor:1
                },
                {
                    text:'Sleep [1h] (-10% Fatigue)',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:10,
                    setState: function() {
                        player.stats.fatigue *= 0.9
                        ui_post_stats_fatigue();
                    },
                    time:{
                        hour:1
                    }
                },
                {
                    text:'Sleep [3h] (-50% Fatigue) (Restores Health)',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:10,
                    setState: function() {
                        player.stats.fatigue *= 0.5;
                        player.health = player.maxhealth;
                        ui_post_hp();
                        ui_post_stats_fatigue();
                    },
                    time:{
                        hour:3
                    }
                },
                {
                    text:'Sleep [6h] (-100% Fatigue) (Restores Health & Mana)',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:10,
                    setState: function() {
                        player.stats.fatigue = 0,
                        player.health = player.maxhealth;
                        player.mana = player.maxmana;
                        ui_post_hp();
                        ui_post_stats_fatigue();
                        ui_post_mana();
                    },
                    time:{
                        hour:6
                    }
                },
                {
                    text:'Go back downstairs.',
                    color:'aqua',
                    nextText:9,
                    allowRepeats:1
                }
            ]
        }, // 7
        {
            id:8,
            text:'You head upstairs to your room.',
            options:[
                {
                    text:'Sleep [1h] (-10% Fatigue)',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:10,
                    setState: function() {
                        player.stats.fatigue *= 0.9;
                        ui_post_stats_fatigue();
                    },
                    time:{
                        hour:1
                    }
                },
                {
                    text:'Sleep [3h] (-50% Fatigue) (Restores Health)',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:10,
                    setState: function() {
                        player.stats.fatigue *= 0.5;
                        player.health = player.maxhealth;
                        ui_post_hp();
                        ui_post_stats_fatigue();
                    },
                    time:{
                        hour:3
                    }
                },
                {
                    text:'Sleep [6h] (-100% Fatigue) (Restores Health & Mana)',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:10,
                    setState: function() {
                        player.stats.fatigue = 0,
                        player.health = player.maxhealth;
                        player.mana = player.maxmana;
                        ui_post_hp();
                        ui_post_stats_fatigue();
                        ui_post_mana();
                    },
                    time:{
                        hour:6
                    }
                },
                {
                    text:'Go back downstairs.',
                    color:'aqua',
                    nextText:9,
                    allowRepeats:1
                }
            ]
        }, // 8
        {
            id:9,
            text:'You stand inside the inn, looking around its interior absentmindedly.',
            options:[
                {
                    text:'The inn is crowded with people talking and drinking in groups.',
                    flavor:1,
                    requiredTimes:{
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:11,
                        timehalfEF:'pm'
                    }
                },
                {
                    text:'Some of them recognize you, and warmly smile as you look their way.',
                    flavor:1,
                    requiredTimes:{
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:11,
                        timehalfEF:'pm'
                    },
                    requiredState: (player) =>
                    player.reputation[0]['ebonfront_inn'] >= 3
                    ||
                    player.hometown.name == 'Ignoma'
                },
                {
                    description:'The innkeeper stands at the counter, serving someone a drink,',
                    text:'approach them.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:5,
                    requiredTimes:{
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:11,
                        timehalfEF:'pm'
                    },
                },
                {
                    description:'The counter is staffed by a night-shift worker,',
                    text:'approach them.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:6,
                    requiredTimes:{
                        hourA:12,
                        hourB:12,
                        timehalfAB:'am',
                        hourC:1,
                        hourD:6,
                        timehalfCD:'am'
                    }
                },
                {
                    text:'Head to your room.',
                    color:'aqua',
                    nextText:8,
                    allowRepeats:1,
                    requiredState: (player) =>
                    player.inns.indexOf('ebonfront') !== -1,
                    time:{
                        minute:1
                    }
                },
                {
                    text:'Leave the inn.',
                    color:'aqua',
                    nextText:1,
                    allowRepeats:1,
                    setState: function() {
                        player.stats.fatigue += 0.1;
                        ui_post_stats_fatigue();
                    },
                    time:{
                        minute:1
                    }
                }
            ]
        }, // 9
        {
            id:10,
            text:'You stand in your room at the inn.',
            options:[
                {
                    text:'Sleep [1h] (-10% Fatigue)',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:10,
                    setState: function() {
                        player.stats.fatigue *= 0.9
                        ui_post_stats_fatigue();
                    },
                    time:{
                        hour:1
                    }
                },
                {
                    text:'Sleep [3h] (-50% Fatigue) (Restores Health)',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:10,
                    setState: function() {
                        player.stats.fatigue *= 0.5;
                        player.health = player.maxhealth;
                        ui_post_hp();
                        ui_post_stats_fatigue();
                    },
                    time:{
                        hour:3
                    }
                },
                {
                    text:'Sleep [6h] (-100% Fatigue) (Restores Health & Mana)',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:10,
                    setState: function() {
                        player.stats.fatigue = 0,
                        player.health = player.maxhealth;
                        player.mana = player.maxmana;
                        ui_post_hp();
                        ui_post_stats_fatigue();
                        ui_post_mana();
                    },
                    time:{
                        hour:6
                    }
                },
                {
                    text:'Go downstairs.',
                    color:'aqua',
                    nextText:9,
                    allowRepeats:1
                }
            ]
        }, // 10
        {
            id:11,
            text:'You arrive at the outskirts of Ebonfront.',
            options:[
                {
                    text:'Go into the city.',
                    color:'aqua',
                    nextText:1,
                    allowRepeats:1,
                    time: {
                        minute:3
                    },
                    setState: function() {
                        player.stats.fatigue += 0.2;
                        ui_post_stats_fatigue();
                    }
                },
                {
                    description:'Many travellers are coming in and out of the city. And numerous caravans are preparing to set off.',
                    text:'Ask to join one.',
                    color:'aqua',
                    nextText:12,
                    allowRepeats:1,
                    requiredTimes: {
                        hourA:6,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:3,
                        timehalfEF:'pm'
                    }
                },
                {
                    text:'Many travellers are coming in to the city, but it is too late for any caravans to be leaving.',
                    flavor:1,
                    requiredTimes:{
                        hourA:4,
                        hourB:11,
                        timehalfAB:'pm',
                    }
                },
                {
                    text:'The streets are deserted, and almost nobody is seen arriving at the city.',
                    flavor:1,
                    requiredTimes:{
                        hourA:12,
                        hourB:12,
                        timehalfAB:'am',
                        hourC:1,
                        hourD:5,
                        timehalfCD:'am'
                    }
                }
            ]
        }, // 11
        {
            id:12,
            text:'You approach a group of caravans, all headed to different regions of Ignoma.',
            options:[
                {
                    description:'One of the caravans looks to be going to Freygrave,',
                    text:'ask to join.',
                    color:'aqua',
                    nextText:13,
                    allowRepeats:1
                },
                {
                    description:'Another is headed for Timberside,',
                    text:'ask to join.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:18
                },
                {
                    text:'Back',
                    color:'gray',
                    nextText:11,
                    allowRepeats:1
                }
            ]
        }, // 12
        {
            id:13,
            text:'You ask the head of the caravan if you can tag along.',
            options:[
                {
                    description:'"Sure we got space, ain\'t doing it for free though, its gonna cost ya, what say 20 gold?"',
                    text:'Agree',
                    color:'lime',
                    nextText:14,
                    allowRepeats:1,
                    time:{
                        minute:5,
                        day:1
                    },
                    requiredState: (player) =>
                    player.gold >= 20
                    &&
                    player.backstory.name !== 'Explorer',
                    setState: function() {
                        player.gold -= 10;
                        player.stats.fatigue += 1;
                        ui_post_stats_gold();
                        ui_post_stats_fatigue();
                    }
                },
                {
                    description:'"Sure we got space, ain\'t doing it for free though, normally I\'d charge bout 20 gold, but since yer a pretty popular explorer I\'ll drop it to 10.',
                    text:'Agree',
                    color:'lime',
                    nextText:14,
                    allowRepeats:1,
                    time:{
                        minute:5,
                        day:1
                    },
                    requiredState: (player) =>
                    player.gold >= 10
                    &&
                    player.backstory.name == 'Explorer',
                    setState: function() {
                        player.gold -= 10;
                        ui_post_stats_gold();
                    }
                },
                {
                    text:'Decline',
                    color:'red',
                    nextText:11,
                    allowRepeats:1
                }
            ]
        }, // 13
        {
            id:14,
            text:'You help organize the caravan and shortly set off for Freygrave. The sound of the ocean fades as you travel further inland, and as the journey nears its end you see the town of Freygrave approaching.',
            options:[
                {
                    text:'-20 Gold',
                    color:'gray',
                    flavor:1,
                    requiredState: (player) => player.backstory.name !== 'Explorer'
                },
                {
                    text:'-10 Gold',
                    color:'gray',
                    flavor:1,
                    requiredState: (player) => player.backstory.name == 'Explorer'
                },
                {
                    text:'As you arrive at Freygrave you disembark from the wagon and thank them as they go on their way.',
                    flavor:1
                },
                {
                    text:'You\'re now in Freygrave, a small town on the eastern border of Ignoma, there\'s not much to do here, the town is merely used as a checkpoint between Ignoma and The Luma Empire.',
                    flavor:1
                },
                {
                    text:'Continue',
                    color:'gray',
                    allowRepeats:1,
                    nextText:15,
                    time:{
                        minute:5
                    }
                }
            ]
        }, // 14
        {
            id:15,
            text:'You stand on main streets, or rather street, of Freygrave.',
            options:[
                {
                    description:'A few groups of people on horse-drawn wagons are travelling through the street.',
                    text:'Run up to the one heading towards Ebonfront.',
                    color:'aqua',
                    nextText:16,
                    allowRepeats:1,
                    requiredTimes: {
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:6,
                        timehalfEF:'pm'
                    },
                    setState: function() {
                        player.stats.fatigue += 0.2;
                        ui_post_stats_fatigue();
                    }
                },
                {
                    text:'Wander the street. [15m]',
                    nextText:15,
                    color:'gray',
                    allowRepeats:1,
                    time: {
                        minute:15
                    },
                    setState: function() {
                        player.stats.fatigue += 0.1;
                        ui_post_stats_fatigue();
                    }
                }
            ]
        }, // 15
        {
            id:16,
            text:'You run up to a group of travellers who are headed in the direction of Ebonfront.',
            options:[
                {
                    text:'"We\'ve got plenty of room if you need a lift to Ebonfront, don\'t worry about payment."',
                    flavor:1
                },
                {
                    text:'Travel to Ebonfront',
                    nextText:17,
                    allowRepeats:1,
                    color:'lime',
                    time:{
                        day:1
                    },
                    setState: function() {
                        player.stats.fatigue += 1;
                        ui_post_stats_fatigue();
                    }
                },
                {
                    text:'Nevermind',
                    color:'red',
                    nextText:15,
                    allowRepeats:1
                }
            ]
        }, // 16
        {
            id:17,
            text:'Thanking the travellers for their kindness, you board their wagon and travel to Ebonfront.',
            options:[
                {
                    text:'The day-long journey seems to fly by in an instant, and before you know it you\'re approaching the outskirts of Ebonfront.',
                    flavor:1
                },
                {
                    text:'You\'ve arrived at Ebonfront, Ignoma\'s capital city and home to it\'s reputable fishing industry and glamorous ports.',
                    flavor:1
                },
                {
                    text:'Continue',
                    color:'gray',
                    nextText:11,
                    allowRepeats:1
                }
            ]
        }, // 17
        {
            id:18,
            text:'You run up to the head of the caravan and ask to join.',
            options:[
                {
                    description:'"Sure that\'s fine, we\'re in a bit of a hurry though so we\'re leaving straight away, still on board?"',
                    text:'Sure',
                    color:'lime',
                    nextText:19,
                    allowRepeats:1,
                    setState: function() {
                        player.stats.fatigue += 1;
                        ui_post_stats_fatigue();
                    },
                    time: {
                        hour:23,
                        minute:30
                    }
                },
                {
                    text:'Nevermind',
                    color:'red',
                    allowRepeats:1,
                    nextText:11
                }
            ]
        }, // 18
        {
            id:19,
            text:'You hastily join the caravan and set off towards Timberside. As you head further inland the ocean\'s sound and breeze slowly fades, replaced with the smell of pine.',
            options:[
                {
                    text:'The day-long journey goes by quickly, and due to the caravan\'s haste you arrive 30 minutes earlier than expected.',
                    flavor:1
                },
                {
                    text:'You thank the travellers for their generosity and quickly disembark the wagon as they make their way further into the residential area of the town.',
                    flavor:1
                },
                {
                    text:'Welcome to Timberside, a medium-sized town on Ignoma\'s southeast border. Timberside is a common stopover point and trade center for the various small villages in Light Witesia.',
                    flavor:1
                },
                {
                    text:'Continue',
                    color:'gray',
                    allowRepeats:1,
                    nextText:20
                }
            ]
        }, // 19
        {
            id:20,
            text:'You wander through the main streets of Timberside.',
            options:[
                {
                    text:'Various farmers from nearby Ignoman and Light Witesian villages are managing stalls along the main roads, selling fresh produce and various animal products.',
                    flavor:1,
                    requiredTimes: {
                        hourA:6,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:6,
                        timehalfEF:'pm'
                    }
                },
                {
                    description:'A large hub for arriving and departing caravans is situated further up the main road, crowded with the many travelling merchants, villagers, hunters, and more.',
                    text:'Make your way towards it.',
                    color:'aqua',
                    nextText:21,
                    allowRepeats:1,
                    setState: function() {
                        player.random = random(10);
                    },
                    requiredTimes: {
                        hourA:6,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:6,
                        timehalfEF:'pm'
                    }
                },
                {
                    description:'A large hub for arriving and departing caravans is situated further up the main road, at this time little activity is around it, although it still remains open.',
                    text:'Make your way towards it.',
                    color:'aqua',
                    nextText:21,
                    allowRepeats:1,
                    setState: function() {
                        player.random = random(10);
                        player.stats.fatigue += 0.1;
                        ui_post_stats_fatigue();
                    },
                    time: {
                        minute:1
                    },
                    requiredTimes: {
                        hourA:1,
                        hourB:5,
                        timehalfAB:'am',
                        hourC:7,
                        hourD:11,
                        timehalfCD:'pm',
                        hourE:12,
                        hourF:12,
                        timehalfEF:'am'
                    }
                }
            ]
        }, // 20
        {
            id:21,
            text:'You enter the Timberside travel hub through it\'s large front-facing gateway. It\'s spacious interior and full of parked wagons and carriages.',
            options:[
                {
                    text:'At this time of day, the building is crowded with carriages, wagons, and carts carrying various goods, standing out amidst a sea of merchants, villagers, hunters, and more.',
                    flavor:1,
                    requiredTimes: {
                        hourA:6,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:6,
                        timehalfEF:'pm'
                    }
                },
                {
                    text:'There are very few people wandering around the building at this time, a few guards here and there, and some merchants selling less common goods.',
                    flavor:1,
                    requiredTimes: {
                        hourA:1,
                        hourB:5,
                        timehalfAB:'am',
                        hourC:7,
                        hourD:11,
                        timehalfCD:'pm',
                        hourE:12,
                        hourF:12,
                        timehalfEF:'am'
                    }
                },
                {
                    description:'A few passenger carriages line up at the far end of the building, likely waiting for customers to transport.',
                    text:'Go towards them.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:22
                },
                {
                    text:'Leave the travel hub.',
                    color:'gray',
                    allowRepeats:1,
                    nextText:20,
                    time: {
                        minute:1
                    },
                    setState: function() {
                        player.stats.fatigue += 0.1;
                        ui_post_stats_fatigue();
                    }
                }
            ]
        }, // 21
        {
            id:22,
            text:'You approach the line of waiting carriages, a staff member nearby walks up to you and asks where you need to go, adding that all rides cost a standard 20 gold coins.',
            options:[
                {
                    text:'Ebonfront',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:23,
                    setState: function() {
                        player.gold -= 20;
                        player.stats.fatigue += 1;
                        ui_post_stats_fatigue();
                        ui_post_stats_gold();
                    },
                    time: {
                        day:1
                    }
                },
                {
                    text:'Freygrave',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:24,
                    setState: function() {
                        player.gold -= 20;
                        player.stats.fatigue += 1;
                        ui_post_stats_fatigue();
                        ui_post_stats_gold();
                    },
                    time: {
                        hour:12
                    }
                },
                {
                    text:'Nevermind',
                    color:'gray',
                    nextText:21,
                    allowRepeats:1
                }
            ]
        }, // 22
        {
            id:23,
            text:'The staff member quickly hails a carriage and sends you off on your way to Ebonfront once you give them the gold.',
            options:[
                {
                    text:'The journey is plain and uneventful, and after a day the city of Ebonfront visibly draws closer.',
                    flavor:1
                },
                {
                    text:'You\'ve arrived at Ebonfront, Ignoma\'s capital city and home to it\'s reputable fishing industry and glamorous ports.',
                    flavor:1
                },
                {
                    text:'Continue',
                    color:'gray',
                    allowRepeats:1,
                    nextText:11
                }
            ]
        }, // 23
        {
            id:24,
            text:'The staff member quickly hails a carriage and sends you off on your way to Freygrave when you pay them.',
            options:[
                {
                    text:'The journey passes by uneventfully, and once the half-day is up you reach Freygrave, thanking the driver as you dismount the carriage.',
                    flavor:1
                },
                {
                    text:'You\'re now in freygrave, a small town on the eastern border of Ignoma, there\'s not much to do here, the town is merely used as a checkpoint between Ignoma and The Luma Empire.',                    flavor:1
                },
                {
                    text:'Continue',
                    color:'gray',
                    allowRepeats:1,
                    nextText:15
                }
            ]
        }, // 24
        {
            id:100,
            text:'You stand near the center of your home village in Light Witesia. Villagers are starting daily activities; hunters going out into the surrounding forest, travelling merchants setting up stalls, and the delicious smell of fresh bread wavers through the air.',
            options: [
                {
                    text:'End',
                    nextText:-1,
                    color:'aqua',
                }
            ]
        }, // 100
        {
            id:200,
            text:'As the hot sun rises in the east you observe the citizens of Wildedenn, the Luma Empire\'s capital city. Many travellers who were using Wildedenn as a stopover point are getting ready to depart, and wandering merchants are setting up their shops for the soon arriving travellers.',
            options: [
                {
                    text:'End',
                    nextText:-1,
                    color:'aqua'
                }
            ]
        }, // 200
        {
            id:300,
            text:'Despite the early time, the citizens of The Kingdom of Dalia\'s capital, Oxlight, are already going about with their daily routines. Students from various academic and magic universities line the streets, some visiting the many high-end magical item retailers found throughout the city.',
            options: [
                {
                    text:'End',
                    nextText:-1,
                    color:'aqua'
                }
            ]
        }, // 300
        {
            id:400,
            text:'Zalrord\'s capital, Bellecairn, is already bustling with activity despite the somewhat early time, travelling merchants, adventurers, and nobles already bleed in and out of the city.',
            options: [
                {
                    text:'End',
                    nextText:-1,
                    color:'aqua'
                }
            ]
        }, // 400
        {
            id:500,
            text:'The Kingdom of Cataclite\'s capital, Beargarde, never sleeps. That could not be more apparent now, as despite the early time armed platoons of soldiers are moving in and out of the city, constantly on alert for the neverending threat of invasion from the numerous magical beasts in the area. Local blacksmiths and the odd traveller are also occasionally seen on the streets.',
            options: [
                {
                    text:'End',
                    nextText:-1,
                    color:'aqua'
                }
            ]
        }, // 500
        {
            id:600,
            text:'Westforest, Seld\'s capital, is pleasingly quiet at this time in the morning, with many of its nobles living a more late-waking lifestyle. However, several people go about conducting their business on Westforest\'s streets.',
            options: [
                {
                    text:'End',
                    nextText:-1,
                    color:'aqua'
                }
            ]
        }, // 600
    ]
}