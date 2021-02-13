const version = '0.1.5';
var universalOptions = [];
var textnodes = [];
    var shows_map_ignoma = [1,11,12,15,20,21,22],
    shows_map_light_witesia = [101,151],
    shows_map_luma_empire = [201,202]
    shows_map_option = shows_map_ignoma.concat(shows_map_light_witesia,shows_map_luma_empire),
    inn_room = [118,30,207]
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
            },
            fatigue:false,
            time:false
        },
        {
            text:'Sleep [8hr] (-100% Fatigue) (Restores Health & Mana)',
            color:'aqua',
            allowRepeats:1,
            nextText:-2,
            fatigue:false,
            time:{hour:8},
            requiredState: (player) => inn_room.indexOf(player.scene) !== -1,
            setState: function() {
                player.fatigue = 0;
                player.health = player.maxhealth;
                player.mana = player.maxmana;
                ui_post_hp(), ui_post_mana(), ui_post_stats_fatigue();
            }
        },
        {
            text:'Sleep [4hr] (-50% Fatigue) (Restores Health)',
            color:'aqua',
            allowRepeats:1,
            nextText:-2,
            fatigue:false,
            time:{hour:4},
            requiredState: (player) => inn_room.indexOf(player.scene) !== -1,
            setState: function() {
                player.fatigue *= 0.5;
                player.health = player.maxhealth;
                ui_post_hp(), ui_post_stats_fatigue();
            }
        },
        {
            text:'Sleep [1hr] (-10% Fatigue)',
            color:'aqua',
            allowRepeats:1,
            nextText:-2,
            fatigue:false,
            time:{hour:1},
            requiredState: (player) => inn_room.indexOf(player.scene) !== -1,
            setState: function() {
                player.fatigue *= 0.9;
                ui_post_stats_fatigue();
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
                    text:'Continue',
                    nextText:1,
                    color:'gold',
                    allowRepeats:1,
                    fatigue:false,
                    time:false
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
                    nextText:1,
                    allowRepeats:1,
                    fatigue:false,
                    time:false
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
                    fatigue:1
                },
                {
                    text:'Keep wandering the streets. [15m]',
                    color:'aqua',
                    nextText:1,
                    allowRepeats:1,
                    time:{
                        minute:15
                    },
                    fatigue:'Wander'
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
                        if(player.stats.strength<5){player.stats.strength += 1;ui_post_stats_strength();};
                        player.stats.fatigue += 40;
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
                /*{
                    text:'+1 Strength',
                    flavor:1,
                    color:'gray'
                },
                {
                    text:'+40 Fatigue',
                    flavor:1,
                    color:'gray'
                },*/
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
                        create_trade_menu('Ebonfront Innkeeper');
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
                    fatigue:false,
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
                    fatigue:false,
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
                    fatigue:false,
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
                    fatigue:false,
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
                    fatigue:false,
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
                    fatigue:false,
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
                    fatigue:false,
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
                    fatigue:false,
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
                    fatigue:false,
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
                    fatigue:false,
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
                        ui_post_stats_gold();
                    },
                    fatigue:'Caravan'
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
                    fatigue:0.2
                },
                {
                    text:'Run up to the one heading towards Timberside.',
                    color:'aqua',
                    nextText:25,
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
                    fatigue:0.2
                },
                {
                    description:'A large caravan headed for Wildedenn, The Luma Empire\'s capital, is preparing to depart soon.',
                    text:'Ask about joining.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:31,
                    requiredTimes: {
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am'
                    }
                },
                {
                    text:'A large caravan headed for Wildedenn, The Luma Empire\'s capital, will be departing later today.',
                    flavor:1,
                    requiredTimes: {
                        hourA:1,
                        hourB:6,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'am'
                    }
                },
                {
                    text:'Today\'s daily caravan for Wildedenn has already departed, you\'ll have to wait until tomorrow if you want to visit The Luma Empire.',
                    flavor:1,
                    requiredTimes: {
                        hourA:12,
                        hourB:12,
                        timehalfAB:'pm',
                        hourC:1,
                        hourD:11,
                        timehalfCD:'pm'
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
                    fatigue:'Wander'
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
                    fatigue:'Caravan'
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
                    fatigue:'Caravan',
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
                },
                {
                    text:'Visit the local inn.',
                    color:'aqua',
                    nextText:28,
                    allowRepeats:1
                },
                {
                    text:'Wander the street. [15m]',
                    nextText:20,
                    color:'gray',
                    allowRepeats:1,
                    time: {
                        minute:15
                    },
                    fatigue:'Wander'
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
                    requiredState: (player) => player.gold >= 20,
                    setState: function() {
                        player.gold -= 20;
                        ui_post_stats_fatigue();
                        ui_post_stats_gold();
                    },
                    time: {
                        day:1
                    },
                    fatigue:'Caravan'
                },
                {
                    text:'Freygrave',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:24,
                    requiredState: (player) => player.gold >= 20,
                    setState: function() {
                        player.gold -= 20;
                        ui_post_stats_fatigue();
                        ui_post_stats_gold();
                    },
                    time: {
                        hour:12
                    },
                    fatigue:'Caravan'
                },
                {
                    text:'Basinfront',
                    color:'yellow',
                    allowRepeats:1,
                    nextText:27,
                    requiredState: (player) => player.gold >= 20,
                    setState: function() {
                        player.gold -= 20;
                        ui_post_stats_fatigue();
                        ui_post_stats_gold();
                    },
                    fatigue:'Caravan',
                    time: {
                        day:1
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
                    text:'-20 Gold',
                    color:'gray',
                    flavor:1
                },
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
                    text:'-20 Gold',
                    color:'gray',
                    flavor:1
                },
                {
                    text:'The journey passes by uneventfully, and once the half-day is up you reach Freygrave, thanking the driver as you dismount the carriage.',
                    flavor:1
                },
                {
                    text:'You\'re now in freygrave, a small town on the eastern border of Ignoma, there\'s not much to do here, the town is merely used as a checkpoint between Ignoma and The Luma Empire.',
                    flavor:1
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
            id:25,
            text:'You run up to a group of travellers who are headed in the direction of Timberside.',
            options:[
                {
                    text:'"15 Gold if you want to tag along, not negotiating."',
                    flavor:1
                },
                {
                    text:'Travel to Timberside',
                    nextText:26,
                    allowRepeats:1,
                    color:'lime',
                    time:{
                        hour:12
                    },
                    requiredState: (player) => player.gold >= 15,
                    setState: function() {
                        ui_post_stats_fatigue();
                        player.gold -= 15;
                        ui_post_stats_gold();
                    },
                    fatigue:'Caravan'
                },
                {
                    text:'Nevermind',
                    color:'red',
                    nextText:15,
                    allowRepeats:1
                }
            ]
        }, // 25
        {
            id:26,
            text:'You give the travellers 15 gold and join their caravan. The weather takes a turn on the way to Timberside but luckily the carriages are enclosed by a layer of tarp.',
            options:[
                {
                    text:'-15 Gold',
                    color:'gray',
                    flavor:1
                },
                {
                    text:'As the journey comes to an end and the rain conveniently fades, you begin to see Timberside coming into view.',
                    flavor:1
                },
                {
                    text:'Welcome to Timberside, a medium-sized own on Ignoma\'s southeast border. Timberside is a common stopover point and trade center for the various small villages in Light Witesia.',
                    flavor:1
                },
                {
                    text:'Continue',
                    allowRepeats:1,
                    color:'gray',
                    nextText:20
                }
            ]
        }, // 26
        {
            id:27,
            text:'You give the staff member the gold as they hail a waiting carriage.',
            options:[
                {
                    text:'-20 Gold',
                    color:'gray',
                    flavor:1
                },
                {
                    text:'As you journey into Light Witesia the surrounding woods become more dense, and path less built-up. Signs of human civilization become less frequent all the way up until you reach the village of Basinfront.',
                    flavor:1
                },
                {
                    text:'You\'ve reached Basinfront, a prominent village in the north of Light Witesia. Hunters and explorers frequent this village due to its close proximity to the vast, dense, and unexplored jungles surrounding it.',
                    flavor:1
                },
                {
                    text:'Continue',
                    color:'gray',
                    allowRepeats:1,
                    nextText:101
                }
            ]
        }, // 27
        {
            id:28,
            text:'You stand inside Timberside\'s primary inn.',
            options:[
                {
                    description:'The innkeeper stands at the counter,',
                    text:'approach them.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:29,
                    requiredTimes: {
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:10,
                        timehalfEF:'pm'
                    }
                },
                {
                    description:'An innkeeper working the night shift stands at the counter,',
                    text:'approach them.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:29,
                    requiredTimes: {
                        hourA:1,
                        hourB:6,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'am',
                        hourE:11,
                        hourF:11,
                        timehalfEF:'pm'
                    }
                },
                {
                    text:'Go upstairs to your room.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:30,
                    requiredState: (player) => player.inns.indexOf('timberside') !== -1
                },
                {
                    text:'Leave',
                    color:'gray',
                    nextText:20,
                    allowRepeats:1
                }
            ]
        }, // 28
        {
            id:29,
            text:'You walk up to the counter.',
            options:[
                {
                    text:'"Welcome to the inn, we\'ve got rooms for 12 gold a pop, and serve meals as well."',
                    flavor:1,
                    requiredTimes: {
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:10,
                        timehalfEF:'pm'
                    }
                },
                {
                    text:'Welcome, rooms are 12 gold each, and the kitchen opens at 7."',
                    flavor:1,
                    requiredTimes: {
                        hourA:1,
                        hourB:6,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'am',
                        hourE:11,
                        hourF:11,
                        timehalfEF:'pm'
                    }
                },
                {
                    text:'"A room please."',
                    allowRepeats:1,
                    color:'lime',
                    requiredState: (player) => player.gold >= 12 && player.inns.indexOf('timberside') == -1,
                    nextText:28,
                    setState: function() {
                        player.gold -= 12;
                        ui_post_stats_gold();
                        player.inns.push('timberside');
                    }
                },
                {
                    text:'You do not have enough gold for a room.',
                    color:'gray',
                    flavor:1,
                    requiredState: (player) => player.gold < 12 && player.inns.indexOf('timberside') == -1
                },
                {
                    text:'"What\'s on the menu?"',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:-2,
                    setState: function() {
                        create_trade_menu('Ebonfront Innkeeper');
                    }
                },
                {
                    text:'Nevermind',
                    color:'gray',
                    allowRepeats:1,
                    nextText:28
                }
            ]
        }, // 29
        {
            id:30,
            text:'You are in your room at the Timberside inn.',
            options:[
                {
                    text:'Leave',
                    color:'gray',
                    allowRepeats:1,
                    nextText:28
                }
            ]
        }, // 30
        {
            id:31,
            text:'You walk up to the caravan overseers and enquire about joining.',
            options:[
                {
                    text:'"It\'s 20 gold if your joining as an ordinary traveller, The Luma Empire is a dangerous place and hiring protection is costly. If you\'re any good with a weapon however, we\'d be more than happy having you onboard for free."',
                    flavor:1
                },
                {
                    text:'Join Caravan',
                    color:'lime',
                    requiredState: (player) => player.gold >= 20,
                    setState: function() {
                        player.gold -= 20;
                        ui_post_stats_gold();
                    },
                    nextText:32,
                    allowRepeats:1,
                    fatigue:10,
                    time:{
                        day:5
                    }
                },
                {
                    text:'You do not have enough gold to join the caravan.',
                    color:'gray',
                    flavor:1,
                    requiredState: (player) => player.gold < 20
                },
                {
                    text:'Nevermind',
                    color:'gray',
                    allowRepeats:1,
                    nextText:15
                }
            ]
        }, // 31
        {
            id:32,
            text:'You pay the gold and join the caravan. By midday everyone is ready and you set off on the 5 day journey to Wildedenn.',
            options:[
                {
                    text:'The lush forestry and grassy plains of Ignoma are left behind, and the surroundings turn into vast sandy deserts and dunes as far as the eye can see.',
                    flavor:1
                },
                {
                    text:'There are few others on the roads, most travelling in a similar manner to your caravan, heavily guarded and leveraging safety in numbers.',
                    flavor:1
                },
                {
                    text:'Thanks to the caravan\'s hired guards, most lurking bandits are deterred, and you are able to get to Wildedenn without any trouble, a relief for everyone.',
                    flavor:1
                },
                {
                    text:'Continue',
                    allowRepeats:1,
                    nextText:33,
                    color:'gray',
                }
            ]
        }, // 32
        {
            id:33,
            text:'You thank the caravan organisers for helping you safely get to Wildedenn, and they bid you farewell.',
            options:[
                {
                    text:'You\'ve made it to Wildedenn, a small city in the center of The Luma Empire and widely regarded as The Luma Empire\'s capital despite the lack of a governing body in the kingdom. Wildedenn is a major stopover point for travellers making the long, dangerous journeys through The Luma Empire, and crime is commonplace.',
                    flavor:1
                },
                {
                    text:'Continue',
                    allowRepeats:1,
                    nextText:201,
                    color:'gray'
                }
            ]
        }, // 33
        {
            id:100,
            text:'You stand near the center of your home village in Light Witesia. Villagers are starting daily activities; hunters going out into the surrounding forest, travelling merchants setting up stalls, and the delicious smell of fresh bread wavers through the air.',
            options: [
                {
                    text:'Continue',
                    nextText:101,
                    color:'aqua',
                }
            ]
        }, // 100
        {
            id:101,
            text:'You wander down the main road of Basinfront.',
            options:[
                {
                    text:'Although the village is small, the street is busy with many villagers, hunters, and explorers are going about their day.',
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
                    text:'There are many familiar faces among them, and some greet you as you walk by.',
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
                    },
                    requiredState: (player) => player.hometown.name == 'Light Witesia'
                },
                {
                    description:'A lot of people are entering a building displaying a "Hunters Guild" banner,',
                    text:'go inside.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:104,
                    requiredState: (player) => player.completed.indexOf(104) == -1,
                    time: {
                        minute:1
                    },
                    requiredTimes: {
                        hourA:6,
                        hourB:10,
                        timehalfAB:'am'
                    }
                },
                {
                    description:'The Hunters Guild building is open,',
                    text:'go inside.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:104,
                    requiredState: (player) => player.completed.indexOf(104) !== -1,
                    time: {
                        minute:1
                    },
                    requiredTimes: {
                        hourA:6,
                        hourB:10,
                        timehalfAB:'am'
                    },
                },
                {
                    text:'Visit the local inn.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:113,
                    time:{
                        minute:1
                    }
                },
                {
                    description:'Numerous travellers are coming through the village on their way to Timberside and Oldwatch.',
                    text:'Hitchike to Timberside.',
                    color:'aqua',
                    nextText:102,
                    allowRepeats:1,
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
                    },
                    setState: function() {
                        player.random = random()
                    },
                    time: {
                        minute:5
                    }
                },
                {
                    text:'Hitchike to Oldwatch.',
                    color:'aqua',
                    nextText:111,
                    allowRepeats:1,
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
                    },
                    setState: function() {
                        player.random = random()
                    },
                    time: {
                        minute:5
                    }
                },
                {
                    text:'Wander through the village. [15m]',
                    nextText:101,
                    color:'gray',
                    allowRepeats:1,
                    time: {
                        minute:15
                    },
                    fatigue:'Wander'
                }
            ]
        }, // 101
        {
            id:102,
            text:'You try your luck at hitchiking to Timberside.',
            options:[
                {
                    description:'A passing explorer offers you a lift,',
                    text:'accept it.',
                    color:'lime',
                    allowRepeats:1,
                    nextText:103,
                    fatigue:'Caravan',
                    time: {
                        day:1
                    },
                    requiredState: (player) => player.random >= 6
                },
                {
                    text:'Decline',
                    color:'red',
                    allowRepeats:1,
                    nextText:101,
                    requiredState: (player) => player.random >= 6
                },
                {
                    description:'Unfortunately nobody stops to offer you a lift.',
                    text:'Keep Trying',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:102,
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
                    },
                    setState: function() {
                        ui_post_stats_fatigue();
                        player.random = random()
                    },
                    time: {
                        minute:5
                    },
                    requiredState: (player) => player.random <= 5

                },
                {
                    text:'Give Up',
                    color:'gray',
                    allowRepeats:1,
                    nextText:101,
                    requiredState: (player) => player.random <= 5
                }
            ]

        }, // 102
        {
            id:103,
            text:'You jump in the explorer\'s wagon and make your way to Timberside.',
            options:[
                {
                    text:'You make small talk with the generous explorer on the way.',
                    flavor:1
                },
                {
                    text:'They passionately explain their theories about hidden villages of humanoid people deeper in the jungle.',
                    flavor:1,
                    requiredState: (player) => player.random == 10
                },
                {
                    text:'Welcome to Timberside, a medium-sized town on Ignoma\'s southeast border. Timberside is a common stopover point and trade center for the various small villages in Light Witesia.',
                    flavor:1
                },
                {
                    text:'Continue',
                    color:'gray',
                    nextText:20,
                    allowRepeats:1
                }
            ]
        }, // 103
        {
            id:104,
            text:'You\'re in the Hunters Guild building. The atmosphere is noisy yet pleasant, as you overhear various groups of hunters, explorers, and adventurers planning out their expeditions for the day.',
            options: [
                {
                    description:'A large wooden noticeboard stands near the entrance, filled with details about quests and parties to join for the surrounding area.',
                    text:'Take a look.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:105
                },
                {
                    text:'Exit',
                    color:'gray',
                    nextText:101,
                    allowRepeats:1
                }
            ]
        }, // 104
        {
            id:105,
            text:'You stop to look at the noticeboard, it\'s filled with advertisements and recruitment posters for hunters and explorers.',
            options:[
                {
                    text:'View hunter related posters.',
                    color:'yellow',
                    allowRepeats:1,
                    nextText:106
                },
                {
                    text:'View explorer related posters.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:107
                },
                {
                    text:'View other posters.',
                    color:'magenta',
                    allowRepeats:1,
                    nextText:108
                },
                {
                    text:'Move Away',
                    color:'gray',
                    allowRepeats:1,
                    nextText:104
                }
            ]
        }, // 105
        {
            id:106,
            text:'You look at the hunter related posters on the board.',
            options:[
                {
                    description:'A small group of local hunters are going on a daily hunting trip, offering 50 gold to any able hunters who wish to join them.',
                    text:'Join them.',
                    color:'lime',
                    allowRepeats:1,
                    nextText:109,
                    time: {
                        minute:5
                    }
                },
                {
                    text:'Back',
                    color:'gray',
                    allowRepeats:1,
                    nextText:105
                }
            ]
        }, // 106
        {
            id:107,
            text:'You look at the explorer related posters on the board.',
            options:[
                {
                    text:'Back',
                    color:'gray',
                    allowRepeats:1,
                    nextText:105
                }
            ]
        }, // 107
        {
            id:108,
            text:'You look at the other posters on the board.',
            options:[
                {
                    text:'Back',
                    color:'gray',
                    allowRepeats:1,
                    nextText:105
                }
            ]
        }, // 108
        {
            id:109,
            text:'You read through the details on the notice and find the group of local hunters. After a quick period of preperation you set off to a lesser-known animal hunting ground.',
            options:[
                {
                    text:'Continue',
                    color:'gray',
                    allowRepeats:1,
                    nextText:110,
                    time: {
                        hour:7
                    },
                    setState: function() {
                        if(player.stats.strength < 5){player.stats.strength += 1;ui_post_stats_strength();player.deltas.strength=1};
                        if(player.stats.agility < 5){player.stats.agility += 1;ui_post_stats_agility();player.deltas.agility=1};
                        if(player.stats.agility >= 5 && player.stats.strength >= 5 && player.stats.perception < 5){player.stats.perception+=1;ui_post_stats_perception();player.deltas.perception=1}
                        if(player.backstory.name=='Hunter'){player.stats.fatigue += 40;player.gold+=70}
                        else {player.stats.fatigue += 50;player.gold+=50};
                        ui_post_stats_gold();
                        ui_post_stats_fatigue();
                    },
                    fatigue:false
                },
            ]
        }, // 109
        {
            id:110,
            text:'The hunt is successful, you and the other hunters were able to get quite a few animal corpses without incident.',
            options:[
                {
                    text:'The hunters happily hand you the promised gold before leaving towards their homes.',
                    flavor:1,
                    requiredState: (player) => player.backstory.name !== 'Hunter'
                },
                {
                    text:'The hunters were surprised at your oustanding hunting ability, and give you some extra gold as thanks.',
                    flavor:1,
                    requiredState: (player) => player.backstory.name == 'Hunter'
                },
                {
                    text:'+50 Gold',
                    color:'gray',
                    flavor:1,
                    requiredState: (player) => player.backstory.name !== 'Hunter'
                },
                {
                    text:'+70 Gold',
                    color:'gray',
                    flavor:1,
                    requiredState: (player) => player.backstory.name == 'Hunter'
                },
                {
                    text:'+1 Strength',
                    color:'gray',
                    flavor:1,
                    requiredState: (player) => player.deltas.strength == 1
                },
                {
                    text:'+1 Agility',
                    color:'gray',
                    flavor:1,
                    requiredState: (player) => player.deltas.agility == 1
                },
                {
                    text:'+1 Perception',
                    color:'gray',
                    flavor:1,
                    requiredState: (player) => player.deltas.perception == 1
                },
                {
                    text:'Continue',
                    color:'gray',
                    allowRepeats:1,
                    nextText:101,
                    setState: function() {
                        ui_clear_delta();
                    }
                }
            ]
        }, // 110
        {
            id:111,
            text:'You try your luck at hitchiking to Oldwatch.',
            options:[
                {
                    description:'A passing merchant offers you a lift,',
                    text:'accept it.',
                    color:'lime',
                    allowRepeats:1,
                    nextText:112,
                    fatigue:'Caravan',
                    setState: function() {
                        ui_post_stats_fatigue();
                    },
                    time: {
                        day:1
                    },
                    requiredState: (player) => player.random >= 6
                },
                {
                    text:'Decline',
                    color:'red',
                    allowRepeats:1,
                    nextText:101,
                    requiredState: (player) => player.random >= 6
                },
                {
                    description:'Unfortunately nobody stops to offer you a lift.',
                    text:'Keep Trying',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:111,
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
                    },
                    setState: function() {
                        ui_post_stats_fatigue();
                        player.random = random()
                    },
                    time: {
                        minute:5
                    },
                    requiredState: (player) => player.random <= 5

                },
                {
                    text:'Give Up',
                    color:'gray',
                    allowRepeats:1,
                    nextText:101,
                    requiredState: (player) => player.random <= 5
                }
            ]

        }, // 111
        {
            id:112,
            text:'You accept the merchant\'s offer and climb into the carriage.',
            options:[
                {
                    text:'The dense forests and jungles of the surroundings slowly fade into open farmlands as your journey to Oldwatch. As the day-long journey comes to an end the merchant bids you farewell and you dismount the carriage.',
                    flavor:1
                },
                {
                    text:'You\'re now in Oldwatch, Light Witesia\'s northernmost village. Due to its relatively large distance from Light Witesia\'s dense forests and jungles, Oldwatch is primarily surrounded by crop and animal farms.',
                    flavor:1
                },
                {
                    text:'Continue',
                    color:'gray',
                    nextText:151,
                    allowRepeats:1
                }
            ]
        }, // 112
        {
            id:113,
            text:'You enter Basinfront\'s local inn.',
            options:[
                {
                    description:'The innkeeper stands at the bar, serving someone a drink,',
                    text:'approach them.',
                    color:'aqua',
                    nextText:115,
                    allowRepeats:1,
                    requiredTimes: {
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
                }
            ]
        }, // 113
        {
            id:114,
            text:'You\'re in Basinfront\'s local inn.',
            options:[
                {
                    description:'The innkeeper stands idly at the bar,',
                    text:'approach them.',
                    color:'aqua',
                    nextText:115,
                    allowRepeats:1,
                    requiredTimes: {
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
                    description:'An staff member sits at the inn\'s counter, working the night shift.',
                    text:'Approach them.',
                    color:'aqua',
                    nextText:116,
                    allowRepeats:1,
                    requiredTimes: {
                        hourA:1,
                        hourB:6,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'am'
                    }
                },
                {
                    text:'Go upstairs to your room.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:118
                },
                {
                    text:'Leave',
                    color:'gray',
                    allowRepeats:1,
                    nextText:101
                }
            ]
        }, // 114
        {
            id:115,
            text:'You walk up to the innkeeper.',
            options:[
                {
                    text:'"You\'re a new face, what can I get you?"',
                    flavor:1,
                    requiredState: (player) => player.hometown.name !== 'Light Witesia'
                },
                {
                    text:`"Hello ${player.name}, what can I get you today?"`,
                    flavor:1,
                    requiredState: (player) => player.hometown.name == 'Light Witesia'
                },
                {
                    description:'"Rooms start at 10 gold a night, I know its a little expensive but we get lots of travellers through here."',
                    text:'Pay for a room.',
                    color:'lime',
                    nextText:117,
                    allowRepeats:1,
                    requiredState: (player) => player.gold >= 10 && player.inns.indexOf('basinfront') == -1,
                    setState: function() {
                        player.gold -= 10;
                        ui_post_stats_gold();
                        player.inns.push('basinfront');
                    }
                },
                {
                    description:'"Rooms start at 10 gold a night, I know its a little expensive but we get lots of travellers through here."',
                    text:'You do not have enough money for a room.',
                    color:'gray',
                    flavor:1,
                    requiredState: (player) => player.gold < 10 && player.inns.indexOf('basinfront') !== -1
                },
                {
                    description:'"We also serve local meals and liquor."',
                    text:'Browse the menu.',
                    color:'yellow',
                    allowRepeats:1,
                    nextText:114,
                    setState: function() {
                        create_trade_menu('Basinfront Innkeeper')
                    }
                },
                {
                    text:'Nevermind',
                    color:'gray',
                    allowRepeats:1,
                    nextText:114
                }
            ]
        }, // 115
        {
            id:116,
            text:'You walk up to the counter.',
            options:[
                {
                    text:`"Rooms are 10 gold a night."`,
                    flavor:1,
                    requiredState: (player) => player.hometown.name == 'Light Witesia'
                },
                {
                    text:'Pay for a room.',
                    color:'lime',
                    nextText:117,
                    allowRepeats:1,
                    requiredState: (player) => player.gold >= 10 && player.inns.indexOf('basinfront') == -1,
                    setState: function() {
                        player.gold -= 10;
                        ui_post_stats_gold();
                        player.inns.push('basinfront');
                    }
                },
                {
                    text:'You do not have enough money for a room.',
                    color:'gray',
                    flavor:1,
                    requiredState: (player) => player.gold < 10 && player.inns.indexOf('basinfront') == -1
                },
                {
                    text:'Nevermind',
                    color:'gray',
                    allowRepeats:1,
                    nextText:114
                }
            ]
        }, // 116
        {
            id:117,
            text:'You get your room key and move away from the counter.',
            options:[
                {
                    text:'-10 Gold',
                    color:'gray',
                    flavor:1
                },
                {
                    text:'Continue',
                    color:'gray',
                    allowRepeats:1,
                    nextText:114,
                    fatigue:false,
                    time:false
                }
            ]
        }, // 117
        {
            id:118,
            text:'You\'re in your room at the Basinfront inn.',
            options:[
                {
                    text:'Leave Room',
                    color:'gray',
                    allowRepeats:1,
                    nextText:114
                }
            ]
        }, // 118
        {
            id:151,
            text:'You stand on the streets of Oldwatch.',
            options:[
                {
                    text:'Hitchike to Basinfront.',
                    color:'aqua',
                    nextText:152,
                    allowRepeats:1,
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
                    },
                    setState: function() {
                        player.random = random()
                    },
                    time: {
                        minute:5
                    }
                },
                {
                    text:'Wander the streets. [15m]',
                    color:'gray',
                    allowRepeats:1,
                    nextText:151,
                    time: {
                        minute:15
                    },
                    fatigue:'Wander'
                }
            ]
        }, // 151
        {
            id:152,
            text:'You stand on the main road and try to hitchhike your way to Basinfront.',
            options:[
                {
                    description:'A passing hunter offers you a lift,',
                    text:'accept it.',
                    color:'lime',
                    allowRepeats:1,
                    nextText:153,
                    fatigue:'Caravan',
                    time: {
                        day:1
                    },
                    requiredState: (player) => player.random >= 6
                },
                {
                    text:'Decline',
                    color:'red',
                    allowRepeats:1,
                    nextText:151,
                    requiredState: (player) => player.random >= 6
                },
                {
                    description:'Unfortunately nobody stops to offer you a lift.',
                    text:'Keep Trying',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:152,
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
                    },
                    setState: function() {
                        player.random = random()
                    },
                    time: {
                        minute:5
                    },
                    requiredState: (player) => player.random <= 5

                },
                {
                    text:'Give Up',
                    color:'gray',
                    allowRepeats:1,
                    nextText:151,
                    requiredState: (player) => player.random <= 5
                }
            ]
        }, // 152
        {
            id:153,
            text:'You accept the hunter\'s offer and join them on their journey to Basinfront. The open farmland surroundings soon turn into dense forests and jungle canopies.',
            options:[
                {
                    text:'Before long you reach Basinfront, a prominent village in the north of Light Witesia. Many hunters and explorers frequent this village due to its close proximity to the vast, dense, and unexplored jungles surrounding it.',
                    flavor:1,
                },
                {
                    text:'Continue',
                    allowRepeats:1,
                    color:'gray',
                    nextText:101
                }
            ]
        }, // 153
        {
            id:200,
            text:'As the hot sun rises in the east you absentmindedly walk the streets of Wildedenn, the Luma Empire\'s capital city. For better or for worse you\'ve decided to become an adventurer, and although it won\'t be easy, it\'ll surely be worth it in the long run.',
            options: [
                {
                    text:'Continue',
                    nextText:201,
                    color:'gray',
                    allowRepeats:1
                }
            ]
        }, // 200
        {
            id:201,
            text:'You stand on the streets of Wildedenn, a gentle breeze circulates from the surrounding desert.',
            options:[
                {
                    description:'Many travellers who were using Wildedenn as a stopover point are preparing to depart.',
                    text:'Try and join a caravan.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:202,
                    requiredTimes: {
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                    }
                },
                {
                    text:'Visit a local inn.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:205
                },
                {
                    text:'Wander the Streets. [15m]',
                    allowRepeats:1,
                    color:'gray',
                    nextText:201,
                    time:{
                        minute:15
                    },
                    fatigue:'Wander'
                }
            ]
        }, // 201
        {
            id:202,
            text:'There are many caravans headed to multiple places.',
            options:[
                {
                    text:'Join one headed towards Freygrave.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:203
                },
                {
                    text:'Nevermind',
                    color:'gray',
                    allowRepeats:1,
                    nextText:201
                }
            ]
        }, // 202
        {
            id:203,
            text:'You walk up to a caravan heading in the direction of Freygrave.',
            options:[
                {
                    text:'"20 Gold to join us, and don\'t even think about haggling me."',
                    flavor:1
                },
                {
                    text:'Accept',
                    color:'lime',
                    allowRepeats:1,
                    nextText:204,
                    fatigue:'Caravan',
                    time: {
                        day:5
                    },
                    requiredState: (player) => player.gold >= 20,
                    setState: function() {
                        player.gold -= 20;
                        ui_post_stats_gold();
                    }
                },
                {
                    text:'You do not have enough gold to accept their offer.',
                    color:'gray',
                    flavor:1,
                    requiredState: (player) => player.gold < 20
                },
                {
                    text:'Decline',
                    color:'red',
                    allowRepeats:1,
                    nextText:202
                }
            ]
        }, // 203
        {
            id:204,
            text:'You accept their offer and hand over the gold.',
            options:[
                {
                    text:'-20 Gold',
                    color:'gray',
                    flavor:1
                },
                {
                    text:'Not long afterwards the caravan is on the road towards Freygrave. The unchanging surroundings of vast empty desert lasts a while, but as you near the end of the journey they begin to change into lush forests and grassy plains, becoming more prominent as you draw closer to Ignoma\'s border.',
                    flavor:1
                },
                {
                    text:'The trip is uneventful, the people overseeing the caravan you joined clearly know what they\'re doing, the caravan isn\'t targeted by lurking bandits as a result.',
                    flavor:1
                },
                {
                    text:'Once the 5 long days are up you arrive in Freygrave, a small town on the eastern Border of Ignoma. There isn\'t much to do here as the town is merely used as a checkpoint between Ignoma and The Luma Empire.',
                    flavor:1
                },
                {
                    text:'Continue',
                    color:'gray',
                    allowRepeats:1,
                    nextText:15
                }
            ]
        }, // 204
        {
            id:205,
            text:'You\'re in Wildenn\'s local inn.',
            options:[
                {
                    text:'The inn is crowded with many people, some merchants and travellers, and others with more dubious backgrounds. You feel several pairs of eyes staring into you as you enter.',
                    flavor:1,
                    requiredTimes: {
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:10,
                        timehalfEF:'pm'
                    }
                },
                {
                    description:'The innkeeper stands behind the counter, looking out for trouble among the visitors.',
                    text:'Approach them.',
                    color:'lime',
                    allowRepeats:1,
                    requiredTimes: {
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:10,
                        timehalfEF:'pm'
                    },
                    nextText:206
                },
                {
                    description:'An inn staff sits behind the counter, working the night shift.',
                    text:'Approach them.',
                    color:'lime',
                    allowRepeats:1,
                    requiredTimes: {
                        hourA:1,
                        hourB:6,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'am',
                        hourE:11,
                        hourF:11,
                        timehalfEF:'pm'
                    },
                    nextText:206
                },
                {
                    text:'Go to your room.',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:207,
                    requiredState: (player) => player.inns.indexOf('wildedenn') !== -1
                },
                {
                    text:'Exit',
                    color:'gray',
                    allowRepeats:1,
                    nextText:201
                }
            ]
        }, // 205
        {
            id:206,
            text:'You walk up to the counter.',
            options:[
                {
                    text:'"Hey there, rooms are 10 gold a night if you need one of those, we\'ve also got a menu if you wanna have a look at that."',
                    flavor:1,
                    requiredTimes: {
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:10,
                        timehalfEF:'pm'
                    },
                },
                {
                    text:'"Rooms are 10 gold a night."',
                    flavor:1,
                    requiredTimes: {
                        hourA:1,
                        hourB:6,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'am',
                        hourE:11,
                        hourF:11,
                        timehalfEF:'pm'
                    },
                },
                {
                    text:'"A room."',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:205,
                    requiredState: (player) => player.gold >= 10 && player.inns.indexOf('wildedenn') == -1,
                    setState: function() {
                        player.gold -= 10;
                        ui_post_stats_gold();
                        player.inns.push('wildedenn');
                    }
                },
                {
                    text:'You do not have enough gold for a room.',
                    color:'gray',
                    requiredState: (player) => player.gold < 10 && player.inns.indexOf('wildedenn') == -1,
                    flavor:1
                },
                {
                    text:'"Let me see the menu."',
                    color:'aqua',
                    allowRepeats:1,
                    nextText:-2,
                    requiredTimes: {
                        hourA:7,
                        hourB:11,
                        timehalfAB:'am',
                        hourC:12,
                        hourD:12,
                        timehalfCD:'pm',
                        hourE:1,
                        hourF:10,
                        timehalfEF:'pm'   
                    },
                    setState: function() {
                        create_trade_menu('Wildedenn Innkeeper');
                    }
                },
                {
                    text:'Nevermind',
                    color:'gray',
                    allowRepeats:1,
                    nextText:205
                }
            ]
        }, // 206
        {
            id:207,
            text:'You stand in your room at the Wildedenn inn.',
            options:[
                {
                    text:'Leave',
                    color:'gray',
                    allowRepeats:1,
                    nextText:205
                }
            ]
        }, // 207
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