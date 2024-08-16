let n;

const ar=[];
var enable=true;
var running;



// Range slider code
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
  n = this.value; // Update the value of temp

  define();
}
// slider code ends

const t1=document.getElementById("stop_btn");
t1.style.display="block";

const t2=document.getElementById("start_btn");
t2.style.display="none";

function restart(){
    location.reload();
}

function define(){
    enable=true;
    for(let i=0; i<n; i++){
        ar[i]=Math.random();
    }
    show();
    document.querySelector('#start-btn').disabled=true;

}

function stop(){
    enable=false;
    document.querySelector('#stop_btn').disabled=true;
    document.querySelector('#start_btn').disabled=false;

    const t1=document.getElementById("stop_btn");
    t1.style.display="none";

    const t2=document.getElementById("start_btn");
    t2.style.display="block";
}

function start(){
    enable=true;
    document.querySelector('#stop_btn').disabled=false;
    document.querySelector('#start_btn').disabled=true;

    if(running=="bubble"){
        bubble_sort();
    }
    else if(running=="selection"){
        selection_sort();
    }
    else quick_sort();

    const t1=document.getElementById("stop_btn");
    t1.style.display="block";

    const t2=document.getElementById("start_btn");
    t2.style.display="none";


}

function bubble_sort(){
    running="bubble";
    const copy=[...ar];
    const moves=bubble(copy);
    animation(moves);
    
}

function bubble(ar){
    
    const moves=[];

    var swapped=true;
    while(swapped && enable){
        swapped=false;
        for(let i=1; i<ar.length; i++){
            moves.push({indices:[i-1,i], type:"comp"});
            if(ar[i-1]>ar[i]){
                swapped=true;
                moves.push({ indices:[i-1,i], type:"swap"});
                [ar[i-1], ar[i]]=[ar[i], ar[i-1]];
            }
        }
    }
    return moves;
}

function animation(moves){
    if(!enable) return;

    if(moves.length==0){
       show();
        return;
    }
    const move=moves.shift();
    const [i,j]=move.indices;

    if(move.type=="swap"){
        [ar[i], ar[j]]=[ar[j], ar[i]];
    }
    playSound(200+ar[i]*500);
    playSound(200+ar[i]*500);

    show(move);
    setTimeout(function(){animation(moves);}, 100);
}

function show(move){
    const cont=document.querySelector("#container");
    cont.innerHTML='';

    for(let i=0; i<n; i++){
        const bar=document.createElement("div");
        bar.style.height=ar[i]*100+"%";
        bar.classList.add("bar");

        if(move && move.indices.includes(i)){
            bar.style.backgroundColor= 
                move.type=="swap"?"#f79256":"#7dcfb6";
        } 
        container.appendChild(bar);
    }
}

// Programming for audio play using some audio api

let audioCtx=null;

function playSound(freq){
    if(audioCtx==null){
        audioCtx=new(AudioContext ||webkitAudioContext || window.webkitAudioContext)();
    }
    const duration=0.1;
    const osc=audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.stop(audioCtx.currentTime+duration);
    const node=audioCtx.createGain();
    node.gain.value=0.1;
    node.gain.linearRampToValueAtTime(0,audioCtx.currentTime+duration);
    osc.connect(node);
    node.connect(audioCtx.destination);
}

// selection sort
function selection_sort(){
    running="selection";
    const copy=[...ar];
    const moves=selection(copy);
    animation(moves);
}

function selection(ar){

    const moves=[];
    var beg=0;
    while(beg<n-1 && enable){
        var mini=beg;

        for( let i=beg+1; i<n; i++){
            moves.push({indices:[beg,i], type:"comp"});
            if(ar[i]<ar[mini]){
                mini=i;
            }
        }
        moves.push({indices:[beg,mini], type:"swap"});
        [ar[beg], ar[mini]]=[ar[mini], ar[beg]];
        beg++;
    }
    return moves;
}

// quick sort
const quick_moves=[];
function quick_sort(){
    const copy=[...ar];
    quick(copy, 0, n-1);
    animation(quick_moves);
}



function partition(ar, s, e){
    const pivot=ar[s];
    var cnt=0;

    for(let i=s+1; i<=e; i++){
        if(ar[i]<=pivot) cnt++;
    }

    const pivot_index=s+cnt;
    quick_moves.push({indices:[pivot_index, s], type:"swap"});
    [ar[pivot_index], ar[s]]=[ar[s], ar[pivot_index]];

    var i=s;
    var j=e;

    while(i<pivot_index && j>pivot_index){
        while(ar[i]<pivot) i++;

        while(ar[j]>pivot) j--;

        if(i<pivot_index && j>pivot_index){
            quick_moves.push({indices:[i,j], type:"swap"});
            [ar[i], ar[j]]=[ar[j], ar[i]];
        }
    }

    return pivot_index;
}

function quick(ar, s, e){
    running="quick";

    if(!enable) return;
    if(s>=e) return;

    quick_moves.push({indices:[s,e], type:"comp"});

    const p=partition(ar, s, e);

    quick(ar,s,p-1);
    quick(ar,p+1, e);

}



