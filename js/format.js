// Excuse the awful indentation, this format is very much a work in progress.
// Should be extremely easy to add "DLC"s since just array.push, and editing some original array options to point to the new ones (and linking the javascript file in index.html).
var textNodes = [
    { // This is an example scene so it has all the possible fields in it, any field with an '(Optional)' comment means you don't need to include the field if you're not using its functionality.
        id:12345, // ID for this scene, must be unique (decimal values are allowed).
        text:'You look around the room and see 2 boxes, one gray and one green.', // Text for the scene that is shown unconditionally.
        options:[ // List of "options" for the scene, options is in quotes since some options can just be used as additional, non-interactable text.
            {
                description:'The gray box looks strange, like it\'s made out of a transparent silk, you could', // (Optional) Text for the option that provides context.
                text:'try and take it off.', // The selectable part of the option, this is the bit that the player taps on, so its preferable for this to describe the action the option is doing.
                color:'gray', // (Optional) Color for the 'text' section of this option, accepts HEX and other CSS color definitions, defaults to white if undefined.
                nextText:12346, // (Optional) ID of the scene this option links to, this is required unless the option is a 'flavor' option.
                reverse:0, // (Optional) Displays the option's description after the text (by default it is before).
                flavor:0, // (Optional) Turns the option into a flavor option, removing the click event, hover effects, but not color. This is best used as conditional background text.
                time: { //  (Optional) Defines how much time this option takes, e.g. a task like strolling through streets will take 5 minutes, but sleeping may take many hours. Defaults to 0.
                    month:0, // Each field is optional.
                    day:0,
                    hour:0,
                    minute:1
                },
                requiredTimes: { // (Optional) Specifices the range of times and dates when this option is shown. Will show all the time if not included.
                    monthA:0, // A is the lowest the value can be, B is the highest the value can be, both are inclusive.
                    monthB:12, // Each field here is optional, but if you have an A of one you must also have the B of another.
                    dayA:0,
                    dayB:100,
                    hourA:1, // 3 Seperate ranges of time are possible, don't get caught out on 12's.
                    hourB:2,
                    timehalfAB:'am',
                    hourC:10, // You don't have to have all 3 ranges, but if you have EF you must have CD, and if you have CD you must have AB, etc.
                    hourD:11,
                    timehalfCD:'am',
                    hourE:1,
                    hourF:5,
                    timehalfEF:'pm',
                    minuteA:0,
                    minuteB:59
                },
                allowRepeats:1, // (Optional) Specifies if this option can be shown again once selected, has no effect on flavour options, defaults to 0.
                requiredState: (player) =>  // (Optional) Conditional playerdata to show the option.
                    player.stats.strength == 0
                    && // New arguments on each line for visibility, but aren't necessary.
                    player.stats.agility >= 5 // Examples using player stats and ranges.
                    &&
                    player.stats.agility <= 10
                    &&
                    player.backstory.name == 'Sailor'
                    ||
                    player.hometown.name == 'Ignoma'
                    &&
                    player.reputation[0]['ebonfront_docks'] >= 3 // Reputations are predefined player data.
                    &&
                    player.completed.indexOf(12) !== -1 // Example using story ID's, this option won't show unless the player has completed scene 12.
                    &&
                    player.inns.indexOf('ebonfront') == -1 // Example using inns, this option won't show unless the player doesnt have a room in the Ebonfront inn.
                    &&
                    player.inventory[player.inventory.map(e => e.name).indexOf('Beer')] !== -1, // Example using inventory, this option will only show if the player has beer in their inventory.
                setState: function() { // (Optional) Actions this option does, anything can go here.
                    player.stats.proficiency += 1;
                    player.health -= 10;
                    ui_post_stats_all();
                    ui_post_hp();
                    player.inns.push('ebonfront');
                    // etc...
                }
            }, // At the end of each option comment the id number.
            {
                // Option #2...
            }, // 2 Ignoma Ebonfront Docks
            {
                // Option #3, etc...
            } // 3 Kingdom of Dalia Oxlight Sewers
        ]
    },
    {
        // Another scene...
    },
    {
        // Another scene, etc...
    }
]