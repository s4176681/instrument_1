//document.body.style.backgroundColor = "red";
// get button
//const testButton = document.getElementById("test-button");
//
//const key = document.getElementById("key-test")


//PLAYHEAD
let isPlaying = false;
let playStartTIme = 0;
let playheadX = 0;
const loopDuration = 4000; //ms for one full pass, in short - duration of the slider

const playPauseButton = document.querySelector(".playPauseButton");
const playPauseIcon = playPauseButton.querySelector("img");
const playIconSrc = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
const pauseIconSrc = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";

playPauseButton.addEventListener("click", function(){
    isPlaying = !isPlaying;

    if(isPlaying){
        playStartTIme = performance.now(); //restart the loop from beginning
        playPauseIcon.src = pauseIconSrc;
        playPauseIcon.alt = "Pause Button";
    } else {
        playPauseIcon.src = playIconSrc;
        playPauseIcon.alt = "Play Button"
    }
});
function updatePlayhead(){
    if(!isPlaying) return;
    let elapsed = performance.now() - playStartTIme;
    let progress = (elapsed % loopDuration) / loopDuration; //0 to 1, wrapping
    playheadX = progress * canvas.width; //within the visualiser, from end to end, righ to left logic.
}
function drawPlayhead(){
    if(!isPlaying) return;
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.fillRect(playheadX - 1, 0, 2, canvas.height);
}


//MODAL
//find intro modal
const introModal = document.getElementById("intro-modal");
//console.log(introModal); this actually slows it down
//close
const okButton = document.getElementById("intro-modal-close");
// mouse button hold?
let mouseButtonDown = false;
// mouse being held variable
window.addEventListener("mousedown", function(){ //
    mouseButtonDown = true;
});
window.addEventListener("mouseup", function(){ 
    mouseButtonDown = false;
});
introModal.showModal();
// when click close
okButton.addEventListener("click", function closeIntroModal() {
    introModal.close();
});
//function closeIntroModal()
introModal.addEventListener("close", toneInit);






// COLOURING
const canvas = document.getElementById("visualiser");
const ctx = canvas.getContext("2d");

function flashCanvas(colour){ //colouring
    ctx.fillStyle = colour;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const noteColours = {
    "C4": "lightpink",
    "D4": "lightyellow",
    "E4": "lightgreen",
    "F4": "lightblue",
    "G4": "plum",
    "A4": "peachpuff",
    "B4": "lightcyan",

    "C5": "lightgray",
    "D5": "lightsalmon",
    "E5": "khaki", // experimental colouring
    "F5": "lightseagreen",
    "G5": "thistle"
}




//TONE + usage
// create instrument and connect to audio
// html -> js -> open modal -> ok -> modal closes -> audio init
const synth = new Tone.PolySynth();

function toneInit(){
    Tone.start().then(function(){
        console.log("audio is ready");
    }); 
    // connect synth
    synth.connect(Tone.Destination);
}

// action
//testButton.addEventListener("click", playTestNote);

function playNote(e){
    // find the element that the event ran on
    let keyPressed = e.target;
    console.log(keyPressed);
    // find the data-note attribute of that element
    let note = keyPressed.dataset.note;
    console.log(note);
    // play the note for the right amount of time
    // if mouse button is held previously play note

    if(e.buttons === 1){
        let mode = document.getElementById("play-mode").value;
        let colours;

        if(mode === "chord"){
            synth.triggerAttack(chords[note]);
            //flashChords(chords[note]); // chords, but actually note, gradient colour for chords.
            colours = chords[note].map(function(n){ return noteColours[n]; });
        } else {
            synth.triggerAttack(note);
            //flashCanvas(noteColours[note]); // flate colour for single notes.
            colours = [noteColours[note]];
        }

        createLayer(note, colours);

        if(isPlaying){
            blocks[note] = playheadX; //no new blocks should be made
        }
    }
}

function endNote(e) {
    // find element
    let keyPressed = e.target;
    console.log(keyPressed);
    // find data note
    let note = keyPressed.dataset.note;
    console.log(note);

    let mode = document.getElementById("play-mode").value;

    if(mode === "chord"){
        synth.triggerRelease(chords[note]); // STOP PLAYING!
    } else {
        synth.triggerRelease(note);
    }

    //flashCanvas("#2a2a2a"); //reset colour
    if(activeLayers[note]){
        activeLayers[note].held = false;
        delete activeLayers[note];//fade out reset
    }
}

function flashChords(notes){
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0); //defining a gradient line.
    notes.forEach(function(n, i){
        gradient.addColorStop(i / (notes.length - 1), noteColours[n]); //spread the stops evenly
    });
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const chords = {
    "C4": ["C4", "E4", "G4"],
    "D4": ["D4", "F4", "A4"],
    "E4": ["E4", "G4", "B4"],
    "F4": ["F4", "A4", "C5"],
    "G4": ["G4", "B4", "D5"],
    "A4": ["A4", "C5", "E5"],
    "B4": ["B4", "D5", "F5"],
    "C5": ["C5", "E5", "G5"]
};

// LAYOUT + Sliding function
const allKeys = document.querySelectorAll(".whiteKey");
const numberOfKeys = allKeys.length;
const radius = 1000; //change this to adjust how compact the keys are

const centerX = 400; // change these for the placement of the keys
const centerY = 1100;

const arcSpan = Math.PI * 0.2; // 180 degrees total spread, change this!!
const arcStartAngle = -Math.PI / 2 - arcSpan / 2; // centres the arc around, also the direction its facing


allKeys.forEach(function(keyButton, index){ //claude helped here to better understand how wiring all the buttons together work.
    //angular formatting
    let angle = arcStartAngle + (index / (numberOfKeys - 1)) * arcSpan;
    let x = centerX + radius * Math.cos(angle); // more trig
    let y = centerY + radius * Math.sin(angle);

    keyButton.style.position = "absolute";
    keyButton.style.left = x + "px";
    keyButton.style.top = y + "px";
    keyButton.style.transform = `rotate(${angle}rad)`;
    
    // forEach only exists on array like collections. Thats why there was an issue her before.
    keyButton.addEventListener("mousedown", playNote);
    keyButton.addEventListener("mouseenter", playNote);
    keyButton.addEventListener("mouseup", endNote);
    keyButton.addEventListener("mouseleave", endNote);
})



//NOTE BLOCKING
const noteOrder = Array.from(allKeys).map(function(k){ return k.dataset.note; });
const rowHeight = canvas.height / noteOrder.length;

let blocks = {}; //note x position of its block
let prevPlayheadX = 0; //when dial/playhead crosses the block

function drawBlocks(){
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";

    for(let note in blocks){ //seperate each block, leaves a gap
        let rowIndex = noteOrder.indexOf(note);
        let y = rowIndex * rowHeight;
        ctx.fillRect(blocks[note] - 5, y, 10, rowHeight - 2);
    }
}

function checkBlockCrossing(){
    if(!isPlaying) return;

    for(let note in blocks){
        let x = blocks[note];
        let crossed;

        if(playheadX >= prevPlayheadX){
            //check if the block sits bewteen the last frame this frame
            crossed = x > prevPlayheadX && x <= playheadX; //checking jumping between px
        } else {
            //the loop just wrap around, check both ends
            crossed = x > prevPlayheadX || x <= playheadX;
        }

        if(crossed){ //play note
            synth.triggerAttackRelease(note, "8n");
        }
    }

    prevPlayheadX = playheadX;
}


//ANIMATING A WIPE
let layers = []; //every visible layer
let activeLayers = {}; //the layer belonging to each currently held note

const wipeSpeed = 0.03;
const fadeSpeed = 0.025;
const softEdge = 300;

function createLayer(note, colours){
    //if this note already has a layer, release
    if(activeLayers[note]){
        activeLayers[note].held = false;
    }
    let layer = { colours: colours, wipe: 0, alpha: 1, held: true };
    layers.push(layer);
    activeLayers[note] = layer;
}

//draw loop
function drawLayers(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    layers.forEach(function(layer){
        //advance the wipe
        layer.wipe = Math.min(layer.wipe + wipeSpeed, 1);
        //only fade once the key released
        if(!layer.held){ //error being drawn in the negative before, fixed ver here
            layer.alpha = Math.max(layer.alpha - fadeSpeed, 0); //never below 0
        }

        if(layer.alpha <= 0){
            return; // fully faded, skip drawing.
        } // claude assisted me with debugging and developing hard to understand sections of the code. Especially with the wide in and fade out aspect. Design choices, ideation, and conceptualing was all thought out and planned before hand.

        //colour gradient across the canvas
        let stops = layer.colours.length === 1 ? [layer.colours[0], layer.colours[0]] : layer.colours;
        let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        stops.forEach(function(c, i){
            gradient.addColorStop(i / (stops.length - 1), c);
        });
        ctx.fillStyle = gradient;

        //where the leading edge of the wipe is
        let front = layer.wipe * (canvas.width + softEdge);

        //paint in thin strips
        for(let x = 0; x < canvas.width; x += 4){
            let stripAlpha = Math.min(Math.max((front - x) / softEdge, 0), 1);
            ctx.globalAlpha = layer.alpha * stripAlpha;
            ctx.fillRect(x, 0, 4, canvas.height);
        }
    });

    ctx.globalAlpha = 1 //reset

    updatePlayhead();
    drawPlayhead(); //calling them  

    drawBlocks();
    checkBlockCrossing();

    //drop layers that have fully faded
    layers = layers.filter(function(layer){
        return layer.alpha > 0;
    });

    requestAnimationFrame(drawLayers);

}

drawLayers();