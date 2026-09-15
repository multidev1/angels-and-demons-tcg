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

/* =========================================
   CARD DATABASE FILTERS
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("cardSearch");
    const filterButtons = document.querySelectorAll(".card-filter");
    const cards = document.querySelectorAll(".card-item");

    if (!searchInput || !filterButtons.length || !cards.length) {
        return;
    }

    let activeFilter = "all";

    function filterCards() {

        const searchTerm = searchInput.value.toLowerCase().trim();

        cards.forEach(function (card) {

            const number = (card.dataset.number || "").toLowerCase();
            const name = (card.dataset.name || "").toLowerCase();
            const type = (card.dataset.type || "").toLowerCase();

            const matchesSearch =
                number.includes(searchTerm) ||
                name.includes(searchTerm);

            let matchesFilter = true;

            if (activeFilter !== "all") {
                    matchesFilter = type === activeFilter;
            }

            if (matchesSearch && matchesFilter) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });
    }

    /* Search */

    searchInput.addEventListener("input", function () {
        filterCards();
    });

    /* Filters */

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            activeFilter = button.dataset.filter;

            filterCards();
        });

    });

});

/* =========================================
   CARD LIGHTBOX
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const lightbox = document.getElementById("cardLightbox");
    const lightboxImage = document.getElementById("cardLightboxImage");
    const closeButton = document.getElementById("cardLightboxClose");

    const cards = document.querySelectorAll(".card-item img");

    if (!lightbox || !lightboxImage || !closeButton || !cards.length) {
        return;
    }

    cards.forEach(function (card) {

        card.addEventListener("click", function () {

            lightboxImage.src = card.src;
            lightboxImage.alt = card.alt;

            lightbox.classList.add("active");

            document.body.style.overflow = "hidden";

        });

    });

    function closeLightbox() {

        lightbox.classList.remove("active");

        lightboxImage.src = "";

        document.body.style.overflow = "";

    }

    closeButton.addEventListener("click", function () {
        closeLightbox();
    });

    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape" && lightbox.classList.contains("active")) {
            closeLightbox();
        }

    });

});