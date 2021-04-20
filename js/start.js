function generate_map_menu() {
    let lore = document.getElementById("initial_lore");
    let d1 = document.createElement("div"),
    d2 = document.createElement("div"),
    d3 = document.createElement("div");
    d1.id = "location_meta";
    d1.id = "location_select";
    d1.id = "location_chose";
    lore.appendChild(d1);
    lore.appendChild(d2);
    lore.appendChild(d3);
    let content1 = `
    <div id="location_meta">
        <h1> World Map</h1>
        <div>
            <p>Kingdom Labels</p>
            <div>
                <input class="map_options" type="range" min=0 max=100 value="100" oninput="slider_modify_map(0)">
                <input class="map_outputs" type="number" placeholder="100" min=0 max=100 oninput="direct_modify_map(0)">
            </div>
        </div>
        <div>
            <p>Intrakingdom Routes</p>
            <div>
                <input class="map_options" type="range" min=0 max=100 value="80" oninput="slider_modify_map(1)">
                <input class="map_outputs" type="number" placeholder="80" min=0 max=100 oninput="direct_modify_map(1)">
            </div>
        </div>
        <div>
            <p>Interkingdom Routes</p>
            <div>
                <input class="map_options" type="range" min=0 max=100 value="80" oninput="slider_modify_map(2)">
                <input class="map_outputs" type="number" placeholder="80" min=0 max=100 oninput="direct_modify_map(2)">
            </div>
        </div>
        <div>
            <p>Place Labels</p>
            <div>
                <input class="map_options" type="range" min=0 max=100 value="100" oninput="slider_modify_map(3)">
                <input class="map_outputs" type="number" placeholder="100" min=0 max=100 oninput="direct_modify_map(3)">
            </div>
        </div>
        <div>
            <p>Place Dots</p>
            <div>
                <input class="map_options" type="range" min=0 max=100 value="100" oninput="slider_modify_map(4)">
                <input class="map_outputs" type="number" placeholder="100" min=0 max=100 oninput="direct_modify_map(4)">
            </div>
        </div>
        <div>
            <p>Zoom</p>
            <div class="map_zoom">
                <button onclick="zoom(-0.1)">-</button>
                <p class="map_zoom_output">100%</p>
                <button onclick="zoom(0.1)">+</button>
            </div>
        </div>
    </div>
    `,
    content2 = `
    <div id="location_select">
        <img class="map_s" src="img/map/global/base.png">
        <img class="map_s" src="img/map/global/base_labelled.png">
        <img class="map_s" src="img/map/global/intraconnectives_all.png">
        <img class="map_s" src="img/map/global/interconnectives_all.png">
        <img class="map_s" src="img/map/global/labels_all.png">
        <img class="map_s" src="img/map/global/nodes_all.png">
    </div>
    `,
    content3 = `
    <div id="location_chose">
        <h1>Chose your starting location</h1>
        <div class="location_options" onclick="location_choose(0)">
            <h2>Ignoma</h2>
            <ul>
                <li>Population: High</li>
                <li>Difficulty: <span class="lo_d_0">Low</span></li>
                <li>Geography: <span class="lo_g_sandy_coastlines">Sandy Coastlines</span> <span class="lo_g_grassy_plains">Grassy Plains</span><br> <span class="lo_g_swamps_and_marshes">Swamps and Marshes</span></li>
                <li>Wealth: <span class="lo_w_1">Medium</span></li>
            </ul>
        </div>
        <div class="location_options" onclick="location_choose(1)">
            <h2>Light Witesia</h2>
            <ul>
                <li>Population: Low</li>
                <li>Difficulty: <span class="lo_d_1">Medium</span></li>
                <li>Geography: <span class="lo_g_forests">Forests</span> <span class="lo_g_jungles">Jungles</span> <span class="lo_g_hills">Hills</span></li>
                <li>Wealth: <span class="lo_w_0">Low</span></li>
            </ul>
        </div>
        <div class="location_options" onclick="location_choose(2)">
            <h2>The Luma Empire</h2>
            <ul>
                <li>Population: Low</li>
                <li>Difficulty: <span class="lo_d_2">High</span></li>
                <li>Geography: <span class="lo_g_deserts">Deserts</span> <span class="lo_g_mountains">Mountains</span></li>
                <li>Wealth: <span class="lo_w_0">Low</span></li>
            </ul>
        </div>
        <div class="location_options" onclick="location_choose(3)">
            <h2>Kingdom of Dalia</h2>
            <ul>
                <li>Population: Medium</li>
                <li>Difficulty: <span class="lo_d_0">Low</span></li>
                <li>Geography: <span class="lo_g_grassy_plains">Grassy Plains</span> <span class="lo_g_forests">Forests</span><br> <span class="lo_g_mountains">Mountains</span> <span class="lo_g_volcanoes">Volcanoes</span></li>
                <li>Wealth: <span class="lo_w_1">Medium</span></li>
            </ul>
        </div>
        <div class="location_options" onclick="location_choose(4)">
            <h2>Zalrord</h2>
            <ul>
                <li>Population: High</li>
                <li>Difficulty: <span class="lo_d_1">Medium</span></li>
                <li>Geography: <span class="lo_g_forests">Forests</span> <span class="lo_g_mountains">Mountains</span></li>
                <li>Wealth: <span class="lo_w_1">Medium</span></li>
            </ul>
        </div>
        <div class="location_options" onclick="location_choose(5)">
            <h2>Kingdom of Cataclite</h2>
            <ul>
                <li>Population: Medium</li>
                <li>Difficulty: <span class="lo_d_2">High</span></li>
                <li>Geography: <span class="lo_g_grassy_plains">Grassy Plains</span> <span class="lo_g_forests">Forests</span> <span class="lo_g_tundra">Tundra</span></li>
                <li>Wealth: <span class="lo_w_1">Medium</span></li>
            </ul>
        </div>
        <div class="location_options" onclick="location_choose(6)">
            <h2>Seld</h2>
            <ul>
                <li>Population: Medium</li>
                <li>Difficulty: <span class="lo_d_1">Medium</span></li>
                <li>Geography: <span class="lo_g_grassy_plains">Grassy Plains</span> <span class="lo_g_forests">Forests</span> <span class="lo_g_mountains">Mountains</span></li>
                <li>Wealth: <span class="lo_w_2">High</span></li>
            </ul>
        </div>
    </div>
    `;
    d1.innerHTML = content1;
    d2.innerHTML = content2;
    d3.innerHTML = content3;
    map_sliders = document.getElementsByClassName("map_options");
    map_outputs = document.getElementsByClassName("map_outputs");
    maps = document.getElementsByClassName("map_s");
    zoom_output = document.getElementsByClassName("map_zoom_output");
}

function slider_modify_map(layer) {
    //console.log(layer);
    if (current_header !== 2) {
        map_outputs[5 + layer].value = map_sliders[5 + layer].value;
        maps[5 + layer + 2].style.opacity = map_sliders[5 + layer].value / 100;
        return;
    }
    map_outputs[layer].value = map_sliders[layer].value;
    maps[layer + 1].style.opacity = map_sliders[layer].value / 100;
}

function direct_modify_map(layer) {
    map_sliders[layer].value = map_outputs[layer].value;
    maps[layer+1].style.opacity = map_outputs[layer].value / 100;
}

function zoom(type) {
    if ((zoom_level * 100).toFixed(0) >= 500 && type == 0.1 || (zoom_level * 100).toFixed(0) <= 10 && type == -0.1) return;
    zoom_level += type;
    let len = maps.length, mult = 0;
    if (current_header !== 2) {
        len = maps.length / 2;
        mult = 6;
    }
    for (let i = 0; i < len; i++) {
        maps[i + mult].width = base_width * zoom_level;
        maps[i + mult].height = base_height * zoom_level;
    }
    zoom_output[mult / 6].innerText = (zoom_level * 100).toFixed(0) + "%";
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

function submit_name() {
    player.name = input_name.value;
    let form = document.getElementById("name_submit");
    form.parentNode.removeChild(form);
    generate_map_menu();
}