
//document.body.style.backgroundColor = "red";
// get button
const testButton = document.getElementById("test-button");



//MODAL
//find intro modal
const introModal = document.getElementById("intro-modal");
//console.log(introModal); this actually slows it down
introModal.showModal();
//close
const ok = document.getElementById("modal-close");
ok.addEventListener("click", () => {
    introModal.close();
});
//function closeIntroModal()
introModal.addEventListener("close", toneInit);


//TONE
// create instrument and connect to audio
// html -> js -> open modal -> ok -> modal closes -> audio init
const synth = new Tone.Synth();

function toneInit(){
    synth.connect(Tone.Destination);
}

// action
testButton.addEventListener("click", playTestNote);

function playTestNote(){
    synth.triggerAttackRelease("C4", "8n");
}

