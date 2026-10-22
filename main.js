//document.body.style.backgroundColor = "red";
// get button
//const testButton = document.getElementById("test-button");
//
//const key = document.getElementById("key-test")


//PLAYHEAD
let isPlaying = false;
let playStartTIme = 0;
let playheadY = 0;
let currentProgress = 0; //sets the default playhead to 0
const loopDuration = 4000; //ms for one full pass, in short - duration of the slider
let currentStep = -1;
const playPauseButton = document.querySelector(".playPauseButton");
const playPauseIcon = playPauseButton.querySelector("img");
const playIconSrc = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
const pauseIconSrc = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";


function updatePlayhead(){
    if(!isPlaying) return;
    let elapsed = performance.now() - playStartTIme;
    currentProgress = (elapsed % loopDuration) / loopDuration; //0 to 1, wrapping
    playheadY = canvas.height - currentProgress * canvas.height; //within the visualiser, from end to end, righ to left logic.
}
function drawPlayhead(){
    if(!isPlaying) return;
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";

    // drawing a line across the whole canvas instead of top to bottom
    ctx.fillRect(0, playheadY - 1, canvas.width, 2);
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
    "G5": "thistle",

    "C#4": "hotpink",
    "D#4": "gold",
    "F#4": "skyblue",
    "G#4": "orchid",
    "A#4": "coral"
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
//testButton.addEventListener("click", playTestNote);]
function getMode(){
    let select = document.getElementById("play-mode");
    return select ? select.value : "single"; //fall back
}

let heldNotes = {}; //key note, the notes actually sounding

function playNote(e){
    let keyPressed = e.target;
    let note = keyPressed.dataset.note;
    let notesToPlay = (getMode() === "chord" && chords[note]) ? chords[note] : [note];

    if(e.buttons === 1){
        let notesToPlay = getMode() === "chord" ? chords[note] : [note];

        synth.triggerAttack(notesToPlay);
        heldNotes[note] = notesToPlay;

        createLayer(note, notesToPlay.map(function(n){ return noteColours[n]; }));

        if(isPlaying){
                let step = Math.round(currentProgress * stepsPerLoop) % stepsPerLoop;
                if(!grid[note]) grid[note] = {};
                grid[note][step] = notesToPlay;     //keeps the chord notes as well
        }
    }
}

function endNote(e) {
    // find data note
    let note = e.target.dataset.note; //key Pressed doesn't exist in this ver

    if(heldNotes[note]){
        synth.triggerRelease(heldNotes[note]); // STOP PLAYING!
        delete heldNotes[note];
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
//I split the selectors with the implementation of black keys
const whiteKeys = document.querySelectorAll(".whiteKey");
const blackKeys = document.querySelectorAll(".blackKey");
const allKeys = document.querySelectorAll(".whiteKey, .blackKey");

const numberOfKeys = whiteKeys.length;
const radius = 1320; //change this to adjust how compact the keys are

const centerX = 400; // change these for the placement of the keys
const centerY = 1520;

const arcSpan = Math.PI * 0.15; // 180 degrees total spread, change this!!
const arcStartAngle = -Math.PI / 2 - arcSpan / 2; // centres the arc around, also the direction its facing

//black key implementation
const blackAfter = {"C#4": 0, "D#4": 1, "F#4": 3, "G#4": 4, "A#4": 5 }; //index of the white keys
const blackOffset = 20; //radius offset/change, change this

function angleOfWhite(i){
    return arcStartAngle + (i / (whiteKeys.length - 1)) * arcSpan;
}



function placeKey(button, angle, r){
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    button.style.position = "absolute";
    button.style.left = x + "px";
    button.style.top = y + "px";
    button.style.transform = `rotate(${angle}rad)`
} //placement job

whiteKeys.forEach(function(k, i){
    placeKey(k, angleOfWhite(i), radius);
});

blackKeys.forEach(function(k){
    const i = blackAfter[k.dataset.note];
    const angle = (angleOfWhite(i) + angleOfWhite(i + 1)) / 2;
    placeKey(k, angle, radius + blackOffset);
    //same x and y, left and top, transform lines as the white keys
});


allKeys.forEach(function(k){ //claude helped here to better understand how wiring all the buttons together work.
    //angular formatting
    //listeners go on every key
    // forEach only exists on array like collections. Thats why there was an issue her before.
    k.addEventListener("mousedown", playNote);
    k.addEventListener("mouseenter", playNote);
    k.addEventListener("mouseup", endNote);
    k.addEventListener("mouseleave", endNote);
});

const noteX = {};

function measureColumns(){
    const canvasRect = canvas.getBoundingClientRect();
    const scale = canvas.width / canvasRect.width; //CSS may stretch the canvas, scaling towards that for future testing

    allKeys.forEach(function(k){
        const r = k.getBoundingClientRect();
        const centreOnScreen = r.left + r.width / 2;
        noteX[k.dataset.note] = (centreOnScreen - canvasRect.left) * scale;
    });
}

measureColumns();
window.addEventListener("resize", measureColumns);



//NOTE BLOCKING
const noteOrder = Array.from(allKeys).map(function(k){ return k.dataset.note; });
const rowHeight = canvas.height / noteOrder.length;

//thinking out the clipping as steps
const stepsPerLoop = 16;    //4x4
const stepHeight = canvas.height / stepsPerLoop;

let blocks = {}; //note x position of its block
let prevPlayheadY = 0; //when dial/playhead crosses the block

let grid = {}; //note -> pressing C4 on step 4

function drawBlocks(){
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";

    for(let note in grid){ //the outer loop
        for(let step in grid[note]){
            const x = noteX[note] - 15;
            const y = canvas.height - (Number(step) + 1) * stepHeight;

            ctx.fillRect(x, y, 30, stepHeight - 2);
        }
    }
}

//CLEAR BUTTONS
const rowsPerButton = 4; //4 = one button per beat, 1 per step
const clearRows = document.getElementById("clearRows");

for(let first = 0; first < stepsPerLoop; first += rowsPerButton){
    const btn = document.createElement("button");
    btn.className = "clear-btn";
    btn.textContent = "✕"
    btn.title = "Clear this row"

    btn.addEventListener("click", function(){
        clearSteps(first, first + rowsPerButton - 1);
    });

    clearRows.appendChild(btn);
}

//delete playheadblocks
function clearSteps(from, to){ //claude help explain and demonstrate how to use these complex functions so that I could achieve my percieved concept model.
    for(let note in grid){
        for (let s = from; s <= to; s++){
            delete grid[note][s];
        }
    }
}



//cross pixel checking -> block checking
function triggerSteps(){
    if(!isPlaying) return;

    const step = Math.floor(currentProgress * stepsPerLoop);

    if(step !== currentStep){ //if not current step...
        currentStep = step;
        for(let note in grid){
            if(grid[note][step]){
                synth.triggerAttackRelease(grid[note][step], "8n"); //if crossed play note
            }
        }
    }
}

//drawing a grid
function drawGrid(){
    for(let i = 0; i <= stepsPerLoop; i++){
        const y = canvas.height - i * stepHeight;
        const isBeat = i % 4 === 0; //every 4th line equals to one beat 4/4 bar

        ctx.globalAlpha = isBeat ? 0.35 : 0.12;
        ctx.fillStyle = "white";
        ctx.fillRect(0, y - 0.5, canvas.width, 1);
    }

    for(let note in noteX){
        ctx.globalAlpha = 0.12;
        ctx.fillRect(noteX[note] - 0.5, 0, 1, canvas.height);
    }
    ctx.globalAlpha = 1;
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

    drawGrid();

    updatePlayhead();
    drawPlayhead(); //calling them  

    drawBlocks();
    triggerSteps(); //was checkBlockCrossing

    //drop layers that have fully faded
    layers = layers.filter(function(layer){
        return layer.alpha > 0;
    });

    requestAnimationFrame(drawLayers);

}

drawLayers();



//creating presets in response to the 'dynamic sound track-er'
//the concept is: The goals is to make a drop down box, by default its 'no preset'. The dropdown will have preset 1, 2, 3, etc. Start with 1 for now. When the preset is 'selected', it 'clears' all playhead blocks, and stamps a set of notes onto the board. Upon using the function, it switches the play button off also. The user can click play afterwards and the dial should run over normally and play a nice rhythm thats already built in for them. 
const presets = {
    "1": {
        "C4": [0],
        "E4": [3, 14],
        "G4": [6, 11],
        "A4": [8]
    }

   //"2":
};
//seeing if play/pause is on
function setPlaying(on){
    isPlaying = on;

    if(on){
        playStartTIme = performance.now();
        playheadY = canvas.height;
        currentStep = -1; //make step 0 play on the first pass
        playPauseIcon.src = pauseIconSrc;
        playPauseIcon.alt = "Pause Button";
    } else {
        playPauseIcon.src = playIconSrc;
        playPauseIcon.alt = "Play Button";
    }
}

playPauseButton.addEventListener("click", function(){
    setPlaying(!isPlaying); //not playing
});
//loading the preset in
function loadPreset(name){
    const preset = presets[name];
    if(!preset) return; //none has no entry, so nothing happens

    setPlaying(false); //switch play off here
    grid = {};

    for(let note in preset){
        grid[note] = {};
        preset[note].forEach(function(step){
            grid[note][step] = [note]; //same shape playnote creates
        });
    }
}

document.getElementById("preset-select").addEventListener("change", function(e){
    loadPreset(e.target.value);
});