//messy prototyping code.. Used as (heavy) reference for creating canvas.js

const canvas = document.querySelector("canvas");
import funcs from "./funcs.js";

//abreviations
const m = Math;
const c = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
const el = (id) => document.getElementById(id);
const cl = (x) => console.log(x);

//initial
cl("canvas.js in connected");
const init = function(){
    let isSpace = false;
    let desiredHeight = 0.7 * window.innerHeight; //canvas sizing on page
    let desiredWidth = 0.9 * window.innerWidth;
    
    canvas.width = desiredWidth;
    canvas.height = desiredHeight;
    let scrollOffset = 0;
    

    //Resize Canvas
    window.addEventListener("resize", function() {
        desiredWidth = 0.95 * window.innerWidth;
        desiredHeight = 0.9 * window.innerHeight;
        canvas.width = desiredWidth;
        canvas.height = desiredHeight;
        sunX = canvas.width / 2;
        sunY = canvas.height / 2;
        cl("resize event");
    });

    const keyBodNum = 4;
    let sunX = canvas.width / 2;
    let sunY = canvas.height / 2;
    const sunR = 40;
    const sunS = "Yellow";
    const pView = 100;
    let namelist = ["Balaqieje",//silly planet names (see sillyname.py)
        "Fyzydoobie",
        "Leejucymo",
        "Iepomoyyw",
        "Ooropephih",
        "Kocku",
        "Eelaluzoom",
        "Eenyckiyil",
        "Eevyjocash",
        "Eedip",
        "Iexakih",
        "Ouchyshiek",
        "Aewif",
        "Jigosewou",
        "Aepejah",
        "Aechif",
        "Etaz",
        "Youlipo",
        "Iqegotof",
        "Aepiediekeck",
        "Ixeelydiy",
        "Ameeroumuph",
        "Vooyokooke",
        "Xigoowieshee",
        "Iecet",
        "Ishaeyesh",
        "Ujaepyw",
        "Ichos",
        "Pheegoliecae",
        "Gaereedoo"
    ]

    //Mouse and Touch interactvity with canvas.
    let mouse = {
        x: undefined,
        y: undefined
    };
    let mousedown = "false";
    window.addEventListener("touchstart", //touchscreen compatibility
        function(event){
            mousedown = true;
            this.setTimeout(function(){mousedown = false},2000);
            event.target.classList.add("down");
            doubleClickBody();
        },
    true);
    window.addEventListener("mousedown", function(event) { 
        mouse.x = event.x - rect.left;
        mouse.y = event.y - rect.top;
        mousedown = true;
        doubleClickBody();
    });
    window.addEventListener("mouseup", function() {
        mousedown = false;
    });
    //Scroll Event
    window.addEventListener("scroll", function(){
        scrollOffset = window.scrollY;
        cl("Scroll event");
        cl(isSpace)
    });

    const doubleClickBody = function(){
        if (isSpace == true
            && mouse.x < canvas.width
            && mouse.y < canvas.height - scrollOffset){
                let angle = funcs.whatTheta(mouse.x, mouse.y,
                    sunX, sunY, scrollOffset);
                funcs.newClickBody(bodyList, Planet, mouse.x, mouse.y, sunX,
                    sunY, angle, scrollOffset);
                isSpace = false;
        }else{
            isSpace = true;
            setTimeout(function(){isSpace = false;}, 175); //Only double click
        };
    }


    //METHODS
    function Planet(x, y, rad, orbR, shade,
    theta = (m.random() * 2 * m.PI)){
        this.name = namelist[m.floor(m.random() * namelist.length)];
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.orbR = orbR;
        this.theta = theta;
        this.shade = shade;
        this.cos = m.cos(this.theta);
        this.sin = m.cos(this.theta);
        this.stroke = "white";


        this.draw = function(){
            funcs.drawCircle(this.x, this.y, this.rad, this.shade)
        };
        if (this.orbR == 0){ //if Sun
            this.update = function(){
                this.x = sunX;
                this.y = sunY;
                this.draw();
        }} else {
            this.update = function(){
                this.theta += ((this.orbR**-2) * (150));;
                //X axis
                this.x = (this.orbR * this.sin) + sunX;
                this.sin = m.cos(this.theta);
                //Y axis
                this.y = (this.orbR * this.cos) + sunY;
                this.cos = m.sin(this.theta);
                this.draw();
                
                if (funcs.distFromPoint(mouse.x, mouse.y,
                    this.x, this.y + scrollOffset) < this.rad 
                    ){
                        cl("Caught Planet");
                        isSpace = false;
                        let index = bodyList.indexOf(this);
                        if ((mousedown == true)){//<-1 means
                            bodyList.splice(index,1);  //not in list NOT
                            cl("body deleted");     // last thing in array
                        }
                    }
            }
        }

    }


    function Box(x, y, w, h, shade, name = "box"){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.shade = shade;


        this.draw = function(){
            c.beginPath();
            c.rect(this.x, this.y, this.w, this.h);
            c.strokeStyle = this.shade;
            c.stroke();
        };

        this.update = function(){
            this.x = 0;
            this.y = desiredHeight - pView;
            this.draw();
            
        }

    }

    function Preview(x, y, strshade,type){
        this.rad = 0;
        this.shade = strshade;
        this.x = x;
        this.y = y;
        this.type = type;
        this.fillStyle =`rgba(0,0,0,0)`;
        if (this.type == "colour"){
            this.draw = function(){
                funcs.drawCircle(this.x, this.y, this.rad, this.fillStyle);
                this.rad = el("RadiusSlider").value;
                this.fillStyle =`rgba(${el("RSlider").value},\
                            ${el("GSlider").value},\
                            ${el("BSlider").value},\
                            1`;
            this.x = pView / 2;
            this.y = canvas.height - (pView / 2);
        }}else{
            this.draw = function(){
                this.rad = el("OrbitSlider").value;
                funcs.drawCircle(this.x,this.y,this.rad);
                this.x = sunX;
                this.y = sunY;
            };        
        }
        
        this.update = function(){
            this.draw();
        }
    }


    let bodyList = [];
    let savedSystem = [];
    canvas.upList = function(){
        return bodyList;}

    //Creating "Permanant" Objects
    //Sun
    bodyList.push(new Planet(sunX, sunY, sunR, 0, sunS));
    //Box
    bodyList.push(new Box(0, canvas.height - pView, pView, pView, "blue"));
    //Preview of custom Planet
    bodyList.push(new Preview(pView/2,canvas.height - (pView / 2), "white", "colour",));
    //Preview Radius Ring
    bodyList.push(new Preview(sunX, sunY, "white", "orbit"))
    //Defining our solar system
    const ourSolarSystem = function(){
        const solarSystem = [
            new Planet(0, 0, 5, 50, "white"), //mercury
            new Planet(0, 0, 10, 75, "orange"), //venus
            new Planet(0, 0, 13, 100, "blue"), //earth
            new Planet(0, 0, 8, 130, "red"), //mars
            new Planet(0, 0, 30, 180, "beige"), //jupiter
            new Planet(0, 0, 25, 280, "beige"), //saturn
            new Planet(0, 0, 22, 320, "blue"), //uranus
            new Planet(0, 0, 20, 380, "lightblue"), //neptune
            new Planet(0, 0, 3, 450, "pink")  //pluto
        ]; 
        bodyList = bodyList.concat(solarSystem);
    };
    
    //Animation frame and updating
    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        bodyList.forEach(function (i) {i.update()})
    };

    //UI Buttons for Canvas
    el("NewRandomPlanet").onclick = function(){
        bodyList = funcs.newRandBody(bodyList, Planet);
    };

    el("NewCustomPlanet").onclick = function(){
        bodyList = funcs.newCustBody(bodyList, Planet);
    }

    el("Clear").onclick = function(){
        funcs.clearScreen(bodyList,keyBodNum);
    };

    el("DelLast").onclick = function(){
        if(bodyList.length > keyBodNum){
            bodyList.length = bodyList.length - 1;
        }
    };

    el("OurSolarSystem").onclick = function(){
        ourSolarSystem();
    };

    el("SaveSystem").onclick = function(){
        savedSystem = funcs.saveCurrSystem(savedSystem, bodyList, keyBodNum);
    };

    el("LoadSystem").onclick = function(){
        bodyList = (funcs.loadSavedSystem(savedSystem, bodyList));
    };

    animate();
};
init();
export default Object.freeze(canvas);