
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
window.addEventListener("mousedown", function(){ //new
    mouseButtonDown = true;
});
window.addEventListener("mouseup", function(){ //new
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
const synth = new Tone.Synth();

function toneInit(){
    // connect synth
    synth.connect(Tone.Destination);
}

// action
//testButton.addEventListener("click", playTestNote);

function playNote(e){
    // find element
    let keyPressed = e.target;
    console.log(keyPressed);
    // find data note
    let note = keyPressed.dataset.note;
    console.log(note);
}

testButton.addEventListener("mousedown", playNote);
key.addEventListener("mousedown", playNote);

