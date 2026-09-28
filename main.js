//document.body.style.backgroundColor = "red";
// get button
//const testButton = document.getElementById("test-button");
//
//const key = document.getElementById("key-test")
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





//MODAL
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

        if(mode === "chord"){
            synth.triggerAttack(chords[note]);
            flashChords(chords[note]); // chords, but actually note, gradient colour for chords.
        } else {
            synth.triggerAttack(note);
            flashCanvas(noteColours[note]); // flate colour for single notes.
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

    flashCanvas("#2a2a2a"); //reset colour
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


const allKeys = document.querySelectorAll(".whiteKey");


allKeys.forEach(function(keyButton){ //claude helped here to better understand how wiring all the buttons together work.
    // forEach only exists on array like collections. Thats why there was an issue her before.
    keyButton.addEventListener("mousedown", playNote);
    keyButton.addEventListener("mouseenter", playNote);
    keyButton.addEventListener("mouseup", endNote);
    keyButton.addEventListener("mouseleave", endNote);
})

//ANIMATING A WIPE
let layers = []; //every visible layer
let activeLayers = {}; //the layer belonging to each currently held note

const wipeSpeed = 0.02;
const fadeSpeed = 0.015;
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
        if(!layer.held){ //being released
            layer.alpha -= fadeSpeed;
        }

        //colour gradient across the canvas
        let stop = layer.colours.length === 1 ? [layer.colours[0], layer.colours[0]] : layer.colours;
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

    //drop layers that have fully faded
    layers = layer.filter(function(layer){
        return layer.alpha > 0;
    });

    requestAnimationFrame(drawLayers);

}