// ****************************************************************
// Written for modifing Miata MX-5 BPF3 MCU's program memory
// run on Gecko 1.9 or higher
// 
// by guicho <guicho2.71818@gmail.com>
// Sep 5, 2011
// 
// log: Sep 5: changed the data type to Intel HEX file
// log: Oct 6: writes the correct checksum
// 
// 
// ****************************************************************

Array.prototype.split = function(by){
    var total = Math.ceil(this.length / by)*by;
    var ary = [];
    for(var i=0;i<total;i+=by){
	ary.push(this.slice(i,i+by));
    }
    return ary;
};

Array.prototype.__defineGetter__(
    'last',function(){ return this[this.length-1]; });
Array.prototype.__defineSetter__(
    'last',function(last){ this[this.length-1] = last; });

// constant
var trows = 14;
var frows = 13;
// var cols = 16;
var timing;
var fuel;
var timing_original;
var fuel_original;
var tlimit = {min:-5,max:40};
var flimit = {min:11,max:14};
var diffmax = 8;

var records;
var intArray;
var records_original;
var intArray_original;
var wholeCheckSum = [1319051, 1318741];

var HexRecord = function(line){
    this.returnCode = line[2];
    var regexp = /(..)/gm;
    this.strings = [];
    while(true){
	var byteRecord = regexp.exec(line[1]);
	if(byteRecord!=null){
	    this.strings.push(byteRecord[1]);
	}else break;
    }
};

HexRecord.prototype = {
    get length(){return parseInt(this.strings[0],16);},
    get offset(){return [parseInt(this.strings[1],16),
			 parseInt(this.strings[2],16)];},
    get type(){return parseInt(this.strings[3],16);},
    get data(){return this.strings.slice(4,-1).map(
		   function(string){
		       return parseInt(string,16);});},

    set data(data){
	data.map(function(n){//n:integer
		     if(n>255){
			 console.warn('the number '+n.toString(16)+
				      ' is too big. Used 0xFF instead.');
			 return 'FF';
		     }else if(n<16){
			 return '0'+n.toString(16).toUpperCase();
		     }else{
			 return n.toString(16).toUpperCase();
		     }},'')
	    .forEach(function(str,i){ this.strings[i+4]=str; },this);
	if(this.checksum>15)
	    this.strings.last = this.checksum.toString(16).toUpperCase();
	else
	    this.strings.last = '0'+this.checksum.toString(16).toUpperCase();
    },

    get checksum(){
	var sum = this.strings.slice(0,-1).reduce(
	    function(prev,now){ 
		return prev+parseInt(now,16); },0) % 256;

	if(sum==0){
	    return 0;
	}else{
	    return 256-sum;
	}
    }
};

HexRecord.prototype.toString = function(){
    return String.concat(':',this.strings.join(''),this.returnCode);
};

function checksum(){
    return records.reduce(function(prev,now){return prev+now.checksum;},0);
}

function evenOddChecksum(ary){
    var sum = [0,0];
    ary.forEach(
	function(n,index){
	    if((index%2) == 0){
		sum[0]+=n;
	    }else{
		sum[1]+=n;
	    }
	});
    return sum;
}

function handleFiles(file,fn){
    var fileReader = new FileReader();
    fileReader.onload = function(){
	fn(fileReader.result);
    };
    fileReader.readAsText(file);
}

var nofile = true;
var timingcells={val:[]};
var fuelcells={val:[]};
var timingoldcells={val:[]};
var fueloldcells={val:[]};
function rereadFile(){
    var elem = document.getElementById('file');
    if(elem.files.length==0){
	elem.click();
    }else{
	handleFiles(
	    document.getElementById('file').files.item(0),
	    function(result){ 
		var data = getMCUTable(result);
		records = data[0];
		intArray = data[1];
		timing = data[2];
		fuel = data[3];
		timing.original = timing_original;
		fuel.original = fuel_original;
		$('.editing tbody').empty();
		buildTableBody($('#timing tbody'),
			       timing,tlimit,
			       timingcells,timingoldcells);
		buildTableBody($('#fuel tbody'),
			       fuel,flimit,
			       fuelcells,fueloldcells);
		$('td input').change();
	    });
    }
    if(nofile){
	nofile=false;
	$("#ignition").show();
	$("h1").hide();
    }
}
function rereadOriginalFile(){
    var elem = document.getElementById('original');
    if(elem.files.length==0){
	elem.click();
    }else{
	handleFiles(
	    elem.files.item(0),
	    function(result){
		var data = getMCUTable(result);
		records_original = data[0];
		intArray_original = data[1];
		timing_original = data[2];
		fuel_original = data[3];

		timing.original = timing_original;
		fuel.original = fuel_original;
		$('.old tbody').empty();
		buildTableBody($('#timingold tbody'),
			       timing_original,tlimit,
			       timingoldcells,timingcells);
		buildTableBody($('#fuelold tbody'),
			       fuel_original,flimit,
			       fueloldcells,fuelcells);
		$('td input').change();
	    });
    }
    if(nofile){
	nofile=false;
	$("#ignition").show();
	$("h1").hide();
    }
}

function getMCUTable(result){
    var records = [];
    var intArray = [];
    var regexp = /:(.*)(\r?\n)/gm;
    while(true){
	var line = regexp.exec(result);
	if(line!=null){
	    var record=new HexRecord(line);
	    records.push(record);
	    if(record.type==0){
		intArray = intArray.concat(record.data);
	    }
	}else break;
    }
    var timing = intArray.slice(0x74A5,0x7585) //224=14*16
    	.map(function(n){ return (n - 86) / 4.5 + 10; })
    	.split(trows);
    var fuel = intArray.slice(0x71A2,0x7272) //208=13*16
    	.map(function(n){ return (n==0)? NaN: (14.7 / (1 + 0.78 * n / 100));})
    	.split(frows);
    
    return [records,intArray,timing,fuel];
}

function buildTableBody(tbody,ary,limit,cells,othercells){
    var cols = ary.length;
    var rows = ary[0].length;
    for (var i = 0; i < cols; i++) {
	var row = document.createElement('tr');
	cells.val[i]=[];
        for (var j = 0; j < rows; j++) {
	    var cell = new Cell(Number(i),Number(j),ary,limit,cells,othercells);
	    row.appendChild(cell.td);
	    cells.val[i][j] = cell;
        }
        tbody.append(row);
    }
}

function Cell(i,j,ary,limit,cells,othercells){
    this.td = document.createElement('td');
    this.diff = document.createElement('div');
    $(this.diff).addClass("diff");
    this.input = document.createElement('input');
    this.input.value = ary[i][j];
    this.input.onchange = input_onchange(this,i,j,ary,limit);
    this.td.onmouseover = function(){
	console.log('clisked');
	$(othercells.val[i][j].td).addClass("selected");
    };
    this.td.onmouseout = function(){
	console.log('blur');
	$(othercells.val[i][j].td).removeClass("selected");
    };
    this.input.onkeydown = input_onkeydown(this,i,j,cells.val);
    this.td.appendChild(this.input);
    this.td.appendChild(this.diff);
}

function input_onchange(cell,i,j,ary,limit){
    return function(){
	var val = Number(cell.input.value);
	// hexフィールドを編集する
	ary[i][j] = val;
	var p = cell.diff;
	if(ary.original!=undefined){
	    // オリジナルとの差を計算して入力する
	    var diff = val - ary.original[i][j];
	    if(isNaN(diff)||Math.abs(diff)<0.001){
		p.innerHTML = '-';
		p.style.color = 'black';
	    }else{
		p.innerHTML = diff.toFixed(1);
		var color = Math.floor(150 * (1 - Math.abs(diff)/diffmax));
		if(color<0) color = 0;
		if(diff>0){
		    p.style.color = 'rgb(255,'+color+','+color+')';
		}else{
		    p.style.color = 'rgb('+color+',255,'+color+')';
		}
	    }
	}else{
	    p.innerHTML = '-';
	    p.style.color = 'black';
	}
	// 入力窓の色を設定する
	// console.log("colorizing");
	var hue = 270*(val-limit.min)/(limit.max-limit.min);
	cell.input.style.color = (hue>190)? 'white':'black';
	cell.input.style.background = 'hsl('+ hue + ', 100%, 40%)';
    };	
}

function input_onkeydown(cell,i,j,cells){
    return function(e){
	try{
	    // 隣のセルの入寮窓を選択する
	    switch(e.keyCode){
	    case 13: cells[i+1][j].click();e.preventDefault(); break;
	    case 40: cells[i+1][j].click();e.preventDefault(); break;
	    case 38: cells[i-1][j].click();e.preventDefault(); break;
	    case 37: cells[i][j-1].click();e.preventDefault(); break;
	    case 39: cells[i][j+1].click();e.preventDefault(); break;
	    case 72: cell.input.blur(); break;
	    case 74: cell.input.blur(); break;
	    case 75: cell.input.blur(); break;
	    case 76: cell.input.blur(); break;
	    case 107: cell.input.value = (+(cell.input.value)+0.1).toFixed(2);e.preventDefault();break;//num +
	    case 109: cell.input.value = (+(cell.input.value)-0.1).toFixed(2);e.preventDefault();break;//num -
	    case 219: cell.input.value = (+(cell.input.value)+0.1).toFixed(2);e.preventDefault();break;//[
	    case 221: cell.input.value = (+(cell.input.value)-0.1).toFixed(2);e.preventDefault();break;//]
	    }
	    cell.input.onchange();
	} catch (x) {}
    };
}

function writefile(){
    
    timing.reduce(function(prev,now){return prev.concat(now);}) //一次元配列に変換
	.forEach(
	    function(n,index){
		intArray[0x74A5+index] = Math.floor((n-10)*4.5+86); //ROMデータとして代入
	    });

    fuel.reduce(function(prev,now){return prev.concat(now);})
	.forEach(
	    function(n,index){
		intArray[0x71A2+index] = isNaN(n) ? 0 : Math.round((14.7/n -1)*100/0.78);
	    });

    // checkSum計算 調整リセット
    for(var i=0x5c00;i<0x6bf0;i++){
	intArray[i] = 0x3f;
    }
    var newWholeCheckSum = evenOddChecksum(intArray);
    var diffs = [0,1].map(function(i){
			      return newWholeCheckSum[i]-wholeCheckSum[i];
			  });
    console.info('[even,odd] : '+ wholeCheckSum
		 +' --> '+ newWholeCheckSum
		 +'\n[even:odd] deferrence is '+ diffs);

    diffs.forEach(
	function(x,evenodd){
	    // 0x5C00から3Fデータが続く 編集もとのデータはオリジナルだとする
	    var adr=0x5C00+evenodd;
	    if(x>0){
		while(x!=0){
		    if(adr>=0x6BF0) {
		      	alert('checksum overflown');
			throw new Error('checksum overflown');
		    }
		    if(x>0x3F){
		      	intArray[adr] -= 0x3F; // intArray[adr] == 0x00; 
		      	x -= 0x3F;
		      	adr+=2;
		    }else{
		      	intArray[adr] -= x;
			console.info((intArray[adr]+x).toString(16)); //should be 0x3F
			x=0;
		    }
		}

	    }else{
		while(x!=0){
		    if(adr>=0x6BF0 && x!=0) {
		      	alert('checksum overflown');
			throw new Error('checksum overflown');
		    }
		    if(x<-0xC0){
		      	intArray[adr] += 0xC0;// intArray[adr] == 0xFF; 
		      	x += 0xC0;
		      	adr+=2;
		    }else{
		      	intArray[adr] -= x;
			console.info((intArray[adr]+x).toString(16)); //should be 0x3F
			x=0;
		    }
		}
	    }
	});
    
    intArray.split(16)
	.forEach(function(data,index){
		     records[index].data = data;
		 });

    console.info('checksum= 0x'+ checksum().toString(16));

    document.getElementById('text').value = records.reduce(
	function(prev,now){
	    return prev + now.toString();
	},'');
}


// ****************************************************************
// init
// 

function rangeChange(obj,slot,affected){
    return function(){
	obj[slot]=Number(this.value);
	$(affected).change();
    };
}

jQuery(
    function(){
      	$('#tmax').val(tlimit.max)
	    .change(rangeChange(tlimit,"max",'.timing input'));
	$('#tmin').val(tlimit.min)
	    .change(rangeChange(tlimit,"min",'.timing input'));
	$('#fmax').val(flimit.max)
	    .change(rangeChange(flimit,"max",'.fuel input'));
	$('#fmin').val(flimit.min)
	    .change(rangeChange(flimit,"min",'.fuel input'));

	var thead = $('.timing thead').append($('<tr></tr>'));
	for (var j = 0; j < trows; j++) {
	    $('tr',thead).append($('<th>'+512*(j+1)+'</th>'));
	}

	var fhead = $('.fuel thead').append($('<tr></tr>'));
	for (var j = 0; j < frows; j++) {
	    $('tr',fhead).append($('<th>'+512*(j+2)+'</th>'));
	}
	$('th').css('fontSize','10');
	$("#ignition").hide();
	$("#airfuel").hide();
	$("#igbutton").click(
	    function(){
		$("#ignition").show();
		$("#airfuel").hide();
	    });
	$("#afbutton").click(
	    function(){
		$("#ignition").hide();
		$("#airfuel").show();
	    });
	$("#diff").click(
	    function(){
		$(".diff").toggle();
	    });
    });

setInterval(writefile,120000);