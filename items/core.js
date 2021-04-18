var items = [
    {
        name: "Seafood Meal",
        desc: "An average seafood meal.",
        cost: 10,
        src: "seafood_meal.png",
        tags: ["seaside"],
        use: function() {console.log("helklo")}
    },
    {
        name: "Beer",
        desc: "A cold bottle of beer.",
        cost: 5,
        src: "beer.png"
    }
],
vendors = [
    {
        name: "Innkeeper",
        items: ["Seafood Meal", "Beer"]
    }
],
item_modifiers = [
    {
        name: "seaside", // seafood and sea related items are cheaper
        offset: -1
    }
],
global_item_modifiers = [
    {
        name: "isolated", // places far away from others, like Wildedenn, have generally more expensive goods
        offset: 5
    }
];