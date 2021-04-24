file_holder = document.getElementById("load_file"),
file_label = document.getElementById("load_file_label"),
header = document.getElementById("header"),
container = document.getElementById("container"),
width = window.innerWidth - 60,
height = window.innerHeight - header.offsetHeight,
height_change = document.getElementById("height");
height_change.value = height;

function load_file() {
    let file = file_holder.files[0];
    if (typeof window.FileReader !== "function") {
        header.innerHTML = "<span style='color: lightcoral'>Browser not supported!</span>";
        window.alert("Browser not supported!");
        return;
    }
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (contents) {
        let data = JSON.parse(contents.target.result);
        generate_all_nodes(data);
    }
}

function generate_all_nodes(data) {
    let len = data.length,
    output_points = make_circle_coordinates(header.offsetHeight, 0, height, width, len);
    console.log(len);
    for (let i = 0; i < len; i++) {
        let p = document.createElement("p");
        p.classList.add("node");
        p.id = `node_${i}`;
        p.innerText = data[i].id;
        container.appendChild(p);
        p.style.top = output_points[i].y + "px";
        p.style.left = output_points[i].x + "px";
    }
}

function make_circle_coordinates(top = 0, left = 0, bottom = 300, right = 300, points = 20, visual = true) {
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
    console.log(`Create circle with radius (${radius.x}, ${radius.y}) about point (${center.x}, ${center.y}).`);
    // to do: this lol
    for (let i = 0, angle = 0; i < points; i++, angle += angle_step) {
        let point = {
            x: center.x + Math.sin(angle) * radius.x,
            y: center.y + Math.cos(angle) * radius.y
        }
        output_points.push(point);
    }
    if (visual) {
        let p = document.createElement("p");
        p.classList.add("node");
        p.style.backgroundColor = "red";
        container.appendChild(p);
        p.style.top = center.y + "px";
        p.style.left = center.x + "px";
    }
    return output_points;
}

function change_height(input) {
    height = parseInt(input);
}