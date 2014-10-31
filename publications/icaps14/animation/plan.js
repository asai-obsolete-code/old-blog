

var t = 0;
var maxt = 400;

var blockA = document.getElementById("ba");
var blockB = document.getElementById("bb");

console.log(blockA);
console.log(blockB);


var w = 66;

function val(x,attr){
    return x[attr].baseVal.value;
}

function center(x){
    var r = x.getBBox();
    // return [r.x+r.width/2,r.y+r.height/2];
    return [r.x,r.y];
}

function animate(){
    t+=2;
    
    if (t<100){
        
    }else if (t<200){
        var x,y;

        x = (t/100-1) * w;
        y = (t/100-1) * -w;

        blockB.setAttribute("transform","translate("+x+"," +y+")");
    }else if (t<300){
        var x,y;

        x = (t/100-2) * 2 * w;
        y = (t/100-2) * -2 * w;

        blockA.setAttribute("transform","translate("+x+"," +y+")");
    }else if (t<400){
    }else {
        blockB.setAttribute("transform","translate(0,0)");
        blockA.setAttribute("transform","translate(0,0)");
        t = 0;
    }
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
