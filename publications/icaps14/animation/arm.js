
var initialTheta = 0;
var thetaDelta = 3;
var currentTheta = initialTheta;
var limit = 150;

var arm1 = document.getElementById("arm1");
var arm2 = document.getElementById("arm2");
var ab1 = document.getElementById("armbase1");
var ab2 = document.getElementById("armbase2");

function rad(deg){
    return deg*Math.PI/360;
}

function val(x,attr){
    return x[attr].baseVal.value;
}

console.log(val(arm1,"x"));
console.log(val(arm1,"y"));
console.log(val(arm1,"width"));
console.log(val(arm1,"height"));
console.log(center(arm1));
console.log(center(ab1));
console.log(center(arm2));
console.log(center(ab2));



function center(x){
    var r = x.getBBox();
    // return [r.x+r.width/2,r.y+r.height/2];
    return [r.x,r.y];
}

// var requestAnimationFrameID;


var forward = true;
function moveArm() {
    arm1.setAttribute("transform", "rotate(" + currentTheta + "," +
                      (0+val(arm1,"x") + val(arm1,"width")) + "," + 
                      (0+val(arm1,"y") + val(arm1,"height")/2) + ")");
    arm2.setAttribute("transform", "rotate(" + currentTheta + "," +
                      (0+val(arm2,"x")) + "," + 
                      (0+val(arm2,"y") + val(arm2,"height")/2) + ")");
    // arm1.setAttribute("transform", "rotate(" + currentTheta + "," +
    //                   center(ab1)[0] + "," + 
    //                   center(ab1)[1] + ")");

    
    if (forward){
        currentTheta += thetaDelta;
        if(limit<currentTheta){
            forward = false;
        }
    }else{
        currentTheta -= thetaDelta;
        if(currentTheta<-limit){
            forward = true;
        }
    }
    requestAnimationFrame(moveArm);
}

requestAnimationFrame(moveArm);

// requestAnimationFrameID = requestAnimationFrame(moveArm1); // Start the loop.

