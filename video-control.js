document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("introVideo");

    if (!video) return;

    video.muted = false;

    video.play().catch(function () {
        console.log("Autoplay with sound was blocked by the browser.");
    });

    video.addEventListener("ended", function () {
        video.muted = true;
        video.currentTime = 0;
        video.play();
    });
});