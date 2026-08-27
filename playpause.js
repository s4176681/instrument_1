const playPauseButton = document.querySelector(".playPauseButton");
const playPauseIcon = playPauseButton.querySelector("img");

let isPlaying = false;

const playIconSrc = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
const pauseIconSrc = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
// defining images


// audio file playback
const playbackButton = document.getElementById("playPauseButton");
const audioTrack = document.getElementById("audio-track");



playPauseButton.addEventListener("click", function(){
    isPlaying = !isPlaying; // ! = not
    // flipping the boolean, toggle pattern for playpause button.

    if(isPlaying){
        audioTrack.play();
        playPauseIcon.src = pauseIconSrc;
        playPauseIcon.alt = "Pause Button";
        
        
    } else {
        audioTrack.pause();
        //audioTrack.paused === true;
        playPauseIcon.src = playIconSrc;
        playPauseIcon.alt = "Play Button";
        
    }
});

playPauseButton.addEventListener("click", playAudio);