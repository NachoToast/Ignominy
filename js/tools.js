function what_points_to(scene_id) {
    // finds scenes which have options to progress to specified scene id
    let start = Date.now(),
    found_scenes = [];
    for (let i = 0, len = story.length; i < len; i++) {
        for (let j = 0, j_len = story[i].options.length; j < j_len; j++) {
            if (story[i].options[j].scene == scene_id) {
                found_scenes.push(story[i].id);
                break;
            }
        }
    }
    var str = "scenes";
    if (found_scenes.length == 1) str = "scene"
    console.log(`${found_scenes.length} ${str} points to scene ${scene_id} (${Date.now() - start}ms)`, found_scenes);
}

function meta_check(min, max) {
    // finds missing meta in range of scene with id from min to max (inclusive)
    let start = Date.now(),
    no_meta = [],
    checked = 0,
    id_array = story.map(e => e.id);

    if (min !== undefined) id_array = id_array.filter(e => e >= min);
    if (max !== undefined) id_array = id_array.filter(e => e <= max);

    let len = id_array.length;

    for (let i = 0; i < len; i++, checked++) {
        if (story[story.map(e => e.id).indexOf(id_array[i])]?.meta === undefined) no_meta.push(i);
    }
    console.log(`${no_meta.length}/${checked} scenes are missing metadata (${Date.now() - start}ms)`, no_meta);
}