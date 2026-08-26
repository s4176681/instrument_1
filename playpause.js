const playPauseButton = document.querySelector(".playPauseButton");
const playPauseIcon = playPauseButton.querySelector("img");

let isPlaying = false;

const playIconSrc = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
const pauseIconSrc = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
// defining images

playPauseButton.addEventListener("click", function(){
    isPlaying = !isPlaying; // ! = not
    // flipping the boolean, toggle pattern for playpause button.

    if(isPlaying){
        playPauseIcon.src = pauseIconSrc;
        playPauseIcon.alt = "Pause Button";
    } else {
        playPauseIcon.src = playIconSrc;
        playPauseIcon.alt = "Play Button";
    }
});