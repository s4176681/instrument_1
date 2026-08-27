
//document.body.style.backgroundColor = "red";
// get button
const testButton = document.getElementById("test-button");
//
const key = document.getElementById("key-test")
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






//TONE
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
}

testButton.addEventListener("mousedown", playNote);
testButton.addEventListener("mouseenter", playNote);
testButton.addEventListener("mouseup", endNote);
testButton.addEventListener("mouseleave", endNote);

key.addEventListener("mousedown", playNote);
key.addEventListener("mouseenter", playNote);
key.addEventListener("mouseup", endNote);
key.addEventListener("mouseleave", endNote);


// audio file playback
const playbackButton = document.getElementById("playback-button");
const audioTrack = document.getElementById("audio-track");

function playAudio() { // PLAY
    if(audioTrack.paused === true){
        audioTrack.play();
    } else {
        audioTrack.pause();
    }
}
playbackButton.addEventListener("click", playAudio);



// randomly scrub to a location
const randomButton = document.getElementById("random-location");
// move playback to random pos
function randomLocation(){
    // file duration
    let trackLength = audioTrack.duration;
    audioTrack.currentTime = trackLength * Math.random();
}

randomButton.addEventListener("click", randomLocation);