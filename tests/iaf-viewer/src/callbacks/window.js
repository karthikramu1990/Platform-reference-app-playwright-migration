// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 06-08-24    ATK        PLAT-5131   Created.
//                                    Animation Live mode does not refresh on resize.
// -------------------------------------------------------------------------------------

export const iafCallbackWindowResize = (iafViewer) => {
    // HSK PLAT-4269: The Full Screen / Half Screen 2D Mode does not resize on window resize
    // Update the state with the new window width when a resize occurs
    iafViewer.setState({
        windowWidth: window.innerWidth,
    });

    iafViewer._viewer && iafViewer._viewer.resizeCanvas();  

    // ATK PLAT-5131: Live mode does not refresh on resize
    if (iafViewer.state.isAnimationPlaying) {
        iafViewer.animationManager && iafViewer.animationManager.resizeAnimation();
        iafViewer.animationManager2d && iafViewer.animationManager2d.resizeAnimation();;
    }
}

export const iafCallbackWindowResize2d = (iafViewer) => {
    // iafViewer._viewer2d && iafViewer.state.view2d.isLoaded && this._viewer2d.resizeCanvas();; // Resize canvas for 2d viewer
    if (iafViewer._viewer2d && iafViewer.state.view2d.isLoaded) {
        iafViewer._viewer2d.resizeCanvas(); // Resize canvas for 2d viewer
      }
    // // ATK PLAT-5131: Live mode does not refresh on resize
    // if (iafViewer.state.isAnimationPlaying) {
    //     iafViewer.animationManager2d && iafViewer.animationManager2d.resizeAnimation();
    // }
}