var items = [
    {
        name:'Seafood Meal',
        count:1,
        description:'An average seafood meal.',
        icon:'img/item/seafood_meal.png',
        value:10,
        consumable:true,
        onConsume: function() {
            player.health += 10;
            if(player.health > player.maxhealth)player.health = player.maxhealth;
        }
    },
    {
        name:'Beer',
        count:1,
        description:'A cold bottle of beer.',
        icon:'img/item/beer.png',
        value:5,
        consumable:true,
        onConsume: function() {
            player.mana -= 5;
            if(player.mana < 0)player.mana = 0;
        }
    },
    {
        name:'Item A',
        count:1,
        description:'Debug item.',
        icon:'img/item/seafood_meal.png',
        value:100,
        consumable:false
    },
    {
        name:'Item B',
        count:1,
        description:'Debug item.',
        icon:'img/item/seafood_meal.png',
        value:100,
        consumable:false
    },
    {
        name:'Item C',
        count:1,
        description:'Debug item.',
        icon:'img/item/seafood_meal.png',
        value:100,
        consumable:false
    }
]
function debug_acquire() {
    let a = items[items.map(e => e.name).indexOf('Item A')];
    let b = items[items.map(e => e.name).indexOf('Item B')];
    let c = items[items.map(e => e.name).indexOf('Item C')];
    acquire(a,1);
    acquire(b,2);
    acquire(c,3);
}