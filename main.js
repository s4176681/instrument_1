//document.body.style.backgroundColor = "red";
// get button
const testButton = document.getElementById("test-button");

// create instrument and connect to audio
const synth = new Tone.Synth().toDestination();

// action
testButton.addEventListener("click", playTestNote);

function playTestNote(){
    synth.triggerAttackRelease("C4", "8n");
}