const funcs = Object.create(null);

//abbreviations
const c = canvas.getContext("2d");
const m = Math;
const el = (id) => document.getElementById(id);
const cl = (x) => console.log(x);
cl("funcs.js is connected");

//A^2 + B^2 = C^2 Pythagoras
funcs.pytha = function(A, B) {
    let C = m.sqrt((A**2)+(B**2));
    return C;
};

//Draws a circle
funcs.drawCircle = function( x, y, radius,
    fill = `rgba(0,0,0,0)`, stroke = "white"){
        c.beginPath();
        c.arc(x, y, radius, 0, 2 * m.PI);
        c.fillStyle = fill;
        c.strokeStyle = stroke;
        c.stroke();
        c.fill();
};

//Tells you the distance between two sets of coordinates
funcs.distFromPoint = function (mx, my, ex, ey) {
    let dx = mx - ex;
    let dy = my - ey;
    let dist = funcs.pytha(dx, dy);
    return dist;
};

//Tells you the angle from centre
funcs.whatTheta = function (mx, my, cx, cy, offset) {
    let theta;
    let dx = mx - cx;
    let dy = my - cy + offset;
    theta = m.atan2(dy, dx);
    return theta;
};

//Limits the list to only its key components
funcs.clearScreen = function(arr,key){
    arr.length = key;
    cl("screen cleared");
};

//Load Saved System
funcs.loadSavedSystem = function(sav, arr, key){
    if (sav != []){
        funcs.clearScreen(arr,key);
        arr = arr.concat(sav);//not property
        cl("Saved system loaded");
        return arr;
    }
};

//Save Current System
funcs.saveCurrSystem = function(sav,arr,key){
    sav = arr.slice(key);
    cl("Current system state saved");
    return sav;
};

//New Random Body
funcs.newRandBody = function(arr,Func, cx, cy){
    let theta = m.random() * m.PI * 2;
    let rad = 3 + m.random() * 22;
    let orbR = 50 + m.random() * 300;
    let x = (orbR * m.cos(theta)) + cx;
    let y = (orbR * m.sin(theta)) + cy;
    arr.push(
        new Func(x, y, rad,
            `rgba(${m.floor(m.random() * 256)}, `+
            `${m.floor(m.random() * 256)}, `+
            `${m.floor(m.random() * 256)}, `+
            `1)`));
    cl("new body made");
    return arr;
};
//New Custom Body
funcs.newCustBody = function(arr,Func, cx, cy){
    let theta = 0;
    let rad = el("RadiusSlider").value;
    let orbR = el("OrbitSlider").value;
    let x = (orbR * m.cos(theta)) + cx;
    let y = (orbR * m.sin(theta)) + cy;
    arr.push(
        new Func(x, y, rad,
            `rgba(${el("RSlider").value}, `+
            `${el("GSlider").value}, `+
            `${el("BSlider").value}, `+
            `1)`));
    cl("new body made")
    return arr;
};
//New Custom Body on click
funcs.newClickBody = function(arr, Func, mx, my, offset){
    let rad = el("RadiusSlider").value;
    let x = mx;
    let y = my + offset;
    arr.push(
        new Func(x, y, rad,
            `rgba(${el("RSlider").value}, `+
            `${el("GSlider").value}, `+
            `${el("BSlider").value}, `+
            `1)`));
    cl("new body made")
    return arr;
};

//Our solar system
funcs.ourSolarSystem = function(arr,Func){
    let solarSystem = [
        new Func(0, 0, 5, "white", 50, "Mercury"), //mercury
        new Func(0, 0, 10, "orange", 75, "Venus"), //venus
        new Func(0, 0, 13, "blue", 100, "Earth"), //earth
        new Func(0, 0, 8, "red", 130, "Mars"), //mars
        new Func(0, 0, 30, "beige", 180, "Jupiter"), //jupiter
        new Func(0, 0, 25, "beige", 280, "Saturn"), //saturn
        new Func(0, 0, 22, "blue", 320, "Uranus"), //uranus
        new Func(0, 0, 20, "lightblue", 380, "Neptune"), //neptune
        new Func(0, 0, 3, "pink", 450, "Pluto")];//pluto
    arr = arr.concat(solarSystem);
    return arr;
};

//Sequence
funcs.sequence = (n) => Array.from(new Array(n).keys());

//TABLE GENERATORS
//Gets title
funcs.genTableHead = function(table, data){
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
      };
};
//Gets Content
funcs.genTable = function(table, data) {
    for (let i of data){
        let row = table.insertRow();
        for (let key in i) {
            let cell = row.insertCell();
            let text = document.createTextNode(i[key]);
            cell.appendChild(text);
        }
    }
};
//Delete Content in table
funcs.clTableContent = function(id){
    id.innerHTML="";
};
export default Object.freeze(funcs);