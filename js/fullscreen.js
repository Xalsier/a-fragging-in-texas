document.getElementById('fullscreenBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen().catch(() => {});
    } else { if (document.exitFullscreen) document.exitFullscreen(); }
});