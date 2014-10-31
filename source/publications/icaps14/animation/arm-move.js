
var arm1;
var arm2;
var ab1;
var ab2;

// var arm1 = document.getElementById("arm1");
// var arm2 = document.getElementById("arm2");
// var ab1 = document.getElementById("armbase1");
// var ab2 = document.getElementById("armbase2");
// var product = document.getElementById("product");

////////////////////////////////////////////////////////////////

var animations = [];
var step = -1;
function all(){
    ++step;
    console.log(step);
    if (step < animations.length){
        requestAnimationFrame(animations[step]);
    }else{
        step = -1;
    }
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////


var initialTheta = 0;
var thetaDelta = 3;
var currentTheta = initialTheta;
var limit = 150;


function rad(deg){
    return deg*2*Math.PI/360;
}

function val(x,attr){
    return x[attr].baseVal.value;
}

function center(x){
    var r = x.getBBox();
    // return [r.x+r.width/2,r.y+r.height/2];
    return [r.x,r.y];
}

function l(x0,x1,p){ // p: proportion
    return (1-p)*x0+p*x1;
}

function moveArm(th00,th01,th10,th11,sec,next) {
    var t = 0;
    var fn = function(){
        t++;
        if (t<sec){
            move1(l(th00,th01,t/sec));
            move2(l(th10,th11,t/sec));
            if (next){
                requestAnimationFrame(next);
            }
            requestAnimationFrame(fn);
        }else{
        }
    }
    return fn;
}

var grip1=[];
var grip2=[];
function move1(th){
    var cx = (0+val(arm1,"x") + val(arm1,"width"));
    var cy = (0+val(arm1,"y") + val(arm1,"height")/2);
    arm1.setAttribute("transform", "rotate(" + th + "," + cx  + "," + cy + ")");
    grip1[0]= cx - val(arm1,"width")*Math.cos(rad(th));
    grip1[1]= cy - val(arm1,"width")*Math.sin(rad(th));
}

function move2(th){
    var cx = val(arm2,"x");
    var cy = (0+val(arm1,"y") + val(arm1,"height")/2);
    arm2.setAttribute("transform", "rotate(" + -th + "," + cx + "," + cy + ")");
    grip2[0]= cx + val(arm2,"width")*Math.cos(rad(-th));
    grip2[1]= cy + val(arm2,"width")*Math.sin(rad(-th));
}


function moveObj(obj,x,y){
    obj.setAttribute("transform", "translate("+ x + "," + y + ")");
}

function follow(obj,grip){
    return function(){
        moveObj(obj,grip[0],grip[1]);
    }
}

var product,p1,p2;

window.onload = function(){
    arm1 = document.getElementById("arm1");
    arm2 = document.getElementById("arm2");
    ab1 = document.getElementById("armbase1");
    ab2 = document.getElementById("armbase2");
    product = document.getElementById("product");
    p1 = document.getElementById("p1");
    p2 = document.getElementById("p2");
    ab1.onclick = all;
    move1(80);
    move2(0);
    follow(product,grip1)();
    moveObj(p1,440,290);

    var m1 = 80; // upper left
    var table = 135; // middle
    var tray1 = 40; // upper right 
    var m2 = 0;  // right
    var m3 = -90; // bottom left
    var tray2 = 0; // left

    var sec = 80;
    //真ん中に持っていく
    animations.push(moveArm(m1,table,m2,tray1,sec,follow(product,grip1)));
    //パーツ取り付け
    animations.push(moveArm(table,m1,tray1,table,sec,follow(p1,grip2)))
    //右マシン
    animations.push(moveArm(m1,m1,table,m2,sec,function(){
        follow(product,grip2)();
        follow(p1,grip2)();
    }));
    animations.push(function(){
        product.setAttribute("style","fill:red;stroke:black;stroke-width:0.5;");
        p1.setAttribute("style","fill:red;stroke:black;stroke-width:0.5;");
    });
    //下マシン
    animations.push(moveArm(m1,m1,m2,table,sec,function(){
        follow(product,grip2)();
        follow(p1,grip2)();
    }));
    animations.push(moveArm(m1,table,table,tray1,sec))
    animations.push(moveArm(table,m3,tray1,tray1,sec,function(){
        follow(product,grip1)();
        follow(p1,grip1)();
    }));

}
