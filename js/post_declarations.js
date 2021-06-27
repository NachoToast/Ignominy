{
  // Items
  var item_map = items.map((e) => e.name),
    item_modifier_map = item_modifiers.map((e) => e.name),
    global_item_modifiers_map = global_item_modifiers.map((e) => e.name);
}

{
  // Story
  var story_map = story.map((e) => e.id);
}

{
  // UI
  window.addEventListener('resize', () => {
    if (player.homekingdom !== 'Default') {
      UIManager.resize();
    }
  });
  setTimeout(UIManager.resize(), 600);
}
