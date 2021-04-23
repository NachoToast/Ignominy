file_holder = document.getElementById("load_file"),
file_label = document.getElementById("load_file_label"),
header = document.getElementById("header"),
container = document.getElementById("container"),
width = window.innerWidth - 10,
height = window.innerHeight - header.offsetHeight - 26;

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
    let max = data.length;
    console.log(max);
    for (let i = 0; i < max; i++) {
        let p = document.createElement("p");
        p.classList.add("node");
        p.innerText = data[i].id;
        container.appendChild(p);
        p.style.top = header.offsetHeight + 0.5 + Math.abs(0.5 - i / max) * height + "px";
        p.style.left = i / max * width + "px";
    }
}

function make_circle_coordinates(top, left, bottom, right, points) {
    let center_x = (top + bottom) / 2,
    center_y = (left + right) / 2,
    output_points = [];
    // to do: this lol
}