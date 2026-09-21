
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




// getting maths correct before applying code
const allKeys = document.querySelectorAll(".whiteKey");
const numberOfKeys = allKeys.length;
const radius = 150; //distance from centre in PX
const centerX = 200; //container centre
const centerY = 200;

allKeys.forEach(function(keyButton, index){ //claude helped here to better understand how wiring all the buttons together work.
    // circle layout
    let angle = (index / numberOfKeys) * 2 * Math.PI; // full circle in radians
    let x = centerX + radius * Math.cos(angle); // using trigonometry
    let y = centerY + radius * Math.sin(angle);

    keyButton.style.position = "absolute";
    keyButton.style.left = x + "px";
    keyButton.style.top = y + "px";
    keyButton.style.transform = `rotate(${angle}rad)`; //facing outwards, angular
    
    
    // forEach only exists on array like collections. Thats why there was an issue her before.
    keyButton.addEventListener("mousedown", playNote);
    keyButton.addEventListener("mouseenter", playNote);
    keyButton.addEventListener("mouseup", endNote);
    keyButton.addEventListener("mouseleave", endNote);
});



