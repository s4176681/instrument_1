
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
    "C5": "lightgray"
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
    if(e.buttons === 1){ //// WORKS FOR OUR BROWSER, awkwardly optimised.
        synth.triggerAttack(note);
        flashCanvas(noteColours[note]); // choose colour here
    }
}

function endNote(e) {
    // find element
    let keyPressed = e.target;
    console.log(keyPressed);
    // find data note
    let note = keyPressed.dataset.note;
    console.log(note);
    //right amount of time
    synth.triggerRelease(note);
    flashCanvas("#ffffff76"); //reset colour
}





const allKeys = document.querySelectorAll(".whiteKey");


allKeys.forEach(function(keyButton){ //claude helped here to better understand how wiring all the buttons together work.
    // forEach only exists on array like collections. Thats why there was an issue her before.
    keyButton.addEventListener("mousedown", playNote);
    keyButton.addEventListener("mouseenter", playNote);
    keyButton.addEventListener("mouseup", endNote);
    keyButton.addEventListener("mouseleave", endNote);
})


