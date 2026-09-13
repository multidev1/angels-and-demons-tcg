const neonElements = document.querySelectorAll(
    ".neon-dot, .neon-bar"
);

function moveNeon(element) {

    const x = Math.random() * 90 + 5;
    const y = Math.random() * 90 + 5;

    element.style.left = x + "%";
    element.style.top = y + "%";

    const nextMove = Math.random() * 2000 + 1000;

    setTimeout(() => {
        moveNeon(element);
    }, nextMove);
}


neonElements.forEach(element => {
    moveNeon(element);
});