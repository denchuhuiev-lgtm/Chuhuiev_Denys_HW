const playButton = document.querySelector(".video-card__play");
const video = document.querySelector(".video-card__media");

if (playButton && video) {
  playButton.addEventListener("click", async () => {
    try {
      video.controls = true;
      await video.play();
      playButton.classList.add("is-hidden");
    } catch (error) {
      video.controls = true;
    }
  });

  video.addEventListener("pause", () => {
    if (!video.ended) {
      playButton.classList.remove("is-hidden");
    }
  });

  video.addEventListener("ended", () => {
    playButton.classList.remove("is-hidden");
    video.controls = false;
    video.currentTime = 0;
  });
}
