const canvas = document.querySelector("canvas");
import funcs from "./funcs.js";
import Ajax from "./ajax.js";

//abreviations
const m = Math;
const c = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
const el = (id) => document.getElementById(id);
const ev = (x,y) =>  window.addEventListener(x,y);
const cl = (x) => console.log(x);

cl("canvas.js is connected");
const play = function () {
    //initial
    let sunX = canvas.width / 2,
        sunY = canvas.height / 2,
        sunR = 40,
        sunS = `rgba(255,255,100,1)`,
        scrollOffset = 0,
        mousedown = false,
        nameBuffer = [],
        bodyList = [],
        savedSystem = [],
        pView = 100; //preview window height


    //Creating "Permanent" Objects
    const keyBodies = [
        new Planet(sunX, sunY, sunR, sunS, 0, "Sun"),
        new Preview(sunX, sunY, "white"),
        new Box(0, canvas.height - pView, pView, pView, "blue"),
        new Preview((pView /2), canvas.height - (pView/2), "white", "planet")
    ];

    const keyBodNum = keyBodies.length; //Number of non-planet items in bodyList

    //Canvas resizing
    let dW = 0.95 * window.innerWidth;
    let dH = 0.9 * window.innerHeight;
    canvas.width = dW;
    canvas.height = dH;
    sunX = canvas.width / 2;
    sunY = canvas.height / 2;

    const resizeCanvas = (obj) => {
        dW = 0.95 * window.innerWidth;
        dH = 0.9 * window.innerHeight;
        obj.width = dW;
        obj.height = dH;
        sunX = obj.width / 2;
        sunY = obj.height / 2;
        cl("canvas size reset");
    };
    ev("resize", function(){resizeCanvas(canvas);});


    //Mouse and Touch Interactivity
    let mouse = {x:undefined, y:undefined};
    const position = function (event) {
        mouse.x = event.x - rect.left;
        mouse.y = event.y - rect.top;
    };
    ev("mousemove", function(){
        position(this.event);
    });
    ev("mousedown", function(){
        // cl(bodyList);
        mousedown = true;
        // cl(nameBuffer);
    });
    ev("mouseup", function(){
        mousedown = false;
    });
    ev("touchstart", function(){//touchscreen
        position(this.event);
        cl("touchstart");
    })
    ev("touchend", function(){
        position(this.event);
        cl("touchend")
    });
    ev("touchmove", function(){
        position(this.event);
    });
    ev("dblclick", function(){//Creating a new planet
        if(mouse.x < canvas.width
            && mouse.y < canvas.height - scrollOffset){
                funcs.newClickBody(bodyList, Planet,
                     mouse.x, mouse.y, scrollOffset);
            }
    });

    //Scroll
    ev("scroll", function(){
        scrollOffset = window.scrollY; //ensures coordinate systems stay aligned
    });


//CLASSES AND ANIMATION SECTION//
    function Planet(x, y, rad, shade,
    orbR = funcs.pytha(x-sunX, y-sunY), name = "planet"){
//x and y define orbital radius, unless overridden bu orbR
        this.name = name;
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.orbR = orbR;
        this.theta = funcs.whatTheta(this.x, this.y, sunX, sunY, 0);
        this.cos = m.cos(this.theta);
        this.sin = m.sin(this.theta);
        this.stroke = "white";
        this.shade = shade;

        //Getting Names from Server
        this.requestData = function () {
            const response = Promise.resolve(Ajax.query());
            response.then(function (obj) {
                cl(obj.name);
                nameBuffer.push(obj.name);
            });
        };

        if (this.name === "planet") {//only for unnamed planets
            this.requestData();
        };

        this.draw = function () {
            funcs.drawCircle(this.x, this.y, this.rad, this.shade)
        }; //end of draw

        this.update = function () {
            if (this.name == "Sun"){ //if sun
                this.x = sunX;
                this.y = sunY;
                this.theta = NaN;
                this.draw();
            }else{
                //To ensure that server can rename planets if not fast enough
                if (this.name === "planet" && nameBuffer.length != 0) {
                    this.name = nameBuffer.pop();
                    cl(this.name + " has been named");
                }
                this.theta += (this.orbR**-2) * 150;
                //X axis change rule
                this.x = (this.orbR * this.cos) + sunX;
                this.cos = m.cos(this.theta);
                //Y axis change rule
                this.y = (this.orbR * this.sin) + sunY;
                this.sin  = m.sin(this.theta);
                this.draw();
                //Mouse click to delete
                if (funcs.distFromPoint(mouse.x, mouse.y + scrollOffset,
                    this.x, this.y)
                 < this.rad){
                    let index = bodyList.indexOf(this);
                    // cl("target lock");
                    if(mousedown == true){
                        bodyList.splice(index,1);
                    };
                };
            };
        };//end of update
    };//end of Planet

    function Box(x,y,w,h,shade){
        this.name = "box"
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.shade = shade;

        this.draw = () =>{
            c.beginPath();
            c.rect(this.x, this.y, this.w, this.h);
            c.strokeStyle = this.shade;
            c.stroke();
        };
        this.update = () =>{
            this.x = x;
            this.y = canvas.height - pView;
            this.draw();
        };

    };//end of Box

    function Preview(x = sunX,y = sunY, shade, type = "orbit"){
        this.name = type + " preview";
        this.type = type;
        this.rad = 200;
        this.stroke = shade;
        this.fill = `rgba(0,0,0,0)`
        this.x = x;
        this.y = y;

        this.draw = () =>{
            funcs.drawCircle(this.x, this.y, this.rad, this.fill, this.stroke)
        };
        this.update = () =>{
            if (this.type == "orbit"){
                this.rad = el("OrbitSlider").value
                this.x = sunX;
                this.y = sunY;
                this.draw();
            }else{
                this.rad = el("RadiusSlider").value;
                this.fill = `rgba(${el("RSlider").value}, `+
                                `${el("GSlider").value}, `+
                                `${el("BSlider").value}, `+
                                `1`;
                this.y = canvas.height - this.x;
                this.draw();
            };

        };
    };//end of Preview

    //Creating key bodies
    keyBodies.forEach(function (i) {bodyList.push(i)});

    //Animate
    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        bodyList.forEach(function (i) {i.update()})
    };
    animate();

    //UI Buttons for Canvas
    const uiButtons = () =>{
        el("NewRandomPlanet").onclick = function(){
            bodyList = funcs.newRandBody(bodyList, Planet, sunX, sunY);
        };
        el("NewCustomPlanet").onclick = function(){
            bodyList = funcs.newCustBody(bodyList, Planet, sunX, sunY);
        };
        el("Clear").onclick = function(){
            funcs.clearScreen(bodyList,keyBodNum);
        };
        el("DelLast").onclick = function(){
            if(bodyList.length > keyBodNum){
                bodyList.length = bodyList.length - 1;
            }
        };
        el("OurSolarSystem").onclick = function(){
            bodyList = funcs.ourSolarSystem(bodyList, Planet);
        };
        el("SaveSystem").onclick = function(){
            savedSystem = funcs.saveCurrSystem(savedSystem,
                bodyList, keyBodNum);
        };
        el("LoadSystem").onclick = function(){
            bodyList = (funcs.loadSavedSystem(savedSystem,
                bodyList, keyBodNum));
        };
};
uiButtons();

canvas.getList = function(){//bridge between canvas and table
    return bodyList;}
canvas.getKeyBod = function(){
    return keyBodNum;}

};//end of play

play();//runs everything for canvas

export default Object.freeze(canvas);