document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("allCardsContainer");

    const sets = [
        {
            file: "set1.html",
            title: "SET 1 — ANGELS & DEMONS"
        },
        {
            file: "set2.html",
            title: "SET 2 — THE DRAGON AWAKENING"
        },
    ];

    const lightbox = document.getElementById("allCardLightbox");
    const lightboxImage = document.getElementById("allCardLightboxImage");
    const lightboxTitle = document.getElementById("allCardLightboxTitle");
    const lightboxClose = document.getElementById("allCardLightboxClose");

    // --------------------------------------------------
    // Navigation buttons
    // --------------------------------------------------

    const previousButton = document.createElement("button");
    previousButton.type = "button";
    previousButton.className = "all-card-nav all-card-prev";
    previousButton.textContent = "← BACK";

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "all-card-nav all-card-next";
    nextButton.textContent = "NEXT →";

    lightbox.appendChild(previousButton);
    lightbox.appendChild(nextButton);

    // All cards currently loaded from Set 1 and Set 2
    const allCards = [];

    let currentCardIndex = -1;

    // --------------------------------------------------
    // Open card
    // --------------------------------------------------

    function openCard(index) {

        if (index < 0 || index >= allCards.length) {
            return;
        }

        currentCardIndex = index;

        const card = allCards[currentCardIndex];

        lightboxImage.src = card.image;
        lightboxImage.alt = card.number + " — " + card.name;

        lightboxTitle.textContent =
            card.number + " — " + card.name;

        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";

        updateNavigation();
    }

    // --------------------------------------------------
    // Previous / Next
    // --------------------------------------------------

    function previousCard() {

        if (currentCardIndex > 0) {
            openCard(currentCardIndex - 1);
        }

    }

    function nextCard() {

        if (currentCardIndex < allCards.length - 1) {
            openCard(currentCardIndex + 1);
        }

    }

    // --------------------------------------------------
    // Enable / disable navigation buttons
    // --------------------------------------------------

    function updateNavigation() {

        previousButton.disabled = currentCardIndex <= 0;
        nextButton.disabled =
            currentCardIndex >= allCards.length - 1;

    }

    previousButton.addEventListener("click", function (event) {

        event.stopPropagation();
        previousCard();

    });

    nextButton.addEventListener("click", function (event) {

        event.stopPropagation();
        nextCard();

    });

    // --------------------------------------------------
    // Close lightbox
    // --------------------------------------------------

    function closeCard() {

        lightbox.classList.remove("active");

        lightboxImage.src = "";
        lightboxTitle.textContent = "";

        document.body.style.overflow = "";

        currentCardIndex = -1;

    }

    lightboxClose.addEventListener("click", function (event) {

        event.stopPropagation();
        closeCard();

    });

    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {
            closeCard();
        }

    });

    // --------------------------------------------------
    // Keyboard navigation
    // --------------------------------------------------

    document.addEventListener("keydown", function (event) {

        if (!lightbox.classList.contains("active")) {
            return;
        }

        if (event.key === "Escape") {
            closeCard();
        }

        if (event.key === "ArrowLeft") {
            previousCard();
        }

        if (event.key === "ArrowRight") {
            nextCard();
        }

    });

    // --------------------------------------------------
    // Load Set
    // --------------------------------------------------

    function loadSet(set) {

        const setSection = document.createElement("section");
        setSection.className = "all-cards-set";

        const setTitle = document.createElement("h2");
        setTitle.className = "all-cards-set-title";
        setTitle.textContent = set.title;

        setSection.appendChild(setTitle);

        // Set 3
        if (set.comingSoon) {

            const comingSoon = document.createElement("div");

            comingSoon.className = "all-card-coming-soon";
            comingSoon.textContent = "COMING SOON";

            setSection.appendChild(comingSoon);
            container.appendChild(setSection);

            return;
        }

        const iframe = document.createElement("iframe");

        iframe.src = set.file;
        iframe.style.display = "none";
        iframe.setAttribute("aria-hidden", "true");

        document.body.appendChild(iframe);

        iframe.onload = function () {

            try {

                const setDocument = iframe.contentDocument;

                if (!setDocument) {
                    throw new Error(
                        "Could not access " + set.file
                    );
                }

                const cards =
                    setDocument.querySelectorAll(".card-item");

                if (cards.length === 0) {

                    const error = document.createElement("div");

                    error.className = "all-card-error";
                    error.textContent =
                        "No cards found in " + set.file;

                    setSection.appendChild(error);
                    container.appendChild(setSection);

                    iframe.remove();

                    return;
                }

                const list =
                    document.createElement("div");

                list.className = "all-cards-list";

                cards.forEach(function (card) {

                    const number =
                        card.dataset.number || "";

                    const name =
                        card.dataset.name ||
                        "Unknown Card";

                    const image =
                        card.querySelector("img");

                    if (!image) {
                        return;
                    }

                    const imagePath =
                        image.getAttribute("src");

                    // Add card to global navigation array
                    const cardIndex = allCards.length;

                    allCards.push({
                        number: number,
                        name: name,
                        image: imagePath,
                        set: set.title
                    });

                    // Create list row
                    const row =
                        document.createElement("div");

                    row.className = "all-card-row";

                    const numberElement =
                        document.createElement("span");

                    numberElement.className =
                        "all-card-number";

                    numberElement.textContent =
                        number;

                    const nameElement =
                        document.createElement("span");

                    nameElement.className =
                        "all-card-name";

                    nameElement.textContent =
                        name;

                    row.appendChild(numberElement);
                    row.appendChild(nameElement);

                    // Click card
                    row.addEventListener("click", function () {
                        openCard(cardIndex);
                    });

                    list.appendChild(row);

                });

                setSection.appendChild(list);
                container.appendChild(setSection);

                iframe.remove();

                updateNavigation();

            } catch (error) {

                console.error(error);

                const errorBox =
                    document.createElement("div");

                errorBox.className =
                    "all-card-error";

                errorBox.textContent =
                    "Unable to read cards from " +
                    set.file;

                setSection.appendChild(errorBox);
                container.appendChild(setSection);

                iframe.remove();

            }

        };

        iframe.onerror = function () {

            const errorBox =
                document.createElement("div");

            errorBox.className =
                "all-card-error";

            errorBox.textContent =
                "Unable to load " + set.file;

            setSection.appendChild(errorBox);
            container.appendChild(setSection);

            iframe.remove();

        };

    }

    // --------------------------------------------------
    // Load everything
    // --------------------------------------------------

    container.innerHTML = "";

    sets.forEach(function (set) {
        loadSet(set);
    });

});
