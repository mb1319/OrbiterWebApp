const tablejs = Object.create(null);
import funcs from "./funcs.js";
import canvas from "./canvas.js";

const m = Math;
const el = (id) => document.getElementById(id);
const cr = (id) => document.createElement(id);
const cl = (x) => console.log(x);
cl("table.js is connected");

//Generating a table!

//getting list from canvas
let bodyList = canvas.getList();
let keyBodNum = canvas.getKeyBod();
//processing List
const cleanListGen = function (list) {
    let newList = [];
    list.map(function (obj) {
        let newObj = {};
        newObj = Object.assign(newObj, obj);
        delete newObj.cos;
        delete newObj.sin;
        delete newObj.stroke;
        delete newObj.update;
        delete newObj.draw;
        delete newObj.x;//Catering what goes into the table
        delete newObj.y;
        delete newObj.theta;
        delete newObj.getName;
        delete newObj.requestData;
        newObj.rad = m.floor(newObj.rad);
        newObj.orbR = m.floor(newObj.orbR);
        newList.push(newObj);
    });
    newList.splice(1, keyBodNum - 1);
    return newList;
};

//live update of list
const update = function(){
    requestAnimationFrame(update);
    let table = el("table");
    bodyList = canvas.getList();
    let useList = cleanListGen(bodyList);
    funcs.clTableContent(table);
    let heading = Object.keys(useList[0]);
    funcs.genTableHead(table, heading);
    funcs.genTable(table,useList);
};

update();

export default Object.freeze(tablejs);