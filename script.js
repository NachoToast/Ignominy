var file_holder = document.getElementById("load_file"),
file_label = document.getElementById("load_file_label"),
header = document.getElementById("header"),
container = document.getElementById("container"),
console_element = document.getElementById("console_element");
width = window.innerWidth - 60,
height = window.innerHeight - header.offsetHeight - 5,
height_direct = document.getElementById("height"),
weight_direct = document.getElementById("weight_direct"),
weight_slider = document.getElementById("weight"),
global_data = [],
weight = 7,
console_message_count = 0,
console_message_repeats = 0,
console_previous_message = "",
color_mode = "default",
//pretty_mode = true,
pretty_factor = 1;

height_direct.value = height;
weight_direct.value = weight;

const canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d");

canvas.height = height - 0;
canvas.width = width;

var colors = {
    red: {red: 255, green: 0, blue: 0},
    green: {red: 0, green: 255, blue: 0},
    blue: {red: 0, green: 0, blue: 255},
    white: {red: 255, green: 255, blue: 255},
    black: {red: 0, green: 0, blue: 0}
}

window.addEventListener("resize", function() {
    width = window.innerWidth - 40;
    height = window.innerHeight - header.offsetHeight - 5,
    height_direct.value = height;
    canvas.height = height - 0;
    canvas.width = width;
    log("Window resized.");
})

function load_file() {
    let start = Date.now();
    container.innerHTML = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let file = file_holder.files[0];
    if (typeof window.FileReader !== "function") {
        header.innerHTML = "<span style='color: lightcoral'>Browser not supported!</span>";
        log("FileReader not found.")
        window.alert("Browser not supported!");
        return;
    }
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (contents) {
        let data = JSON.parse(contents.target.result);
        global_data = data;
        if (data.length == 0) {
            log("No data selected!");
            return;
        }
        log("Generating...");
        generate_nodes(data, start);
    }
}

function regenerate() {
    let start = Date.now();
    log("Regenerating...");
    container.innerHTML = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generate_nodes(global_data, start);
}

function generate_nodes(data, start = Date.now()) {
    let len = data.length;
    if (len == 0) {
        log(`No data selected!`);
        return;
    }
    log(`Registered ${len} nodes.`);
    let output_points = make_circle_coordinates(header.offsetHeight, 0, height, width, len),
    output_nodes = [];
    for (let i = 0; i < len; i++) {
        let p = document.createElement("p");
        p.classList.add("node");
        p.id = `node_${data[i].id}`;
        p.innerText = data[i].id;
        container.appendChild(p);
        p.style.top = output_points[i].y + "px";
        p.style.left = output_points[i].x + "px";
        output_nodes.push(p);
    }
    if (pretty_mode) {
        for (let i = 0; i < len; i++) {
            data[i].options = [];
            for (let j = 0; j < len; j += pretty_factor) {
                data[i].options.push({scene: j})
            }
        }
    }
    generate_lines(data, output_nodes, len)
    log(`Done! (${Date.now() - start}ms)`);
}

function generate_lines(data, nodes, len) {
    let data_map = data.map(e => e.id),
    nodes_map = nodes.map(e => e.id),
    center_node = document.getElementById("node_center").getBoundingClientRect();
    for (let i = 0; i < len; i++) {
        let lines_to_options = [];
        for (let j = 0, j_len = data[i].options.length; j < j_len; j++) {
            if (data[i].options[j].scene === undefined || data[i].options[j].scene == data[i].id) {
                //console.log(`Node ${data[i].id} points to itself.`)
                continue;
            }
            if (data_map.indexOf(data[i].options[j].scene) == -1) {
                //console.log(`Node ${data[i].id} points to unfound scene (${data[i].options[j].scene})`)
                continue;
            };
            //console.log(`Node ${data[i].id} points to scene ${data[i].options[j].scene}`);
            let end_point = nodes[nodes_map.indexOf("node_" + data[i].options[j].scene)].getBoundingClientRect(),
            end = {x: end_point.x + end_point.width / 2, y: end_point.y - end_point.height},
            start_point = nodes[nodes_map.indexOf("node_" + data[i].id)].getBoundingClientRect(),
            start = {x: start_point.x + start_point.width / 2, y: start_point.y - start_point.height},
            control_1 = {x: start.x, y: end.y},
            control_2 = {x: end.x, y: start.y};
            weighted_center = {x: (center_node.x + weight * (start.x + end.x) / 2) / (weight + 1), y: (center_node.y + weight * (start.y + end.y) / 2) / (weight + 1)}
            //console.log(`Starting at (${start.x}, ${start.y}) ending at (${end.x}, ${end.y})`);
            //container.appendChild(make_div(Math.min(start.y, end.y), Math.min(start.x, end.x), Math.max(start.y, end.y), Math.max(start.x, end.x)));
            chosen_color = "0, 0, 0";
            if (color_mode == "invert") chosen_color = "255, 255, 255";
            else if (color_mode == "rgb") chosen_color = color_gradient(0, len, i, colors.red, colors.green, colors.blue);
            else if (color_mode == "red") chosen_color = color_gradient(0, len, i, colors.white, colors.red);
            else if (color_mode == "green") chosen_color = color_gradient(0, len, i, colors.white, colors.green);
            else if (color_mode == "blue") chosen_color = color_gradient(0, len, i, colors.white, colors.blue);
            else if (color_mode == "rgb2") chosen_color = color_gradient(0, j_len, j, colors.red, colors.green, colors.blue);

            draw_curve(start, weighted_center, weighted_center, end, chosen_color);
            
        }
    }
}

function make_circle_coordinates(top = 0, left = 0, bottom = 300, right = 300, points = 20, visual = false) {
    // e.g. top: 20, left: 20, right: 1900, bottom: 800
    let center = {
        x: (left + right) / 2,
        y: (top + bottom) / 2
    },
    radius = {
        x: right - center.x,
        y: bottom - center.y
    },
    output_points = [],
    // angles in radians
    angle_step = 2 * Math.PI / points;
    log(`Create circle with radius (${radius.x}, ${radius.y}) about point (${center.x}, ${center.y}).`);
    // to do: this lol
    for (let i = 0, angle = 0; i < points; i++, angle += angle_step) {
        let point = {
            x: center.x + Math.sin(angle) * radius.x,
            y: center.y + Math.cos(angle) * radius.y
        }
        output_points.push(point);
    }
    // center
    let p = document.createElement("p");
    p.classList.add("node");
    p.id = "node_center";
    p.style.backgroundColor = "red";
    container.appendChild(p);
    p.style.top = center.y + "px";
    p.style.left = center.x + "px";
    if (!visual) p.style.visibility = "hidden";

    return output_points;
}
{ // Config UI
    function change_height(input = window.innerHeight - header.offsetHeight - 5) {
        if (parseInt(input) == height) return;
        if (!(parseInt(input) >= 10)) input = 10;
        height = parseInt(input);
        log(`Height updated to ${height}`);
        regenerate();
    }
    function reset_height() {
    height_direct.value = window.innerHeight - header.offsetHeight - 5;
    change_height();
    }
    function change_weight(value) {
        weight = parseFloat(value);
        log(`Weight updated to ${value}`);
        regenerate();
        weight_direct.value = weight;

    }
    function change_weight_direct(value) {
        
        weight = parseFloat(value);
        log(`Weight updated to ${value}`);
        regenerate();
        weight_slider.value = weight;
    }
    function change_color_mode(value) {
        log(`Color mode updated to ${value}`);
        color_mode = value;
        regenerate();
    }
}

function draw_curve(start, cp1, cp2, end, color = '0, 0, 0') {
    // Cubic Bézier curve
    ctx.strokeStyle = "rgb" + "(" + color + ")";
    ctx.fillStyle = "transparent";
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.stroke();

    // Start and end points
    //ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(start.x, start.y, 5, 0, 2 * Math.PI);  // Start point
    ctx.arc(end.x, end.y, 5, 0, 2 * Math.PI);      // End point
    ctx.fill();

    // Control points
    //ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(cp1.x, cp1.y, 5, 0, 2 * Math.PI);  // Control point one
    ctx.arc(cp2.x, cp2.y, 5, 0, 2 * Math.PI);  // Control point two
    ctx.fill();
}

function log(message) {
    if (console_previous_message == message) {
        if (console_message_repeats < 10) { // < 10 = dont print anything
            console_message_repeats += 1;
            return;
        }
        message += ` (${console_message_repeats})`;
        console_message_repeats = 0;
    }
    else {
        console_message_repeats = 0;
        console_previous_message = message;
    }
    let p = document.createElement("p");
    console_message_count += 1;
    p.classList.add("console_msg");
    p.innerHTML = `[${console_message_count}] ${message}`;
    console_element.appendChild(p);
    console_element.scrollTop = console_element.scrollHeight;
}

function color_gradient(min, max, current, color_a, color_b, color_c) {
    // returns an rgb value in the format "r, g, b"
    let color_progression;
    if (current >= max) color_progression = 1;
    else color_progression = (current - min) / (max - min); // Standardize as decimal [0-1 (inc)].
    if (color_c) {
        color_progression *= 2;
        if (color_progression >= 1) {
            color_progression -=1;
            color_a = color_b;
            color_b = color_c;
        }
    }

    let new_red = color_a.red + color_progression * (color_b.red - color_a.red),
    new_green = color_a.green + color_progression * (color_b.green - color_a.green),
    new_blue = color_a.blue + color_progression * (color_b.blue - color_a.blue);

    let output_red = parseInt(Math.floor(new_red), 10),
    output_green = parseInt(Math.floor(new_green), 10),
    output_blue = parseInt(Math.floor(new_blue), 10);

    return `${output_red}, ${output_green}, ${output_blue}`;
    // final r = x (final red - initial red) + inital red
    // where x is how far along u are (1 = done, 0 = none)

}