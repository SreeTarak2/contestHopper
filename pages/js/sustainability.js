document.addEventListener("DOMContentLoaded", () => {
    const videos = Array.from(document.querySelectorAll(".hero-video-wrapper video"));
    const previewBox = document.getElementById("videoPreview");
    const previewVideo = previewBox.querySelector("video");
    
    let currentIndex = 0;

    const updatePreview = () => {
        const previewIndex = (currentIndex + 1) % videos.length;
        const nextVideoSrc = videos[previewIndex].querySelector("source").src;
        previewVideo.src = nextVideoSrc;
        previewVideo.load();
    };

    const changeVideo = () => {
        const nextIndex = (currentIndex + 1) % videos.length;
        const currentVideo = videos[currentIndex];
        const nextVideo = videos[nextIndex];

        const tl = gsap.timeline({
            onComplete: () => {
                currentVideo.classList.remove("active");
                currentVideo.pause();
                currentIndex = nextIndex;
                updatePreview();
            }
        });

        tl.to(currentVideo, { opacity: 0, duration: 1.2, ease: "power2.inOut" })
          .to(nextVideo, { opacity: 1, duration: 1.2, ease: "power2.inOut" }, "-=0.8");
        
        nextVideo.classList.add("active");
        nextVideo.play();
    };

    previewBox.addEventListener("click", changeVideo);

    previewBox.addEventListener("mouseenter", () => {
        previewVideo.play();
    });

    previewBox.addEventListener("mouseleave", () => {
        previewVideo.pause();
        previewVideo.currentTime = 0;
    });

    videos.forEach(vid => vid.pause());
    videos[currentIndex].play();
    updatePreview();
});

// window.addEventListener("load", () => {
//     const loadingOverlay = document.getElementById("loadingOverlay");
//     if (loadingOverlay) {
//         setTimeout(() => {
//             loadingOverlay.classList.add("hidden");
//             document.body.style.overflow = "auto";
//         }, 500);
//     }
// });
