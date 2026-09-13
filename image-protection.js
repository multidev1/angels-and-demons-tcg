/* =========================================
   ANGELS & DEMONS TCG
   IMAGE PROTECTION
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // Mark all images as protected
    document.querySelectorAll("img").forEach(function (image) {
        image.classList.add("protected-image");
        image.setAttribute("draggable", "false");
    });

    // Disable right-click on images
    document.addEventListener("contextmenu", function (event) {
        if (event.target.closest("img.protected-image")) {
            event.preventDefault();
        }
    });

    // Disable dragging images
    document.addEventListener("dragstart", function (event) {
        if (event.target.closest("img.protected-image")) {
            event.preventDefault();
        }
    });

    // Disable copying an image
    document.addEventListener("copy", function (event) {
        const selection = window.getSelection();

        if (selection && selection.anchorNode) {
            const element =
                selection.anchorNode.nodeType === 1
                    ? selection.anchorNode
                    : selection.anchorNode.parentElement;

            if (element && element.closest("img.protected-image")) {
                event.preventDefault();
            }
        }
    });

});