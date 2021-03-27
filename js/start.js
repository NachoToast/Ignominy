var this_year = new Date().getFullYear(),
calculate_year = document.getElementById("calculate_year");
calculate_year.innerHTML = this_year;
calculate_year.title = 3051 - this_year + " Years";

var map_sliders = document.getElementsByClassName("map_options"),
map_outputs = document.getElementsByClassName("map_outputs"),
maps = document.getElementsByClassName("map_s"),
zoom_level = 1,
base_height = 1405.5,
base_width = 2880,
zoom_output = document.getElementById("map_zoom_output");

function slider_modify_map(layer) {
    map_outputs[layer].value = map_sliders[layer].value;
    maps[layer+1].style.opacity = map_sliders[layer].value / 100;
}
function direct_modify_map(layer) {
    map_sliders[layer].value = map_outputs[layer].value;
    maps[layer+1].style.opacity = map_outputs[layer].value / 100;
}
function zoom(type) {
    if ((zoom_level * 100).toFixed(0) >= 500 && type == 0.1 || (zoom_level * 100).toFixed(0) <= 10 && type == -0.1) return;
    zoom_level += type;
    for (let i = 0, len = maps.length; i < len; i++) {
        maps[i].width = base_width * zoom_level;
        maps[i].height = base_height * zoom_level;
    }
    zoom_output.innerText = (zoom_level * 100).toFixed(0) + "%";
}

for (let i = 0, len = maps.length; i < len; i++) {
    maps[i].width = base_width;
    maps[i].height = base_height;
}

function location_choose(location) {
    let scene;
    if (location == 0) {
        player.homekingdom = "Ignoma";
        player.hometown = "Ebonfront";
        scene = 0;
    }
    else if (location == 1) {
        player.homekingdom = "Light Witesia";
        player.hometown = "Basinfront";
        scene = 100;
    }
    else if (location == 2) {
        player.homekingdom = "The Luma Empire";
        player.hometown = "Wildedenn";
        scene = 200;
    }
    else if (location == 3) {
        player.homekingdom = "The Kingdom of Dalia";
        player.hometown = "Oxlight";
        scene = 300;
    }
    else if (location == 4) {
        player.homekingdom = "Zalrord";
        player.hometown = "Bellecairn";
        scene = 400;
    }
    else if (location == 5) {
        player.homekingdom = "The Kingdom of Cataclite";
        player.hometown = "Beargarde";
        scene = 500;
    }
    else if (location == 6) {
        player.homekingdom = "Seld";
        player.hometown = "Westforest";
        scene = 600;
    }
    generate_game(scene);
}