var story_the_luma_empire = [
  {
    id: 200,
    text: [
      {
        content: [
          "As the hot sun rises in the east you absentmindedly walk through the streets of Wildedenn, the Luma Empire's capital city.",
        ],
      },
    ],
    options: [
      {
        text: 'Continue',
        scene: 201,
        time: false,
        fatigue: false,
      },
    ],
    meta: {
      authors: ['NachoToast'],
      version: '0.1.16',
      legacy_version: '0.0.2',
    },
  }, // 200
  {
    id: 201,
    text: [
      {
        content: [
          "You've made it to Wildedenn, a small city in the center of The Luma Empire and widely regarded as it's capital despite the lack of governing body in the kingdom. Wildedenn is a major stopover point for travellers making the long, dangerous journey through The Luma Empire and crime is commonplace.",
        ],
        norepeat: true,
        conditions: (player) => player.homekingdom !== 'The Luma Empire',
      },
      {
        content: [
          'You stand on the wind-swept streets of Wildedenn, a gentle breeze circulates from the surrounding desert.',
        ],
      },
      {
        content: [
          'Many travellers who were using Wildedenn as a stopover point are preparing to depart.',
        ],
        conditions: (player) =>
          player.time.getHours() >= 7 && player.time.getHours() <= 18,
      },
    ],
    options: [
      {
        text: 'Try and join a caravan.',
        scene: 202,
        conditions: (player) =>
          player.time.getHours() >= 7 && player.time.getHours() <= 18,
      },
      {
        text: 'Visit a local inn.',
        scene: 205,
      },
      {
        text: 'Wander the streets.',
        time: { minute: 15 },
      },
    ],
    meta: {
      authors: ['NachoToast'],
      version: '0.1.16',
      legacy_version: '0.1.5',
    },
  }, // 201
  {
    id: 202,
    text: [
      {
        content: [
          'There are caravans headed to various places all preparing to leave.',
        ],
      },
    ],
    options: [
      {
        text: 'Join one headed towards Freygrave.',
        scene: 203,
      },
      {
        text: 'Nevermind',
        scene: 201,
      },
    ],
    meta: {
      authors: ['NachoToast'],
      version: '0.1.16',
      legacy_version: '0.1.5',
    },
  }, // 202
  {
    id: 203,
    text: [
      {
        content: [
          'You walk up to a caravan heading in the direction of Freygrave.',
          '"20 Gold to join us, don\'t even think about haggling me."',
        ],
      },
    ],
    options: [
      {
        text: 'Accept',
        scene: 204,
        time: { day: 5 },
        conditions: (player) => player.gold >= 20,
        action: function () {
          player.gold -= 20;
        },
        alternate: ['You do not have enough gold to accept this offer.'],
      },
      {
        text: 'Decline',
        scene: 202,
      },
    ],
    meta: {
      authors: ['NachoToast'],
      version: '0.1.16',
      legacy_version: '0.1.5',
    },
  }, // 203
  {
    id: 204,
    text: [
      {
        content: [
          'You accept their offer and hand over the gold.',
          "Not long afterwards the caravan is on the road towards Freygrave. The unchanging surroundings of vast empty desert remain for a while, but as you near the end of the journey they being to change into lush forests and grassy plains, becoming more prominent as you draw closer to Ignoma's border.",
          "The trip is uneventful, the people overseeing the caravan clearly know what they're doing as the caravan isn't targeted by lurking bandits even once.",
          'Once the 5 long days are up you arrive in Freygrave.',
        ],
      },
    ],
    options: [
      {
        text: 'Continue',
        scene: 15,
      },
    ],
    meta: {
      authors: ['NachoToast'],
      version: '0.1.16',
      legacy_version: '0.1.5',
    },
  }, // 204
  {
    id: 205,
    text: [
      {
        content: ["You're in Wildedenn's local inn."],
      },
      {
        content: [
          'The inn is crowded with many people, some merchants and travellers and others of more dubious backgrounds. You feel several pairs of eyes staring into your back as you enter.',
          'The innkeeper stands behind the counter, looking out for trouble among the visitors.',
        ],
        conditions: (player) =>
          player.time.getHours() >= 7 && player.time.getHours() <= 22,
        alternate: [
          'An inn staff sits behind the counter, working the night shift.',
        ],
      },
    ],
    options: [
      {
        text: 'Approach the innkeeper.',
        conditions: (player) =>
          player.time.getHours() >= 7 && player.time.getHours() <= 22,
        scene: 206,
      },
      {
        text: 'Approach the inn staff.',
        conditions: (player) =>
          player.time.getHours() <= 6 || player.time.getHours() >= 23,
        scene: 206,
      },
      {
        text: 'Go to your room.',
        scene: 207,
        conditions: () => has_inn(207),
      },
      {
        text: 'Exit',
        scene: 201,
      },
    ],
    meta: {
      authors: ['NachoToast'],
      version: '0.1.16',
      legacy_version: '0.1.5',
    },
  }, // 205
  {
    id: 206,
    text: [
      {
        content: ['You walk up to the counter.'],
      },
      {
        content: [
          '"Hey there, rooms are 10 gold a night if you need one of those, we\'ve also got a menu if you\'re interested."',
        ],
        conditions: (player) =>
          player.time.getHours() >= 7 && player.time.getHours() <= 22,
        alternate: ['"Rooms are 10 gold a night."'],
      },
      {
        content: ['You do not have enough gold for a room.'],
        conditions: (player) => player.gold < 10 && has_inn(207) == false,
      },
    ],
    options: [
      {
        text: 'A room please.',
        scene: 207,
        conditions: (player) => player.gold >= 10 && has_inn(207) == false,
        action: function () {
          player.gold -= 10;
          add_inn(207);
        },
      },
      {
        text: 'The menu.',
        conditions: (player) =>
          player.time.getHours() >= 7 && player.time.getHours() <= 22,
        scene: 205,
        action: function () {
          start_trade('Innkeeper', null, 'isolated');
        },
      },
      {
        text: 'Nevermind',
        scene: 205,
      },
    ],
    meta: {
      authors: ['NachoToast'],
      version: '0.1.16',
      legacy_version: '0.1.5',
    },
  }, // 206
  {
    id: 207,
    text: [
      {
        content: ['You get your key and make your way to the room at the inn.'],
        conditions: (player) => player.previous_scene == 206,
        alternate: ['You stand in your room at the Wildedenn inn.'],
      },
    ],
    options: [
      {
        text: 'Leave',
        scene: 205,
      },
    ],
    meta: {
      authors: ['NachoToast'],
      version: '0.1.16',
      legacy_version: '0.1.5',
    },
  }, // 207
];
story = story.concat(story_the_luma_empire);
rest_scenes.push(207);
